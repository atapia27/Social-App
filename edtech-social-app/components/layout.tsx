import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-xl">EdTech Video Platform</h1>
      </header>
      <main className="p-4">{children}</main>
    </div>
  );
};

export default Layout;
