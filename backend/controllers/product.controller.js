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


export const upload = multer({ storage });

export const uploadImage = (req, res) => {
	res.json({ fileId: req.file.id });
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
		const { severity, description } = req.body;
		const product = new Product({
			imageId: req.file.id,
			severity,
			description,
		});
		await product.save();
		res.status(201).json(product);
	} catch (error) {
		res.status(500).json({ message: error.message });
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