import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "./UserContext";
import "./NavBar.css";

const NavBar = () => {
    const { user, setUser } = useUser();

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    return (
        <nav className="navbar">
         
            <Link to="/" className="navbar-logo">
            PublishPad
            </Link>

            <ul className="navbar-menu">
                <li>
                    <Link to="/">Головна</Link>
                    <Link to="add-article">Створити нову статтю</Link>
                    <Link to="my-articles">Мої статті</Link>
                
                </li>
              
              
                  
                {user?.role === "адміністратор" && (
                    <li>
                        <Link to="/admin">Панель адміністратора</Link>
                    </li>
                )}
            </ul>


<div className="navbar-right">
    {user ? (
        <>
            <Link to="/profile" className="profile-link">
               
              Особистий кабінет
            </Link>
          
        </>
    ) : (
        <>
            <Link to="/login">Вхід</Link>
            <Link to="/register">Реєстрація</Link>
        </>
    )}
</div>

        </nav>
    );
};

export default NavBar;
