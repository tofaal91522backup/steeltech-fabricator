import Modal from "../../../components/Modal";
import { useGetDistributorByIdQuery } from "../../../features/distributorApi/distributorApi";
import {
  useGetMrReportByIdQuery,
  useGetReportByIdQuery,
} from "../../../features/reportsApi/reportsApi";
import { LuExternalLink, LuMapPin } from "react-icons/lu";

const ReportDetails = ({ reportActiveTab, isOpen, onClose, record }) => {
  const { data: distributor } = useGetDistributorByIdQuery({
    id: record?.distributor,
  });

  const { data: reportDetails } = useGetReportByIdQuery({
    id: record?.id,
  });
  const { data: reportDetailsMr } = useGetMrReportByIdQuery({
    id: record?.id,
  });

  const hasLocation = !!(reportDetails?.latitude && reportDetails?.longitude);

  if (!record) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidthClass="max-w-5xl">
      <div className="space-y-6">
        {/* Header with Avatar and Name */}
        <div className="flex items-center space-x-4 pb-4 border-b border-b-gray-200">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center bg-primary`}
          >
            <span className="text-white font-bold text-xl">
              {reportActiveTab == "marketing-rep-and-fabricator"
                ? reportDetailsMr?.fabricator__name?.charAt(0).toUpperCase()
                : reportDetails?.fabricator_name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {reportActiveTab == "marketing-rep-and-fabricator"
                ? reportDetailsMr?.fabricator__name
                : reportDetails?.fabricator_name}
            </h2>
            <p className="text-gray-600 capitalize">Report Details</p>
          </div>
        </div>

        {/* Details Grid */}
        {reportActiveTab !== "marketing-rep-and-fabricator" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-md font-bold text-gray-700 mb-1">
                  Amount
                </label>
                <p className="text-gray-900 text-lg font-semibold">
                  {reportDetails?.amount}
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-md font-bold text-gray-700 mb-1">
                  Invoice Number
                </label>
                <p className="text-gray-900">{reportDetails?.invoice_number}</p>
              </div>
            </div>
            <div>
              <label className="block text-md font-bold text-gray-700 mb-1">
                Date
              </label>
              <p className="text-gray-900">{reportDetails?.sales_date}</p>
            </div>
          </div>
        ) : null}

        {/* Fabricator / Distributor / Marketing Representative Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border rounded-lg p-4">
            <h3 className="font-bold text-gray-900 mb-2">Fabricator Info</h3>
            <div className="space-y-1">
              <p className="text-gray-900">
                <span className="font-bold">Name: </span>{" "}
                {reportDetails?.fabricator_name}
              </p>
              <p className="text-gray-900">
                <span className="font-bold">Phone: </span>{" "}
                {reportDetails?.fabricator_phone_number}
              </p>
              <p className="text-gray-900">
                <span className="font-bold">District: </span>{" "}
                {reportDetails?.fabricator_district},{" "}
                {reportDetails?.fabricator_sub_district}
              </p>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-bold text-gray-900 mb-2">Distributor Info</h3>
            <div className="space-y-1">
              <p className="text-gray-900">
                <span className="font-bold">Name: </span> {distributor?.name}
              </p>
              <p className="text-gray-900">
                <span className="font-bold">Email: </span> {distributor?.email}
              </p>
              <p className="text-gray-900">
                <span className="font-bold">Phone Number: </span>{" "}
                {distributor?.phone_number}
              </p>
              <p className="text-gray-900">
                <span className="font-bold">District: </span>{" "}
                {distributor?.sub_district}, {distributor?.district}
              </p>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-bold text-gray-900 mb-2">
              Marketing Representative
            </h3>
            <div className="space-y-1">
              <p className="text-gray-900">
                <span className="font-bold">Name: </span>{" "}
                {reportDetails?.marketing_rep_name}
              </p>
              <p className="text-gray-900">
                <span className="font-bold">Phone: </span>{" "}
                {reportActiveTab === "marketing-rep-and-fabricator"
                  ? reportDetailsMr?.marketing_rep_phone
                  : reportDetails?.marketing_rep_phone_number}
              </p>
              <p className="text-gray-900">
                <span className="font-bold">District: </span>{" "}
                {reportDetails?.marketing_rep_district},{" "}
                {reportDetails?.marketing_rep_sub_district}
              </p>
            </div>
          </div>
        </div>

        {/* Location Map */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-gray-900 flex items-center gap-1">
              <LuMapPin className="w-4 h-4" /> Location
            </h3>
            {hasLocation ? (
              <a
                href={`https://www.google.com/maps?q=${reportDetails.latitude},${reportDetails.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 text-sm flex items-center gap-1"
              >
                Open in Google Maps <LuExternalLink className="w-4 h-4" />
              </a>
            ) : null}
          </div>
          {hasLocation ? (
            <iframe
              title="Report location"
              className="w-full h-64 rounded border-0"
              src={`https://maps.google.com/maps?q=${reportDetails.latitude},${reportDetails.longitude}&z=15&output=embed`}
            />
          ) : (
            <p className="text-gray-500 text-sm">Location not available.</p>
          )}
        </div>

        {/* Attachments */}
        <div className="border rounded-lg p-4">
          <h3 className="font-bold text-gray-900 mb-2">Attachment</h3>
          {reportDetails?.attachements_urls?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reportDetails?.attachements_urls?.map((url) => (
                <div className="border rounded-lg p-4 w-full" key={url}>
                  <div className="bg-gray-50 rounded p-4 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400 mb-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      <button className="mt-2 text-blue-600 hover:text-blue-800 text-sm cursor-pointer">
                        View Document
                      </button>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No Attachment found!</p>
          )}
        </div>

        {/* Additional Information */}
        {/* <div className="pt-4 border-t">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Transaction Details
          </label>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-900 text-sm">
              Payment processed successfully for {record?.fabricator_name}.
              Invoice {record?.invoice_number} generated and sent to the registered
              email address. Marketing representative {record?.marketing_rep_name} has
              been notified of the transaction.
            </p>
          </div>
        </div> */}

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-t-gray-200">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 font-medium cursor-pointer"
          >
            Close
          </button>
          {/* <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 font-medium">
            Download Invoice
          </button> */}
        </div>
      </div>
    </Modal>
  );
};

export default ReportDetails;
