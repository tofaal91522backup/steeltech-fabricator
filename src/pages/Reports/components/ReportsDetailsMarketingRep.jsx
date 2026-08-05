import { useState } from "react";
import Modal from "../../../components/Modal";
import { useGetDistributorByIdQuery } from "../../../features/distributorApi/distributorApi";
import {
  useGetMrReportByIdQuery,
  useGetReportByIdQuery,
} from "../../../features/reportsApi/reportsApi";
import { LuExternalLink } from "react-icons/lu";

const ReportDetailsMarketingRep = ({
  reportActiveTab,
  isOpen,
  onClose,
  record,
}) => {
  
  const { data: distributor } = useGetDistributorByIdQuery({
    id: record?.distributor,
  });

  const { data: reportDetailsMr } = useGetMrReportByIdQuery({
    id: record?.id,
  });


  const [activeTab, setActiveTab] = useState("fabricator");
  const tabs = [
    { id: "fabricator", label: "Fabricator Info" },
    { id: "mar", label: "Marketing Representative" },
    { id: "attachment", label: "Attachment" },
  ];

  if (!record) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-6">
        {/* Header with Avatar and Name */}
        <div className="flex items-center space-x-4 pb-4 border-b border-b-gray-200">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center bg-primary`}
          >
            <span className="text-white font-bold text-xl">
              {reportDetailsMr?.marketing_rep_name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {reportDetailsMr?.marketing_rep_name}
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
                  {reportDetailsMr?.amount}
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-md font-bold text-gray-700 mb-1">
                  Invoice Number
                </label>
                <p className="text-gray-900">
                  {reportDetailsMr?.invoice_number}
                </p>
              </div>
            </div>
            <div>
              <label className="block text-md font-bold text-gray-700 mb-1">
                Date
              </label>
              <p className="text-gray-900">{reportDetailsMr?.sales_date}</p>
            </div>
          </div>
        ) : null}

        <div className="border-b border-b-gray-200 mb-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm cursor-pointer ${
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

        {/* Details Grid */}
        <div className="grid grid-cols-1  gap-6">
          {/* Left Column */}
          <div className="space-y-4 ">
            {activeTab == "mar" ? (
              <div className="flex flex-col gap-1">
                <p className="text-gray-900">
                  <span className="font-bold">Name: </span>{" "}
                  {reportDetailsMr?.marketing_rep_name}
                </p>
                <p className="text-gray-900">
                  <span className="font-bold">Phone: </span>{" "}
                  {reportDetailsMr?.marketing_rep_phone_number}
                </p>
                <p className="text-gray-900">
                  <span className="font-bold">Email: </span>{" "}
                  {reportDetailsMr?.email}
                </p>
                <p className="text-gray-900">
                  <span className="font-bold">Employee ID: </span>{" "}
                  {reportDetailsMr?.employee_id}
                </p>

                <p className="text-gray-900">
                  <span className="font-bold">District: </span>{" "}
                  {reportDetailsMr?.marketing_rep_district}
                </p>
                <p className="text-gray-900">
                  <span className="font-bold">Sub District: </span>{" "}
                  {reportDetailsMr?.marketing_rep_sub_district}
                </p>
              </div>
            ) : null}
            {activeTab == "fabricator" ? (
              <div className="flex flex-col gap-1">
                <p className="text-gray-900">
                  <span className="font-bold">Name: </span>{" "}
                  {reportDetailsMr?.name}
                </p>
                <p className="text-gray-900">
                  <span className="font-bold">Phone: </span>{" "}
                  {reportDetailsMr?.phone_number}
                </p>
                <p className="text-gray-900">
                  <span className="font-bold">Institution: </span>{" "}
                  {reportDetailsMr?.institution}
                </p>
                <p className="text-gray-900">
                  <span className="font-bold">Registration Number: </span>{" "}
                  {reportDetailsMr?.registration_number}
                </p>
                <p className="text-gray-900">
                  <span className="font-bold">District: </span>{" "}
                  {reportDetailsMr?.district}
                </p>
                <p className="text-gray-900">
                  <span className="font-bold">Sub District: </span>{" "}
                  {reportDetailsMr?.sub_district}
                </p>
                <p className="text-gray-900">
                  <span className="font-bold">Address: </span>{" "}
                  {reportDetailsMr?.address}
                </p>
                <p className="text-gray-900">
                  <span className="font-bold">Created At: </span>{" "}
                  {reportDetailsMr?.created_at?.slice(0, 10)}
                </p>

                <div className="text-sm font-light text-gray-900 flex flex-wrap gap-2 mt-3">
                  <a
                    href={reportDetailsMr?.profile_img_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500"
                  >
                    <div className="flex gap-2 items-center">
                      <p>Profile Image</p>
                      <LuExternalLink className="w-4 h-4" />
                    </div>
                  </a>
                  <a
                    href={reportDetailsMr?.trade_license_img_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500"
                  >
                    <div className="flex gap-2 items-center">
                      <p>Trade License</p>
                      <LuExternalLink className="w-4 h-4" />
                    </div>
                  </a>
                  <a
                    href={reportDetailsMr?.visiting_card_img_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500"
                  >
                    <div className="flex gap-2 items-center">
                      <p>Visiting Card</p>
                      <LuExternalLink className="w-4 h-4" />
                    </div>
                  </a>
                </div>

                {/* <p className="text-gray-900">
                  <span className="font-bold">District: </span>{" "}
                  {reportDetailsMr?.fabricator_district},{" "}
                  {reportDetailsMr?.fabricator_sub_district}
                </p> */}
              </div>
            ) : null}

            {activeTab == "attachment" ? (
              <div>
                {/* <h2 className="text-2xl pb-2">Attachment</h2> */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border rounded-lg p-4 w-full">
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
                      <a
                        href={reportDetailsMr?.profile_img_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <button className="mt-2 text-blue-600 hover:text-blue-800 text-sm cursor-pointer">
                          View Document
                        </button>
                      </a>
                      <p>Profile Image</p>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4 w-full">
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
                      <a
                        href={reportDetailsMr?.trade_license_img_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <button className="mt-2 text-blue-600 hover:text-blue-800 text-sm cursor-pointer">
                          View Document
                        </button>
                      </a>
                      <p>Trade License</p>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4 w-full">
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
                      <a
                        href={reportDetailsMr?.visiting_card_img_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <button className="mt-2 text-blue-600 hover:text-blue-800 text-sm cursor-pointer">
                          View Document
                        </button>
                      </a>
                      <p>Visiting Card</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
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

export default ReportDetailsMarketingRep;
