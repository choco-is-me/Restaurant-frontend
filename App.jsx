import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "./App.css";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicLayout from "./layouts/Public";
import WaiterLayout from "./layouts/Waiter";
import ManagerLayout from "./layouts/Manager";
import CookLayout from "./layouts/Cook";
import AdminLayout from "./layouts/Admin";
import Login from "./pages/Login";
import Table from "./pages/Table";
import Menu from "./pages/Menu";
import Order from "./pages/Order";
import Payment from "./pages/Payment";
import Ingredient from "./pages/Ingredient";
import Record from "./pages/Record";
import ManageStaff from "./pages/ManageStaff";
import Logout from "./pages/Logout";
import Axios from "axios";

const App = () => {
    Axios.defaults.baseURL = "http://192.168.0.59:8000/";

    let role = localStorage.getItem("role");
    if (typeof role === "undefined" || role === null) {
        localStorage.setItem("role", "guest");
    }

    return (
        <>
            <ToastContainer
                style={{ width: "fit-content", minWidth: "250px" }}
            />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<PublicLayout />}>
                        <Route index element={<Login />} />
                    </Route>
                    <Route path="/waiter" element={<WaiterLayout />}>
                        <Route index element={<Table />} />
                        <Route path="menu" element={<Menu />} />
                        <Route path="order" element={<Order />} />
                        <Route path="payment" element={<Payment />} />
                        <Route path="logout" element={<Logout />} />
                    </Route>
                    <Route path="/manager" element={<ManagerLayout />}>
                        <Route index element={<Record />} />
                        <Route path="table" element={<Table />} />
                        <Route path="menu" element={<Menu />} />
                        <Route path="order" element={<Order />} />
                        <Route path="payment" element={<Payment />} />
                        <Route path="logout" element={<Logout />} />
                    </Route>
                    <Route path="/cook" element={<CookLayout />}>
                        <Route index element={<Ingredient />} />
                        <Route path="order" element={<Order />} />
                        <Route path="logout" element={<Logout />} />
                    </Route>
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<ManageStaff />} />
                        <Route path="table" element={<Table />} />
                        <Route path="menu" element={<Menu />} />
                        <Route path="ingredient" element={<Ingredient />} />
                        <Route path="order" element={<Order />} />
                        <Route path="payment" element={<Payment />} />
                        <Route path="record" element={<Record />} />
                        <Route path="logout" element={<Logout />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
};
export default App;
