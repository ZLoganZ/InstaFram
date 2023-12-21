import { RouteApi } from '@tanstack/react-router';

import Loader from '@/components/Shared/Loader';
import PostForm from '@/components/Forms/Post/PostForm';
import { useGetPost } from '@/lib/hooks/query';

interface IEditPost {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const routeApi = new RouteApi({ id: '/main/post/$postID' });

const EditPost = ({ setOpen }: IEditPost) => {
  const { postID } = routeApi.useParams();
  const { post, isLoadingPost, isFetchingPost } = useGetPost(postID);

  return (
    <div className='flex flex-col flex-1 items-center gap-10 overflow-scroll p-5 custom-scrollbar'>
      {isLoadingPost || isFetchingPost ? (
        <Loader />
      ) : (
        <PostForm key={postID} post={post} action='edit' setOpen={setOpen} />
      )}
    </div>
  );
};

export default EditPost;
