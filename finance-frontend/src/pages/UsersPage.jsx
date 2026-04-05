import { useState, useCallback, useRef, useEffect } from "react";
import { Users, Search, ChevronDown } from "lucide-react";
import { getUsers, updateUser } from "../services/users";
import useFetch from "../hooks/useFetch";
import Badge from "../components/ui/Badge";
import Pagination from "../components/ui/Pagination";
import EmptyState from "../components/ui/EmptyState";
import Spinner from "../components/ui/Spinner";
import { formatDate, getErrorMessage } from "../utils/formatters";
import toast from "react-hot-toast";

const ROLES = ["admin", "analyst", "viewer"];
const STATUSES = ["active", "inactive"];

const RoleSelect = ({ userId, currentRole, currentStatus, onSuccess }) => {
   const [role, setRole] = useState(currentRole);
   const [status, setStatus] = useState(currentStatus);
   const [saving, setSaving] = useState(false);
   const [open, setOpen] = useState(false);
   const [coords, setCoords] = useState(null);

   const buttonRef = useRef(null);
   const dropdownRef = useRef(null);

   const handleToggle = () => {
      if (!buttonRef.current) return;

      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownWidth = 224; // w-56
      const padding = 12;

      let left = rect.left + window.scrollX;

      // 🚀 prevent right overflow
      if (left + dropdownWidth > window.innerWidth) {
         left = window.innerWidth - dropdownWidth - padding;
      }

      // 🚀 prevent left overflow (safety)
      if (left < padding) {
         left = padding;
      }

      setCoords({
         top: rect.bottom + window.scrollY + 8,
         left,
      });

      setOpen((prev) => !prev);
   };

   // close on outside click
   useEffect(() => {
      const handleClickOutside = (e) => {
         if (
            !buttonRef.current?.contains(e.target) &&
            !dropdownRef.current?.contains(e.target)
         ) {
            setOpen(false);
         }
      };

      if (open) {
         document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, [open]);

   const handleSave = async () => {
      if (role === currentRole && status === currentStatus) {
         setOpen(false);
         return;
      }

      setSaving(true);
      try {
         await updateUser(userId, { role, status });
         toast.success("User updated.");
         onSuccess();
         setOpen(false);
      } catch (err) {
         toast.error(getErrorMessage(err));
      } finally {
         setSaving(false);
      }
   };

   return (
      <>
         {/* BUTTON */}
         <button
            ref={buttonRef}
            onClick={handleToggle}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-surface-border text-white/80 text-xs font-semibold hover:border-brand/40 hover:text-brand transition-colors"
         >
            Edit <ChevronDown size={12} />
         </button>

         {/* FLOATING DROPDOWN */}
         {open && coords && (
            <div
               ref={dropdownRef} // ✅ IMPORTANT
               style={{ top: coords.top, left: coords.left }}
               className="fixed z-[9999] w-56 bg-[#0b1220] border border-white/10 rounded-xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] p-4"
            >
               <p className="text-xs text-white/60 uppercase mb-2">Role</p>

               <div className="flex gap-2 mb-4">
                  {ROLES.map((r) => (
                     <button
                        key={r}
                        onClick={() => setRole(r)}
                        className={`flex-1 py-1.5 rounded-lg text-xs capitalize ${
                           role === r
                              ? "bg-blue-500/20 text-blue-400 border border-blue-400/30"
                              : "border border-white/10 text-white/70"
                        }`}
                     >
                        {r}
                     </button>
                  ))}
               </div>

               <p className="text-xs text-white/60 uppercase mb-2">Status</p>

               <div className="flex gap-2 mb-4">
                  {STATUSES.map((s) => (
                     <button
                        key={s}
                        onClick={() => setStatus(s)}
                        className={`flex-1 py-1.5 rounded-lg text-xs capitalize ${
                           status === s
                              ? s === "active"
                                 ? "bg-green-500/20 text-green-400 border border-green-400/30"
                                 : "bg-red-500/20 text-red-400 border border-red-400/30"
                              : "border border-white/10 text-white/70"
                        }`}
                     >
                        {s}
                     </button>
                  ))}
               </div>

               <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs py-2 rounded-lg"
               >
                  {saving ? "Saving…" : "Save"}
               </button>
            </div>
         )}
      </>
   );
};

const UsersPage = () => {
   const [page, setPage] = useState(1);
   const [search, setSearch] = useState("");
   const [roleFilter, setRoleFilter] = useState("");
   const [statusFilter, setStatusFilter] = useState("");

   const fetchFn = useCallback(
      () =>
         getUsers({
            page,
            limit: 10,
            search,
            role: roleFilter,
            status: statusFilter,
         }),
      [page, search, roleFilter, statusFilter],
   );

   const { data, loading, refetch } = useFetch(fetchFn, [
      page,
      search,
      roleFilter,
      statusFilter,
   ]);

   const users = data?.data || [];
   const pagination = data?.pagination;

   return (
      <div>
         <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Users</h1>
            <p className="text-white/60 text-sm">
               Manage roles and account statuses.
            </p>
         </div>

         <div className="card p-4 mb-6 flex gap-3">
            <input
               value={search}
               onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
               }}
               placeholder="Search..."
               className="input-field w-64"
            />
         </div>

         <div className="card overflow-visible">
            {loading ? (
               <div className="py-20 text-center">
                  <Spinner />
               </div>
            ) : (
               <table className="w-full">
                  <thead>
                     <tr>
                        {[
                           "User",
                           "Email",
                           "Role",
                           "Status",
                           "Joined",
                           "Actions",
                        ].map((h) => (
                           <th
                              key={h}
                              className="px-5 py-3 text-left text-white/60"
                           >
                              {h}
                           </th>
                        ))}
                     </tr>
                  </thead>

                  <tbody>
                     {users.map((user) => (
                        <tr key={user._id}>
                           <td className="px-5 py-4 text-white">{user.name}</td>
                           <td className="px-5 py-4 text-white/60">
                              {user.email}
                           </td>
                           <td className="px-5 py-4">
                              <Badge variant={user.role}>{user.role}</Badge>
                           </td>
                           <td className="px-5 py-4">
                              <Badge variant={user.status}>{user.status}</Badge>
                           </td>
                           <td className="px-5 py-4 text-white/60">
                              {formatDate(user.createdAt)}
                           </td>
                           <td className="px-5 py-4">
                              <RoleSelect
                                 userId={user._id}
                                 currentRole={user.role}
                                 currentStatus={user.status}
                                 onSuccess={refetch}
                              />
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            )}
         </div>
      </div>
   );
};

export default UsersPage;
