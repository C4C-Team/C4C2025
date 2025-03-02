import express from "express";
import dotenv from "dotenv";
import path from "path";

import { connectDB } from "./config/db.js";
import productRoutes from "./routes/product.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Define dirname to point to current directory
const __dirname = process.cwd();

app.use(express.json());

// CORS middleware - place this BEFORE your routes
app.use((req, res, next) => {
    // Set the specific origin instead of using an array
    res.header("Access-Control-Allow-Origin", "https://c4c2025.onrender.com");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    
    // Important: Handle OPTIONS preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    next();
});

app.use("/api/products", productRoutes);

if (process.env.NODE_ENV === "production") {
    // Updated paths to stay in backend directory
    app.use(express.static(path.join(__dirname, "build/server")));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "build", "server", "index.js"));
    });
}

app.listen(PORT, () => {
    connectDB();
    console.log("Server started at http://localhost:" + PORT);
});