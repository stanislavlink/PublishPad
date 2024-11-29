import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import NavBar from "../../NavBar";
import "./ArticleDetailPage.css";

const ArticleDetailPage = () => {
    const { id } = useParams(); // Get article id from URL
    const [article, setArticle] = useState(null);
    const [categories, setCategories] = useState([]); // State to store categories
    const [author, setAuthor] = useState(null);  // State to store author details

    // Fetch all categories once
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get("http://localhost:5000/categories");
                setCategories(response.data); // Store categories in state
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);

    // Fetch article details and author based on the article id
    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/article/${id}`);
                setArticle(response.data); // Store the article data
                
                // Fetch the author's details based on the user_id
                const authorResponse = await axios.get(`http://localhost:5000/user/${response.data.user_id}`);
                setAuthor(authorResponse.data); // Store the author details
            } catch (error) {
                console.error("Error fetching article details:", error);
            }
        };

        fetchArticle();
    }, [id]);

    if (!article || !author || categories.length === 0) {
        return <div>Loading...</div>; // Show loading until article, author, and categories are fetched
    }

    // Find the category name based on category_id
    const category = categories.find((cat) => cat.id === article.category_id);

    return (
        <>
            <NavBar />
            <div className="article-detail-page">
                <h1 className="article-title">{article.title}</h1>
                <p className="article-category">
                    <strong>Категорія:</strong> {category ? category.name : "Не знайдено"}
                </p>
                <div className="article-content">
                    <h2 className="content-header">Зміст статті:</h2>
                    <p>{article.content}</p>
                </div>
                <p className="article-author">
                    <strong>Автор:</strong> {author.first_name} {author.last_name}
                </p>
            </div>
        </>
    );
};

export default ArticleDetailPage;
