import {
  getAllInterviewReports,
  generateInterviewReport,
  getInterviewReportById,
  generateResumePdf,
} from "../services/interview.api";
import { useCallback, useContext, useEffect, useState } from "react";
import { InterviewContext } from "../interview.context.js";

export const useInterview = (interviewId) => {
  const context = useContext(InterviewContext);
  const [resumeLoading, setResumeLoading] = useState(false);

  if (!context) {
    throw new Error("useInterview must be used within an InterviewProvider");
  }

  const { loading, setLoading, report, setReport, reports, setReports } =
    context;

  
const generateReport = useCallback(async ({
    jobDescription,
    selfDescription,
    resumeFile,
}) => {
    setLoading(true);

    try {
        const response = await generateInterviewReport({
            jobDescription,
            selfDescription,
            resumeFile,
        });

        if (!response || !response.interviewReport) {
            throw new Error("Interview report was not generated.");
        }

        setReport(response.interviewReport);

        return response.interviewReport;

    } catch (error) {
        console.error("Generate Report Error:", error);
        throw error;

    } finally {
        setLoading(false);
    }
}, [setLoading, setReport]);


  const getReportById = useCallback(async (id) => {
    setLoading(true);
    try {
      const response = await getInterviewReportById(id);
      if (!response || !response.interviewReport) {
        throw new Error("Interview report was not found.");
      }
      setReport(response.interviewReport);
      return response.interviewReport;
    } catch (error) {
      console.error("Get Report Error:", error);
      setReport(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setReport]);

  const getReports = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllInterviewReports();
      if (!response || !Array.isArray(response.interviewReports)) {
        throw new Error("Interview reports were not returned.");
      }
      setReports(response.interviewReports);
      return response.interviewReports;
    } catch (error) {
      console.error("Get Reports Error:", error);
      setReports([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [setLoading, setReports]);

  const getResumePdf = useCallback(async (interviewReportId) => {
    setResumeLoading(true);
    try {
      const response = await generateResumePdf({ interviewReportId });
      const url = window.URL.createObjectURL(
        new Blob([response], { type: "application/pdf" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `resume_${interviewReportId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Generate Resume Error:", error);
    } finally {
      setResumeLoading(false);
    }
  }, []);

  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
    } else {
      getReports();
    }
  }, [interviewId, getReportById, getReports]);

  return {
    loading,
    resumeLoading,
    report,
    reports,
    generateReport,
    getReportById,
    getReports,
    getResumePdf,
  };
};
