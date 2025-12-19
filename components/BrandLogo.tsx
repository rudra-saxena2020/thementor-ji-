import React from 'react';
import logo from '../LOGO.png';

interface BrandLogoProps {
  className?: string;
}

export function BrandLogo({ className = "w-10 h-10" }: BrandLogoProps) {
  return (
    <img 
      src={logo} 
      alt="Tutor Ji Logo" 
      className={`${className} object-contain`}
    />
  );
}