// src/app/(routes)/page.tsx
import Slider from './components/ui/Slider';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="space-y-12">
      <Slider />
      <section className="px-4">
        <h2 className="text-3xl font-bold mb-6 text-primary">Welcome to Landslide Detection System</h2>
        <p className="text-gray-600">
          Our advanced system helps protect communities through early detection and warning of potential landslides.
        </p>
      </section>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="relative h-64 w-full">
          <Image src="/images/satlodat.jpg" alt="Advanced Detection Systems" layout="fill" objectFit="cover" />
        </div>
        <div className="relative h-64 w-full">
          <Image src="/images/satlodat2.jpg" alt="Real-time Monitoring" layout="fill" objectFit="cover" />
        </div>
        <div className="relative h-64 w-full">
          <Image src="/images/satlodat3.jpg" alt="Data Analytics" layout="fill" objectFit="cover" />
        </div>
      </div>
    </div>
  );
}