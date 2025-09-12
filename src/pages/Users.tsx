import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ActionButton from "@/components/ui/custom/action-button";
import { DataTable } from "@/components/ui/custom/data-table";
import DeleteDialog from "@/components/ui/custom/delete-dialog";
import PageTitle from "@/components/ui/custom/page-title";
import { UserFormDialog } from "@/components/users/UserFormDialog";
import { apiService } from "@/services/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, Plus, Trash2, Users as UsersIcon } from "lucide-react";
import React, { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

const Users: React.FC = React.memo(() => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserApi | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserApi | null>(null);
  const queryClient = useQueryClient();

  // Use React Query for data fetching
  const { data: users = [], isLoading: loading } = useQuery({
    queryKey: ["users"],
    queryFn: apiService.getUsers,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes (renamed from cacheTime)
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: apiService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted successfully.");
    },
    onError: (error) => {
      console.error("Failed to delete user:", error);
      toast.error("Failed to delete user.");
    },
  });

  // Memoize handlers to prevent unnecessary re-renders
  const handleAddUser = useCallback(() => {
    setEditingUser(null);
    setIsDialogOpen(true);
  }, []);

  const handleEditUser = useCallback((user: UserApi) => {
    setEditingUser(user);
    setIsDialogOpen(true);
  }, []);

  const handleDeleteUser = useCallback((user: UserApi) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!userToDelete) return;
    deleteUserMutation.mutate(userToDelete.id);
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  }, [userToDelete, deleteUserMutation]);

  const handleUserSaved = useCallback(
    (_savedUser: UserApi) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsDialogOpen(false);
      setEditingUser(null);
    },
    [queryClient],
  );

  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
    setEditingUser(null);
  }, []);

  // Memoize table columns to prevent unnecessary re-renders
  const columns: DataTableColumn<UserApi>[] = useMemo(
    () => [
      {
        key: "id",
        header: "ID",
        width: "80px",
        render: (user) => <div className="font-mono text-sm">{user.id}</div>,
      },
      {
        key: "name",
        header: "Name",
        render: (user) => <div className="font-medium">{user.name}</div>,
      },
      {
        key: "username",
        header: "Username",
        render: (user) => user.username,
      },
      {
        key: "email",
        header: "Email",
        render: (user) => user.email,
      },
      {
        key: "company",
        header: "Company",
        render: (user) => user.company.name,
      },
      {
        key: "status",
        header: "Status",
        render: () => (
          <Badge variant="secondary" className="bg-success/10 text-success">
            Active
          </Badge>
        ),
      },
      {
        key: "actions",
        header: "Actions",
        className: "text-right",
        render: (user) => (
          <div className="flex items-center justify-end space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleEditUser(user);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteUser(user);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    [handleEditUser, handleDeleteUser],
  );

  // Memoize search value extraction
  const getSearchValue = useCallback(
    (user: UserApi, field: keyof UserApi): string => {
      switch (field) {
        case "name":
          return user.name;
        case "email":
          return user.email;
        case "username":
          return user.username;
        case "company":
          return user.company.name;
        default:
          return String(user[field] || "");
      }
    },
    [],
  );

  return (
    <>
      <div className="animate-fade-in space-y-6">
        {/* Header */}
        <PageTitle
          title="Users"
          subTitle="Manage all registered users in your system"
        />

        {/* Users DataTable */}
        <DataTable
          data={users}
          columns={columns}
          title="Users"
          loading={loading}
          searchPlaceholder="Search users by name, email, or username..."
          searchFields={["name", "email", "username", "company"]}
          getSearchValue={getSearchValue}
          emptyStateTitle="No users available"
          emptyStateDescription="There are currently no users to display."
          emptyStateIcon={
            <UsersIcon className="text-muted-foreground h-12 w-12" />
          }
          actions={
            <ActionButton
              text="Add New User"
              onClick={handleAddUser}
              Icon={Plus}
            />
          }
        />

        {/* User Form Dialog */}
        <UserFormDialog
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
          user={editingUser}
          onUserSaved={handleUserSaved}
        />
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteDialog<UserApi>
        dialogOpen={deleteDialogOpen}
        setDialogOpen={setDeleteDialogOpen}
        confirmDelete={confirmDelete}
        itemToDelete={userToDelete}
        getLabel={(user) => user.name}
      />
    </>
  );
});

Users.displayName = "Users";

export default Users;
