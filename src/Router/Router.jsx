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
import ManageUsers from "../Pages/Admin/ManageUsers";
import Meals from "../Pages/Meals/Meals";
import MealDetail from "../Pages/Meals/MealDetail";
;




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
                path: '/addMeals',
                Component: AddMeal
            },
            {
                path: '/allMeals',
                Component: Meals,
                children: [
                    {
                        index: true,
                        Component: MealDetail
                    }
                ]
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
        children: [
            {
                index: true,
                Component: MealsTable
            },
            {
                path: '/dashboard/manageUsers',
                Component: ManageUsers
            }

        ]

    }
]);