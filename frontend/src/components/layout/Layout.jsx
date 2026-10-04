import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-text-primary font-sans selection:bg-primary/30">
      <Navbar />
      <main className="flex-1 min-h-screen flex flex-col w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
