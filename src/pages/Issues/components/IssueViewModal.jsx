import Modal from "../../../components/Modal";
import ImageAttachments from "../../../components/ImageAttachments";

const IssueViewModal = ({ isOpen, onClose, issue }) => {
  if (!issue) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Issue Details">
      <div className="space-y-4">
        {/* Issue details */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Reporter</p>
              <p className="text-sm font-medium text-gray-900">{issue.marketing_rep_name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Submitted</p>
              <p className="text-sm font-medium text-gray-900">{issue.created_at?.slice(0, 10)}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Description</p>
            <p className="text-sm text-gray-700 leading-relaxed">{issue.issue_description}</p>
          </div>
          {issue.attachments_urls?.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Attachments</p>
              <ImageAttachments urls={issue.attachments_urls} />
            </div>
          )}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Status</p>
            <span
              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                issue.status === "closed"
                  ? "bg-green-100 text-green-800"
                  : issue.status === "in_progress"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
              }`}
            >
              {issue.status?.replace("_", " ")}
            </span>
          </div>
        </div>

        {/* Admin reply block — only shown once a reply has been sent */}
        {issue.admin_reply && (
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Admin Reply</p>
            <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
              <p className="text-sm text-gray-800 leading-relaxed">{issue.admin_reply}</p>
              {issue.replied_at && (
                <p className="text-xs text-gray-500 mt-2">
                  Replied on {issue.replied_at.slice(0, 10)}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end pt-1">
          <button
            onClick={onClose}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 font-medium cursor-pointer text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default IssueViewModal;
