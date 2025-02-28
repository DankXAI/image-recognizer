import Header from "@/components/header";
import ImageUploaderContainer from "@/components/image-uploader-container";

export default function Home() {
  return (
    <div className="flex flex-col items-center h-full">
      {/* <Header /> */}
      <img
        src="/images/zepto-logo.png"
        alt="logo"
        className="w-[150px] h-28 object-cover"
      />

      <main className="h-full sm:pt-4">
        <ImageUploaderContainer />
      </main>
    </div>
  );
}
