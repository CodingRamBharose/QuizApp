import React, { useState, useRef } from "react";

function Avatar({ imageUrl, name, size = "md", onImageChange }) {
  const [error, setError] = useState(false);
  const fileInputRef = useRef(null);

  // Size classes mapping
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-12 h-12 text-base",
    lg: "w-16 h-16 text-lg",
    xl: "w-20 h-20 text-xl",
  };

  // Get initials from name
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Handle image load error
  const handleImageError = () => {
    setError(true);
  };

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && onImageChange) {
      onImageChange(file);
    }
  };

  // Handle avatar click
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative inline-block">
      <div
        className={`${sizeClasses[size]} relative rounded-full overflow-hidden bg-primary-100 cursor-pointer
          hover:opacity-90 transition-opacity duration-200 flex items-center justify-center`}
        onClick={handleAvatarClick}
        role="button"
        tabIndex={0}
        aria-label="Change profile picture"
      >
        {!imageUrl || error ? (
          <span className="font-medium text-primary-700">
            {getInitials(name)}
          </span>
        ) : (
          <img
            src={imageUrl}
            alt={`${name}'s avatar`}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
          <span className="text-white opacity-0 hover:opacity-100 text-xs">
            Change
          </span>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileSelect}
        aria-label="Upload profile picture"
      />
    </div>
  );
}

export default Avatar;
