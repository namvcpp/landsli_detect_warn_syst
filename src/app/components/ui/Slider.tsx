// src/app/components/ui/Slider.tsx
'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

const slides = [
  {
    image: '/slide1.jpg',
    title: 'Advanced Detection Systems',
    description: 'State-of-the-art sensors for early warning'
  },
  {
    image: '/slide2.jpg',
    title: 'Real-time Monitoring',
    description: '24/7 surveillance of high-risk areas'
  },
  {
    image: '/slide3.jpg',
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
    <div className="relative h-[600px] w-full overflow-hidden rounded-xl">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000
            ${index === current ? 'opacity-100' : 'opacity-0'}`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-4">{slide.title}</h2>
              <p className="text-xl">{slide.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Slider;