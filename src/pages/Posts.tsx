import { PostFormDialog } from "@/components/posts/PostFormDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ActionButton from "@/components/ui/custom/action-button";
import { DataTable } from "@/components/ui/custom/data-table";
import DeleteDialog from "@/components/ui/custom/delete-dialog";
import PageTitle from "@/components/ui/custom/page-title";
import { apiService } from "@/services/api";
import { Edit, FileText, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const Posts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<UserApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const [postsData, usersData] = await Promise.all([
        apiService.getPosts(),
        apiService.getUsers(),
      ]);
      setPosts(postsData);
      setUsers(usersData);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      toast.error("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  const handleAddPost = () => {
    setEditingPost(null);
    setIsDialogOpen(true);
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setIsDialogOpen(true);
  };

  const handleDeletePost = (post: Post) => {
    setPostToDelete(post);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!postToDelete) return;

    try {
      await apiService.deletePost(postToDelete.id);
      setPosts(posts.filter((post) => post.id !== postToDelete.id));
      toast.success("Post deleted successfully.");
    } catch (error) {
      console.error("Failed to delete post:", error);
      toast.error("Failed to delete post.");
    } finally {
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    }
  };

  const handlePostSaved = (savedPost: Post) => {
    if (editingPost) {
      // Update existing post
      setPosts(
        posts.map((post) => (post.id === savedPost.id ? savedPost : post)),
      );
    } else {
      // Add new post
      setPosts([savedPost, ...posts]);
    }
    setIsDialogOpen(false);
    setEditingPost(null);
  };

  // Create a map of userId to user name for quick lookup
  const userMap = users.reduce(
    (acc, user) => {
      acc[user.id] = user.name;
      return acc;
    },
    {} as Record<number, string>,
  );

  // Define table columns
  const columns: DataTableColumn<Post>[] = [
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
  ];

  // Custom search value extraction
  const getSearchValue = (post: Post, field: keyof Post | "author"): string => {
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
  };

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
          data={posts}
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
          onClose={() => {
            setIsDialogOpen(false);
            setEditingPost(null);
          }}
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
};

export default Posts;
