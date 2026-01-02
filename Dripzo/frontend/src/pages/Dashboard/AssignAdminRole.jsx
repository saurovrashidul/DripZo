import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const AssignAdminRole = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [searchEmail, setSearchEmail] = useState("");
  const [debouncedEmail, setDebouncedEmail] = useState("");

  // debounce the search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedEmail(searchEmail);
    }, 700); // 500ms delay

    return () => clearTimeout(handler);
  }, [searchEmail]);

  // Fetch users with debounced search
  const { data: users = [], isLoading, isError } = useQuery({
    queryKey: ["users", debouncedEmail],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users?email=${debouncedEmail}`);
      return res.data;
    },
    keepPreviousData: true,
  });

  // Make / Remove admin
  const roleMutation = useMutation({
    mutationFn: async ({ id, makeAdmin }) => {
      const res = await axiosSecure.patch(`/users/admin/${id}`, { makeAdmin });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", debouncedEmail] });
    },
  });

  // Delete user
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/users/${id}`);
      return res.data;
    },
    onSuccess: () => {
      Swal.fire("Deleted", "User has been deleted", "success");
      queryClient.invalidateQueries({ queryKey: ["users", debouncedEmail] });
    },
  });

  if (isLoading) return <p className="text-center mt-4">Loading users...</p>;
  if (isError) return <p className="text-center mt-4 text-red-500">Failed to load users</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Admin Panel - Users</h2>

      {/* Search Bar */}
      <div className="mb-4 flex justify-center">
        <input
          type="text"
          placeholder="Search by email..."
          className="input input-bordered w-full max-w-sm"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
        />
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td className="capitalize">{user.role}</td>
                  <td>{new Date(user.createdAt).toLocaleString()}</td>
                  <td className="space-x-2">
                    {user.role !== "admin" ? (
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => roleMutation.mutate({ id: user._id, makeAdmin: true })}
                      >
                        Make Admin
                      </button>
                    ) : (
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() => roleMutation.mutate({ id: user._id, makeAdmin: false })}
                      >
                        Remove Admin
                      </button>
                    )}

                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => {
                        Swal.fire({
                          title: "Are you sure?",
                          text: "This user will be deleted!",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonColor: "#dc2626",
                          cancelButtonColor: "#6b7280",
                          confirmButtonText: "Yes, delete!",
                        }).then((result) => {
                          if (result.isConfirmed) {
                            deleteMutation.mutate(user._id);
                          }
                        });
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignAdminRole;
