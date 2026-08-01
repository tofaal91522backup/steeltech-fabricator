import { useEffect, useState } from "react";
import StatCard from "../../components/StatCard";
import Pagination from "../../components/Pagination";
import { useModalContext } from "../../context/ModalContext";
import IssueReplyModal from "./components/IssueReplyModal";
import IssueViewModal from "./components/IssueViewModal";
import { FiFileText, FiAlertCircle, FiCheckCircle } from "react-icons/fi";

const DEMO_ISSUES = [
  {
    id: 1,
    reporter: "Karim Ahmed",
    subject: "App crashes on login screen",
    description:
      "When I try to log in with my phone number, the app closes unexpectedly. This happens every time since the last update was installed.",
    submittedDate: "2026-06-03",
    status: "open",
    reply: null,
  },
  {
    id: 2,
    reporter: "Sadia Rahman",
    subject: "Cannot upload visit photos",
    description:
      "The camera button in the daily report form does not open. I have tried restarting the app but the issue persists on multiple attempts.",
    submittedDate: "2026-06-01",
    status: "resolved",
    reply:
      "We have identified the issue with the camera permission handler. A fix has been deployed in version 2.1.3. Please update the app from the homepage.",
  },
  {
    id: 3,
    reporter: "Alam Hossain",
    subject: "Sales data not syncing",
    description:
      "My sales figures submitted yesterday are not showing in the dashboard. The data appears to be lost after submission and has not reappeared.",
    submittedDate: "2026-05-30",
    status: "open",
    reply: null,
  },
  {
    id: 4,
    reporter: "Fatima Khanam",
    subject: "Wrong distributor assigned",
    description:
      "The distributor shown in my profile is incorrect. It shows a distributor from Chittagong but I am based in Dhaka and should be assigned accordingly.",
    submittedDate: "2026-05-28",
    status: "resolved",
    reply:
      "We have corrected your distributor assignment in the system. Please log out and log back in to see the updated information in your profile.",
  },
  {
    id: 5,
    reporter: "Jahid Hasan",
    subject: "Notifications not received",
    description:
      "I am not receiving push notifications for new task assignments. I have notifications enabled in my phone settings but still nothing arrives.",
    submittedDate: "2026-06-04",
    status: "open",
    reply: null,
  },
  {
    id: 6,
    reporter: "Reshma Akter",
    subject: "Password reset not working",
    description:
      "I requested a password reset but I am not receiving the OTP on my registered phone number. I have tried three times with no success.",
    submittedDate: "2026-05-25",
    status: "resolved",
    reply:
      "The OTP delivery issue was caused by a temporary SMS gateway outage. The issue has been resolved. Please try the password reset again and it should work.",
  },
];

const ITEMS_PER_PAGE = 5;

const tabs = [
  { id: "all", label: "All" },
  { id: "open", label: "Open" },
  { id: "resolved", label: "Resolved" },
];

const statusStyles = {
  open: "bg-red-100 text-red-800",
  resolved: "bg-green-100 text-green-800",
};

const Issues = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [issues, setIssues] = useState(DEMO_ISSUES);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [replyText, setReplyText] = useState("");

  const { dispatch: modalDispatch } = useModalContext();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const filtered = issues.filter((issue) => {
    const matchesTab = activeTab === "all" ? true : issue.status === activeTab;
    const matchesSearch =
      debouncedSearchTerm.trim() === ""
        ? true
        : issue.subject.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          issue.reporter.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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
    setIssues((prev) =>
      prev.map((issue) =>
        issue.id === selectedIssue.id
          ? { ...issue, status: "resolved", reply: replyText.trim() }
          : issue
      )
    );
    handleCloseModals();
    modalDispatch({ type: "success", payload: "Reply sent and issue marked as resolved." });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Issues"
          value={issues.length}
          icon={<FiFileText />}
          color="blue"
        />
        <StatCard
          title="Open"
          value={issues.filter((i) => i.status === "open").length}
          icon={<FiAlertCircle />}
          color="red"
        />
        <StatCard
          title="Resolved"
          value={issues.filter((i) => i.status === "resolved").length}
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

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reporter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
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
              {paginated.map((issue) => (
                <tr key={issue.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary shrink-0">
                        <span className="text-white font-semibold">
                          {issue.reporter.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {issue.reporter}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {issue.subject}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 max-w-xs truncate">
                      {issue.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{issue.submittedDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${statusStyles[issue.status]}`}
                    >
                      {issue.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleOpenView(issue)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-xs cursor-pointer hover:bg-blue-600"
                    >
                      View
                    </button>
                    {issue.status === "open" && (
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

      {selectedIssue && (
        <>
          <IssueReplyModal
            isOpen={isReplyModalOpen}
            onClose={handleCloseModals}
            issue={selectedIssue}
            replyText={replyText}
            onReplyChange={setReplyText}
            onSend={handleSendReply}
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
