import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateService from "./pages/CreateService";
import MyServices from "./pages/MyServices";
import EditService from "./pages/EditService";
import Services from "./pages/Services";
import ServiceDetails from "./pages/ServiceDetails";
import Profile from "./pages/Profile";

const App = () => {
    return (
        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Navigate to="/login" />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="/create-service"
                    element={<CreateService />}
                />

                <Route
                    path="/my-services"
                    element={<MyServices />}
                />
                <Route
    path="/edit-service/:id"
    element={<EditService />}
/>
<Route
    path="/services"
    element={<Services />}
/>
<Route
    path="/services/:id"
    element={<ServiceDetails />}
/>
<Route
    path="/profile"
    element={<Profile />}
/>
            </Routes>

        </BrowserRouter>
    );
};

export default App;