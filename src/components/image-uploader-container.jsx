"use client";

import React, { useState } from "react";
import ImagePreview from "./image-preview";
import toast from "react-hot-toast";
import { submitImages, uploadImages } from "@/api.js";
import ImageUploader from "./image-uploader.jsx";

export default function ImageUploaderContainer() {
  const [images, setImages] = useState(Array(3).fill(null));
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [promptNumber, setPromptNumber] = useState(1);
  const [aiResponse, setAiResponse] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = async (event, index) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await uploadImages(formData);
      const imageUrl = res.data;

      const newImages = [...images];
      newImages[index] = { imgUrl: imageUrl };
      setImages(newImages);

      onImageSelection(imageUrl);

      event.target.value = "";
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error uploading image");
    } finally {
      setIsUploading(false);
    }
  };

  const onImageSelection = (imgUrl) => {
    setSelectedImage(imgUrl);
  };

  const onPromptSelection = (e) => {
    const value = e.target.value;
    setPromptNumber(value);
  };

  const deletePhoto = (e, imgUrl) => {
    e.stopPropagation();

    const indexToDelete = images.findIndex(
      (img) => img && img.imgUrl === imgUrl
    );
    if (indexToDelete !== -1) {
      const newImages = [...images];
      newImages[indexToDelete] = null;
      setImages(newImages);

      if (selectedImage === imgUrl) {
        setSelectedImage(null);
      }
    }

    // e.stopPropagation();

    // setImages((prev) =>
    //   prev.map((photo) => (!!photo && photo.imgUrl === imgUrl ? null : photo))
    // );
    // selectedImage === imgUrl && setSelectedImage("");
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (images.length === 0) {
      alert("Please select at least one image");
      return;
    }

    const imageUrls = images
      .filter((img) => img !== null)
      .map((img) => img.imgUrl);

    const payload = { images: imageUrls, promptNumber };
    try {
      setIsSubmitting(true);

      const res = await submitImages(payload);
      if (res.code < 400) {
        toast.success("Images submitted successfully!");
        setImages(Array(3).fill(null));
        setSelectedImage("");
        setAiResponse(res.data);
      } else {
        toast.error("Failed in submitting images");
        console.error("Failed in submitting images: ", res);
      }
    } catch (error) {
      console.log("Error in submitting images: ", error);
      toast.error("Error submitting images");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
      <select
        name="promptNumber"
        id="promptNumber"
        onChange={onPromptSelection}
        className="absolute top-28"
      >
        <option value={1}>Wrong Item</option>
        <option value={2}>Missing Item</option>
        <option value={3}>Damaged Item</option>
      </select>

      <div className="h-[650px] w-[500px] sm:bg-white sm:rounded-3xl p-4 flex flex-col">
        <section className="h-[210px] w-full bg-gray-200 rounded-2xl flex items-center justify-center py-3">
          <ImagePreview selectedImage={selectedImage} />
        </section>

        <div className="flex-1">
          <ImageUploader
            images={images}
            onImageChange={handleImageChange}
            onImageSelection={onImageSelection}
            deletePhoto={deletePhoto}
            onSubmit={onSubmit}
            selectedImage={selectedImage}
            handleImageChange={handleImageChange}
            isUploading={isUploading}
            isSubmitting={isSubmitting}
            aiResponse={aiResponse}
          />
        </div>
      </div>
    </>
  );
}
