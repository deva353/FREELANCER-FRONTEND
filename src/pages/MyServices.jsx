import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const MyServices = () => {
    const navigate = useNavigate();

    const [services, setServices] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const currentUser = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            setLoading(true);

            const response = await API.get("/services");

            const allServices = response.data.services || [];

            const userId = currentUser?.id || currentUser?._id;

            const myServices = allServices.filter((service) => {
                const freelancerId =
                    service.freelancer?._id || service.freelancer;

                return freelancerId === userId;
            });

            setServices(myServices);
        } catch (error) {
            console.error(error);
            setMessage(
                error.response?.data?.message ||
                "Failed to load your services"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this service?"
        );

        if (!confirmDelete) return;

        try {
            await API.delete(`/services/${id}`);

            setServices((prevServices) =>
                prevServices.filter((service) => service._id !== id)
            );

            setMessage("Service deleted successfully");

            setTimeout(() => {
                setMessage("");
            }, 2000);
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Failed to delete service"
            );
        }
    };

    const categories = useMemo(() => {
        const uniqueCategories = [
            ...new Set(services.map((service) => service.category))
        ];

        return ["All", ...uniqueCategories];
    }, [services]);

    const filteredServices = useMemo(() => {
        return services.filter((service) => {
            const searchText = search.toLowerCase();

            const matchesSearch =
                service.title?.toLowerCase().includes(searchText) ||
                service.description?.toLowerCase().includes(searchText) ||
                service.skills?.some((skill) =>
                    skill.toLowerCase().includes(searchText)
                );

            const matchesCategory =
                category === "All" ||
                service.category === category;

            return matchesSearch && matchesCategory;
        });
    }, [services, search, category]);

    const averagePrice =
        services.length > 0
            ? Math.round(
                  services.reduce(
                      (total, service) => total + Number(service.price || 0),
                      0
                  ) / services.length
              )
            : 0;

    return (
        <div className="management-page">

            {/* Header */}
            <div className="management-header">
                <div className="management-header-content">
                    <div>
                        <h1>My Services</h1>
                        <p>
                            Manage and showcase the services you offer to clients.
                        </p>
                    </div>

                    <button
                        className="primary-button"
                        onClick={() => navigate("/create-service")}
                    >
                        + Create Service
                    </button>
                </div>
            </div>

            {/* Message */}
            {message && (
                <div className="management-message">
                    {message}
                </div>
            )}

            {/* Statistics */}
            <div className="management-stats">

                <div className="management-stat">
                    <div className="management-stat-icon">📦</div>
                    <div>
                        <span>Total Services</span>
                        <strong>{services.length}</strong>
                    </div>
                </div>

                <div className="management-stat">
                    <div className="management-stat-icon">✓</div>
                    <div>
                        <span>Published Services</span>
                        <strong>{services.length}</strong>
                    </div>
                </div>

                <div className="management-stat">
                    <div className="management-stat-icon">₹</div>
                    <div>
                        <span>Average Price</span>
                        <strong>₹{averagePrice.toLocaleString()}</strong>
                    </div>
                </div>

            </div>

            {/* Toolbar */}
            <div className="management-toolbar">

                <input
                    type="text"
                    placeholder="Search your services..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    {categories.map((item) => (
                        <option key={item} value={item}>
                            {item}
                        </option>
                    ))}
                </select>

            </div>

            {/* Loading */}
            {loading && (
                <div className="management-empty">
                    <h3>Loading services...</h3>
                </div>
            )}

            {/* Services */}
            {!loading && filteredServices.length > 0 && (
                <div className="service-management-grid">

                    {filteredServices.map((service) => (
                        <div
                            className="management-service-card"
                            key={service._id}
                        >

                            {/* Image */}
                            {service.image ? (
                                <img
                                    src={service.image}
                                    alt={service.title}
                                    className="management-service-image"
                                />
                            ) : (
                                <div className="management-service-image placeholder-image">
                                    No Image
                                </div>
                            )}

                            {/* Content */}
                            <div className="management-service-content">

                                <div className="management-service-top">
                                    <span className="management-category">
                                        {service.category}
                                    </span>

                                    <span className="listed-badge">
                                        Listed
                                    </span>
                                </div>

                                <h2 className="management-service-title">
                                    {service.title}
                                </h2>

                                <p className="management-service-description">
                                    {service.description?.length > 120
                                        ? service.description.substring(0, 120) + "..."
                                        : service.description}
                                </p>

                                {/* Skills */}
                                {service.skills?.length > 0 && (
                                    <div className="management-skills">
                                        {service.skills.slice(0, 4).map(
                                            (skill, index) => (
                                                <span key={index}>
                                                    {skill}
                                                </span>
                                            )
                                        )}
                                    </div>
                                )}

                                {/* Footer */}
                                <div className="management-service-footer">

                                    <div>
                                        <span>Starting at</span>
                                        <strong>
                                            ₹{Number(service.price).toLocaleString()}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Delivery</span>
                                        <strong>
                                            {service.deliveryTime} days
                                        </strong>
                                    </div>

                                </div>

                                {/* Actions */}
                                <div className="management-service-actions">

                                    <button
                                        className="edit-service-button"
                                        onClick={() =>
                                            navigate(
                                                `/edit-service/${service._id}`
                                            )
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="delete-service-button"
                                        onClick={() =>
                                            handleDelete(service._id)
                                        }
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>
                        </div>
                    ))}

                </div>
            )}

            {/* Empty */}
            {!loading && filteredServices.length === 0 && (
                <div className="management-empty">

                    {services.length === 0 ? (
                        <>
                            <div className="empty-icon">📦</div>

                            <h2>No services yet</h2>

                            <p>
                                Create your first service and start getting
                                clients.
                            </p>

                            <button
                                className="primary-button"
                                onClick={() =>
                                    navigate("/create-service")
                                }
                            >
                                Create Your First Service
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="empty-icon">🔍</div>

                            <h2>No matching services</h2>

                            <p>
                                Try changing your search or category filter.
                            </p>
                        </>
                    )}

                </div>
            )}

        </div>
    );
};

export default MyServices;