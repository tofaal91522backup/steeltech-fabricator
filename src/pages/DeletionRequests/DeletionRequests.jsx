import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import StatCard from "../../components/StatCard";
import Pagination from "../../components/Pagination";
import AsyncStateWrapper from "../../components/shared/AsyncStateWrapper";
import { useModalContext } from "../../context/ModalContext";
import DeletionRequestDetails from "./components/DeletionRequestDetails";
import { FiFileText, FiClock, FiTrash2, FiCheckCircle } from "react-icons/fi";
import {
  DELETED_REPORT_QUERY_KEY,
  resolveDeleteRequest,
  useGetDeletedReports,
} from "../../features/deletedReportApi/deletedReportApi";

const tabs = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "unresolved", label: "Rejected" },
  { id: "resolved", label: "Resolved" },
];

const statusStyles = {
  pending: "bg-blue-100 text-blue-800",
  unresolved: "bg-yellow-100 text-yellow-800",
  resolved: "bg-green-100 text-green-800",
};

const deleteReasonLabels = {
  duplicate: "Duplicate",
  incorrect_date: "Incorrect date",
  incorrect_amount: "Incorrect amount",
  wrong_fabricator: "Wrong fabricator",
  wrong_distributor: "Wrong distributor",
  other: "Other",
};

const DeletionRequests = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { dispatch: modalDispatch } = useModalContext();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useGetDeletedReports({
    query: {
      page: currentPage,
      status: activeTab === "all" ? undefined : activeTab,
    },
  });

  const requests = data?.data?.results || [];
  const sorted = [...requests].sort((a, b) => {
    const diff = new Date(b.requested_at) - new Date(a.requested_at);
    return sortOrder === "newest" ? diff : -diff;
  });

  const resolveMutation = useMutation({
    mutationFn: resolveDeleteRequest,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [DELETED_REPORT_QUERY_KEY] });
      handleCloseModal();
      modalDispatch({
        type: "success",
        payload:
          variables.status === "resolved"
            ? "Request approved — the report has been permanently deleted."
            : "Request rejected — the report was left untouched.",
      });
    },
    onError: (err) => {
      modalDispatch({
        type: "open",
        payload: err?.response?.data?.message || "Failed to update the request.",
      });
    },
  });

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

  const handleApprove = (id) => {
    const ok = window.confirm(
      "Approving this request PERMANENTLY DELETES the underlying report. This cannot be undone. Continue?"
    );
    if (!ok) return;
    resolveMutation.mutate({ id, status: "resolved" });
  };

  const handleReject = (id) => {
    resolveMutation.mutate({ id, status: "unresolved" });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Requests"
          value={data?.total}
          icon={<FiFileText />}
          color="blue"
        />
        <StatCard
          title="Pending"
          value={data?.pending}
          icon={<FiClock />}
          color="purple"
        />
        <StatCard
          title="Rejected"
          value={data?.unresolved}
          icon={<FiTrash2 />}
          color="orange"
        />
        <StatCard
          title="Resolved"
          value={data?.resolved}
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

        <AsyncStateWrapper loading={isLoading} error={error?.response?.data?.message || error?.message}>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requester
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Report
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requested Date
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
                {sorted.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary shrink-0">
                          <span className="text-white font-semibold">
                            {req.marketing_rep_name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {req.marketing_rep_name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {req.report_snapshot?.invoice_number}
                      </div>
                      <div className="text-xs text-gray-500">
                        {req.report_snapshot?.fabricator_name} · BDT{" "}
                        {req.report_snapshot?.amount}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {deleteReasonLabels[req.delete_reason] || req.delete_reason}
                      </div>
                      {req.remarks && (
                        <div className="text-xs text-gray-500 max-w-xs truncate">
                          {req.remarks}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {req.requested_at?.slice(0, 10)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${statusStyles[req.status]}`}
                      >
                        {req.status === "unresolved" ? "rejected" : req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleViewRequest(req)}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-xs cursor-pointer hover:bg-blue-600"
                      >
                        View
                      </button>
                      {req.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleApprove(req.id)}
                            disabled={resolveMutation.isPending}
                            className="bg-green-500 text-white px-3 py-1 rounded text-xs cursor-pointer hover:bg-green-600 disabled:opacity-50"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(req.id)}
                            disabled={resolveMutation.isPending}
                            className="bg-yellow-500 text-white px-3 py-1 rounded text-xs cursor-pointer hover:bg-yellow-600 disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {sorted.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">
                      No deletion requests found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="border-t border-t-gray-200">
            <Pagination
              currentPage={data?.data?.current_page || currentPage}
              totalPages={data?.data?.num_pages || 1}
              onPageChange={setCurrentPage}
            />
          </div>
        </AsyncStateWrapper>
      </div>

      {selectedRequest && (
        <DeletionRequestDetails
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          request={selectedRequest}
          onApprove={handleApprove}
          onReject={handleReject}
          isResolving={resolveMutation.isPending}
        />
      )}
    </div>
  );
};

export default DeletionRequests;
