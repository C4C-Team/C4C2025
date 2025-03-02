import mongoose from "mongoose";
import Product from "../models/product.model.js";
import Grid from "gridfs-stream";
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import dotenv from "dotenv";

dotenv.config();

const conn = mongoose.createConnection(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

let gfs;
conn.once("open", () => {
	gfs = Grid(conn.db, mongoose.mongo);
	gfs.collection("uploads");
});

const storage = new GridFsStorage({
	url: process.env.MONGO_URI,
	file: (req, file) => {
		return { filename: file.originalname, bucketName: "uploads" };
	},
});

const upload = multer({ storage });

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
		gfs.files.findOne({ _id: new mongoose.Types.ObjectId(req.params.id) }, (err, file) => {
			if (!file || file.length === 0) {
				return res.status(404).json({ message: "No file found" });
			}
			const readstream = gfs.createReadStream(file.filename);
			readstream.pipe(res);
		});
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