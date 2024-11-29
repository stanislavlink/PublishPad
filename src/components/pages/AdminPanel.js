import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminPanel.css";
import NavBar from "../NavBar";

const AdminPanel = () => {
    const [articles, setArticles] = useState([]); // для статей
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    // Функція для завантаження статей та користувачів
    const fetchData = async () => {
        try {
            const articlesResponse = await axios.get("http://localhost:5000/admin/articles");
            const usersResponse = await axios.get("http://localhost:5000/admin/users");
            setArticles(articlesResponse.data);
            setUsers(usersResponse.data);
        } catch (error) {
            console.error("Помилка завантаження даних:", error);
        } finally {
            setLoading(false);
        }
    };

    // Видалення статті
    const handleDeleteArticle = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/admin/article/delete/${id}`);
            setArticles(articles.filter((article) => article.id !== id));
            alert("Статтю успішно видалено!");
        } catch (error) {
            console.error("Помилка видалення статті:", error);
        }
    };



    // Блокування користувача
    const handleBlockUser = async (id) => {
        try {
            await axios.put(`http://localhost:5000/admin/user/block/${id}`);
            setUsers(users.map((user) => (user.id === id ? { ...user, status: "blocked" } : user)));
            alert("Користувача заблоковано!");
        } catch (error) {
            console.error("Помилка блокування користувача:", error);
        }
    };

    // Призначення ролі учасника
    const handleMakeParticipant = async (id) => {
        try {
            await axios.put(`http://localhost:5000/admin/user/participant/${id}`);
            setUsers(users.map((user) => (user.id === id ? { ...user, role: "учасник" } : user)));
            alert("Користувач став учасником!");
        } catch (error) {
            console.error("Помилка надання прав учасника:", error);
        }
    };

    return (
        <>
            <NavBar />
            <div className="admin-panel">
                <h1>Адміністративна панель</h1>
                {loading ? (
                    <p>Завантаження...</p>
                ) : (
                    <div className="admin-content">
                        <div className="articles-section">
                            <h2>Статті</h2>
                            {articles.length === 0 ? (
                                <p>Немає статей.</p>
                            ) : (
                                <div className="articles-list">
                                    {articles.map((article) => (
                                        <div key={article.id} className="article-card">
                                            <h3>{article.title}</h3>
                                            <p>{article.excerpt}</p>
                                            <div className="article-actions">
                                                
                                                <button
                                                    className="delete-btn"
                                                    onClick={() => handleDeleteArticle(article.id)}
                                                >
                                                    Видалити
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="users-section">
                            <h2>Користувачі</h2>
                            {users.length === 0 ? (
                                <p>Немає користувачів.</p>
                            ) : (
                                <div className="users-list">
                                    {users.map((user) => (
                                        <div key={user.id} className="user-card">
                                            <h3>{user.first_name} {user.last_name}</h3>
                                            <p>Email: {user.email}</p>
                                            <p>Роль: {user.role}</p>
                                            <div className="user-actions">
                                                {user.status !== "blocked" ? (
                                                    <button
                                                        className="block-btn"
                                                        onClick={() => handleBlockUser(user.id)}
                                                    >
                                                        Заблокувати
                                                    </button>
                                                ) : (
                                                    <span className="blocked-status">Заблоковано</span>
                                                )}
                                                {user.role !== "учасник" ? (
                                                    <button
                                                        className="make-participant-btn"
                                                        onClick={() => handleMakeParticipant(user.id)}
                                                    >
                                                        Призначити учасником
                                                    </button>
                                                ) : (
                                                    <span className="participant-status">Учасник</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default AdminPanel;
