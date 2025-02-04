'use client';
import { useState, useEffect } from 'react';
import Image from "next/legacy/image";

const slides = [
  {
    image: '/images/satlodat1.jpg',
    title: 'Advanced Detection Systems',
    description: 'State-of-the-art sensors for early warning'
  },
  {
    image: '/images/satlodat2.png',
    title: 'Real-time Monitoring',
    description: '24/7 surveillance of high-risk areas'
  },
  {
    image: '/images/satlodat3.jpeg',
    title: 'Data Analytics',
    description: 'Powerful insights for prevention'
  }
];

const Slider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[600px] w-full overflow-hidden rounded-xl shadow-lg">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000
            ${index === current ? 'opacity-100' : 'opacity-0'}`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            layout="fill"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-4">{slide.title}</h2>
              <p className="text-xl">{slide.description}</p>
            </div>
          </div>
        </div>
      ))}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              index === current ? 'bg-accent' : 'bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;