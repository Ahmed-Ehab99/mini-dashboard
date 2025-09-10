import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { apiService } from "@/services/api";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormActions } from "../ui/custom/form-buttons";
import { FormInput } from "../ui/custom/form-input";
import { userFormSchema, type UserFormData } from "@/lib/schemas";

interface UserFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user?: UserApi | null;
  onUserSaved: (user: UserApi) => void;
}

export const UserFormDialog: React.FC<UserFormDialogProps> = ({
  isOpen,
  onClose,
  user,
  onUserSaved,
}) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      phone: "",
      website: "",
    },
  });

  // Reset form when user changes or dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      if (user) {
        form.reset({
          name: user.name,
          username: user.username,
          email: user.email,
          phone: user.phone,
          website: user.website,
        });
      } else {
        form.reset({
          name: "",
          username: "",
          email: "",
          phone: "",
          website: "",
        });
      }
    }
  }, [isOpen, user, form]);

  const onSubmit = async (data: UserFormData) => {
    setIsSubmitting(true);

    try {
      let savedUser: UserApi;

      if (user) {
        // Update existing user
        savedUser = await apiService.updateUser({
          id: user.id,
          ...data,
        });
        toast.success("User updated successfully.");
      } else {
        // Create new user
        savedUser = await apiService.createUser(data as CreateUserData);
        toast.success("User created successfully.");
      }

      onUserSaved(savedUser);
    } catch (error) {
      console.error("Failed to save user:", error);
      toast.error(`Failed to ${user ? "update" : "create"} user.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{user ? "Edit User" : "Add New User"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormInput<UserFormData>
              control={form.control}
              name="name"
              label="Full Name"
              placeholder="Enter full name"
              disabled={isSubmitting}
            />

            <FormInput<UserFormData>
              control={form.control}
              name="username"
              label="Username"
              placeholder="Enter username"
              disabled={isSubmitting}
            />

            <FormInput<UserFormData>
              control={form.control}
              name="email"
              label="Email"
              placeholder="Enter email address"
              type="email"
              disabled={isSubmitting}
            />

            <FormInput<UserFormData>
              control={form.control}
              name="phone"
              label="Phone"
              placeholder="Enter phone number"
              disabled={isSubmitting}
            />

            <FormInput<UserFormData>
              control={form.control}
              name="website"
              label="Website (Optional)"
              placeholder="Enter website URL"
              disabled={isSubmitting}
            />

            <FormActions
              onCancel={onClose}
              isSubmitting={isSubmitting}
              submitLabel={user ? "Update User" : "Create User"}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
