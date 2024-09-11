import React from 'react';

interface FlexBetweenProps {
  children: React.ReactNode;
  className?: string;
}

const FlexBetween: React.FC<FlexBetweenProps> = ({ children, className }) => {
  return (
    <div className={`flex justify-between items-center ${className}`}>
      {children}
    </div>
  );
};

export default FlexBetween;
