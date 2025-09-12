import { PostFormDialog } from "@/components/posts/PostFormDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ActionButton from "@/components/ui/custom/action-button";
import { DataTable } from "@/components/ui/custom/data-table";
import DeleteDialog from "@/components/ui/custom/delete-dialog";
import PageTitle from "@/components/ui/custom/page-title";
import { apiService } from "@/services/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, FileText, Plus, Trash2 } from "lucide-react";
import React, { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

const Posts: React.FC = React.memo(() => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const queryClient = useQueryClient();

  // Use React Query for data fetching
  const { data: posts = [], isLoading: postsLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: apiService.getPosts,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes (renamed from cacheTime)
  });

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: apiService.getUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
  });

  const loading = postsLoading || usersLoading;

  // Delete post mutation
  const deletePostMutation = useMutation({
    mutationFn: apiService.deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post deleted successfully.");
    },
    onError: (error) => {
      console.error("Failed to delete post:", error);
      toast.error("Failed to delete post.");
    },
  });

  // Memoize handlers to prevent unnecessary re-renders
  const handleAddPost = useCallback(() => {
    setEditingPost(null);
    setIsDialogOpen(true);
  }, []);

  const handleEditPost = useCallback((post: Post) => {
    setEditingPost(post);
    setIsDialogOpen(true);
  }, []);

  const handleDeletePost = useCallback((post: Post) => {
    setPostToDelete(post);
    setDeleteDialogOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!postToDelete) return;
    deletePostMutation.mutate(postToDelete.id);
    setDeleteDialogOpen(false);
    setPostToDelete(null);
  }, [postToDelete, deletePostMutation]);

  const handlePostSaved = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["posts"] });
    setIsDialogOpen(false);
    setEditingPost(null);
  }, [queryClient]);

  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
    setEditingPost(null);
  }, []);

  // Memoize user map for quick lookup
  const userMap = useMemo(
    () =>
      (users as UserApi[]).reduce(
        (acc: Record<number, string>, user: UserApi) => {
          acc[user.id] = user.name;
          return acc;
        },
        {} as Record<number, string>,
      ),
    [users],
  );

  // Memoize table columns to prevent unnecessary re-renders
  const columns: DataTableColumn<Post>[] = useMemo(
    () => [
      {
        key: "id",
        header: "ID",
        width: "80px",
        render: (post) => <div className="font-mono text-sm">{post.id}</div>,
      },
      {
        key: "title",
        header: "Title",
        render: (post) => (
          <div className="font-medium">
            <div className="line-clamp-2 max-w-xs">{post.title}</div>
          </div>
        ),
      },
      {
        key: "body",
        header: "Content",
        render: (post) => (
          <div className="text-muted-foreground line-clamp-3 max-w-xs text-sm">
            {post.body}
          </div>
        ),
      },
      {
        key: "author",
        header: "Author",
        render: (post) => (
          <Badge variant="secondary">
            {userMap[post.userId] || `User ${post.userId}`}
          </Badge>
        ),
      },
      {
        key: "actions",
        header: "Actions",
        className: "text-center",
        render: (post) => (
          <div className="flex items-center justify-end space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleEditPost(post);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleDeletePost(post);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    [userMap, handleEditPost, handleDeletePost],
  );

  // Memoize search value extraction
  const getSearchValue = useCallback(
    (post: Post, field: keyof Post | "author"): string => {
      switch (field) {
        case "title":
          return post.title;
        case "body":
          return post.body;
        case "author":
          return userMap[post.userId] || `User ${post.userId}`;
        default:
          return String((post as Post)[field] || "");
      }
    },
    [userMap],
  );

  return (
    <>
      <div className="animate-fade-in space-y-6">
        {/* Header */}
        <PageTitle
          title="Posts"
          subTitle="Browse and search through all posts"
        />

        {/* Posts DataTable */}
        <DataTable
          data={posts as Post[]}
          columns={columns}
          title="Posts"
          loading={loading}
          searchPlaceholder="Search posts by title, content, or author..."
          searchFields={["title", "body", "author" as keyof Post]}
          getSearchValue={getSearchValue}
          emptyStateTitle="No posts available"
          emptyStateDescription="There are currently no posts to display."
          emptyStateIcon={
            <FileText className="text-muted-foreground h-12 w-12" />
          }
          actions={
            <ActionButton
              text="Add New Post"
              onClick={handleAddPost}
              Icon={Plus}
            />
          }
        />

        {/* Post Form Dialog */}
        <PostFormDialog
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
          post={editingPost}
          onPostSaved={handlePostSaved}
        />
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteDialog<Post>
        dialogOpen={deleteDialogOpen}
        setDialogOpen={setDeleteDialogOpen}
        confirmDelete={confirmDelete}
        itemToDelete={postToDelete}
        getLabel={(post) => post.title}
      />
    </>
  );
});

Posts.displayName = "Posts";

export default Posts;
