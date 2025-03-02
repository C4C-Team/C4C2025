import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
	{
		/*location: {
			type: {
			lat: Number,
			lng: Number,
			},
			required: true,
		},*/
		image: {
			type: String,
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