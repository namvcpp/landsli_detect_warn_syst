'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminSidebar from '@/app/components/admin/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const isAdmin = localStorage.getItem('isAdmin');
      if (!isAdmin && pathname !== '/admin/login') {
        router.push('/admin/login');
      } else if (isAdmin) {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated && pathname !== '/admin/login') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {pathname === '/admin/login' ? (
        <>{children}</>
      ) : (
        <div className="flex">
          <div className="fixed inset-y-0 top-20 left-0 w-64">
            <AdminSidebar />
          </div>
          <main className="flex-1 ml-64">
            <div className="p-8 min-h-screen">
              {children}
            </div>
          </main>
        </div>
      )}
    </div>
  );
}