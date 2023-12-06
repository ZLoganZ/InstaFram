import { useEffect } from 'react';

import PostForm from '@/components/Forms/Post/PostForm';

const CreatePost = () => {
  useEffect(() => {
    document.title = 'Create Post - InstaFram';
  }, []);

  return (
    <div className='flex flex-1'>
      <div className='flex flex-col flex-1 items-center gap-10 overflow-scroll py-10 px-5 md:px-8 lg:p-14 custom-scrollbar'>
        <div className='max-w-5xl flex-start gap-3 justify-start w-full'>
          <img src='/assets/icons/add-post.svg' alt='create post' className='w-9 h-9' />
          <h2 className='h3-bold md:h2-bold text-left w-full'>Create post</h2>
        </div>
        <PostForm key={Math.random()} action='create' />
      </div>
    </div>
  );
};

export default CreatePost;
