import { createBrowserRouter, Outlet } from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/Protected";
import Landing from "./features/interview/pages/Landing";
import Home from "./features/interview/pages/Home";
import Interview from "./features/interview/pages/Interview";
import { AuthProvider } from "./features/auth/auth.provider.jsx";
import { InterviewProvider } from "./features/interview/interview.provider.jsx";

function RootLayout() {
    return (
        <AuthProvider>
            <InterviewProvider>
                <Outlet />
            </InterviewProvider>
        </AuthProvider>
    );
}

export const router = createBrowserRouter([
    {
        element: <RootLayout />,
        children: [
            {
                path: "/",
                element: <Landing />
            },
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/register",
                element: <Register />
            },
            {
                path: "/dashboard",
                element: <Protected><Home /></Protected>
            },
            {
                path: "/interview/:interviewId",
                element: <Protected><Interview /></Protected>
            }
        ]
    }
]);
