import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

const EditService = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        category: "Web Development",
        deliveryTime: "",
        skills: "",
        image: ""
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchService();
    }, [id]);

    const fetchService = async () => {
        try {
            setLoading(true);

            const response = await API.get(`/services/${id}`);

            const service = response.data.service;

            setFormData({
                title: service.title || "",
                description: service.description || "",
                price: service.price || "",
                category: service.category || "Web Development",
                deliveryTime: service.deliveryTime || "",
                skills: Array.isArray(service.skills)
                    ? service.skills.join(", ")
                    : service.skills || "",
                image: service.image || ""
            });
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

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.description.length < 20) {
            setMessage(
                "Description must contain at least 20 characters."
            );
            return;
        }

        if (Number(formData.price) <= 0) {
            setMessage("Price must be greater than 0.");
            return;
        }

        if (Number(formData.deliveryTime) <= 0) {
            setMessage(
                "Delivery time must be greater than 0."
            );
            return;
        }

        try {
            setSaving(true);
            setMessage("");

            const serviceData = {
                title: formData.title,
                description: formData.description,
                price: Number(formData.price),
                category: formData.category,
                deliveryTime: Number(formData.deliveryTime),
                skills: formData.skills
                    .split(",")
                    .map((skill) => skill.trim())
                    .filter(Boolean),
                image: formData.image
            };

            await API.put(`/services/${id}`, serviceData);

            navigate("/my-services");
        } catch (error) {
            console.error(error);

            setMessage(
                error.response?.data?.message ||
                "Failed to update service"
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="service-builder-page">
                <div className="management-empty">
                    <h2>Loading service...</h2>
                    <p>Please wait.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="service-builder-page">

            {/* Header */}

            <div className="service-builder-header">

                <div>
                    <h1>Edit Service</h1>

                    <p>
                        Update your service information and keep your
                        listing attractive to clients.
                    </p>
                </div>

                <button
                    type="button"
                    className="secondary-button"
                    onClick={() => navigate("/my-services")}
                >
                    ← Back to Services
                </button>

            </div>

            {/* Error */}

            {message && (
                <div className="service-form-message">
                    {message}
                </div>
            )}

            {/* Form */}

            <form
                className="professional-service-form"
                onSubmit={handleSubmit}
            >

                {/* Section 1 */}

                <div className="form-section">

                    <div className="form-section-header">

                        <div className="form-section-number">
                            1
                        </div>

                        <div>
                            <h2>Basic Information</h2>

                            <p>
                                Update the title and description of your
                                service.
                            </p>
                        </div>

                    </div>

                    <div className="form-field">

                        <label>
                            Service Title
                        </label>

                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Example: Professional MERN Stack Website"
                            required
                        />

                    </div>

                    <div className="form-field">

                        <label>
                            Description
                        </label>

                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="7"
                            maxLength="1000"
                            placeholder="Describe your service..."
                            required
                        />

                        <div className="character-count">
                            {formData.description.length}/1000
                        </div>

                    </div>

                </div>

                {/* Section 2 */}

                <div className="form-section">

                    <div className="form-section-header">

                        <div className="form-section-number">
                            2
                        </div>

                        <div>
                            <h2>Pricing & Delivery</h2>

                            <p>
                                Set your service price and delivery time.
                            </p>
                        </div>

                    </div>

                    <div className="form-two-columns">

                        <div className="form-field">

                            <label>
                                Starting Price (₹)
                            </label>

                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                min="1"
                                placeholder="5000"
                                required
                            />

                        </div>

                        <div className="form-field">

                            <label>
                                Delivery Time (Days)
                            </label>

                            <input
                                type="number"
                                name="deliveryTime"
                                value={formData.deliveryTime}
                                onChange={handleChange}
                                min="1"
                                placeholder="7"
                                required
                            />

                        </div>

                    </div>

                </div>

                {/* Section 3 */}

                <div className="form-section">

                    <div className="form-section-header">

                        <div className="form-section-number">
                            3
                        </div>

                        <div>
                            <h2>Category & Skills</h2>

                            <p>
                                Keep your expertise information up to date.
                            </p>
                        </div>

                    </div>

                    <div className="form-field">

                        <label>
                            Category
                        </label>

                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                        >
                            <option>
                                Web Development
                            </option>

                            <option>
                                Mobile Development
                            </option>

                            <option>
                                UI/UX Design
                            </option>

                            <option>
                                Graphic Design
                            </option>

                            <option>
                                Digital Marketing
                            </option>

                            <option>
                                Content Writing
                            </option>
                        </select>

                    </div>

                    <div className="form-field">

                        <label>
                            Skills
                        </label>

                        <input
                            type="text"
                            name="skills"
                            value={formData.skills}
                            onChange={handleChange}
                            placeholder="React, Node.js, MongoDB, Express"
                        />

                        <small>
                            Separate multiple skills with commas.
                        </small>

                    </div>

                </div>

                {/* Section 4 */}

                <div className="form-section">

                    <div className="form-section-header">

                        <div className="form-section-number">
                            4
                        </div>

                        <div>
                            <h2>Service Image</h2>

                            <p>
                                Update the image displayed on your service.
                            </p>
                        </div>

                    </div>

                    <div className="form-field">

                        <label>
                            Image URL
                        </label>

                        <input
                            type="url"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            placeholder="https://example.com/image.jpg"
                        />

                    </div>

                    {formData.image && (
                        <div className="image-preview">

                            <img
                                src={formData.image}
                                alt="Service preview"
                                onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                }}
                            />

                        </div>
                    )}

                </div>

                {/* Actions */}

                <div className="service-form-actions">

                    <button
                        type="button"
                        className="cancel-button"
                        onClick={() => navigate("/my-services")}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="save-service-button"
                        disabled={saving}
                    >
                        {saving
                            ? "Saving Changes..."
                            : "Save Changes"}
                    </button>

                </div>

            </form>

        </div>
    );
};

export default EditService;