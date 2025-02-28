import Header from "@/components/header";
import ImageUploaderContainer from "@/components/image-uploader-container";

export default function Home() {
  return (
    <div className="flex flex-col items-center h-full">
      <header className="sm:flex items-center justify-center">
        <img
          src="/images/zepto-logo.png"
          alt="logo"
          className="sm:w-[150px] w-[120px] h-28 object-cover sm:absolute left-0 mx-auto sm:mx-0"
        />
        <Header />
      </header>

      <main className="h-full sm:pt-4">
        <ImageUploaderContainer />
      </main>
    </div>
  );
}
