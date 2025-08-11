import React from "react";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

interface Props {
  children: React.ReactNode;
}

const AdminLayout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <div className="flex h-screen bg-gray-50">
        <Sidebar isAdminSidebar={true} />
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
    </>
  );
};

export default AdminLayout;
