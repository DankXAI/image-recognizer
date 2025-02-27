import React from "react";
import Image from "next/image";
import { cn } from "@/utils";
import PlusIcon from "../../public/images/plus-icon.svg";

export default function ImageUploader({
  images,
  handleImageChange,
  isUploading,
  onImageSelection,
  deletePhoto,
  onSubmit,
  selectedImage,
  isSubmitting,
  aiResponse,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="h-full flex flex-col items-center justify-between"
    >
      <section className="flex items-center justify-between w-full pt-6">
        {images.map((image, index) =>
          image === null ? (
            <AddImageButton
              key={index}
              handleImageChange={(e) => handleImageChange(e, index)}
              isUploading={isUploading}
              buttonId={index + 1}
            />
          ) : (
            <div
              key={index}
              onClick={() => onImageSelection(image.imgUrl)}
              className={cn(
                "rounded-lg border-2 border-gray-400 border-dashed sm:w-[120px] w-20 h-20 flex items-center justify-center p-1 relative",
                selectedImage === image.imgUrl &&
                  "border-solid border-[#3d206e] border-[3px]"
              )}
            >
              <Image
                src={image.imgUrl}
                height={80}
                width={80}
                className="h-full w-fit rounded-lg"
                alt="img"
              />

              <button
                type="button"
                onClick={(e) => deletePhoto(e, image.imgUrl)}
                className="absolute w-6 h-6 bg-slate-200 border-black border-[0.5px] -bottom-[6px] -right-[5px] flex items-center justify-center rounded-full hover:scale-[1.2] transition"
              >
                <span className="text-xs">✕</span>
              </button>
            </div>
          )
        )}
      </section>

      <section>
        <p className="text-white sm:text-black sm:text-base text-sm font-medium max-h-60 max-w-[475px] overflow-auto">
          {aiResponse}
        </p>
      </section>

      <button
        type="submit"
        className="w-full h-10 bg-[#512771] mt-5 text-base font-semibold text-white rounded-lg shadow-lg hover:opacity-85 transition-all duration-300 flex items-center justify-center text-center disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
        onClick={onSubmit}
        disabled={
          images.every((img) => !img?.imgUrl) || isUploading || isSubmitting
        }
      >
        {!isSubmitting ? "Submit" : "Submittng..."}
      </button>
    </form>
  );
}

const AddImageButton = ({ handleImageChange, isUploading, buttonId }) => {
  return (
    <label>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
        name={`img-${buttonId}`}
        disabled={isUploading}
      />

      <section className="sm:text-sm text-xs font-semibold flex flex-col items-center justify-center gap-y-1 text-center p-1 rounded-lg cursor-pointer border-2 border-gray-400 bg-white border-dashed sm:w-[120px] w-20 h-[80px]">
        <Image
          src={PlusIcon}
          alt="+"
          className="sm:h-[18px] sm:w-[18px] h-4 w-4"
        />

        <p>Upload {buttonId}</p>
      </section>
    </label>
  );
};
