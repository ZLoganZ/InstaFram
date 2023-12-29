import { useEffect } from "react";

import PostForm from "@/components/Forms/Post/PostForm";

const CreatePost = () => {
  useEffect(() => {
    document.title = "Create Post - InstaFram";
  }, []);

  return (
    <div className="flex flex-1">
      <div className="custom-scrollbar flex flex-1 flex-col items-center gap-10 overflow-scroll px-5 py-10 md:px-8 lg:p-14">
        <div className="flex-start w-full max-w-5xl justify-start gap-3">
          <img
            src="/assets/icons/add-post.svg"
            alt="create post"
            className="size-9"
          />
          <h2 className="h3-bold md:h2-bold w-full text-left">Create post</h2>
        </div>
        <PostForm action="create" />
      </div>
    </div>
  );
};

export default CreatePost;
