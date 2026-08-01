"use client";

import { useEffect, useState } from "react";
import ReportDetails from "./components/ReportsDetails";
import DatePicker from "../../components/DatePicker";
import {
  useDeleteReportMutation,
  useGetReportsQuery,
} from "../../features/reportsApi/reportsApi";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "../../components/Pagination";
import { LuExternalLink } from "react-icons/lu";
import { useGetAllMRForRegQuery } from "../../features/fabricartorApi/fabricartorApi";
import Select from "react-select";
import ReportDetailsMarketingRep from "./components/ReportsDetailsMarketingRep";
import spinner from "../../assets/images/spinner.webp";
import StatCard from "../../components/StatCard";
import { FiFileText } from "react-icons/fi";
import { CiCircleCheck } from "react-icons/ci";
import { MdOutlinePending } from "react-icons/md";
import { RxCrossCircled } from "react-icons/rx";
import { FaRegCircleCheck } from "react-icons/fa6";
import { adminLoggedOut } from "../../features/auth/adminAuthSlice";
import MissingReport from "./components/MissingReport";

const Reports = () => {
  const [activeTab, setActiveTab] = useState("summary");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectMr, setSelectMr] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1–12

  // Year options (example: current year ± 5 years)
  const years = Array.from({ length: 11 }, (_, i) => {
    const year = currentYear - 5 + i;
    return { value: year, label: year.toString() };
  });

  // Month options: value = number, label = name
  const months = Array.from({ length: 12 }, (_, i) => {
    const monthNumber = i + 1;
    const monthName = new Date(0, i).toLocaleString("default", {
      month: "long",
    });
    return { value: monthNumber, label: monthName };
  });

  const [year, setYear] = useState(
    years.find((y) => y.value === currentYear) || years[0]
  );
  const [month, setMonth] = useState(
    months.find((m) => m.value === currentMonth) || months[0]
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(search);
    }, 500); // 500ms debounce

    return () => clearTimeout(handler);
  }, [search]);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const { data: allMr } = useGetAllMRForRegQuery();

  const { data: reports, error } = useGetReportsQuery({
    page: currentPage,
    fromDate,
    toDate,
    view: activeTab,
    mr_id: selectMr,
    search: debouncedSearchTerm,
  });

  const [deleteReport] = useDeleteReportMutation();

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(adminLoggedOut());
  };

  useEffect(() => {
    if (error?.status == 401) {
      handleLogout();
    }
  }, [error]);

  // FOR SEARCHING START HERE
  const options = allMr?.data?.map((mr) => ({
    value: mr.id,
    label: mr.name,
  }));

  const handleChange = (selectedOption) => {
    setSelectMr(selectedOption?.value || "");
    setIsFocused(false);
  };

  useEffect(() => {
    setFromDate("");
    setToDate("");
  }, [activeTab]);

  const handleViewRecord = (record) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const auth = useSelector((state) => state.authAdmin);

  const [loading, setLoading] = useState(false);

  function downloadFile(url, fileName) {
    setLoading(true); // Start loader

    fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${auth?.token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        // 🔹 Get filename from Content-Disposition header
        const disposition = response.headers.get("Content-Disposition");

        return response.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = fileName;

        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
      .catch((err) => console.error("Download error:", err))
      .finally(() => setLoading(false)); // Stop loader
  }

  const handleExportCSV = () => {
    if (activeTab == "missing-report") {
      downloadFile(
        `https://hos-api.ongshak.com/administrator/report/?view=missing-report&year=${year?.value}&month=${month?.value}&action=csv&marketing-rep-id=${selectMr}`,

        `${
          activeTab == "fabricators"
            ? "fabricator_reports"
            : activeTab == "marketing_representatives"
            ? "distributors"
            : activeTab == "marketing-rep-and-fabricator"
            ? "marketing_rep_and_fabricator"
            : activeTab == "missing-report"
            ? "missing_report"
            : activeTab == "summary"
            ? "report"
            : ""
        }`
      );
    } else {
      downloadFile(
        `https://hos-api.ongshak.com/administrator/report/?from_date=${fromDate}&to_date=${toDate}&action=csv&view=${activeTab}${
          activeTab == "summary" || activeTab == "marketing-rep-and-fabricator"
            ? `&marketing-rep-id=${selectMr}`
            : `&search=${search}`
        }`,
        `${
          activeTab == "fabricators"
            ? "fabricator_reports"
            : activeTab == "marketing_representatives"
            ? "distributors"
            : activeTab == "marketing-rep-and-fabricator"
            ? "marketing_rep_and_fabricator"
            : activeTab == "missing-report"
            ? "missing_report"
            : activeTab == "summary"
            ? "report"
            : ""
        }`
      );
    }
  };

  const tabs = [
    { id: "summary", label: "Summary" },
    { id: "fabricators", label: "Fabricators" },
    { id: "marketing_representatives", label: "Distributor" },
    { id: "marketing-rep-and-fabricator", label: "Marketing Representative" },
    { id: "missing-report", label: "Missing Report" },
  ];

  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-800",
    rejected: "bg-red-100 text-red-800",
    assigned: "bg-blue-100 text-blue-800",
    approved: "bg-green-100 text-green-800",
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow">
        {/* Tabs */}
        <div className="p-6 border-b border-b-gray-200">
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-orange-500 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Report Header */}
        <div className="p-6 border-b border-b-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {activeTab === "fabricators"
                ? "Fabricator"
                : activeTab === "marketing_representatives"
                ? "Distributor"
                : activeTab === "marketing-rep-and-fabricator"
                ? "Marketing Representatives"
                : activeTab == "missing-report"
                ? "Missing Report"
                : "Summary"}
            </h2>
            {/* <button
            disabled={loading}
              onClick={handleExportCSV}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 font-medium cursor-pointer"
            >
              {
                loading ? "Exporting" : Export CSV
              }
              
            </button> */}

            <button
              disabled={loading}
              onClick={handleExportCSV}
              className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 font-medium flex items-center cursor-pointer"
            >
              {loading ? (
                <div className="flex gap-2 items-center">
                  <img src={spinner} alt="" className="w-6 h-6" /> Exporting
                </div>
              ) : (
                <div className="flex gap-2 items-center">Export CSV</div>
              )}
            </button>
          </div>

          {/* Date Filters */}
          {activeTab == "missing-report" ? (
            <>
              <div className={` w-[350px] transition-all`}>
                {/* <label className=" block text-sm font-medium text-gray-700 mb-1">
                Marketing Representative
                </label> */}
                <Select
                  options={options}
                  onChange={handleChange}
                  value={options?.find((opt) => opt.value === selectMr)}
                  placeholder="Select the marketing representative"
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  isClearable
                />
              </div>

              {activeTab == "missing-report" ? (
                <div className="w-[350px] flex gap-2 mt-4">
                  {/* Year Dropdown */}
                  <Select
                    className="w-full"
                    value={year}
                    onChange={(selected) => selected && setYear(selected)}
                    options={years}
                    placeholder="Select Year"
                  />

                  {/* Month Dropdown */}
                  <Select
                    className="w-full"
                    value={month}
                    onChange={(selected) => selected && setMonth(selected)}
                    options={months}
                    placeholder="Select Month"
                  />
                </div>
              ) : null}
            </>
          ) : (
            <div className="flex flex-col gap-4">
              {activeTab == "summary" ? (
                <div className={` w-[350px] transition-all`}>
                  {/* <label className=" block text-sm font-medium text-gray-700 mb-1">
                Marketing Representative
              </label> */}
                  <Select
                    options={options}
                    onChange={handleChange}
                    value={options?.find((opt) => opt.value === selectMr)}
                    placeholder="Select the marketing representative"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    isClearable
                  />
                </div>
              ) : (
                <div className={` w-[350px] transition-all`}>
                  {/* <label className=" block text-sm font-medium text-gray-700 mb-1">
                    Search
                  </label> */}
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search"
                    className="p-2 border border-gray-400 w-full rounded-md"
                  />
                </div>
              )}
              <div className="flex items-center space-x-4">
                <DatePicker
                  label="From"
                  value={fromDate}
                  onChange={setFromDate}
                />
                <DatePicker label="To" value={toDate} onChange={setToDate} />
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {activeTab == "marketing-rep-and-fabricator" ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6  px-4 py-4">
                <StatCard
                  title="Approved"
                  value={reports?.approved}
                  icon={<FaRegCircleCheck className="text-black" />}
                  color="green"
                />
                <StatCard
                  title="Pending"
                  value={reports?.pending}
                  icon={<MdOutlinePending className="text-black" />}
                  color="blue"
                />
                <StatCard
                  title="Rejected"
                  value={reports?.rejected}
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
                              {record?.marketing_rep_name
                                ?.charAt(0)
                                .toUpperCase()}
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
          ) : activeTab == "missing-report" ? (
            <MissingReport
              year={year}
              month={month}
              debouncedSearchTerm={debouncedSearchTerm}
              currentPage={currentPage}
              handlePageChange={handlePageChange}
              selectMr={selectMr}
              activeTab={activeTab}
              handleViewRecord={handleViewRecord}
            />
          ) : activeTab !== "summary" ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Serial No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {activeTab === "fabricators"
                      ? "Fabricator"
                      : activeTab === "marketing_representatives"
                      ? "Distributor"
                      : activeTab === "marketing-rep-and-fabricator"
                      ? "Marketing Representatives"
                      : "Summary"}
                  </th>
                  {activeTab == "fabricators" ? (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fabricator Institution
                    </th>
                  ) : null}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Marketing Rep.
                  </th>

                  {activeTab == "summary" ? null : (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Invoice No.
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </>
                  )}

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports?.results?.map((record, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {currentPage * reports?.page_size +
                          index +
                          1 -
                          reports?.page_size}
                      </div>
                    </td>
                    {activeTab === "fabricators" ? (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center bg-primary`}
                          >
                            <span className="text-white font-semibold">
                              {record?.fabricator_name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {record?.fabricator_name}
                          </div>
                        </div>
                      </td>
                    ) : (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center bg-primary`}
                          >
                            <span className="text-white font-semibold">
                              {record?.distributor_name
                                ?.charAt(0)
                                .toUpperCase()}
                            </span>
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {record?.distributor_name}
                          </div>
                        </div>
                      </td>
                    )}
                    {activeTab == "fabricators" ? (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {record?.fabricator_institution}
                        </div>
                      </td>
                    ) : null}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {activeTab == "summary"
                          ? record?.total_amount
                          : record?.amount}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {record?.marketing_rep_name}
                      </div>
                    </td>

                    {activeTab == "summary" ? null : (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {record?.invoice_number}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {record.sales_date}
                          </div>
                        </td>
                      </>
                    )}

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-3">
                      <button
                        onClick={() => handleViewRecord(record)}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 cursor-pointer"
                      >
                        View
                      </button>
                      <button
                        onClick={() => {
                          deleteReport({ id: record?.id });
                        }}
                        className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            // Summary Table
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Serial No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fabricator Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fabricator Mobile Num
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fabricator Thana Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fabricator District
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fabricator Registration Num
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Distributor Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Distributor Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Distributor District
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Distributor Thana
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Marketing Rep Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Marketing Rep Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Marketing Rep District
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Marketing Rep Thana
                  </th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Marketing Rep.
                  </th> */}

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports?.results?.map((record, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {currentPage * reports?.page_size +
                          index +
                          1 -
                          reports?.page_size}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {record?.fabricator__name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {record?.fabricator__phone_number}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {record?.fabricator__sub_district}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {record?.fabricator__district}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {record?.fabricator__registration_number}
                      </div>
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center bg-primary`}
                        >
                          <span className="text-white font-semibold">
                            {record?.fabricator__name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="text-sm ">
                          <p>
                            <span className="font-bold">Name: </span>{" "}
                            {record?.fabricator__name}
                          </p>
                          <p>
                            <span className="font-bold">Registration No: </span>{" "}
                            {record?.fabricator__registration_number}
                          </p>
                          <p>
                            <span className="font-bold">Phone No: </span>{" "}
                            {record?.fabricator__phone_number}
                          </p>
                          <p>
                            <span className="font-bold">District: </span>{" "}
                            {record?.fabricator__district}
                          </p>
                          <p>
                            <span className="font-bold">Thana: </span>{" "}
                            {record?.fabricator__sub_district}
                          </p>
                        </div>
                      </div>
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {record?.distributor_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {record?.distributor_phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {record?.distributor_district}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {record?.distributor_sub_district}
                      </div>
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center bg-primary`}
                        >
                          <span className="text-white font-semibold">
                            {record?.distributor_name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="text-sm ">
                          <p>
                            <span className="font-bold">Name: </span>{" "}
                            {record?.distributor_name}
                          </p>

                          <p>
                            <span className="font-bold">Phone No: </span>{" "}
                            {record?.distributor_phone}
                          </p>
                          <p>
                            <span className="font-bold">District: </span>{" "}
                            {record?.distributor_district}
                          </p>
                          <p>
                            <span className="font-bold">Thana: </span>{" "}
                            {record?.distributor_sub_district}
                          </p>
                        </div>
                      </div>
                    </td> */}

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {record?.marketing_rep_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {record?.marketing_rep_phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {record?.marketing_rep_district}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {record?.marketing_rep_sub_district}
                      </div>
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center bg-primary`}
                        >
                          <span className="text-white font-semibold">
                            {record?.marketing_rep_name
                              ?.charAt(0)
                              .toUpperCase()}
                          </span>
                        </div>
                        <div className="text-sm ">
                          <p>
                            <span className="font-bold">Name: </span>{" "}
                            {record?.marketing_rep_name}
                          </p>

                          <p>
                            <span className="font-bold">Phone No: </span>{" "}
                            {record?.marketing_rep_phone}
                          </p>
                          <p>
                            <span className="font-bold">District: </span>{" "}
                            {record?.marketing_rep_district}
                          </p>
                          <p>
                            <span className="font-bold">Thana: </span>{" "}
                            {record?.marketing_rep_sub_district}
                          </p>
                        </div>
                      </div>
                    </td> */}

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {record?.total_amount}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {activeTab !== "missing-report" ? (
        <div className="border-t border-t-gray-200">
          <Pagination
            currentPage={currentPage}
            totalPages={
              activeTab == "marketing-rep-and-fabricator"
                ? Math.ceil(reports?.data?.count / reports?.data?.page_size)
                : Math.ceil(reports?.count / reports?.page_size)
            }
            onPageChange={handlePageChange}
          />
        </div>
      ) : null}

      {/* Report Details Modal */}
      {selectedRecord?.id && activeTab !== "marketing-rep-and-fabricator" ? (
        <ReportDetails
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          record={selectedRecord}
          reportActiveTab={activeTab}
        />
      ) : null}
      {selectedRecord?.id && activeTab == "marketing-rep-and-fabricator" ? (
        <ReportDetailsMarketingRep
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          record={selectedRecord}
          reportActiveTab={activeTab}
        />
      ) : null}
    </div>
  );
};

export default Reports;
