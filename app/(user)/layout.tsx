import React from "react";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { FloatingChat } from "@/components/floating-chat";

interface Props {
  children: React.ReactNode;
}

const UserLayout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header */}
          <Header />

          {/* Main Content */}
          <main className="relative flex-1 overflow-auto bg-white p-4 lg:p-6">
            {children}
          </main>
          {/* Footer */}
          <Footer />
        </div>
      </div>
      <FloatingChat />
    </>
  );
};

export default UserLayout;
