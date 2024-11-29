const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Database connectionтщ
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Stasj9sus",
    database: "publishpad"
});

db.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL:", err);
    } else {
        console.log("Connected to MySQL");
    }
});

// Add a new article endpoint
app.post("/add-new-article", (req, res) => {
    const { title, content, category_id, userId } = req.body;

    if (!title || !content || !category_id || !userId) {
        return res.status(400).json({ message: "Будь ласка, заповніть усі поля." });
    }

    // Validate that the category exists
    const checkCategorySql = "SELECT * FROM categories WHERE id = ?";
    db.query(checkCategorySql, [category_id], (err, results) => {
        if (err) {
            console.error("Error checking category:", err);
            return res.status(500).json({ message: "Помилка перевірки категорії." });
        }

        if (results.length === 0) {
            return res.status(400).json({ message: "Категорія не існує." });
        }

        // Insert the article
        const sql = "INSERT INTO articles (title, content, category_id, user_id) VALUES (?, ?, ?, ?)";
        db.query(sql, [title, content, category_id, userId], (err, result) => {
            if (err) {
                console.error("Error creating article:", err);
                return res.status(500).json({ message: "Помилка при створенні статті." });
            }

            res.status(201).json({ message: "Статтю успішно створено!" });
        });
    });
});




app.post("/add-user", async (req, res) => {
    const { first_name, last_name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
        INSERT INTO users (first_name, last_name, email, password, role)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [first_name, last_name, email, hashedPassword, role], (err, results) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ message: "Ця електронна пошта вже зареєстрована." });
            }
            console.error("Помилка додавання користувача:", err);
            return res.status(500).json({ message: "Помилка сервера." });
        }
        res.status(201).json({ message: "Користувача успішно зареєстровано!" });
    });
});


app.post("/login", (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], async (err, results) => {
        if (err) {
            console.error("SQL query error:", err);
            return res.status(500).json({ message: "Помилка сервера." });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: "Неправильний email або пароль." });
        }

        const user = results[0];

        // Перевірка пароля
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Неправильний email або пароль." });
        }

        // Перевірка блокування облікового запису
        if (user.isBlocked) {
            return res.status(403).json({ message: "Ваш обліковий запис заблоковано." });
        }

        // Успішний логін
        res.json({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role,
        });
    });
});


app.get("/categories", (req, res) => {
    const sql = "SELECT * FROM categories";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching categories:", err);
            return res.status(500).send("Server error");
        }
        res.json(results); // Return the list of categories
    });
});

app.post("/add-category", (req, res) => {
    const { category_name } = req.body;

    // Валідація назви категорії
    if (!category_name || category_name.trim() === "") {
        return res.status(400).json({ 
            message: "Назва категорії не може бути порожньою." 
        });
    }

    // Перевірка унікальності категорії
    const checkCategorySql = "SELECT * FROM categories WHERE name = ?";
    db.query(checkCategorySql, [category_name], (err, results) => {
        if (err) {
            console.error("Помилка перевірки категорії:", err);
            return res.status(500).send("Помилка сервера");
        }

        // Якщо категорія вже існує
        if (results.length > 0) {
            return res.status(400).json({ 
                message: "Ця категорія вже існує." 
            });
        }

        // Додавання нової категорії
        const insertCategorySql = "INSERT INTO categories (name) VALUES (?)";
        db.query(insertCategorySql, [category_name], (err, results) => {
            if (err) {
                console.error("Помилка додавання категорії:", err);
                return res.status(500).send("Помилка сервера");
            }

            // Повернення успішної відповіді
            res.status(201).json({
                message: "Категорія успішно додана!",
                category: { 
                    id: results.insertId, 
                    name: category_name 
                },
            });
        });
    });
});




app.get("/articles", (req, res) => {
    const { search, category } = req.query;

    let sql = "SELECT * FROM articles WHERE 1=1";
    const params = [];

    if (search) {
        sql += " AND (title LIKE ? OR content LIKE ?)";
        params.push(`%${search}%`, `%${search}%`);
    }

    if (category) {
        sql += " AND category = ?";
        params.push(category);
    }

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error("Error fetching articles:", err);
            return res.status(500).send("Server error");
        }

        res.json(results);
    });
});

// Delete an article
app.delete("/articles/:id", (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM articles WHERE id = ?";
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error("Error deleting article:", err);
            return res.status(500).send("Server error");
        }

        res.json({ message: "Article deleted successfully!" });
    });
});

// Update an article
app.put("/articles/:id", (req, res) => {
    const { id } = req.params;
    const { title, content, category } = req.body;

    const sql = `
        UPDATE articles
        SET title = ?, content = ?, category = ?
        WHERE id = ?
    `;

    db.query(sql, [title, content, category, id], (err, results) => {
        if (err) {
            console.error("Error updating article:", err);
            return res.status(500).send("Server error");
        }

        res.json({ message: "Article updated successfully!" });
    });
});

// Get all articles for a user
app.get("/articles/user/:userId", (req, res) => {
    const userId = req.params.userId;

    const sql = "SELECT * FROM articles WHERE user_id = ?";
    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error("Error fetching articles:", err);
            return res.status(500).json({ message: "Помилка при отриманні статей." });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Статей не знайдено." });
        }

        res.status(200).json(results);
    });
});
// Update an article
app.put("/article/:id", (req, res) => {
    const articleId = req.params.id;
    const { title, content, category_id } = req.body;

    if (!title || !content || !category_id) {
        return res.status(400).json({ message: "Будь ласка, заповніть усі поля." });
    }

    const sql = "UPDATE articles SET title = ?, content = ?, category_id = ? WHERE id = ?";
    db.query(sql, [title, content, category_id, articleId], (err, result) => {
        if (err) {
            console.error("Error updating article:", err);
            return res.status(500).json({ message: "Помилка при оновленні статті." });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Стаття не знайдена." });
        }

        res.status(200).json({ message: "Статтю успішно оновлено!" });
    });
});
// Delete an article
app.delete("/article/:id", (req, res) => {
    const articleId = req.params.id;

    const sql = "DELETE FROM articles WHERE id = ?";
    db.query(sql, [articleId], (err, result) => {
        if (err) {
            console.error("Error deleting article:", err);
            return res.status(500).json({ message: "Помилка при видаленні статті." });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Стаття не знайдена." });
        }

        res.status(200).json({ message: "Статтю успішно видалено!" });
    });
});
app.get("/user/:userId", (req, res) => {
    const userId = req.params.userId;  // Get userId from the URL parameter

    const sql = "SELECT * FROM users WHERE id = ?";
    
    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error("Error fetching user:", err);
            return res.status(500).json({ message: "Server error while fetching user." });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = results[0]; // Since user_id is unique, we can assume there will be only one result
        res.json({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role,  // You can return any fields you need
        });
    });
});



app.put("/update-user", (req, res) => {
    const { id, first_name, last_name, email } = req.body;

    if (!id || !first_name || !last_name || !email) {
        return res.status(400).json({ message: "Please fill all required fields." });
    }

    const sql = "UPDATE users SET first_name = ?, last_name = ?, email = ? WHERE id = ?";
    db.query(sql, [first_name, last_name, email, id], (err, result) => {
        if (err) {
            console.error("Error updating user profile:", err);
            return res.status(500).json({ message: "Server error while updating profile." });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({
            message: "Profile updated successfully!",
            user: { id, first_name, last_name, email }, // Return updated data
        });
    });
});

app.get("/article/:id", (req, res) => {
    const articleId = req.params.id;

    const sql = "SELECT * FROM articles WHERE id = ?";
    db.query(sql, [articleId], (err, results) => {
        if (err) {
            console.error("Error fetching article:", err);
            return res.status(500).json({ message: "Помилка при отриманні статті." });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Статтю не знайдено." });
        }

        res.json(results[0]);
    });
});

app.get('/admin/articles', (req, res) => {
    const sql = "SELECT * FROM articles";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching articles:", err);
            return res.status(500).json({ message: "Failed to fetch articles" });
        }
        res.json(results);
    });
});

app.get('/admin/users', (req, res) => {
    const sql = "SELECT * FROM users";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching users:", err);
            return res.status(500).json({ message: "Failed to fetch users" });
        }
        res.json(results);
    });
});

app.delete('/admin/article/delete/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM articles WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Error deleting article:", err);
            return res.status(500).json({ message: "Failed to delete article" });
        }
        res.status(200).json({ message: "Article deleted successfully" });
    });
});

app.put('/admin/article/approve/:id', (req, res) => {
    const { id } = req.params;
    const sql = "UPDATE articles SET status = 'approved' WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Error approving article:", err);
            return res.status(500).json({ message: "Failed to approve article" });
        }
        res.status(200).json({ message: "Article approved successfully" });
    });
});

app.put('/admin/user/block/:id', (req, res) => {
    const { id } = req.params;

    // Тoggle значення isBlocked (якщо 0 -> 1, якщо 1 -> 0)
    const sql = "UPDATE users SET isBlocked = NOT isBlocked WHERE id = ?";
    
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Error blocking/unblocking user:", err);
            return res.status(500).json({ message: "Failed to block/unblock user" });
        }
        res.status(200).json({ message: "User block status updated successfully" });
    });
});


app.put('/admin/user/participant/:id', (req, res) => {
    const { id } = req.params;
    const sql = "UPDATE users SET role = 'participant' WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Error changing user role:", err);
            return res.status(500).json({ message: "Failed to change user role" });
        }
        res.status(200).json({ message: "User role updated to participant" });
    });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
