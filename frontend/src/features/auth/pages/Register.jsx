import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../hooks/useAuth";

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { loading, handleRegister } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await handleRegister({ username, email, password });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to register.");
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0d1117] px-4 text-center text-slate-100">
        <h1 className="text-2xl font-semibold">Loading.......</h1>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0d1117] px-4 py-10 text-slate-100">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#161b22] p-6 shadow-xl sm:p-8">
        <h1 className="mb-6 text-2xl font-bold tracking-tight sm:text-3xl">
          Register
        </h1>
        {error && <p className="mb-4 text-sm text-rose-400">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="username"
              className="text-sm font-medium text-slate-300"
            >
              Username
            </label>
            <input
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              className="w-full rounded-lg border border-slate-700 bg-[#0d1117] px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/30"
              type="text"
              id="username"
              name="username"
              placeholder="Enter username"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-slate-300"
            >
              Email
            </label>
            <input
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              className="w-full rounded-lg border border-slate-700 bg-[#0d1117] px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/30"
              type="email"
              id="email"
              name="email"
              placeholder="Enter email address"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-slate-300"
            >
              Password
            </label>
            <input
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              className="w-full rounded-lg border border-slate-700 bg-[#0d1117] px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/30"
              type="password"
              id="password"
              name="password"
              placeholder="Enter password"
            />
          </div>

          <button className="w-full rounded-lg bg-pink-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-pink-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#161b22] active:scale-[0.98]">
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link
            to={"/login"}
            className="font-medium text-pink-400 transition-colors hover:text-pink-300 hover:underline"
          >
            Login
          </Link>{" "}
        </p>
      </div>
    </main>
  );
};

export default Register;
