import {
    createBrowserRouter,

} from "react-router";
import AuthLayout from "../Layouts/AuthLayout";
import Login from "../Pages/Authentication/Login/Login";
import Register from "../Pages/Authentication/Register/Register";
import RootLayout from "../Layouts/RootLayout";


export const router = createBrowserRouter([
    {
        path: "/",
        Component: RootLayout
    },
    {
        path: '/',
        Component: AuthLayout,
        children: [
            {
                path: 'login',
                Component: Login
            },
            {
                path: 'register',
                Component: Register
            }
        ]
    },
]);