import React, { useState, useEffect } from "react";
import { useUser } from "../../UserContext";
import axios from "axios";
import "./UserProfile.css";
import NavBar from "../../NavBar";
import { useNavigate } from "react-router-dom";
const UserProfile = () => {
    const { user } = useUser();
    const navigate = useNavigate();  // Use useNavigate instead of useHistory

    const [userDetails, setUserDetails] = useState({
        first_name: "",
        last_name: "",
        email: "",
        role: "",
    });
    const [userArticles, setUserArticles] = useState([]);

    useEffect(() => {
        if (user) {
            setUserDetails(user);
            fetchUserArticles();
        }
    }, [user]);

    // Fetch articles written by the user
    const fetchUserArticles = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/articles/user/${user.id}`);
            setUserArticles(response.data);
        } catch (error) {
            console.error("Error fetching articles:", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        window.location.href = "/login";
    };

    if (!user) {
        return <div className="profile-container">Please log in.</div>;
    }

    return (
        <>
            <NavBar />
            <div className="profile-container">
                <h1>My Profile</h1>
                <div className="profile-details">
                    <div className="form-group">
                        <label>First Name:</label>
                        <input
                            type="text"
                            name="first_name"
                            value={userDetails.first_name}
                            disabled
                        />
                    </div>
                    <div className="form-group">
                        <label>Last Name:</label>
                        <input
                            type="text"
                            name="last_name"
                            value={userDetails.last_name}
                            disabled
                        />
                    </div>
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={userDetails.email}
                            disabled
                        />
                    </div>

                    {/* Articles Section */}
                    <div className="user-articles">
                        <h3>Статті</h3>
                        {userArticles.length > 0 ? (
                            <div className="articles-container">
                                {userArticles.map((article) => (
                                    <div className="article-card" key={article.id}>
                                        <h4>{article.title}</h4>
                                        <p>{article.excerpt}</p>
                                        <button className="read-more-btn" onClick={() => navigate(`/article/${article.id}`)}>Read More</button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>Нема ще ваших статей</p>
                        )}
                    </div>

                    <div className="button-container">
                        <button onClick={handleLogout} className="logout-btn">
                            Вийти з акаунту
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserProfile;
