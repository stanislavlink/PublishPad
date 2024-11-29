import React, { createContext, useState, useContext, useEffect } from "react";

// Створення контексту
const UserContext = createContext();

// Провайдер контексту
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        // Отримання користувача з localStorage при завантаженні
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    useEffect(() => {
        if (user) {
            // Збереження користувача в localStorage
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            // Видалення користувача з localStorage при виході
            localStorage.removeItem("user");
        }
    }, [user]);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

// Хук для доступу до контексту
export const useUser = () => useContext(UserContext);
