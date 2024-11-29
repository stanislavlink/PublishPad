import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "../components/pages/home/HomePage";
import AdminPanel from "../components/pages/AdminPanel";
import RegisterPage from "../components/pages/register/RegisterPage";
import LoginPage from "../components/pages/login/LoginPage";
import PrivateRoute from "./PrivateRoute";
import UserProfile from "./pages/user/UserProfile";
import CreateArticlePage from "./pages/article/CreateArticlePage";
import ArticleDetailPage from "./pages/article/ArticleDetailPage";
import MyArticlesPage from "./pages/article/MyArticlesPage";
import EditArticlePage from "./pages/article/EditArticlePage";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />

            <Route
                path="/"
                element={
                    <PrivateRoute>
                        <HomePage />
                    </PrivateRoute>
                }
            />
            <Route
                path="/profile"
                element={
                    <PrivateRoute>
                        <UserProfile/>
                    </PrivateRoute>
                }
            />
            <Route path="/article/:id" element={<ArticleDetailPage />} />
            
            {/* Змінено шлях для My Articles */}
            <Route 
                path="/my-articles" 
                element={
                    <PrivateRoute>
                        <MyArticlesPage />
                    </PrivateRoute>
                } 
            />
            
            <Route path="/edit-article/:id" element={<EditArticlePage />} />
            <Route
                path="/add-article"
                element={
                    <PrivateRoute>
                        <CreateArticlePage />
                    </PrivateRoute>
                }
            />
        
            <Route
                path="/admin"
                element={
                    <PrivateRoute>
                        <AdminPanel />
                    </PrivateRoute>
                }
            />
        </Routes>
    );
};

export default AppRoutes;