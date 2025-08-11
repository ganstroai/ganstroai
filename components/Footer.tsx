import React from "react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <>
      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white px-4 py-3 lg:px-6 lg:py-4">
        <div className="flex flex-col items-center justify-between space-y-2 text-xs text-gray-600 sm:flex-row sm:space-y-0 lg:text-sm">
          <p>&copy; {year} GanStró AI Assistant. All rights reserved.</p>
          <p>Version 1.0.0</p>
        </div>
      </footer>
    </>
  );
};

export default React.memo(Footer);
