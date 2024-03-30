"use client";

import { CldUploadWidget } from "next-cloudinary";

declare global {
  var cloudinary: any;
}

interface MediaUploadMultipleProps {
  onChange: (value: string) => void;
}

const MediaUploadMultiple: React.FC<React.PropsWithChildren<MediaUploadMultipleProps>> = ({
  onChange,
  children,
}) => {
  const handleUpload = (result: any) => {
    onChange(result.info.secure_url);
  };

  return (
    <CldUploadWidget
      onUpload={handleUpload}
      uploadPreset="rx9q0eq1"
      options={{ multiple: true }}
    >
      {({ open }) => {
        return (
          <div onClick={() => open && open()} className="inline-block">
            {children}
          </div>
        );
      }}
    </CldUploadWidget>
  );
};

export default MediaUploadMultiple;
