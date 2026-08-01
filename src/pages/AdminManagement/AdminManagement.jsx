import { useMemo, useState } from "react";
import SimpleTable from "../../components/shared/SimpleTable";
import SimplePagination from "../../components/shared/SimplePagination";
import AsyncStateWrapper from "../../components/shared/AsyncStateWrapper";

import {
  ADMIN_MANAGE_QUERY_KEY,
  createAdminManage,
  deleteAdminManage,
  updateAdminManage,
  useGetAdminManages,
} from "../../features/adminManageApi/adminManageApi";
import AdminForm from "./AdminForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye } from "lucide-react";
import { EyeOff } from "lucide-react";
import { Loader } from "lucide-react";

// যদি তোমার API functions থাকে, import করো (থাকলে)
// import { createAdminManage, updateAdminManage, deleteAdminManage } from "../../features/adminManageApi/adminManageApi";

const AdminManagement = () => {
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState(null);
  const [page, setPage] = useState(1);

  // modal/form state (simple)
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // password show state per row id
  const [showPwd, setShowPwd] = useState({}); // { [id]: true/false }

  const { data, isLoading, error } = useGetAdminManages({
    query: { page },
  });

  const rows = data?.results || [];

  const createMutation = useMutation({
    mutationFn: createAdminManage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_MANAGE_QUERY_KEY] });
      setOpen(false);
    },
  });
  const updateMutation = useMutation({
    mutationFn: updateAdminManage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_MANAGE_QUERY_KEY] });
      setOpen(false);
    },
  });
  const deleteMutation = useMutation({
    mutationFn: deleteAdminManage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_MANAGE_QUERY_KEY] });
      setOpen(false);
    },
    onSettled: () => {
      setDeletingId(null);
    },
  });

  const columns = useMemo(
    () => [
      { key: "full_name", header: "Admin Name" },
      { key: "email", header: "Email" },
      { key: "admin_role", header: "Role" },

      // ✅ password hide/show (click)
      {
        key: "password_txt",
        header: "Password",
        render: (row) => {
          const id = row.id || row._id || row.email; // fallback
          const visible = !!showPwd[id];
          const pwd = row.password_txt || "";

          return (
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs">
                {pwd ? (visible ? pwd : "••••••••") : "—"}
              </span>

              {pwd ? (
                <button
                  className="text-xs px-2 py-1 border rounded hover:bg-gray-50 border-gray-200"
                  onClick={() => setShowPwd((s) => ({ ...s, [id]: !s[id] }))}
                >
                  {visible ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              ) : null}
            </div>
          );
        },
      },

      // ✅ actions
      {
        key: "__actions",
        header: "Actions",
        render: (row) => {
          const isDeleting = deletingId === row.id;

          return (
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="px-3 py-1 rounded-md border text-sm hover:bg-gray-50 border-gray-200 cursor-pointer"
                onClick={() => {
                  setEditing(row);
                  setOpen(true);
                }}
              >
                Edit
              </button>

              <button
                type="button"
                disabled={isDeleting}
                className="px-3 py-1 rounded-md border border-red-200 text-red-600 text-sm hover:bg-red-50 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={() => {
                  const ok = window.confirm("Delete this admin?");
                  if (!ok) return;

                  setDeletingId(row.id);
                  deleteMutation.mutate(row.id);
                }}
              >
                {isDeleting ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader className="animate-spin w-4 h-4" />
                    Deleting...
                  </span>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          );
        },
      },
    ],
    [showPwd, deleteMutation.isPending],
  );
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Admin Management</h1>
            <p className="text-sm text-gray-600">Manage admins list</p>
          </div>

          <button
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 font-medium cursor-pointer"
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            Add New Admin
          </button>
        </div>

        <AsyncStateWrapper loading={isLoading} error={error?.message}>
          <SimpleTable
            rows={rows}
            columns={columns}
            emptyText="No admins found"
          />

          <SimplePagination
            page={page}
            setPage={setPage}
            currentPage={data?.current_page}
            totalPages={data?.num_pages}
            hasNext={!!data?.next}
            hasPrev={!!data?.previous}
          />
        </AsyncStateWrapper>

        {/* ✅ Simple modal (no library) */}
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-lg rounded-xl bg-white p-5 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">
                  {editing ? "Edit Admin" : "Add New Admin"}
                </h2>
                <button
                  className="px-2 py-1 border rounded hover:bg-gray-50"
                  onClick={() => setOpen(false)}
                >
                  ✕
                </button>
              </div>

              {/* ✅ Simple form (you can connect with your API) */}
              <AdminForm
                initial={editing}
                onCancel={() => setOpen(false)}
                createMutation={createMutation}
                updateMutation={updateMutation}
                onSubmit={(payload) => {
                  // এখানে create/update API বসাবে
                  if (editing)
                    updateMutation.mutate({ id: editing.id, data: payload });
                  else createMutation.mutate(payload);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminManagement;
