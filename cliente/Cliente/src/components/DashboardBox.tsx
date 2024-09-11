import React from 'react';

interface DashboardBoxProps {
  children: React.ReactNode;
  className?: string;
  gridArea: string;
}

const DashboardBox: React.FC<DashboardBoxProps> = ({ children, className, gridArea }) => {
  return (
    <div className={`p-4 bg-white shadow-md rounded-lg ${className}`} style={{ gridArea }}>
      {children}
    </div>
  );
};

export default DashboardBox;
