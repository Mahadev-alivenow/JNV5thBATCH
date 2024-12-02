import React from 'react';
import { UserCircle } from 'lucide-react';

interface ProfilePictureProps {
  src?: string;
  alt: string;
  className?: string;
}

export function ProfilePicture({ src, alt, className = '' }: ProfilePictureProps) {
  if (!src) {
    return (
      <div className={`flex items-center justify-center bg-gray-200 ${className}`}>
        <UserCircle className="w-full h-full text-gray-400" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`object-cover ${className}`}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.onerror = null;
        target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${alt}`;
      }}
    />
  );
}