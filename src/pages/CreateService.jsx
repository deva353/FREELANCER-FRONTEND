import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const CreateService = () => {
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

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

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
            setMessage("Description must contain at least 20 characters.");
            return;
        }

        if (Number(formData.price) <= 0) {
            setMessage("Price must be greater than 0.");
            return;
        }

        if (Number(formData.deliveryTime) <= 0) {
            setMessage("Delivery time must be greater than 0.");
            return;
        }

        try {
            setLoading(true);
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

            await API.post("/services", serviceData);

            navigate("/my-services");
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Failed to create service"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="service-builder-page">

            <div className="service-builder-header">
                <div>
                    <h1>Create New Service</h1>
                    <p>
                        Tell clients what you offer and create an attractive
                        service listing.
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

            {message && (
                <div className="service-form-message">
                    {message}
                </div>
            )}

            <form
                className="professional-service-form"
                onSubmit={handleSubmit}
            >

                {/* Basic Information */}

                <div className="form-section">

                    <div className="form-section-header">
                        <div className="form-section-number">1</div>

                        <div>
                            <h2>Basic Information</h2>
                            <p>
                                Give your service a clear and attractive title.
                            </p>
                        </div>
                    </div>

                    <div className="form-field">
                        <label>Service Title</label>

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
                        <label>Description</label>

                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe what the client will receive..."
                            rows="7"
                            maxLength="1000"
                            required
                        />

                        <div className="character-count">
                            {formData.description.length}/1000
                        </div>
                    </div>

                </div>

                {/* Pricing */}

                <div className="form-section">

                    <div className="form-section-header">
                        <div className="form-section-number">2</div>

                        <div>
                            <h2>Pricing & Delivery</h2>
                            <p>
                                Set your starting price and expected delivery
                                time.
                            </p>
                        </div>
                    </div>

                    <div className="form-two-columns">

                        <div className="form-field">
                            <label>Starting Price (₹)</label>

                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="5000"
                                min="1"
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label>Delivery Time (Days)</label>

                            <input
                                type="number"
                                name="deliveryTime"
                                value={formData.deliveryTime}
                                onChange={handleChange}
                                placeholder="7"
                                min="1"
                                required
                            />
                        </div>

                    </div>

                </div>

                {/* Category & Skills */}

                <div className="form-section">

                    <div className="form-section-header">
                        <div className="form-section-number">3</div>

                        <div>
                            <h2>Category & Skills</h2>
                            <p>
                                Help clients understand your area of expertise.
                            </p>
                        </div>
                    </div>

                    <div className="form-field">
                        <label>Category</label>

                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                        >
                            <option>Web Development</option>
                            <option>Mobile Development</option>
                            <option>UI/UX Design</option>
                            <option>Graphic Design</option>
                            <option>Digital Marketing</option>
                            <option>Content Writing</option>
                        </select>
                    </div>

                    <div className="form-field">
                        <label>Skills</label>

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

                {/* Image */}

                <div className="form-section">

                    <div className="form-section-header">
                        <div className="form-section-number">4</div>

                        <div>
                            <h2>Service Image</h2>
                            <p>
                                Add an image URL to make your service stand out.
                            </p>
                        </div>
                    </div>

                    <div className="form-field">
                        <label>Image URL</label>

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
                        disabled={loading}
                    >
                        {loading ? "Creating..." : "Create Service"}
                    </button>

                </div>

            </form>
        </div>
    );
};

export default CreateService;