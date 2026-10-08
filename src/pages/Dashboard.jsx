import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [services, setServices] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            const [servicesResponse, ordersResponse] =
                await Promise.all([
                    API.get("/services"),
                    API.get("/orders/freelancer")
                ]);

            const allServices =
                servicesResponse.data.services || [];

            const freelancerId =
                user?.id ||
                user?._id;

            const myServices = allServices.filter((service) => {
                const serviceFreelancer =
                    service.freelancer?._id ||
                    service.freelancer;

                return serviceFreelancer === freelancerId;
            });

            setServices(myServices);
            setOrders(ordersResponse.data.orders || []);

        } catch (error) {
            console.error(
                "Dashboard error:",
                error.response?.data || error.message
            );
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const activeOrders = orders.filter(
        (order) =>
            order.status === "pending" ||
            order.status === "accepted"
    );

    const completedOrders = orders.filter(
        (order) => order.status === "completed"
    );

    const totalEarnings = completedOrders.reduce(
        (total, order) =>
            total + Number(
                order.price ||
                order.service?.price ||
                0
            ),
        0
    );

    return (
        <div className="freelancer-layout">

            {/* Sidebar */}

            <aside className="sidebar">

                <div className="sidebar-logo">
                    FreelanceHub
                </div>

                <div className="profile-mini">

                    <div className="profile-avatar">
                        {user?.name?.charAt(0).toUpperCase() || "F"}
                    </div>

                    <div>
                        <strong>
                            {user?.name || "Freelancer"}
                        </strong>

                        <span>
                            Freelancer
                        </span>
                    </div>

                </div>

                <nav className="sidebar-nav">

                    <button
                        className="nav-item active"
                        onClick={() => navigate("/dashboard")}
                    >
                        🏠
                        <span>Dashboard</span>
                    </button>

                    <button
                        className="nav-item"
                        onClick={() => navigate("/my-services")}
                    >
                        📦
                        <span>My Services</span>
                    </button>

                    <button
                        className="nav-item"
                        onClick={() => navigate("/create-service")}
                    >
                        ➕
                        <span>Create Service</span>
                    </button>

                    <button
                        className="nav-item"
                        onClick={() => navigate("/freelancer-orders")}
                    >
                        📋
                        <span>Orders</span>
                    </button>

                    <button
                        className="nav-item"
                        onClick={() => navigate("/profile")}
                    >
                        👤
                        <span>Profile</span>
                    </button>

                </nav>

                <div className="sidebar-bottom">

                    <button
                        className="nav-item"
                        onClick={handleLogout}
                    >
                        🚪
                        <span>Logout</span>
                    </button>

                </div>

            </aside>

            {/* Main */}

            <main className="dashboard-main">

                <div className="dashboard-topbar">

                    <div>
                        <h1>
                            Welcome back, {user?.name || "Freelancer"} 👋
                        </h1>

                        <p>
                            Manage your services and orders from here.
                        </p>
                    </div>

                </div>

                {loading ? (
                    <div className="dashboard-loading">
                        <h2>Loading dashboard...</h2>
                        <p>Please wait while we fetch your data.</p>
                    </div>
                ) : (
                    <>

                        {/* Statistics */}

                        <div className="stats-grid">

                            <div className="stat-card">

                                <div className="stat-icon">
                                    📦
                                </div>

                                <div>
                                    <span>Total Services</span>
                                    <strong>
                                        {services.length}
                                    </strong>
                                </div>

                            </div>

                            <div className="stat-card">

                                <div className="stat-icon">
                                    📋
                                </div>

                                <div>
                                    <span>Active Orders</span>
                                    <strong>
                                        {activeOrders.length}
                                    </strong>
                                </div>

                            </div>

                            <div className="stat-card">

                                <div className="stat-icon">
                                    ✓
                                </div>

                                <div>
                                    <span>Completed Orders</span>
                                    <strong>
                                        {completedOrders.length}
                                    </strong>
                                </div>

                            </div>

                            <div className="stat-card">

                                <div className="stat-icon">
                                    ₹
                                </div>

                                <div>
                                    <span>Total Earnings</span>

                                    <strong>
                                        ₹{totalEarnings.toLocaleString()}
                                    </strong>
                                </div>

                            </div>

                        </div>

                        {/* Quick Actions */}

                        <section className="quick-actions">

                            <div>
                                <h2>Quick Actions</h2>

                                <p>
                                    Manage your freelance business quickly.
                                </p>
                            </div>

                            <div className="quick-buttons">

                                <button
                                    onClick={() =>
                                        navigate("/create-service")
                                    }
                                >
                                    + Create Service
                                </button>

                                <button
                                    onClick={() =>
                                        navigate("/freelancer-orders")
                                    }
                                >
                                    View Orders
                                </button>

                                <button
                                    onClick={() =>
                                        navigate("/profile")
                                    }
                                >
                                    Edit Profile
                                </button>

                            </div>

                        </section>

                        {/* Recent Services */}

                        <section className="dashboard-section">

                            <div className="section-header">

                                <div>
                                    <h2>Recent Services</h2>

                                    <p>
                                        Your latest service listings.
                                    </p>
                                </div>

                                <button
                                    onClick={() =>
                                        navigate("/my-services")
                                    }
                                >
                                    View All
                                </button>

                            </div>

                            {services.length === 0 ? (

                                <div className="dashboard-empty">
                                    <h3>No services yet</h3>

                                    <p>
                                        Create your first service to start
                                        getting clients.
                                    </p>

                                    <button
                                        onClick={() =>
                                            navigate("/create-service")
                                        }
                                    >
                                        Create Service
                                    </button>
                                </div>

                            ) : (

                                <div className="dashboard-list">

                                    {services
                                        .slice(0, 3)
                                        .map((service) => (

                                            <div
                                                className="dashboard-list-item"
                                                key={service._id}
                                            >

                                                <div className="list-icon">
                                                    📦
                                                </div>

                                                <div className="list-content">

                                                    <strong>
                                                        {service.title}
                                                    </strong>

                                                    <span>
                                                        {service.category}
                                                    </span>

                                                </div>

                                                <strong>
                                                    ₹
                                                    {Number(
                                                        service.price || 0
                                                    ).toLocaleString()}
                                                </strong>

                                            </div>

                                        ))}

                                </div>

                            )}

                        </section>

                        {/* Recent Orders */}

                        <section className="dashboard-section">

                            <div className="section-header">

                                <div>
                                    <h2>Recent Orders</h2>

                                    <p>
                                        Latest orders from your clients.
                                    </p>
                                </div>

                                <button
                                    onClick={() =>
                                        navigate("/freelancer-orders")
                                    }
                                >
                                    View All
                                </button>

                            </div>

                            {orders.length === 0 ? (

                                <div className="dashboard-empty">

                                    <h3>No orders yet</h3>

                                    <p>
                                        Orders from clients will appear here.
                                    </p>

                                </div>

                            ) : (

                                <div className="dashboard-list">

                                    {orders
                                        .slice(0, 3)
                                        .map((order) => (

                                            <div
                                                className="dashboard-list-item"
                                                key={order._id}
                                            >

                                                <div className="list-icon order-icon">
                                                    📋
                                                </div>

                                                <div className="list-content">

                                                    <strong>
                                                        {order.service?.title ||
                                                            "Service Order"}
                                                    </strong>

                                                    <span>
                                                        Client:{" "}
                                                        {order.client?.name ||
                                                            "Client"}
                                                    </span>

                                                </div>

                                                <span
                                                    className={`status-badge status-${order.status}`}
                                                >
                                                    {order.status}
                                                </span>

                                            </div>

                                        ))}

                                </div>

                            )}

                        </section>

                    </>
                )}

            </main>

        </div>
    );
};

export default Dashboard;