import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { UserProvider, useUser } from "./components/UserContext";
import AppRoutes from "./components/AppRoutes";

const App = () => {
    return (
        <UserProvider>
            <Router>
                <AppRoutes />
            </Router>
        </UserProvider>
    );
};

export default App;