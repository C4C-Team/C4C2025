import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    location: {
        type: {
            lat: Number,
            lng: Number,
        },
        required: false,
    },
    severity: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Product", productSchema);