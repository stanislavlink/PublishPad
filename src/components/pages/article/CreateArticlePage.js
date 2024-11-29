import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CreateArticlePage.css";
import NavBar from "../../NavBar";
import { useUser } from "../../UserContext";

const CreateArticlePage = () => {
    const { user } = useUser();  // Get the current user from context
    const [articleData, setArticleData] = useState({
        title: "",
        content: "",
        category_id: "", // Corrected to category_id
        userId: user.id, // userId from context
    });
    const [categories, setCategories] = useState([]);
    const [notification, setNotification] = useState("");

    // Fetch categories when the page loads
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get("http://localhost:5000/categories");
                setCategories(response.data);
            } catch (error) {
                console.error("Error loading categories:", error);
            }
        };
        fetchCategories();
    }, []);

    // Handle changes in input fields
    const handleChange = (e) => {
        setArticleData({ ...articleData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate if all fields are filled
        if (!articleData.title || !articleData.content || !articleData.category_id) {
            alert("Будь ласка, заповніть усі поля.");
            return;
        }

        try {
            // Prepare the data to send to the backend
            const payload = {
                ...articleData,
                userId: user.id, // Ensure userId is sent
            };

            // Send POST request to backend
            await axios.post("http://localhost:5000/add-new-article", payload);
            setNotification("Статтю успішно створено!");
            setArticleData({
                title: "",
                content: "",
                category_id: "", // Reset category_id
                userId: user.id,
            });
        } catch (error) {
            console.error("Error creating article:", error);
            alert("Не вдалося створити статтю. Спробуйте ще раз.");
        }
    };

    return (
        <>
            <NavBar />
            <div className="create-article-container">
                <h1>Створити статтю</h1>
                {notification && <p className="notification">{notification}</p>}
                <form onSubmit={handleSubmit} className="create-article-form">
                    <div className="form-group">
                        <label>Назва статті:</label>
                        <input
                            name="title"
                            value={articleData.title}
                            placeholder="Введіть назву статті"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Категорія:</label>
                        <select
                            name="category_id" // Using category_id instead of category
                            value={articleData.category_id} // Using category_id here
                            onChange={handleChange}
                            required
                        >
                            <option value="">Оберіть категорію</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Контент статті:</label>
                        <textarea
                            name="content"
                            value={articleData.content}
                            placeholder="Напишіть текст статті"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="submit-button">
                        Створити статтю
                    </button>
                </form>
            </div>
        </>
    );
};

export default CreateArticlePage;
