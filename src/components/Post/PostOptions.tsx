import { Button } from "@/components/ui/button";
import {
  AlertDialogAction,
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";

import EditPost from "@/components/Post/EditPost";

interface IPostOptions {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleDeletePost: () => void;
}

const PostOptions = ({ open, setOpen, handleDeletePost }: IPostOptions) => {
  return (
    <div className="flex-center gap-4">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            asChild
            variant="ghost"
            className="flex cursor-pointer p-0 hover:bg-transparent"
          >
            <img src="/assets/icons/edit.svg" alt="edit" className="size-6" />
          </Button>
        </DialogTrigger>
        <DialogContent className="h-[98%] max-w-lg md:max-w-2xl lg:max-w-5xl">
          <DialogHeader className="flex w-full max-w-5xl justify-start">
            <div className="flex-start gap-3">
              <img
                src="/assets/icons/add-post.svg"
                alt="edit post"
                className="size-9"
              />
              <h2 className="h3-bold md:h2-bold w-full text-left">Edit post</h2>
            </div>
            <DialogDescription>
              Make changes to your post and click save to update your post.
            </DialogDescription>
          </DialogHeader>
          <EditPost setOpen={setOpen} />
        </DialogContent>
      </Dialog>

      <AlertDialog>
        <AlertDialogTrigger>
          <Button
            asChild
            variant="ghost"
            className="flex p-0 hover:bg-transparent"
          >
            <img
              src="/assets/icons/delete.svg"
              alt="delete"
              className="size-6"
            />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePost}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PostOptions;
