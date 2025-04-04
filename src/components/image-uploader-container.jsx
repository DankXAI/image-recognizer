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
  const [promptNumber, setPromptNumber] = useState("1");
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

    const temp = imageUrls[0];
    imageUrls[0] = imageUrls[1];
    imageUrls[1] = temp;

    const payload = {
      images: imageUrls,
      promptNumber: promptNumber.toString(),
    };
    try {
      setIsSubmitting(true);

      const res = await submitImages(payload);
      if (res.code < 400) {
        toast.success("Images submitted successfully!");
        // setImages(Array(3).fill(null));
        // setSelectedImage("");
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
    <div className="flex flex-col items-center gap-4 font-semibold text-sm">
      <select
        name="promptNumber"
        id="promptNumber"
        value={promptNumber}
        defaultValue="1"
        onChange={onPromptSelection}
        className="px-3 py-2 rounded-lg "
      >
        <option value="1">Wrong Item</option>
        <option value="2">Missing Item</option>
        <option value="3">Damaged Item</option>
      </select>

      <div className="flex items-center gap-x-10">
        <div className="sm:h-[75svh] sm:max-h-[780px] overflow-y-auto h-full sm:w-[500px] sm:bg-white sm:rounded-3xl p-4 flex flex-col">
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

        <div className="sm:h-[62svh] sm:max-h-[780px] overflow-y-auto h-full sm:w-[500px] sm:bg-white sm:rounded-3xl p-4 flex flex-col text-base gap-y-3">
          <p className="font-semibold">What Does It Do?</p>
          <p className="font-medium text-sm">
            AI-powered Order Accuracy Checker is a rule-based AI system that
            quickly validates customer support tickets by analyzing proofs from
            Dark Store, Delivery, and Customers. It provides a clear,
            data-driven assessment to help agents resolve issues faster,
            ultimately boosting customer satisfaction.
          </p>

          <p className="font-semibold">How Does It Work?</p>
          <p className="font-medium text-sm">
            When a ticket is raised for issues like wrong, missing, or damaged
            items, the system compares proofs submitted by the Dark Store,
            Delivery Partner, and Customer. It then outputs an explanation with
            a confidence score to guide swift resolution.
          </p>

          <p className="font-semibold">How it can be Implemented?</p>
          <p className="font-medium text-sm">
            The prototype demonstrates how an AI-driven post-order support
            system can work. Key considerations include:
          </p>
          <ul className="list-disc pl-5 font-medium text-sm">
            <li>Standardizing clear proof submissions from all parties.</li>
            <li>Addressing issues with poor quality or ambiguous images.</li>
            <li>Balancing automation with human review for complex cases.</li>
          </ul>
          <p className="font-medium text-sm">
            This approach can significantly improve trust and reduce resolution
            times.
          </p>
        </div>
      </div>
    </div>
  );
}
