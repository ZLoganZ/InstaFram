import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import { useCallback, useState } from "react";
import { useDropzone, FileWithPath } from "react-dropzone";

import { Button } from "@/components/ui/button";
import { PostFormSchema } from "@/lib/schema";
import { getImageURL } from "@/lib/utils";

interface IFileUpload {
  fieldChange: (files: File) => void;
  form: UseFormReturn<z.infer<typeof PostFormSchema>>;
  mediaURL?: string;
}

const FileUpload = ({ fieldChange, mediaURL, form }: IFileUpload) => {
  const [fileURL, setFileURL] = useState(getImageURL(mediaURL));

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setFileURL(URL.createObjectURL(acceptedFiles[0]));
      fieldChange(acceptedFiles[0]);
    },
    [fileURL],
  );
  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    onDropAccepted: onDrop,
    onDropRejected: () => {
      form.setError("image", {
        message: "This photo is too large. Please try another one.",
      });
    },
    accept: {
      "image/png": [".png"],
      "image/gif": [".gif"],
      "image/jpeg": [".jpeg", ".jpg"],
    },
    maxSize: 1024 * 1024 * 10,
    multiple: false,
    onError: (error) => {
      form.setError("image", {
        message: error.message,
      });
    },
  });

  return (
    <div
      {...getRootProps()}
      className="flex-center flex cursor-pointer flex-col rounded-xl bg-light-3 dark:bg-dark-3"
    >
      <input {...getInputProps()} className="cursor-pointer" />

      {fileURL ? (
        <>
          <div className="flex w-full flex-1 justify-center p-5 lg:p-10">
            <img
              src={fileURL}
              alt="image"
              className="h-80 w-full rounded-[24px] object-cover object-center lg:h-[480px]"
            />
          </div>
          <p className="small-regular w-full border-t border-t-light-4 p-4 text-center text-[#5C5C7B] dark:border-t-dark-4">
            Click or drag another photo to replace
          </p>
        </>
      ) : (
        <div className="flex-center h-80 flex-col p-7 lg:h-[612px]">
          <img
            src="/assets/icons/file-upload.svg"
            alt="upload"
            className="h-[77px] w-[96px]"
          />
          <h3 className="base-medium mb-2 mt-6 text-dark-2 dark:text-light-2">
            Drag and drop your photo here
          </h3>
          <p className="small-regular mb-6 text-center text-[#5C5C7B]">
            SVG, PNG, JPG or GIF <br /> Max size of 10MBs
          </p>
          <Button type="button">Upload photo</Button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
