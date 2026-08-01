"use client";

import { useEffect, useState } from "react";
import FabricatorsDetails from "./components/FabricatorsDetails";
import {
  useChangeStatusMutation,
  useGetAllFabricatorsQuery,
} from "../../features/fabricartorApi/fabricartorApi";
import FabricatorsAssign from "./components/FabricatorsAssign";
import { Link } from "react-router-dom";
import Pagination from "../../components/Pagination";
import { useModalContext } from "../../context/ModalContext";
import { useDispatch } from "react-redux";
import { adminLoggedOut } from "../../features/auth/adminAuthSlice";

const FabricatorManagement = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedFabricator, setSelectedFabricator] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Update debounced value after 500ms delay
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms debounce

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { dispatch: modalDispatch } = useModalContext();

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const { data: fabricators, error } = useGetAllFabricatorsQuery({
    page: currentPage,
    view: activeTab,
    searchTerm: debouncedSearchTerm,
  });

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(adminLoggedOut());
  };

  useEffect(() => {
    if (error?.status == 401) {
      handleLogout();
    }
  }, [error]);

  const [changeStatus, { data, isSuccess, isError }] =
    useChangeStatusMutation();

  const handleApprove = (id) => {
    // Add approval logic here
    // onClose();
    changeStatus({
      data: {
        id,
        status: "approved",
      },
    });
  };

  const handleReject = (id) => {
    // Add rejection logic here
    // onClose();
    changeStatus({
      data: {
        id,
        status: "rejected",
      },
    });
  };


  const tabs = [
    { id: "all", label: "All", count: 156 },
    { id: "pending", label: "Pending", count: 156 },
    { id: "approved", label: "Approved", count: 89 },
    { id: "rejected", label: "Rejected", count: 23 },
    { id: "assigned", label: "Assigned", count: 44 },
  ];

  const handleViewFabricator = (fabricator) => {
    setSelectedFabricator(fabricator);
    setIsModalOpen(true);
  };
  const handleAssingMR = (fabricator) => {
    setSelectedFabricator(fabricator);
    setIsAssignModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsAssignModalOpen(false);
    setSelectedFabricator(null);
  };

  useEffect(() => {
    if (isSuccess || isError) {
      handleCloseModal();
      modalDispatch({
        type: "success",
        payload: data?.message,
      });
    }
  }, [isSuccess, isError]);

  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-800",
    rejected: "bg-red-100 text-red-800",
    assigned: "bg-blue-100 text-blue-800",
    approved: "bg-green-100 text-green-800",
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow">
        {/* Header */}
        <div className="p-6 border-b border-b-gray-200 flex items-center justify-between">
          <h2 className="w-full text-xl font-semibold text-gray-900">
            Fabricator Applications
          </h2>
          <div className="w-full text-center ">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Fabricator"
              className="border border-gray-200 w-[300px] p-2 rounded-md"
            />
          </div>
          <Link to="/fabricator-registration" className="w-full text-right">
            <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 font-medium cursor-pointer">
              Add Fabricator
            </button>
          </Link>
        </div>

        {/* Tabs */}
        <div className="border-b border-b-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
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
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Institution
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reg No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
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
              {fabricators?.results?.map((fabricator, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {/* <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {currentPage * 10 + index + 1 - 10}
                    </div>
                  </td> */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {fabricator.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {fabricator.institution}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {fabricator.registration_number}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {fabricator.created_at?.slice(0, 10)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-2">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize  ${
                          statusStyles[fabricator.status] ||
                          "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {fabricator.status}
                      </span>
                      {activeTab === "approved" && fabricator?.assigned ? (
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize  ${
                            statusStyles["assigned"] ||
                            "bg-gray-100 text-gray-800"
                          }`}
                        >
                          Assigned
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleViewFabricator(fabricator)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-xs cursor-pointer hover:bg-blue-600"
                    >
                      View
                    </button>
                    {activeTab == "approved" ? (
                      <button
                        className="bg-green-800 text-white px-3 py-1 rounded text-xs cursor-pointer hover:bg-green-900"
                        onClick={() => handleAssingMR(fabricator)}
                      >
                        Assign
                      </button>
                    ) : null}
                    {activeTab !== "approved" && activeTab !== "assigned" ? (
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded text-xs cursor-pointer hover:bg-green-600"
                        onClick={() => handleApprove(fabricator?.id)}
                      >
                        Approve
                      </button>
                    ) : null}
                    {activeTab == "rejected" ||
                    activeTab == "assigned" ? null : (
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded text-xs cursor-pointer hover:bg-red-600"
                        onClick={() => handleReject(fabricator?.id)}
                      >
                        Reject
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
            totalPages={Math.ceil(fabricators?.count / 10)}
            onPageChange={handlePageChange}
          />
        </div>
        {selectedFabricator?.id ? (
          <FabricatorsDetails
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            fabricator={selectedFabricator}
          />
        ) : null}
        <FabricatorsAssign
          isOpen={isAssignModalOpen}
          onClose={handleCloseModal}
          fabricator={selectedFabricator}
        />
      </div>
    </div>
  );
};

export default FabricatorManagement;
