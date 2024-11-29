import React, { useEffect, useState } from "react";
import NavBar from "../../NavBar";
import axios from "axios";
import ArticleCard from "../article/ArticleCard";
import "./HomePage.css";

const HomePage = () => {
    const [articles, setArticles] = useState([]);
    const [filteredArticles, setFilteredArticles] = useState([]);
    const [article_category, setArticleCategory] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

 

 

    useEffect(() => {
        fetchArticles();
        fetchCategories();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [searchTerm, selectedCategory, articles]);

    const fetchArticles = async () => {
        try {
            const response = await axios.get("http://localhost:5000/articles");
            setArticles(response.data);
        } catch (error) {
            console.error("Помилка завантаження статей:", error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get("http://localhost:5000/categories");
            setCategories(response.data);
        } catch (error) {
            console.error("Помилка завантаження категорій:", error);
        }
    };

    const applyFilters = () => {
        let filtered = articles;

        if (searchTerm) {
            filtered = filtered.filter(article =>
                article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                article.content.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
       
        if (selectedCategory) {
            filtered = filtered.filter(article => categories.find((cat) => cat.id === article.category_id)?.name === selectedCategory);
        }

        setFilteredArticles(filtered);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    return (
        <>
            <NavBar />
            <div className="homepage-container">
                <h1 className="homepage-title">Статті</h1>
                <div className="filters">
                    <input
                        type="text"
                        placeholder="Пошук статей..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="search-input"
                    />
                    <select value={selectedCategory} onChange={handleCategoryChange} className="category-select">
                        <option value="">Усі категорії</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.name}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="articles-grid">
                    {filteredArticles.length === 0 ? (
                        <p>Немає статей, що відповідають вашому запиту.</p>
                    ) : (
                        filteredArticles.map((article) => (
                            <ArticleCard key={article.id} article={article} />
                        ))
                    )}
                </div>
            </div>
        </>
    );
};

export default HomePage;
