import React, { useState, type FormEvent } from 'react';
import axios from "axios";
export function Submission() {
//   const [location, setLocation] = useState<{ lat: number; lng: number }>([0][0]);
//   const [image, setImage] = useState('');
//   const [severity, setSeverity] = useState('');
//   const [description, setDescription] = useState('');


//export const ProductForm = () => {
  // Form state
  const [formData, setFormData] = useState({
    lat: "",
    lng: "",
    image: "",
    severity: "",
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image capture
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Get the first selected file
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          image: reader.result as string, // Store base64 image
        }));
      };
      reader.readAsDataURL(file); // Convert image to base64
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await axios.post("https://c4c2025-back.onrender.com/api/products", formData);
      setSuccessMessage("Product successfully submitted!");
      setFormData({
        lat: "",
        lng: "",
        image: "",
        severity: "",
        description: "",
      });
    } catch (err) {
      setError("Error submitting product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2>Product Submission Form</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Latitude:</label>
          <input
            type="number"
            name="lat"
            value={formData.lat}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Longitude:</label>
          <input
            type="number"
            name="lng"
            value={formData.lng}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Image:</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
          {formData.image && (
            <img
              src={formData.image}
              alt="Selected"
              style={{ width: "100px", height: "auto", marginTop: "10px" }}
            />
          )}
        </div>

        <div>
          <label>Severity:</label>
          <input
            type="text"
            name="severity"
            value={formData.severity}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Product"}
        </button>
      </form>
    </div>
  );
};
