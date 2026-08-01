import { GoPeople } from "react-icons/go";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { MdAdminPanelSettings, MdOutlineManageAccounts, MdOutlinePeopleAlt } from "react-icons/md";
import { RiDashboardLine } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { adminLoggedOut } from "../features/auth/adminAuthSlice";
import { IoIosLogOut } from "react-icons/io";
import { FiFileText, FiTrash2, FiAlertCircle } from "react-icons/fi";

const Sidebar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <RiDashboardLine />,
      link: "/dashboard",
    },
    {
      id: "fabricators",
      label: "Fabricators",
      icon: <GoPeople />,
      link: "/fabricator-management",
    },
    {
      id: "representatives",
      label: "Representatives",
      icon: <MdOutlineManageAccounts />,
      link: "/representative",
    },
    {
      id: "distributors",
      label: "Distributors",
      icon: <MdOutlinePeopleAlt />,
      link: "/distributors",
    },
    {
      id: "reports",
      label: "Reports",
      icon: <HiOutlineDocumentReport />,
      link: "/reports",
    },
     {
      id: "admin-management",
      label: "Admin Management",
      icon: <MdAdminPanelSettings />,
      link: "/admin-management",
    },
    {
      id: "activity-logs",
      label: "Activity Logs",
      icon: <FiFileText />,
      link: "/activity-logs",
    },
    {
      id: "deletion-requests",
      label: "Deletion Requests",
      icon: <FiTrash2 />,
      link: "/deletion-requests",
    },
    {
      id: "issues",
      label: "Issues",
      icon: <FiAlertCircle />,
      link: "/issues",
    },
  ];

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(adminLoggedOut());
  };

  return (
    <div className="w-64 bg-white h-screen shadow-lg flex flex-col border-r border-r-gray-200">
      {/* Logo and Header */}
      <div className="p-6 border-b border-b-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">ST</span>
          </div>
          <div>
            <h2 className="font-bold text-gray-900">Steeltech Admin</h2>
            <p className="text-sm text-gray-600">Fabricator Management</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => navigate(item.link)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors cursor-pointer ${
                  pathname === item.link
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div
        className="p-4 px-6 flex gap-2 cursor-pointer"
        onClick={handleLogout}
      >
        <IoIosLogOut className="w-6 h-6 stroke-primary cursor-pointer" />
        <p>Logout</p>
      </div>
    </div>
  );
};

export default Sidebar;
