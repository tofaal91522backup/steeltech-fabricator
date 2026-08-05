import React, { useState } from "react";
import Pagination from "../../../components/Pagination";
import { useGetMissingReportsQuery } from "../../../features/reportsApi/reportsApi";
import StatCard from "../../../components/StatCard";
import { FaRegCircleCheck } from "react-icons/fa6";
import { MdOutlinePending } from "react-icons/md";
import { RxCrossCircled } from "react-icons/rx";
import ReportDetails from "./ReportsDetails";
import ReportDetailsMarketingRep from "./ReportsDetailsMarketingRep";
import MissingReportDetails from "./MissingReportDetails";

export default function MissingReport({
  year,
  month,
  activeTab,
  selectMr,
  debouncedSearchTerm,
  currentPage,
  handlePageChange,
}) {
  const { data: reports, error } = useGetMissingReportsQuery({
    page: currentPage,
    // fromDate,
    // toDate,
    // view: activeTab,
    year: year?.value,
    month: month?.value,
    mr_id: selectMr,
    // search: debouncedSearchTerm,
  });

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewRecord = (record) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-800",
    rejected: "bg-red-100 text-red-800",
    assigned: "bg-blue-100 text-blue-800",
    approved: "bg-green-100 text-green-800",
  };
  return (
    <>
      <>
        <div className="grid grid-cols-1 md:grid-cols-2  gap-6  px-4 py-4">
          <StatCard
            title="Submited Reports"
            value={reports?.submitted_reports_count}
            icon={<FaRegCircleCheck className="text-black" />}
            color="green"
          />
          {/* <StatCard
            title="Pending"
            value={reports?.pending}
            icon={<MdOutlinePending className="text-black" />}
            color="blue"
          /> */}
          <StatCard
            title="Unreported Fabricators"
            value={reports?.unreported_fabricators_count}
            icon={<RxCrossCircled className="text-black" />}
            color="red"
          />
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Serial No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Marketing Representatives
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fabricator
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Registration Number
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
            {reports?.data?.results?.map((record, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {currentPage * reports?.data?.page_size +
                      index +
                      1 -
                      reports?.data?.page_size}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center bg-primary`}
                    >
                      <span className="text-white font-semibold">
                        {record?.marketing_rep_name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="text-sm font-medium text-gray-900">
                        {record.marketing_rep_name}
                      </div>
                      <div className="text-sm font-light text-gray-900">
                        {record.marketing_rep_phone_number}
                      </div>
                      <div className="text-sm font-light text-gray-900">
                        {record.email}
                      </div>
                      <div className="text-sm font-light text-gray-900">
                        {record.marketing_rep_district},{" "}
                        {record?.marketing_rep_sub_district}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {record?.employee_id}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`min-w-10 min-h-10 rounded-full flex items-center justify-center bg-primary`}
                    >
                      <span className="text-white font-semibold">
                        {record?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="text-sm font-medium text-gray-900">
                        {record.name}
                      </div>
                      <div className="text-sm font-light text-gray-900">
                        {record.phone_number}
                      </div>
                      <div className="text-sm font-light text-gray-900">
                        {record.district}, {record?.sub_district}
                      </div>
                      {/* <div className="text-sm font-light text-gray-900 flex flex-wrap gap-2">
                              <a
                                href={record?.profile_img_url}
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
                                href={record?.trade_license_img_url}
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
                                href={record?.visiting_card_img_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500"
                              >
                                <div className="flex gap-2 items-center">
                                  <p>Visiting Card</p>
                                  <LuExternalLink className="w-4 h-4" />
                                </div>
                              </a>
                            </div> */}
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {record?.registration_number}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize  ${
                      statusStyles[record?.status] ||
                      "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {record?.status}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleViewRecord(record)}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 cursor-pointer"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
      <div className="border-t border-t-gray-200">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(
            reports?.data?.count / reports?.data?.page_size
          )}
          onPageChange={handlePageChange}
        />
      </div>

      {selectedRecord?.id ? (
        <MissingReportDetails
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          record={selectedRecord}
          reportActiveTab={activeTab}
        />
      ) : null}
    </>
  );
}
