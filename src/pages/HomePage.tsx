import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-6">
      <div className="relative w-full max-w-4xl h-[80vh] flex items-center justify-center text-center text-white">
        <img
          src="/banner.jpeg"
          alt="AI Generated"
          className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-xl"
        />
        <div className="relative z-10 bg-black bg-opacity-50 p-8">
          <h1 className="text-5xl font-bold text-white">
            Welcome to Our MDX Blog
          </h1>
          <p className="py-6 text-lg text-white">
            Explore a collection of blogs written in MDX, submitted by our
            community. You can also write and preview your own markdown before
            submitting.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link to="/main" className="btn btn-primary">
              View Blogs
            </Link>
            <Link to="/write" className="btn btn-secondary">
              Write & Preview
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
