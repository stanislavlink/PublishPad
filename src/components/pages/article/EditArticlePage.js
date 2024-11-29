import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../../UserContext";
import "./EditArticlePage.css";

const EditArticlePage = () => {
    const { id } = useParams(); // Get article ID from the URL
    const { user } = useUser();
    const [article, setArticle] = useState({ title: "", content: "", category_id: "" });
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    // Fetch article details
    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/article/${id}`);
                setArticle(response.data);
            } catch (error) {
                console.error("Error fetching article:", error);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await axios.get("http://localhost:5000/categories");
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchArticle();
        fetchCategories();
    }, [id]);

    // Handle form submission for updating the article
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.put(`http://localhost:5000/article/${id}`, {
                title: article.title,
                content: article.content,
                category_id: article.category_id,
            });
            navigate("/my-articles"); // Redirect to My Articles page after saving
        } catch (error) {
            console.error("Error updating article:", error);
        }
    };

    // Handle input change for form fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setArticle({
            ...article,
            [name]: value,
        });
    };

    return (
        <div className="edit-article-page">
            <h1>Редагувати статтю</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Назва</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={article.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="category_id">Категорія</label>
                    <select
                        id="category_id"
                        name="category_id"
                        value={article.category_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Виберіть категорію</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="content">Контент</label>
                    <textarea
                        id="content"
                        name="content"
                        value={article.content}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>

                <button type="submit">Зберегти зміни</button>
            </form>
        </div>
    );
};

export default EditArticlePage;
