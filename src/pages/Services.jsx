import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../services/api";

const Services = () => {

    const [services, setServices] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    // Get services from backend
    useEffect(() => {

        const fetchServices = async () => {

            try {

                const response = await API.get(
                    "/services"
                );

                setServices(
                    response.data.services
                );

                setFilteredServices(
                    response.data.services
                );

            } catch (error) {

                console.error(error);

                setMessage(
                    error.response?.data?.message ||
                    "Failed to load services"
                );

            } finally {

                setLoading(false);
            }
        };

        fetchServices();

    }, []);


    // Search and category filtering
    useEffect(() => {

        let result = [...services];

        // Search
        if (search.trim() !== "") {

            result = result.filter((service) =>
                service.title
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||

                service.description
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||

                service.skills?.some((skill) =>
                    skill
                        .toLowerCase()
                        .includes(search.toLowerCase())
                )
            );
        }

        // Category
        if (category !== "") {

            result = result.filter(
                (service) =>
                    service.category === category
            );
        }

        setFilteredServices(result);

    }, [search, category, services]);


    if (loading) {

        return (
            <h2 className="loading">
                Loading services...
            </h2>
        );
    }


    return (
        <div className="marketplace">

            {/* Header */}

            <div className="marketplace-header">

                <h1>
                    Explore Services
                </h1>

                <p>
                    Find talented freelancers for your project.
                </p>

            </div>


            {/* Filters */}

            <div className="filters">

                <input
                    type="text"
                    placeholder="Search services..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />


                <select
                    value={category}
                    onChange={(e) =>
                        setCategory(e.target.value)
                    }
                >

                    <option value="">
                        All Categories
                    </option>

                    <option value="Web Development">
                        Web Development
                    </option>

                    <option value="Mobile Development">
                        Mobile Development
                    </option>

                    <option value="UI/UX Design">
                        UI/UX Design
                    </option>

                    <option value="Graphic Design">
                        Graphic Design
                    </option>

                    <option value="Digital Marketing">
                        Digital Marketing
                    </option>

                    <option value="Content Writing">
                        Content Writing
                    </option>

                </select>

            </div>


            {message && (
                <p className="error-message">
                    {message}
                </p>
            )}


            {/* Results */}

            {filteredServices.length === 0 ? (

                <div className="empty-state">

                    <h2>
                        No services found
                    </h2>

                    <p>
                        Try changing your search or category.
                    </p>

                </div>

            ) : (

                <div className="services-grid">

                    {filteredServices.map(
                        (service) => (

                            <div
                                className="service-card"
                                key={service._id}
                            >

                                {service.image ? (

                                    <img
                                        src={service.image}
                                        alt={service.title}
                                        className="service-image"
                                    />

                                ) : (

                                    <div className="service-placeholder">
                                        No Image
                                    </div>

                                )}


                                <div className="service-card-content">

                                    <span className="category">
                                        {service.category}
                                    </span>


                                    <h2>
                                        {service.title}
                                    </h2>


                                    <p>
                                        {service.description}
                                    </p>


                                    <div className="service-info">

                                        <strong>
                                            ₹{service.price}
                                        </strong>

                                        <span>
                                            {service.deliveryTime} days
                                        </span>

                                    </div>


                                    <div className="skills">

                                        {service.skills?.map(
                                            (skill, index) => (

                                                <span
                                                    key={index}
                                                >
                                                    {skill}
                                                </span>

                                            )
                                        )}

                                    </div>


                                    {service.freelancer && (
                                        <div className="freelancer-info">

                                            <strong>
                                                {service.freelancer.name}
                                            </strong>

                                            <span>
                                                Freelancer
                                            </span>

                                        </div>
                                    )}


                                    <button
                                        className="view-button"
                                        onClick={() =>
                                            navigate(
                                                `/services/${service._id}`
                                            )
                                        }
                                    >
                                        View Details
                                    </button>

                                </div>

                            </div>

                        )
                    )}

                </div>

            )}

        </div>
    );
};

export default Services;