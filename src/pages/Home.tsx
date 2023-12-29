import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useInView } from "react-intersection-observer";

import { Button } from "@/components/ui/button";
import Loader from "@/components/Shared/Loader";
import UserCard from "@/components/User/UserCard";
import PostCard from "@/components/Post/PostCard";
import { useGetTopCreators, useGetPosts } from "@/lib/hooks/query";

const Home = () => {
  const [postsRef, inPostsView] = useInView({ threshold: 0 });
  const [creatorsRef, inCreatorsView] = useInView({ threshold: 0 });
  const {
    isLoadingPosts,
    posts,
    hasNextPosts,
    isFetchingNextPosts,
    fetchNextPosts,
  } = useGetPosts();
  const {
    topCreators,
    isLoadingTopCreators,
    hasNextTopCreators,
    isFetchingNextTopCreators,
    fetchNextTopCreators,
  } = useGetTopCreators();
  const navigate = useNavigate();

  useEffect(() => {
    if (inPostsView && hasNextPosts && !isFetchingNextPosts) {
      fetchNextPosts();
    }
  }, [inPostsView]);

  useEffect(() => {
    if (inCreatorsView && hasNextTopCreators && !isFetchingNextTopCreators) {
      fetchNextTopCreators();
    }
  }, [inCreatorsView]);

  useEffect(() => {
    document.title = "InstaFram";
  }, []);

  return (
    <div className="flex flex-1">
      <div className="custom-scrollbar flex flex-1 flex-col items-center gap-10 overflow-scroll px-5 py-10 md:px-8 lg:p-14">
        <div className="flex w-full max-w-screen-sm flex-col items-center gap-6 md:gap-9">
          <h2 className="h3-bold md:h2-bold w-full text-left">Home Feed</h2>
          {isLoadingPosts ? (
            <Loader />
          ) : (
            <ul className="flex w-full flex-1 flex-col gap-9">
              {posts.map((post) => (
                <li key={post._id} className="flex w-full justify-center">
                  <PostCard key={post._id} post={post} />
                </li>
              ))}
            </ul>
          )}
          {hasNextPosts && (
            <div ref={postsRef}>
              <Loader />
            </div>
          )}
        </div>
      </div>

      <div className="custom-scrollbar hidden w-72 flex-col gap-10 overflow-scroll px-6 py-10 xl:flex 2xl:w-[465px]">
        <h3 className="h3-bold">Top Creators</h3>
        {isLoadingTopCreators ? (
          <Loader />
        ) : (
          <ul className="grid gap-6 2xl:grid-cols-2">
            {topCreators.map((user) => (
              <li key={user._id}>
                <UserCard user={user} />
              </li>
            ))}
          </ul>
        )}
        {hasNextTopCreators && (
          <div ref={creatorsRef}>
            <Loader />
          </div>
        )}
      </div>

      <Button
        onClick={() => navigate({ to: "/posts/create" })}
        className="fixed bottom-16 right-16 hidden size-12 rounded-full p-3 md:flex xl:right-72 2xl:right-[32rem]"
      >
        <img
          src="/assets/icons/add-post.svg"
          alt="create post"
          className="invert-white size-9"
        />
      </Button>
    </div>
  );
};

export default Home;
