import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

function AdminForm({
  initial,
  onCancel,
  onSubmit,
  createMutation,
  updateMutation,
}) {
  const [full_name, setFullName] = useState(initial?.full_name || "");
  const [email, setEmail] = useState(initial?.email || "");
  const [admin_role, setRole] = useState(initial?.admin_role || "admin");
  const [password_txt, setPassword] = useState("");

  // when opening edit, reset fields properly
  useEffect(() => {
    setFullName(initial?.full_name || "");
    setEmail(initial?.email || "");
    setRole(initial?.admin_role || "admin");
    setPassword(""); // keep empty in edit
  }, [initial]);

  const inputBase =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 " +
    "placeholder:text-gray-400 outline-none transition " +
    "focus:border-orange-400 focus:ring-4 focus:ring-orange-100";

  const labelBase = "text-sm font-medium text-gray-700";

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ full_name, email, admin_role, password_txt });
      }}
    >
      <div className="space-y-2">
        <label className={labelBase}>Full Name</label>
        <input
          className={inputBase}
          value={full_name}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Enter full name"
        />
      </div>
      {initial ? (
        ""
      ) : (
        <div className="space-y-2">
          <label className={labelBase}>Email</label>
          <input
            className={inputBase}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            type="email"
          />
        </div>
      )}

      <div className="space-y-2">
        <label className={labelBase}>Role</label>
        <select
          className={
            inputBase +
            " appearance-none cursor-pointer bg-[linear-gradient(45deg,transparent_50%,#9ca3af_50%),linear-gradient(135deg,#9ca3af_50%,transparent_50%)] " +
            "bg-size-[8px_8px,8px_8px] bg-position-[calc(100%-18px)_calc(50%+1px),calc(100%-13px)_calc(50%+1px)] bg-no-repeat"
          }
          value={admin_role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="admin">Admin</option>
          <option value="master_admin">Master Admin</option>
        </select>
      </div>

      {initial ? (
        ""
      ) : (
        <div className="space-y-2">
          <label className={labelBase}>
            Password{" "}
            <span className="text-xs font-normal text-gray-500">
              (leave empty to keep old)
            </span>
            <input
              type="password"
              className={inputBase}
              value={password_txt}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </label>
        </div>
      )}

      <div className="pt-2 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 active:scale-[0.99] transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={createMutation.isPending || updateMutation.isPending}
          className="rounded-xl cursor-pointer bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 active:scale-[0.99] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {(createMutation.isPending || updateMutation.isPending) && (
            <Loader className="animate-spin w-4 h-4" />
          )}
          {initial ? "Update Admin" : "Create Admin"}
        </button>
      </div>
    </form>
  );
}

export default AdminForm;
