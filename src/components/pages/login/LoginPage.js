import { useState } from "react";
import { useUser } from "../../UserContext";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import axios from "axios";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { setUser } = useUser();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:5000/login", { email, password });
            setUser(response.data);
            alert("Ви успішно увійшли!");
            navigate("/"); // Переход до головної сторінки
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    alert("Неправильний email або пароль.");
                } else if (error.response.status === 403) {
                    alert("Ваш обліковий запис заблоковано. Зверніться до адміністратора.");
                } else {
                    alert("Помилка сервера. Спробуйте пізніше.");
                }
            } else {
                console.error("Помилка входу:", error);
                alert("Виникла невідома помилка.");
            }
        }
    };

    return (
        <div className="login-container">
            <h1>Вхід</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Електронна пошта</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@gmail.com"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Пароль</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Введіть ваш пароль"
                        required
                    />
                </div>
                <button type="submit" className="submit-button">
                    Увійти
                </button>
            </form>
            <div className="no-account">
                Не маєте акаунту? <a href="/register">Зареєструватися</a>
            </div>
        </div>
    );
}
