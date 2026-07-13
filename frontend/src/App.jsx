import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";


// Layout
import ManagerLayout from "./components/ManagerLayout";


// Home
import Home from "./pages/Home";


// Login Pages
import Login from "./pages/Login";
import EmployeeLogin from "./pages/EmployeeLogin";


// Manager Pages
import ManagerDashboard from "./pages/ManagerDashboard";
import ViewTasks from "./pages/ViewTasks";
import CreateTask from "./pages/CreateTask";
import Reports from "./pages/Reports";
import Employees from "./pages/Employees";
import Profile from "./pages/Profile";
import ManagerNotifications from "./pages/ManagerNotifications";


// Employee Pages
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ChangePassword from "./pages/ChangePassword";
import EmployeeTasks from "./pages/EmployeeTasks";
import EmployeeReports from "./pages/EmployeeReports";
import EmployeeNotifications from "./pages/EmployeeNotifications";
import EmployeeSettings from "./pages/EmployeeSettings";



function App() {


  return (

    <BrowserRouter>


      <Routes>



        {/* ================= HOME ================= */}


        <Route
          path="/"
          element={<Home />}
        />





        {/* ================= LOGIN ================= */}


        <Route
          path="/manager-login"
          element={<Login />}
        />


        <Route
          path="/employee-login"
          element={<EmployeeLogin />}
        />







        {/* ================= MANAGER ROUTES ================= */}



        <Route
          path="/manager"
          element={<ManagerLayout />}
        >



          {/* Dashboard */}

          <Route
            index
            element={<ManagerDashboard />}
          />



          {/* Create Task */}

          <Route
            path="create-task"
            element={<CreateTask />}
          />



          {/* View Tasks */}

          <Route
            path="tasks"
            element={<ViewTasks />}
          />



          {/* Employees */}

          <Route
            path="employees"
            element={<Employees />}
          />



          {/* Reports */}

          <Route
            path="reports"
            element={<Reports />}
          />



          {/* Profile */}

          <Route
            path="profile"
            element={<Profile />}
          />



          {/* Notifications */}

          <Route
            path="notifications"
            element={<ManagerNotifications />}
          />


        </Route>









        {/* ================= EMPLOYEE ROUTES ================= */}



        <Route
          path="/employee-dashboard"
          element={<EmployeeDashboard />}
        />



        <Route
          path="/change-password"
          element={<ChangePassword />}
        />



        <Route
          path="/employee-tasks"
          element={<EmployeeTasks />}
        />



        <Route
          path="/employee-reports"
          element={<EmployeeReports />}
        />



        <Route
          path="/employee-notifications"
          element={<EmployeeNotifications />}
        />



        <Route
          path="/employee-profile"
          element={<EmployeeSettings />}
        />





      </Routes>


    </BrowserRouter>

  );

}


export default App;