import { useEffect, useState } from "react";
import img1 from "../assets/sign-img-child.jpg";
import img2 from "../assets/sign-img2.jpg";
import img3 from "../assets/sign-img3.jpg";
import img4 from "../assets/sign-img4.jpg";
const ImagesHover = () => {
  const images = [img1, img2, img3, img4];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4500); // change image every 2.5 seconds

    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-none border-none">
      <div className="w-[400px] h-[300px] relative overflow-hidden rounded-xl shadow-xl">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`slide-${index}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImagesHover;
