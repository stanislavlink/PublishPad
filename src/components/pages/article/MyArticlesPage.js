import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./MyArticlesPage.css";
import { useUser } from "../../UserContext"; 
import NavBar from "../../NavBar";

const MyArticlesPage = () => {
    const { user } = useUser(); 
    const [articles, setArticles] = useState([]);
    const navigate = useNavigate();

    // Fetch articles when the component mounts or user changes
    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/articles/user/${user.id}`);
                setArticles(response.data);
            } catch (error) {
                console.error("Error fetching user's articles:", error);
            }
        };

        if (user) {
            fetchArticles();
        }
    }, [user]);

    // Navigate to the edit page for the selected article
    const handleEdit = (articleId) => {
        navigate(`/edit-article/${articleId}`);
    };

    // Handle deleting the article
    const handleDelete = async (articleId) => {
        try {
            await axios.delete(`http://localhost:5000/article/${articleId}`);
            setArticles(articles.filter((article) => article.id !== articleId)); // Remove deleted article from UI
        } catch (error) {
            console.error("Error deleting article:", error);
        }
    };

    return (
        <>
            <NavBar />
            <div className="my-articles-page">
                <h1>Мої статті</h1>
                <div className="articles-list">
                    {articles.length === 0 ? (
                        <p>У вас немає статей.</p>
                    ) : (
                        articles.map((article) => (
                            <div key={article.id} className="article-card">
                                <h3>{article.title}</h3>
                                <p>{article.content.slice(0, 100)}...</p>
                                <div className="article-actions">
                                    <button onClick={() => handleEdit(article.id)}>Редагувати</button>
                                    <button onClick={() => handleDelete(article.id)}>Видалити</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
};

export default MyArticlesPage;
