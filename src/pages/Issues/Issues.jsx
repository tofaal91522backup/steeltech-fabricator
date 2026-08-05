import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import StatCard from "../../components/StatCard";
import Pagination from "../../components/Pagination";
import AsyncStateWrapper from "../../components/shared/AsyncStateWrapper";
import { useModalContext } from "../../context/ModalContext";
import IssueReplyModal from "./components/IssueReplyModal";
import IssueViewModal from "./components/IssueViewModal";
import { FiFileText, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import {
  ISSUE_REPORT_QUERY_KEY,
  replyToIssueReport,
  useGetIssueReports,
} from "../../features/issueReportApi/issueReportApi";

const tabs = [
  { id: "all", label: "All" },
  { id: "open", label: "Open" },
  { id: "in_progress", label: "In Progress" },
  { id: "closed", label: "Closed" },
];

const statusStyles = {
  open: "bg-red-100 text-red-800",
  in_progress: "bg-yellow-100 text-yellow-800",
  closed: "bg-green-100 text-green-800",
};

const Issues = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [replyText, setReplyText] = useState("");

  const { dispatch: modalDispatch } = useModalContext();
  const queryClient = useQueryClient();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data, isLoading, error } = useGetIssueReports({
    query: {
      page: currentPage,
      status: activeTab === "all" ? undefined : activeTab,
    },
  });

  // No server-side search param is documented for this endpoint, so the search
  // box only filters within the currently loaded page of results.
  const issues = data?.data?.results || [];
  const filtered = issues.filter((issue) => {
    if (debouncedSearchTerm.trim() === "") return true;
    const term = debouncedSearchTerm.toLowerCase();
    return (
      issue.issue_description?.toLowerCase().includes(term) ||
      issue.marketing_rep_name?.toLowerCase().includes(term)
    );
  });

  const replyMutation = useMutation({
    mutationFn: replyToIssueReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ISSUE_REPORT_QUERY_KEY] });
      handleCloseModals();
      modalDispatch({
        type: "success",
        payload: "Reply sent and issue marked as closed.",
      });
    },
    onError: (err) => {
      modalDispatch({
        type: "open",
        payload: err?.response?.data?.message || "Failed to send reply.",
      });
    },
  });

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentPage(1);
  };

  const handleOpenReply = (issue) => {
    setSelectedIssue(issue);
    setReplyText("");
    setIsReplyModalOpen(true);
  };

  const handleOpenView = (issue) => {
    setSelectedIssue(issue);
    setIsViewModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsReplyModalOpen(false);
    setIsViewModalOpen(false);
    setSelectedIssue(null);
    setReplyText("");
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedIssue) return;
    replyMutation.mutate({
      id: selectedIssue.id,
      status: "closed",
      reply: replyText.trim(),
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Issues"
          value={data?.total}
          icon={<FiFileText />}
          color="blue"
        />
        <StatCard
          title="Open"
          value={data?.open}
          icon={<FiAlertCircle />}
          color="red"
        />
        <StatCard
          title="Closed"
          value={data?.closed}
          icon={<FiCheckCircle />}
          color="green"
        />
      </div>

      {/* Table Panel */}
      <div className="bg-white rounded-lg shadow">
        {/* Panel Header */}
        <div className="p-6 border-b border-b-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Issues</h2>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search issues..."
            className="border border-gray-200 w-[280px] p-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
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
                    Reporter
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted Date
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
                {filtered.map((issue) => (
                  <tr key={issue.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary shrink-0">
                          <span className="text-white font-semibold">
                            {issue.marketing_rep_name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {issue.marketing_rep_name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        {issue.issue_description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {issue.created_at?.slice(0, 10)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${statusStyles[issue.status]}`}
                      >
                        {issue.status?.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleOpenView(issue)}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-xs cursor-pointer hover:bg-blue-600"
                      >
                        View
                      </button>
                      {issue.status !== "closed" && (
                        <button
                          onClick={() => handleOpenReply(issue)}
                          className="bg-orange-500 text-white px-3 py-1 rounded text-xs cursor-pointer hover:bg-orange-600"
                        >
                          Reply
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                      No issues found
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

      {selectedIssue && (
        <>
          <IssueReplyModal
            isOpen={isReplyModalOpen}
            onClose={handleCloseModals}
            issue={selectedIssue}
            replyText={replyText}
            onReplyChange={setReplyText}
            onSend={handleSendReply}
            isSending={replyMutation.isPending}
          />
          <IssueViewModal
            isOpen={isViewModalOpen}
            onClose={handleCloseModals}
            issue={selectedIssue}
          />
        </>
      )}
    </div>
  );
};

export default Issues;
