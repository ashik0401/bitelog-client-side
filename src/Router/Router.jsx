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
import ServeMeals from "../Pages/Admin/ServeMeals";
import UpcomingMeals from "../Pages/Admin/UpcomingMeals";
import AddUpcomingMeal from "../Pages/Admin/AddUpcomingMeal";
import MyReviews from "../Pages/User/MyReviews";
import AdminRoute from "../Pages/Admin/AdminRoute";
import RequestedMeals from "../Pages/User/RequestedMeals";
import DashboardSplite from "../Components/DashboardSplite";
import UpcomingMeal from "../Pages/UpcomingMeals.jsx/UpcomingMeal";





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
        path: '/upComingMeal',
        Component:UpcomingMeal
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
    element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
    children: [
      {
        index: true,
        element: <DashboardSplite />
      },
      {
        path: 'manageUsers',
        element: <AdminRoute><ManageUsers /></AdminRoute>
      },
      {
        path: 'paymentHistory',
        Component: PaymentHistory
      },
      {
        path: 'addMeal',
        element: <AdminRoute><AddMeal /></AdminRoute>
      },
      {
        path: 'updateMeals/:id',
        element: <AdminRoute><UpdateMeals /></AdminRoute>
      },
      {
        path: 'allReviews',
        element: <AdminRoute><AllReviewsTable /></AdminRoute>
      },
      {
        path: 'serveMeals',
        element: <AdminRoute><ServeMeals /></AdminRoute>
      },
      {
        path: 'upcomingMeals',
        element: <AdminRoute><UpcomingMeals /></AdminRoute>
      },
      {
        path: 'addUpcomingMeal',
        element: <AdminRoute><AddUpcomingMeal /></AdminRoute>
      },
      {
        path: 'myReviews',
        Component: MyReviews
      },
      {
        path: 'requestedMeals',
        Component: RequestedMeals
      },
      {
        path: '/dashboard/meals',
        element: <AdminRoute><MealsTable /></AdminRoute>
      }
    ]
  }


]);