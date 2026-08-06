import Modal from "../../../components/Modal";
import ImageAttachments from "../../../components/ImageAttachments";

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

const DeletionRequestDetails = ({
  isOpen,
  onClose,
  request,
  onApprove,
  onReject,
  isResolving,
}) => {
  if (!request) return null;

  const isPending = request.status === "pending";
  const snapshot = request.report_snapshot || {};

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Deletion Request Details">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Requester</p>
            <p className="text-sm font-medium text-gray-900">{request.marketing_rep_name}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Requested On</p>
            <p className="text-sm font-medium text-gray-900">
              {request.requested_at?.slice(0, 10)}
            </p>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
            Report Snapshot
          </p>
          <div className="bg-gray-50 p-3 rounded-lg grid grid-cols-2 gap-2 text-sm text-gray-900">
            <p>Invoice: {snapshot.invoice_number}</p>
            <p>Amount: BDT {snapshot.amount}</p>
            <p>Sales date: {snapshot.sales_date}</p>
            <p>Fabricator: {snapshot.fabricator_name}</p>
            <p className="col-span-2">Distributor: {snapshot.distributor_name}</p>
          </div>
          {snapshot.attachements_urls?.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                Attachments
              </p>
              <ImageAttachments urls={snapshot.attachements_urls} />
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
            {deleteReasonLabels[request.delete_reason] || request.delete_reason}
          </p>
          <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg leading-relaxed">
            {request.remarks || "—"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Status:</p>
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${statusStyles[request.status]}`}
          >
            {request.status === "unresolved" ? "rejected" : request.status}
          </span>
        </div>

        {!isPending && request.resolved_at && (
          <p className="text-xs text-gray-500">
            Decided on {request.resolved_at.slice(0, 10)}
          </p>
        )}

        <div className="border-t border-gray-100 pt-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 font-medium cursor-pointer text-sm"
          >
            Close
          </button>
          {isPending && (
            <>
              <button
                onClick={() => onReject(request.id)}
                disabled={isResolving}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium cursor-pointer text-sm disabled:opacity-50"
              >
                Reject
              </button>
              <button
                onClick={() => onApprove(request.id)}
                disabled={isResolving}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium cursor-pointer text-sm disabled:opacity-50"
              >
                Approve (delete report)
              </button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default DeletionRequestDetails;
