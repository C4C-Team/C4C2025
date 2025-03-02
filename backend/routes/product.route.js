import express from "express";
import { upload } from "../controllers/product.controller.js";
import { uploadImage, createProduct, getImage } from "../controllers/product.controller.js";
import { createProduct, deleteProduct, getProducts, updateProduct } from "../controllers/product.controller.js";

const router = express.Router();

router.get("/", getProducts);
// Route to upload an image
router.post("/upload", upload.single("image"), uploadImage);

// Route to create a product with an uploaded image
router.post("/", upload.single("image"), createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;