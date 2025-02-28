import Header from "@/components/header";
import ImageUploaderContainer from "@/components/image-uploader-container";

export default function Home() {
  return (
    <div className="flex flex-col items-center h-full">
      <header className="flex items-center justify-center">
        <img
          src="/images/zepto-logo.png"
          alt="logo"
          className="w-[150px] h-28 object-cover absolute left-0"
        />
        <Header />
      </header>

      <main className="h-full sm:pt-4">
        <ImageUploaderContainer />
      </main>
    </div>
  );
}
