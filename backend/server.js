import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";

import { connectDB } from "./config/db.js";
import productRoutes from "./routes/product.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Define dirname to point to current directory
const __dirname = process.cwd();

app.use(express.json());

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"]
}));

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