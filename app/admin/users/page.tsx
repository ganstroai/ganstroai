"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { getCurrentUser } from "@/lib/auth";
import { mockUsers, type User } from "@/lib/users-data";
import {
  Search,
  UserIcon,
  Filter,
  Eye,
  Trash2,
  Calendar,
  UserPlus,
  Edit,
} from "lucide-react";
import { AdminLayout } from "@/components/admin-layout";
import { toast } from "sonner";
import { get } from "@/lib/server";
import { ADMIN_USERS_URL, queryNames } from "@/lib/utils/constants";
import { useQuery } from "@tanstack/react-query";
import LoadingOverlay from "@/components/LoadingOverlay";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import CustomPagination from "@/components/CustomPagination";
import { format } from "date-fns";

const limit = 10;

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(
    mockUsers.filter((u) => u.role === "user"),
  );
  const [filteredUsers, setFilteredUsers] = useState<User[]>(
    mockUsers.filter((u) => u.role === "user"),
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  const [currentPage, setCurrentPage] = useState(1);

  const router = useRouter();

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== "admin") {
      // router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((user) =>
        statusFilter === "active" ? user.isActive : !user.isActive,
      );
    }

    setFilteredUsers(filtered);
  }, [searchTerm, statusFilter, users]);

  const handleViewUser = (user: User) => {
    router.push(`/admin/users/view/${user.id}`);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((user) => user.id !== userId));
    toast("User deleted", {
      description: "The user has been successfully deleted.",
    });
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const getSubscriptionColor = (status?: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "inactive":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const fetchUsers = async () => {
    const params = new URLSearchParams({
      page: currentPage.toString(),
      limit: limit.toString(),
    });

    if (searchTerm) {
      params.append("search", searchTerm);
    }
    const { status, message, data } = await get({
      url: `${ADMIN_USERS_URL}?${params.toString()}`,
    });

    if (status) {
      return data;
    } else {
      toast.error(message);
    }
  };

  const { data, isLoading } = useQuery<any>({
    queryKey: [queryNames.ADMIN_USERS, currentPage],
    queryFn: fetchUsers,
    refetchOnWindowFocus: false,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <LoadingOverlay isLoading={isLoading} />
      <div className="space-y-6">
        {/* Search, Filter, and Add User */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 border-gray-200 bg-white pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="rounded-md border border-gray-200 bg-white px-3 py-2"
              >
                <option value="all">All Users</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <Button
            onClick={() => router.push("/admin/users/add")}
            className="flex items-center space-x-2"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add User</span>
          </Button>
        </div>

        {/* Users Table */}
        <div className="rounded-lg border border-gray-200 bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Subscription</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data?.map((user: any) => (
                <TableRow key={user?._id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="rounded-full bg-primary/10 p-2">
                        <UserIcon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{`${user?.firstName ?? ""} ${user?.lastName ?? ""}`}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {user?.subscription ? (
                        <>
                          <p className="text-sm font-medium">
                            {user?.subscription?.plan}
                          </p>
                          <Badge
                            className={getSubscriptionColor(
                              user?.subscription?.status,
                            )}
                          >
                            {user?.subscription?.status}
                          </Badge>
                        </>
                      ) : (
                        <span className="italic text-gray-400">
                          No subscription
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(user.isActive)}>
                      {user?.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>
                        {format(new Date(user?.createdAt), "dd/MM/yyyy")}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{user?.lastLogin?.toLocaleDateString()}</div>
                      <div className="text-gray-500">
                        {user?.lastLogin
                          ? format(new Date(user?.lastLogin), "dd/MM/yyyy")
                          : ""}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewUser(user)}
                      >
                        <Eye className="mr-1 h-3 w-3" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          router.push(`/admin/users/edit/${user?._id}`)
                        }
                      >
                        <Edit className="mr-1 h-3 w-3" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteUser(user?._id)}
                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 className="mr-1 h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {data?.data?.length === 0 && (
            <div className="py-12 text-center">
              <UserIcon className="mx-auto mb-4 h-16 w-16 text-gray-400" />
              <p className="text-gray-500">
                No users found matching your criteria.
              </p>
            </div>
          )}
        </div>

        <CustomPagination
          currentPage={currentPage}
          totalPages={data?.pagination?.totalPages}
          total={data?.pagination?.total}
          limit={limit}
          handlePageChange={(page) => handlePageChange(page)}
        />
      </div>
    </>
  );
}
