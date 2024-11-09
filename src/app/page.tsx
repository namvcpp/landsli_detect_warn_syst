// src/app/(routes)/page.tsx
import Slider from './components/ui/Slider';

export default function HomePage() {
  return (
    <div className="space-y-12">
      <Slider />
      <section className="px-4">
        <h2 className="text-3xl font-bold mb-6">Welcome to Landslide Detection System</h2>
        <p className="text-gray-600">
          Our advanced system helps protect communities through early detection and warning of potential landslides.
        </p>
      </section>
    </div>
  );
}