import { z } from 'zod';
import { useCallback, useState } from 'react';
import { FileWithPath, useDropzone } from 'react-dropzone';
import { UseFormReturn } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { getImageURL } from '@/lib/utils';
import { UpdateUserSchema } from '@/lib/schema';

interface IProfileUpload {
  fieldChange: (files: File) => void;
  mediaURL: string;
  form: UseFormReturn<z.infer<typeof UpdateUserSchema>>;
}

const ProfileUpload: React.FC<IProfileUpload> = ({ fieldChange, mediaURL, form }) => {
  const [fileUrl, setFileUrl] = useState(getImageURL(mediaURL, 'avatar'));

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      fieldChange(acceptedFiles[0]);
      setFileUrl(URL.createObjectURL(acceptedFiles[0]));
    },
    [fileUrl]
  );

  const { getRootProps, getInputProps } = useDropzone({
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
    <div {...getRootProps()}>
      <input {...getInputProps()} className='cursor-pointer' />

      <div className='cursor-pointer flex-center gap-6'>
        <img
          src={fileUrl || '/assets/icons/profile-placeholder.svg'}
          alt='image'
          className='h-24 w-24 rounded-full object-cover object-top'
        />
        <Button type='button' className='small-regular md:base-semibold'>
          Change profile photo
        </Button>
      </div>
    </div>
  );
};

export default ProfileUpload;
