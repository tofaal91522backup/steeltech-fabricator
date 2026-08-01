import { useState } from "react";
import StatCard from "../../components/StatCard";
import Pagination from "../../components/Pagination";
import { useModalContext } from "../../context/ModalContext";
import DeletionRequestDetails from "./components/DeletionRequestDetails";
import { FiFileText, FiTrash2, FiCheckCircle } from "react-icons/fi";

const DEMO_REQUESTS = [
  {
    id: 1,
    requestNumber: "REQ-001",
    name: "Ali Hossain",
    email: "ali.hossain@gmail.com",
    userType: "Fabricator",
    requestedDate: "2026-06-01",
    reason:
      "I want to close my account because I am no longer operating my fabrication business and have relocated to a different city.",
    status: "unresolved",
  },
  {
    id: 2,
    requestNumber: "REQ-002",
    name: "Reza Karim",
    email: "reza.karim@gmail.com",
    userType: "Marketing Rep",
    requestedDate: "2026-05-28",
    reason:
      "Moving to a different company and no longer need this account. Please delete all my personal data from the platform.",
    status: "resolved",
  },
  {
    id: 3,
    requestNumber: "REQ-003",
    name: "Nadia Islam",
    email: "nadia.islam@gmail.com",
    userType: "Fabricator",
    requestedDate: "2026-05-20",
    reason:
      "The business has been sold to a new owner who will register a fresh account. The old account is no longer needed.",
    status: "resolved",
  },
  {
    id: 4,
    requestNumber: "REQ-004",
    name: "Kamal Uddin",
    email: "kamal.uddin@gmail.com",
    userType: "Marketing Rep",
    requestedDate: "2026-06-03",
    reason:
      "I am retiring from the role of marketing representative and no longer require access to this system.",
    status: "unresolved",
  },
  {
    id: 5,
    requestNumber: "REQ-005",
    name: "Sadia Begum",
    email: "sadia.begum@gmail.com",
    userType: "Fabricator",
    requestedDate: "2026-06-05",
    reason:
      "A duplicate account was created by mistake during registration. Please delete this one and keep the other.",
    status: "unresolved",
  },
  {
    id: 6,
    requestNumber: "REQ-006",
    name: "Rahim Sheikh",
    email: "rahim.sheikh@gmail.com",
    userType: "Fabricator",
    requestedDate: "2026-05-15",
    reason:
      "Privacy concerns. I would like all my personal data to be removed from the platform as per my rights.",
    status: "resolved",
  },
];

const ITEMS_PER_PAGE = 5;

const tabs = [
  { id: "all", label: "All" },
  { id: "unresolved", label: "Unresolved" },
  { id: "resolved", label: "Resolved" },
];

const statusStyles = {
  unresolved: "bg-yellow-100 text-yellow-800",
  resolved: "bg-green-100 text-green-800",
};

const DeletionRequests = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [requests, setRequests] = useState(DEMO_REQUESTS);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { dispatch: modalDispatch } = useModalContext();

  const filtered = requests.filter((r) =>
    activeTab === "all" ? true : r.status === activeTab
  );

  const sorted = [...filtered].sort((a, b) => {
    const diff = new Date(b.requestedDate) - new Date(a.requestedDate);
    return sortOrder === "newest" ? diff : -diff;
  });

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const paginated = sorted.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentPage(1);
  };

  const handleViewRequest = (req) => {
    setSelectedRequest(req);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  const handleToggleStatus = (id) => {
    const request = requests.find((r) => r.id === id);
    if (!request) return;

    const nextStatus = request.status === "resolved" ? "unresolved" : "resolved";
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: nextStatus } : r))
    );
    handleCloseModal();
    modalDispatch({
      type: "success",
      payload:
        nextStatus === "resolved"
          ? "Deletion request marked as resolved."
          : "Deletion request marked as unresolved.",
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Requests"
          value={requests.length}
          icon={<FiFileText />}
          color="blue"
        />
        <StatCard
          title="Unresolved"
          value={requests.filter((r) => r.status === "unresolved").length}
          icon={<FiTrash2 />}
          color="orange"
        />
        <StatCard
          title="Resolved"
          value={requests.filter((r) => r.status === "resolved").length}
          icon={<FiCheckCircle />}
          color="green"
        />
      </div>

      {/* Table Panel */}
      <div className="bg-white rounded-lg shadow">
        {/* Panel Header */}
        <div className="p-6 border-b border-b-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Deletion Requests
          </h2>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border border-gray-200 p-2 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        {/* Tabs */}
        <div className="border-b border-b-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm cursor-pointer ${
                  activeTab === tab.id
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Requester
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Requested Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginated.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{req.requestNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary shrink-0">
                        <span className="text-white font-semibold">
                          {req.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {req.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{req.userType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{req.requestedDate}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 max-w-xs truncate">
                      {req.reason}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${statusStyles[req.status]}`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleViewRequest(req)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-xs cursor-pointer hover:bg-blue-600"
                    >
                      View
                    </button>
                    {req.status === "unresolved" ? (
                      <button
                        onClick={() => handleToggleStatus(req.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded text-xs cursor-pointer hover:bg-green-600"
                      >
                        Mark as Resolved
                      </button>
                    ) : (
                      <button
                        onClick={() => handleToggleStatus(req.id)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded text-xs cursor-pointer hover:bg-yellow-600"
                      >
                        Mark as Unresolved
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="border-t border-t-gray-200">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {selectedRequest && (
        <DeletionRequestDetails
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          request={selectedRequest}
          onToggleStatus={handleToggleStatus}
        />
      )}
    </div>
  );
};

export default DeletionRequests;
