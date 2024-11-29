import React from "react";
import { useNavigate } from "react-router-dom";  
import "./ArticleCard.css";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";

const ArticleCard = ({ article }) => {
    const navigate = useNavigate(); 
    const [categories, setCategories] = useState([]);

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
    const handleReadMore = () => {
   
        navigate(`/article/${article.id}`);
    };
   

    return (
        <div className="article-card">
            <h3 className="article-title">{article.title}</h3>
            <p className="article-category">
    Категорія: {categories.find((cat) => cat.id === article.category_id)?.name}
</p>

            <p className="article-content">{article.content.slice(0, 100)}...</p>
            <button className="read-more-button" onClick={handleReadMore}>
                Читати далі
            </button>
        </div>
    );
};

export default ArticleCard;
