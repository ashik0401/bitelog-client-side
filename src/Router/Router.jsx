import {
    createBrowserRouter,

} from "react-router";
import AuthLayout from "../Layouts/AuthLayout";
import Login from "../Pages/Authentication/Login/Login";
import Register from "../Pages/Authentication/Register/Register";
import RootLayout from "../Layouts/RootLayout";
import Home from "../Pages/Home/Home";
import PrivateRoute from "../Routes/PrivateRoutes";
import DashboardLayout from "../Layouts/DashboardLayout";
import AddMeal from "../Pages/Admin/AddMeals/AddMeals";
import MealsTable from "../Pages/Admin/MealsTable";



export const router = createBrowserRouter([
    {
        path: "/",
        Component: RootLayout,
        children: [
            {
                index: true,
                Component: Home
            },
            {
                path:'/addMeals',
                Component:AddMeal
            }
        ]
    },
    {
        path: '/',
        Component: AuthLayout,
        children: [
            {
                path: '/login',
                Component: Login
            },
            {
                path: '/register',
                Component: Register
            }
        ]
    },
    {
        path: '/dashboard',
        element:
            <PrivateRoute>
                <DashboardLayout />
            </PrivateRoute>,
            children:[
                {
                    index:true,
                    Component:MealsTable 
                }
            ]
            
    }
]);