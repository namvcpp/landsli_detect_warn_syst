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
      <section className="px-4 py-8 bg-secondary text-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-4">Why Choose Us?</h2>
        <p className="mb-4">
          Our system provides real-time monitoring and early warning to help prevent landslides and protect communities.
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>Advanced detection technology</li>
          <li>Real-time data analytics</li>
          <li>24/7 monitoring</li>
          <li>Comprehensive risk assessment</li>
        </ul>
      </section>
      <section className="px-4 py-8 bg-primary text-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-4">Get Involved</h2>
        <p className="mb-4">
          Join our community and help us make a difference. Stay informed and take action to prevent landslides.
        </p>
        <button className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-orange-600 transition-colors">
          Learn More
        </button>
      </section>
    </div>
  );
}