import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import AuthLayout from "../Layouts/AuthLayout";
import PrivateRoute from "../Routes/PrivateRoutes";
import AdminRoute from "../Pages/Admin/AdminRoute";

// Pages
import Home from "../Pages/Home/Home";
import Meals from "../Pages/Meals/Meals";
import MealDetail from "../Pages/Meals/MealDetail";
import UpcomingMeal from "../Pages/UpcomingMeals.jsx/UpcomingMeal";
import AboutUs from "../Pages/AboutUs/AboutUs";
import Login from "../Pages/Authentication/Login/Login";
import Register from "../Pages/Authentication/Register/Register";

// Dashboard Pages
import DashboardLayout from "../Layouts/DashboardLayout";
import DashboardSplite from "../Components/DashboardSplite";
import AddMeal from "../Pages/Admin/AddMeals/AddMeals";
import MealsTable from "../Pages/Admin/MealsTable";
import ManageUsers from "../Pages/Admin/ManageUsers";
import PaymentHistory from "../Pages/User/PaymentHistory";
import UpdateMeals from "../Pages/Admin/AddMeals/UpdateMeal";
import AllReviewsTable from "../Pages/Admin/AllReviewsTable";
import ServeMeals from "../Pages/Admin/ServeMeals";
import UpcomingMeals from "../Pages/Admin/UpcomingMeals";
import AddUpcomingMeal from "../Pages/Admin/AddUpcomingMeal";
import MyReviews from "../Pages/User/MyReviews";
import RequestedMeals from "../Pages/User/RequestedMeals";
import Error from "../Pages/Error/Error";
import ProfilePage from "../Pages/ProfilePage/ProfilePage";



export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Home },
      { path: "/meals", Component: Meals },
      { path: "/meals/:id", Component: MealDetail },
      { path: "/upComingMeal", element: <PrivateRoute><UpcomingMeal /></PrivateRoute> },
    ]
  },
  { path: "/aboutUs", Component: AboutUs },
  {
    path: "/",
    Component: AuthLayout,
    children: [
      { path: "/login", Component: Login },
      { path: "/register", Component: Register },
    ]
  },
  {
    path: "/dashboard",
    element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
    children: [

      { index: true, element: <DashboardSplite /> },
     
      { path: "manageUsers", element: <AdminRoute><ManageUsers /></AdminRoute> },
      { path: "paymentHistory", Component: PaymentHistory },
      { path: "addMeal", element: <AdminRoute><AddMeal /></AdminRoute> },
      { path: "updateMeals/:id", element: <AdminRoute><UpdateMeals /></AdminRoute> },
      { path: "allReviews", element: <AdminRoute><AllReviewsTable /></AdminRoute> },
      { path: "serveMeals", element: <AdminRoute><ServeMeals /></AdminRoute> },
      { path: "upcomingMeals", element: <AdminRoute><UpcomingMeals /></AdminRoute> },
      { path: "addUpcomingMeal", element: <AdminRoute><AddUpcomingMeal /></AdminRoute> },
      { path: "myReviews", Component: MyReviews },
      { path: "requestedMeals", Component: RequestedMeals },
      { path: "meals", element: <AdminRoute><MealsTable /></AdminRoute> },
      { path: "profile", element: <AdminRoute><ProfilePage/></AdminRoute> },
      
    ]
  },
  { path: "*", Component: Error }
]);
