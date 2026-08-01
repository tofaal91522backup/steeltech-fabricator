import Modal from "../../../components/Modal";

const statusStyles = {
  unresolved: "bg-yellow-100 text-yellow-800",
  resolved: "bg-green-100 text-green-800",
};

const DeletionRequestDetails = ({ isOpen, onClose, request, onToggleStatus }) => {
  if (!request) return null;

  const isUnresolved = request.status === "unresolved";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Deletion Request Details">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Requester</p>
            <p className="text-sm font-medium text-gray-900">{request.name}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Account Type</p>
            <p className="text-sm font-medium text-gray-900">{request.userType}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Email</p>
            <p className="text-sm font-medium text-gray-900">{request.email}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Requested On</p>
            <p className="text-sm font-medium text-gray-900">{request.requestedDate}</p>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Reason</p>
          <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg leading-relaxed">
            {request.reason}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Status:</p>
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${statusStyles[request.status]}`}
          >
            {request.status}
          </span>
        </div>

        <div className="border-t border-gray-100 pt-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 font-medium cursor-pointer text-sm"
          >
            Close
          </button>
          <button
            onClick={() => onToggleStatus(request.id)}
            className={`text-white px-4 py-2 rounded-lg font-medium cursor-pointer text-sm ${
              isUnresolved
                ? "bg-green-500 hover:bg-green-600"
                : "bg-yellow-500 hover:bg-yellow-600"
            }`}
          >
            {isUnresolved ? "Mark as Resolved" : "Mark as Unresolved"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeletionRequestDetails;
