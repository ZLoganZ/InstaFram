import Loader from '@/components/Shared/Loader';
import PostForm from '@/components/Forms/Post/PostForm';
import { useGetPost } from '@/lib/hooks/query';
import { PostDetailsRoute } from '@/routes/private.routes';

interface IEditPost {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditPost: React.FC<IEditPost> = ({ setOpen }) => {
  const { postID } = PostDetailsRoute.useParams();
  const { post, isLoadingPost, isFetchingPost } = useGetPost(postID);

  return (
    <div className='flex flex-col flex-1 items-center gap-10 overflow-scroll p-5 custom-scrollbar'>
      {isLoadingPost || isFetchingPost ? (
        <Loader />
      ) : (
        <PostForm key={Math.random()} post={post} action='edit' setOpen={setOpen} />
      )}
    </div>
  );
};

export default EditPost;
