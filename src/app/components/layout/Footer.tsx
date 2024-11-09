// src/app/components/layout/Footer.tsx
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-white shadow-lg mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold mb-4">About Us</h3>
            <p className="text-sm text-gray-600">
              We provide advanced landslide detection and warning systems to help protect communities.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-gray-600 hover:text-gray-900">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-600 hover:text-gray-900">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Contact Info</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>Email: info@landslidedetection.com</li>
              <li>Phone: (123) 456-7890</li>
              <li>Address: 123 Detection St, City, Country</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;