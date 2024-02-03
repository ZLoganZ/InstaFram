import { z } from "zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { Check, ChevronsUpDown } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToastAction } from "@/components/ui/toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import FileUpload from "@/components/Upload/FileUpload";
import ComboBox from "@/components/Shared/ComboBox";
import Loader from "@/components/Shared/Loader";
import { PostFormSchema } from "@/lib/schema";
import { useCreatePost, useUpdatePost } from "@/lib/hooks/mutation";
import { useToast } from "@/lib/hooks/useToast";
import { useAuth } from "@/lib/hooks/useAuth";
import { cn } from "@/lib/utils";
import { IDataComboBox, ILocationResponse, IPost } from "@/types";

interface IPostForm {
  post?: IPost;
  action: "create" | "edit";
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const PostForm = ({ post, action, setOpen }: IPostForm) => {
  const tempFile = useMemo(() => new File([], post ? post.image : ""), []);

  const form = useForm<z.infer<typeof PostFormSchema>>({
    resolver: zodResolver(PostFormSchema),
    defaultValues: {
      location: post ? post.location : "",
      tags: post ? post.tags.join(", ") : "",
      content: post ? post.content : "",
      visibility: post ? post.visibility : "Public",
      image: tempFile,
    },
  });

  const navigate = useNavigate();
  const { history } = useRouter();
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const { createPost } = useCreatePost();
  const { updatePost } = useUpdatePost();
  const [isLoading, setIsLoading] = useState(false);
  const [locationData, setLocationData] = useState<IDataComboBox[] | null>(
    null,
  );

  useEffect(() => {
    const fetchLocation = async () => {
      const locationData = await fetch(
        "https://restcountries.com/v3.1/all?fields=name",
      ).then(async (res) => {
        const locations: ILocationResponse[] = await res.json();
        return locations
          .map((location) => {
            return {
              label: location.name.common,
              value: location.name.common.toLowerCase(),
            };
          })
          .sort((a, b) => a.label.localeCompare(b.label));
      });

      setLocationData(locationData);
    };

    fetchLocation();
  }, []);

  const onSubmit = async (values: z.infer<typeof PostFormSchema>) => {
    let isChangeImage = false;

    setIsLoading(true);
    if (action === "create") {
      await createPost(
        { ...values, creator: currentUser._id },
        {
          onError: () => {
            setIsLoading(false);
            toast({
              title: "Uh oh! Something went wrong!!",
              description: "There was a problem when creating your post.",
              action: <ToastAction altText="Try again">Try again</ToastAction>,
            });
          },
          onSuccess: () => {
            setIsLoading(false);
            toast({
              title: "Success",
              description: "Post created successfully",
            });
            navigate({ to: "/", replace: true });
            form.reset();
          },
        },
      );
    } else {
      if (values.image !== tempFile) {
        isChangeImage = true;
      }

      await updatePost(
        {
          ...values,
          postID: post!._id,
          isChangeImage,
          image: isChangeImage ? values.image : undefined,
        },
        {
          onError: () => {
            setIsLoading(false);
            toast({
              title: "Uh oh! Something went wrong.",
              description: "There was a problem when updating your post.",
              action: (
                <ToastAction
                  altText="Try again"
                  onClick={form.handleSubmit(onSubmit)}
                >
                  Try again
                </ToastAction>
              ),
            });
          },
          onSuccess: () => {
            setIsLoading(false);
            toast({
              title: "Success",
              description: "Post updated successfully",
            });
            setOpen!(false);
          },
        },
      );
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full max-w-5xl flex-col gap-9"
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  className="custom-scrollbar resize-none"
                  placeholder="What do you want to share?"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Add photo</FormLabel>
              <FormControl>
                <FileUpload
                  fieldChange={field.onChange}
                  form={form}
                  mediaURL={post?.image}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="visibility"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="mr-2">Visibility</FormLabel>
              <FormControl>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      aria-expanded={false}
                      className="flex w-40 justify-between"
                    >
                      <p className="truncate">{field.value}</p>
                      <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="center"
                    className="w-40 gap-0 p-0"
                  >
                    <DropdownMenuItem className="focus:bg-transparent">
                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => field.onChange("Public")}
                      >
                        <Check
                          className={cn(
                            "mr-2 size-4",
                            field.value === "Public"
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        Public
                      </Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="focus:bg-transparent">
                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => field.onChange("Followers")}
                      >
                        <Check
                          className={cn(
                            "mr-2 size-4",
                            field.value === "Followers"
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        Followers
                      </Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="focus:bg-transparent">
                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => field.onChange("Private")}
                      >
                        <Check
                          className={cn(
                            "mr-2 size-4",
                            field.value === "Private"
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        Private
                      </Button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="mr-2">Add Location</FormLabel>
              <FormControl>
                <ComboBox
                  key="location"
                  onSelect={field.onChange}
                  placeholder="Select a location"
                  searchPlaceholder="Search for a location"
                  defaultValue={field.value.toLowerCase()}
                  data={locationData ?? []}
                  notFound="No location found."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Add Tags (separated by comma ", ")</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  autoComplete="off"
                  placeholder="Javascript, React, Node,..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-end gap-4">
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              action === "create" || !setOpen ? history.back() : setOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="whitespace-nowrap"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex-center gap-2">
                <Loader />
                {action === "create" ? "Creating..." : "Saving..."}
              </div>
            ) : action === "create" ? (
              "Create"
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
