import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ActionButton from "@/components/ui/custom/action-button";
import { DataTable } from "@/components/ui/custom/data-table";
import DeleteDialog from "@/components/ui/custom/delete-dialog";
import PageTitle from "@/components/ui/custom/page-title";
import { UserFormDialog } from "@/components/users/UserFormDialog";
import { apiService } from "@/services/api";
import { Edit, Plus, Trash2, Users as UsersIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const Users: React.FC = () => {
  const [users, setUsers] = useState<UserApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserApi | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserApi | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersData = await apiService.getUsers();
      setUsers(usersData);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setIsDialogOpen(true);
  };

  const handleEditUser = (user: UserApi) => {
    setEditingUser(user);
    setIsDialogOpen(true);
  };

  const handleDeleteUser = (user: UserApi) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      await apiService.deleteUser(userToDelete.id);
      setUsers(users.filter((user) => user.id !== userToDelete.id));
      toast.success("User deleted successfully.");
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error("Failed to delete user.");
    } finally {
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handleUserSaved = (savedUser: UserApi) => {
    if (editingUser) {
      // Update existing user
      setUsers(
        users.map((user) => (user.id === savedUser.id ? savedUser : user)),
      );
    } else {
      // Add new user
      setUsers([savedUser, ...users]);
    }
    setIsDialogOpen(false);
    setEditingUser(null);
  };

  // Define table columns
  const columns: DataTableColumn<UserApi>[] = [
    {
      key: "id",
      header: "ID",
      width: "80px",
      render: (post) => <div className="font-mono text-sm">{post.id}</div>,
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
  ];

  // Custom search value extraction
  const getSearchValue = (user: UserApi, field: keyof UserApi): string => {
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
  };

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
          onClose={() => {
            setIsDialogOpen(false);
            setEditingUser(null);
          }}
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
};

export default Users;
