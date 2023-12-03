import { z } from 'zod';
import { UseFormReturn } from 'react-hook-form';
import React, { useCallback, useState } from 'react';
import { useDropzone, FileWithPath } from 'react-dropzone';

import { Button } from '@/components/ui/button';
import { PostFormSchema } from '@/lib/schema';
import { getImageURL } from '@/lib/utils';

interface IFileUpload {
  fieldChange: (files: File) => void;
  form: UseFormReturn<z.infer<typeof PostFormSchema>>;
  mediaURL?: string;
}

const FileUpload: React.FC<IFileUpload> = ({ fieldChange, mediaURL, form }) => {
  const [fileURL, setFileURL] = useState(getImageURL(mediaURL));

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setFileURL(URL.createObjectURL(acceptedFiles[0]));
      fieldChange(acceptedFiles[0]);
    },
    [fileURL]
  );
  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    onDropAccepted: onDrop,
    onDropRejected: () => {
      form.setError('image', {
        message: 'This photo is too large. Please try another one.'
      });
    },
    accept: {
      'image/png': ['.png'],
      'image/gif': ['.gif'],
      'image/jpeg': ['.jpeg', '.jpg']
    },
    maxSize: 1024 * 1024 * 10,
    multiple: false,
    onError: (error) => {
      form.setError('image', {
        message: error.message
      });
    }
  });

  return (
    <div
      {...getRootProps()}
      className='flex flex-center flex-col bg-light-3 dark:bg-dark-3 rounded-xl cursor-pointer'>
      <input {...getInputProps()} className='cursor-pointer' />

      {fileURL ? (
        <>
          <div className='flex flex-1 justify-center w-full p-5 lg:p-10'>
            <img
              src={fileURL}
              alt='image'
              className='h-80 lg:h-[480px] w-full rounded-[24px] object-cover object-center'
            />
          </div>
          <p className='text-[#5C5C7B] text-center small-regular w-full p-4 border-t border-t-light-4 dark:border-t-dark-4'>
            Click or drag another photo to replace
          </p>
        </>
      ) : (
        <div className='flex-center flex-col p-7 h-80 lg:h-[612px]'>
          <img src='/assets/icons/file-upload.svg' alt='upload' className='w-[96px] h-[77px]' />
          <h3 className='base-medium text-dark-2 dark:text-light-2 mb-2 mt-6'>
            Drag and drop your photo here
          </h3>
          <p className='text-[#5C5C7B] small-regular mb-6 text-center'>
            SVG, PNG, JPG or GIF <br /> Max size of 10MBs
          </p>
          <Button type='button'>Upload photo</Button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
