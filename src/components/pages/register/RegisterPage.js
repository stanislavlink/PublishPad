import { useState } from "react";
import { Link } from "react-router-dom";
import './RegisterPage.css'; 
import axios from "axios";

export default function RegisterPage() {
    const [firstName, setFirstName] = useState(""); // Ім'я
    const [lastName, setLastName] = useState(""); // Прізвище
    const [email, setEmail] = useState(""); // Електронна пошта
    const [password, setPassword] = useState(""); // Пароль

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userData = {
            first_name: firstName,
            last_name: lastName,
            email,
            password,
            role: "користувач", // За замовчуванням роль "користувач"
        };
        

        try {
            await axios.post("http://localhost:5000/add-user", userData);
            alert("Користувача успішно зареєстровано!");
        } catch (error) {
            if (error.response && error.response.status === 409) {
                alert("Ця електронна пошта вже зареєстрована.");
            } else if (error.response) {
                alert(`Помилка сервера: ${error.response.data.message || "Сталася невідома помилка."}`);
            } else {
                alert("Не вдалося зареєструвати користувача. Перевірте з'єднання з сервером.");
            }
        }
    };

    return (
        <div className="register-container">
            <h1>Реєстрація</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="firstName">Ім'я</label>
                    <input
                        type="text"
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Введіть ваше ім'я"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="lastName">Прізвище</label>
                    <input
                        type="text"
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Введіть ваше прізвище"
                        required
                    />
                </div>
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
                <button type="submit" className="register-button">
                    Зареєструватися
                </button>
            </form>
            <div className="already-have-account">
                Вже маєте акаунт? <Link to="/login">Увійти</Link>
            </div>
        </div>
    );
}
