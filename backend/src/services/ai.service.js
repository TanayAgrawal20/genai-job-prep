const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const puppeteer = require("puppeteer")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

const sleep = (ms) =>
    new Promise(resolve => setTimeout(resolve, ms));

const CANDIDATE_MODELS = [
    "gemini-3.6-flash",
    "gemini-3.5-flash-lite",
    "gemini-3.1-flash-lite",
    "gemini-3.8-flash"
];

async function generateWithRetry(request, maxRetries = 2) {
    const modelsToTry = request.model ? [request.model, ...CANDIDATE_MODELS.filter(m => m !== request.model)] : CANDIDATE_MODELS;

    let lastError = null;
    for (const model of modelsToTry) {
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                return await ai.models.generateContent({
                    ...request,
                    model
                });
            } catch (error) {
                lastError = error;
                const status = Number(error.status || error.code);

                // If error is 503 (high demand) or 404/429, retry or fall back to next model
                if (![429, 500, 502, 503, 504].includes(status) && status !== 404) {
                    throw error;
                }

                if (attempt < maxRetries) {
                    const delay = 500 * (2 ** attempt);
                    console.log(`Gemini ${model} returned ${status}, retrying in ${delay}ms...`);
                    await sleep(delay);
                } else {
                    console.log(`Gemini ${model} failed after retries, falling back to next available model...`);
                }
            }
        }
    }

    throw lastError;
}


const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})

async function generateInterviewReport({
    resume,
    selfDescription,
    jobDescription
}) {
    const prompt = `
        Generate an interview report for a candidate.

        Resume:
        ${resume}

        Self Description:
        ${selfDescription}

        Job Description:
        ${jobDescription}

        Extract the job title from the job description.
        Return all fields according to the provided schema.
    `;

    const response = await generateWithRetry({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: z.toJSONSchema(interviewReportSchema)
        }
    });

    if (!response.text) {
        throw new Error("Gemini returned an empty response.");
    }

    const result = JSON.parse(response.text);

    return interviewReportSchema.parse(result);
}



async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu"
        ]
    });

    try {
        const page = await browser.newPage();

        await page.setContent(htmlContent, {
            waitUntil: "load",
            timeout: 30000
        });

        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: {
                top: "20mm",
                bottom: "20mm",
                left: "15mm",
                right: "15mm"
            }
        });

        return pdfBuffer;

    } finally {
        await browser.close();
    }
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `

    const response = await generateWithRetry({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: z.toJSONSchema(resumePdfSchema),
        }
    })


    if (!response.text) {
        throw new Error("Gemini returned an empty response.")
    }

    const jsonContent = resumePdfSchema.parse(JSON.parse(response.text))

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer

}

module.exports = { generateInterviewReport, generateResumePdf }