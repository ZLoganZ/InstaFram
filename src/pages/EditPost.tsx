import { useParams } from 'react-router-dom';

import { Loader } from '@/components/Shared';
import { PostForm } from '@/components/Forms/Post';
import { DialogDescription, DialogHeader } from '@/components/ui/dialog';
import { useGetPost } from '@/lib/hooks/query';

interface IEditPost {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditPost: React.FC<IEditPost> = ({ setOpen }) => {
  const { id } = useParams();
  const { post, isLoadingPost, isFetchingPost } = useGetPost(id ?? '');

  return (
    <div className='flex flex-col flex-1 items-center gap-10 overflow-scroll p-5 custom-scrollbar'>
      <DialogHeader className='flex justify-start w-full max-w-5xl'>
        <div className='flex-start gap-3'>
          <img src='/assets/icons/add-post.svg' alt='edit post' className='w-9 h-9' />
          <h2 className='h3-bold md:h2-bold text-left w-full'>Edit post</h2>
        </div>
        <DialogDescription>Make changes to your post and click save to update your post.</DialogDescription>
      </DialogHeader>
      {isLoadingPost || isFetchingPost ? (
        <Loader />
      ) : (
        <PostForm key={Math.random()} post={post} action='edit' setOpen={setOpen} />
      )}
    </div>
  );
};

export default EditPost;
