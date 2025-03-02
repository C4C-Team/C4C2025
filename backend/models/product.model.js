import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
	{
		location: {
			type: {
				lat: Number,
				lng: Number,
			},
			required: true, // Change to `false` if API might fail
		},
		imageId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "uploads.files", // Reference to GridFS files
			required: true,
		},
		severity: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true, // createdAt, updatedAt
	}
);

const Product = mongoose.model("Product", productSchema);

export default Product;