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
import Payments from "../Pages/Payments/Payments";
import PaymentHistory from "../Pages/User/PaymentHistory";
import UpdateMeals from "../Pages/Admin/AddMeals/UpdateMeal";
import AllReviewsTable from "../Pages/Admin/AllReviewsTable";
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
                path: '/Meals',
                Component: Meals,
            },
            {

                path: '/Meals/:id',
                Component: MealDetail,


            },
            {
                path: '/payment/:id',
                Component: Payments

            },


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
            },

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
            },
            {
                path: '/dashboard/paymentHistory',
                Component: PaymentHistory
            },
            {
                path: '/dashboard/addMeal',
                Component: AddMeal
            },
            {
                path: '/dashboard/updateMeals/:id',
                Component: UpdateMeals
            },
            {
                path: '/dashboard/allReviews',
                Component: AllReviewsTable
            }
        ]

    }
]);