import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [editing, setEditing] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        bio: "",
        skills: "",
        experience: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = (e) => {
        e.preventDefault();

        // Frontend-only for now
        setEditing(false);
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="profile-page">

            <div className="profile-header">

                <button
                    className="back-button"
                    onClick={() => navigate("/dashboard")}
                >
                    ← Dashboard
                </button>

                <h1>My Profile</h1>

                <p>
                    Manage your freelancer profile.
                </p>

            </div>


            <div className="profile-container">

                {/* PROFILE CARD */}

                <div className="profile-card">

                    <div className="large-avatar">
                        {user?.name
                            ?.charAt(0)
                            .toUpperCase()}
                    </div>

                    <h2>
                        {user?.name}
                    </h2>

                    <p>
                        {user?.email}
                    </p>

                    <span className="role-badge">
                        Freelancer
                    </span>

                    <div className="profile-actions">

                        <button
                            onClick={() =>
                                setEditing(true)
                            }
                        >
                            Edit Profile
                        </button>

                        <button
                            className="profile-logout"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>

                    </div>

                </div>


                {/* PROFILE INFORMATION */}

                <div className="profile-info-card">

                    <div className="profile-section-header">

                        <div>
                            <h2>
                                Profile Information
                            </h2>

                            <p>
                                Tell clients about yourself.
                            </p>
                        </div>

                    </div>


                    {editing ? (

                        <form
                            className="profile-form"
                            onSubmit={handleSave}
                        >

                            <label>
                                Full Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                            />


                            <label>
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                disabled
                            />


                            <label>
                                About Me
                            </label>

                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                placeholder="Tell clients about your experience..."
                            />


                            <label>
                                Skills
                            </label>

                            <input
                                type="text"
                                name="skills"
                                value={formData.skills}
                                onChange={handleChange}
                                placeholder="React, Node.js, MongoDB, JavaScript"
                            />


                            <label>
                                Experience
                            </label>

                            <input
                                type="text"
                                name="experience"
                                value={formData.experience}
                                onChange={handleChange}
                                placeholder="2 years"
                            />


                            <div className="profile-form-buttons">

                                <button
                                    type="submit"
                                >
                                    Save Changes
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setEditing(false)
                                    }
                                >
                                    Cancel
                                </button>

                            </div>

                        </form>

                    ) : (

                        <div className="profile-details">

                            <div className="profile-detail">

                                <span>
                                    Name
                                </span>

                                <strong>
                                    {formData.name || "Not provided"}
                                </strong>

                            </div>


                            <div className="profile-detail">

                                <span>
                                    Email
                                </span>

                                <strong>
                                    {formData.email || "Not provided"}
                                </strong>

                            </div>


                            <div className="profile-detail">

                                <span>
                                    About Me
                                </span>

                                <strong>
                                    {formData.bio ||
                                        "Add a description about yourself."}
                                </strong>

                            </div>


                            <div className="profile-detail">

                                <span>
                                    Skills
                                </span>

                                <strong>
                                    {formData.skills ||
                                        "Add your skills."}
                                </strong>

                            </div>


                            <div className="profile-detail">

                                <span>
                                    Experience
                                </span>

                                <strong>
                                    {formData.experience ||
                                        "Add your experience."}
                                </strong>

                            </div>

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
};

export default Profile;