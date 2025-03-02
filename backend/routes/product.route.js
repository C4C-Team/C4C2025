import express from "express";
import { upload } from "../controllers/product.controller.js";
import { uploadImage, createProduct, getImage, deleteProduct, getProducts, updateProduct } from "../controllers/product.controller.js";
const router = express.Router();

// Handle preflight requests for all routes
router.options('*', (req, res) => {
    res.status(200).end();
});

router.get("/", getProducts);
// Route to upload an image
router.post("/upload", upload.single("image"), uploadImage);

// Route to create a product with an uploaded image
router.post("/", upload.single("image"), createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;