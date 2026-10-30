import React, {useState} from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../hooks/useAuth";


const Register = () => {
  const navigate = useNavigate();

  //performing two way binding
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {loading, handleRegister} = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await handleRegister({username, email, password})
    navigate("/");
  };

  if(loading){
    return (<main><h1>Loading....</h1></main>)
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo and Heading */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Resume<span className="text-indigo-400">Analyzer</span>
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Create an account to optimize your career journey.
          </p>
        </div>

        {/* Register Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-8">
          <h2 className="text-2xl font-semibold text-white">
            Create your account
          </h2>

          <p className="mb-8 mt-2 text-sm text-slate-400">
            Enter your details to get started.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-slate-200"
              >
                Username
              </label>

              <input
                onChange={(e)=> {setUsername(e.target.value)}}
                type="text"
                id="username"
                name="username"
                placeholder="Choose a username"
                autoComplete="username"
                minLength={3}
                maxLength={30}
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-200"
              >
                Email address
              </label>

              <input
                onChange={(e) => {setEmail(e.target.value)}}
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-200"
              >
                Password
              </label>

              <input
                onChange={(e) => {setPassword(e.target.value)}}
                type="password"
                id="password"
                name="password"
                placeholder="Create a strong password"
                autoComplete="new-password"
                minLength={8}
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
              />

              <p className="text-xs text-slate-500">
                Use at least 8 characters.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-900 active:scale-[0.99]"
            >
              Create account
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-8 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link
              to={"/login"}
              className="font-semibold text-indigo-400 transition hover:text-indigo-300"
            >
              Sign in
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          Analyze your resume. Identify skill gaps. Get interview-ready.
        </p>
      </div>
    </main>
  );
};

export default Register;
