import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useAuth } from "@/contexts/AuthContext";
import { apiService } from "@/services/api";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormActions } from "../ui/custom/form-buttons";
import { FormInput, FormTextarea } from "../ui/custom/form-input";
import { postFormSchema, type PostFormData } from "@/lib/schemas";

interface PostFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  post?: Post | null;
  onPostSaved: (post: Post) => void;
}

export const PostFormDialog: React.FC<PostFormDialogProps> = ({
  isOpen,
  onClose,
  post,
  onPostSaved,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const form = useForm<PostFormData>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: "",
      body: "",
    },
  });

  // Reset form when post changes or dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      form.reset(
        post ? { title: post.title, body: post.body } : { title: "", body: "" },
      );
    }
  }, [isOpen, post, form]);

  const onSubmit = async (data: PostFormData) => {
    setIsSubmitting(true);
    try {
      let savedPost: Post;
      if (post) {
        savedPost = await apiService.updatePost({
          userId: post.userId,
          id: post.id,
          ...data,
        });
        toast.success("Post updated successfully.");
      } else {
        savedPost = await apiService.createPost({
          ...data,
          userId: Number(user?.id),
        });
        toast.success("Post created successfully.");
      }
      onPostSaved(savedPost);
    } catch (error) {
      console.error("Failed to save post:", error);
      toast.error(`Failed to ${post ? "update" : "create"} post.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{post ? "Edit Post" : "Add New Post"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormInput<PostFormData>
              control={form.control}
              name="title"
              label="Post Title"
              placeholder="Enter post title"
              disabled={isSubmitting}
            />

            <FormTextarea<PostFormData>
              control={form.control}
              name="body"
              label="Post Body"
              placeholder="Enter post body"
              disabled={isSubmitting}
            />

            <FormActions
              onCancel={onClose}
              isSubmitting={isSubmitting}
              submitLabel={post ? "Update Post" : "Create Post"}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
