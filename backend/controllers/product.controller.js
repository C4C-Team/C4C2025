import mongoose from "mongoose";
import Product from "../models/product.model.js";
import Grid from "gridfs-stream";
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import dotenv from "dotenv";

dotenv.config();

let gfs;
mongoose.connection.once("open", () => {
	// Use the native MongoDB GridFSBucket API
	gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
	  bucketName: "uploads",
	});
  });

const storage = new GridFsStorage({
    url: process.env.MONGO_URI,
    file: (req, file) => ({
        filename: file.originalname,
        bucketName: "uploads",
    }),
});

export const upload = multer({ 
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

export const uploadImage = (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                message: "No file uploaded or file too large" 
            });
        }
        res.json({ success: true, fileId: req.file.id });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

export const getProducts = async (req, res) => {
	try {
		const products = await Product.find({});
		res.status(200).json({ success: true, data: products });
	} catch (error) {
		console.log("error in fetching products:", error.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const getImage = async (req, res) => {
	try {
	  const fileId = new mongoose.Types.ObjectId(req.params.id);
	  const downloadStream = gfs.openDownloadStream(fileId);
  
	  downloadStream.on("error", () => {
		return res.status(404).json({ message: "No file found" });
	  });
  
	  downloadStream.pipe(res);
	} catch (error) {
	  res.status(500).json({ message: error.message });
	}
  };

export const createProduct = async (req, res) => {
    try {
        const { severity, description, image, location } = req.body;
        
        // Validate required fields
        if (!severity || !description || !image || !location) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: severity, description, location and image are required"
            });
        }

        // Create new product
        const product = new Product({
            severity,
            description,
            image, // Store the image directly if it's base64
            location,
            created_at: new Date()
        });

        // Save to database
        const savedProduct = await product.save();
        
        // Send success response
        res.status(201).json({
            success: true,
            data: savedProduct
        });

    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error creating product",
            error: error.message 
        });
    }
};

export const updateProduct = async (req, res) => {
	const { id } = req.params;

	const product = req.body;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ success: false, message: "Invalid Product Id" });
	}

	try {
		const updatedProduct = await Product.findByIdAndUpdate(id, product, { new: true });
		res.status(200).json({ success: true, data: updatedProduct });
	} catch (error) {
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const deleteProduct = async (req, res) => {
	const { id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ success: false, message: "Invalid Product Id" });
	}

	try {
		await Product.findByIdAndDelete(id);
		res.status(200).json({ success: true, message: "Product deleted" });
	} catch (error) {
		console.log("error in deleting product:", error.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};