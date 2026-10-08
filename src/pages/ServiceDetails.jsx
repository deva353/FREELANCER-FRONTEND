import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import API from "../services/api";
import { useAuth } from "../context/AuthContext";

const ServiceDetails = () => {
    const { id } = useParams();

    const navigate = useNavigate();

    const { user } = useAuth();

    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchService = async () => {
            try {
                const response = await API.get(
                    `/services/${id}`
                );

                setService(response.data.service);

            } catch (error) {
                console.error(error);

                setMessage(
                    error.response?.data?.message ||
                    "Failed to load service"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchService();
    }, [id]);

    if (loading) {
        return (
            <h2 className="loading">
                Loading service...
            </h2>
        );
    }

    if (!service) {
        return (
            <div className="empty-state">
                <h2>Service not found</h2>

                <button
                    onClick={() => navigate("/services")}
                >
                    Back to Services
                </button>
            </div>
        );
    }

    return (
        <div className="service-details-page">

            <button
                className="back-button"
                onClick={() => navigate("/services")}
            >
                ← Back to Services
            </button>

            <div className="service-details">

                {/* Left side */}

                <div className="service-details-main">

                    {service.image ? (
                        <img
                            src={service.image}
                            alt={service.title}
                            className="details-image"
                        />
                    ) : (
                        <div className="details-placeholder">
                            No Image
                        </div>
                    )}

                    <span className="category">
                        {service.category}
                    </span>

                    <h1>
                        {service.title}
                    </h1>

                    <h3>
                        About this service
                    </h3>

                    <p className="details-description">
                        {service.description}
                    </p>

                    <h3>
                        Skills
                    </h3>

                    <div className="skills">

                        {service.skills?.map(
                            (skill, index) => (
                                <span key={index}>
                                    {skill}
                                </span>
                            )
                        )}

                    </div>

                </div>


                {/* Right side */}

                <div className="service-details-sidebar">

                    <div className="price-card">

                        <div className="price">
                            ₹{service.price}
                        </div>

                        <p>
                            Delivery in{" "}
                            <strong>
                                {service.deliveryTime} days
                            </strong>
                        </p>

                        {user?.role === "client" ? (
                            <button
                                className="order-button"
                                onClick={() =>
                                    navigate(
                                        `/order/${service._id}`
                                    )
                                }
                            >
                                Order Now
                            </button>
                        ) : user?.role === "freelancer" ? (
                            <button
                                className="order-button"
                                onClick={() =>
                                    navigate("/my-services")
                                }
                            >
                                Manage Services
                            </button>
                        ) : (
                            <button
                                className="order-button"
                                onClick={() =>
                                    navigate("/login")
                                }
                            >
                                Login to Order
                            </button>
                        )}

                    </div>


                    {/* Freelancer */}

                    {service.freelancer && (
                        <div className="freelancer-card">

                            <h3>
                                About the Freelancer
                            </h3>

                            <div className="freelancer-avatar">
                                {service.freelancer.name
                                    ?.charAt(0)
                                    .toUpperCase()}
                            </div>

                            <h2>
                                {service.freelancer.name}
                            </h2>

                            <p>
                                {service.freelancer.email}
                            </p>

                            <span>
                                Freelancer
                            </span>

                        </div>
                    )}

                </div>

            </div>

            {message && (
                <p className="error-message">
                    {message}
                </p>
            )}

        </div>
    );
};

export default ServiceDetails;