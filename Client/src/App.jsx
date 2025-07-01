import { RouterProvider, createBrowserRouter } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import Dashboard from "./Pages/AdminDashboard/Dashboard";
import TaskDetails from "./Pages/TaskDetails/TaskDetails";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/task-details/:id",
    element: <TaskDetails />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
