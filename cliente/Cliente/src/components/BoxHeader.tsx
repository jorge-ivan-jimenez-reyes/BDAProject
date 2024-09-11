import React from "react";

interface BoxHeaderProps {
  title: string;
  sideText: string;
  subtitle?: string;
}

const BoxHeader: React.FC<BoxHeaderProps> = ({ title, sideText, subtitle }) => {
  return (
    <div className="flex justify-between items-center mb-4 p-2 border-b border-gray-200">
      <div>
        <h2 className="text-lg font-bold">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
      <p className="text-gray-500 font-bold">{sideText}</p>
    </div>
  );
};

export default BoxHeader;
