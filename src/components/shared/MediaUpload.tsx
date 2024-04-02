"use client";

import { CldUploadWidget } from "next-cloudinary";

declare global {
  var cloudinary: any;
}

interface MediaUploadProps {
  onChange: (value: string) => void;
  setValue?: (value: string) => void;  
}

const MediaUpload: React.FC<React.PropsWithChildren<MediaUploadProps>> = ({
  onChange,
  children,
  setValue = () => {},
}) => {
  const handleUpload = (result: any) => {
    onChange(result.info.secure_url);
    setValue(`${result.info.original_filename}.${result.info.format}`);
  };

  return (
    <CldUploadWidget
      onUpload={handleUpload}
      uploadPreset="rx9q0eq1"
      options={{ maxFiles: 1 }}
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

export default MediaUpload;
