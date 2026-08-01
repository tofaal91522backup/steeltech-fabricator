import Modal from "../../../components/Modal";

const IssueReplyModal = ({ isOpen, onClose, issue, replyText, onReplyChange, onSend }) => {
  if (!issue) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reply to Issue">
      <div className="space-y-4">
        {/* Original issue details — read-only */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Reporter</p>
              <p className="text-sm font-medium text-gray-900">{issue.reporter}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Submitted</p>
              <p className="text-sm font-medium text-gray-900">{issue.submittedDate}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Subject</p>
            <p className="text-sm font-semibold text-gray-900">{issue.subject}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Description</p>
            <p className="text-sm text-gray-700 leading-relaxed">{issue.description}</p>
          </div>
        </div>

        {/* Reply textarea */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Reply
          </label>
          <textarea
            rows={4}
            value={replyText}
            onChange={(e) => onReplyChange(e.target.value)}
            placeholder="Type your reply here..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
          />
        </div>

        <div className="flex justify-end gap-3 pt-1">
          <button
            onClick={onClose}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 font-medium cursor-pointer text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onSend}
            disabled={!replyText.trim()}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 font-medium cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send Reply
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default IssueReplyModal;
