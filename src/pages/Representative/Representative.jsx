"use client";

import { useEffect, useState } from "react";
import RepresentativeDetails from "./components/RepresentativeDetails";
import AddRepresentative from "./components/AddRepresentative";
import {
  useDeleteMarketingRepMutation,
  useGetMarketingRepQuery,
} from "../../features/MarRepApi/MarRepApi";
import RepresentativeTaskView from "./components/RepresentativeTaskView";
import RepresentativeAssignTask from "./components/RepresentativeAssignTask";
import Pagination from "../../components/Pagination";
import { useDispatch } from "react-redux";
import { adminLoggedOut } from "../../features/auth/adminAuthSlice";

const Representative = () => {
  const [editDistributor, setEditDistributor] = useState(null);
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const { data: allMarketingRep, error } = useGetMarketingRepQuery({
    page: currentPage,
    searchTerm: debouncedSearchTerm,
  });
  const [deleteMarketingRep, { isLoading }] = useDeleteMarketingRepMutation();

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(adminLoggedOut());
  };

  useEffect(() => {
    if (error?.status == 401) {
      handleLogout();
    }
  }, [error]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedRepresentative, setSelectedRepresentative] = useState(null);
  const [representativesList, setRepresentativesList] = useState([]);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const handleAddRepresentative = (newRep) => {
    setRepresentativesList([...representativesList, newRep]);
  };

  const handleViewRepresentative = (rep) => {
    setSelectedRepresentative(rep);
    setIsDetailsModalOpen(true);
  };
  const handleTaskViewRepresentative = (rep) => {
    setSelectedRepresentative(rep);
    setIsViewModalOpen(true);
  };
  const handleTaskAssignRepresentative = (rep) => {
    setSelectedRepresentative(rep);
    setIsAssignModalOpen(true);
  };

  const handleEditRepresentative = (distributor) => {
    setEditDistributor(distributor);
    setIsAddModalOpen(true);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow">
        {/* Header */}
        <div className="p-6 border-b border-b-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Marketing Representatives
          </h2>
          <div className="">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Marketing Representatives"
              className="border border-gray-200 w-[300px] p-2 rounded-md"
            />
          </div>
          <button
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 font-medium cursor-pointer"
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Representative
          </button>
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
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tasks
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allMarketingRep?.results.map((rep, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center bg-primary`}
                      >
                        <span className="text-white font-semibold">
                          {rep.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {rep.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {rep.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {rep.phone_number}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {rep.district}, {rep?.sub_district}
                    </div>
                  </td>

                  {/* <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(rep.status, rep.statusColor)}
                  </td> */}

                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {rep.created_at?.slice(0, 10)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-3 items-center">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 cursor-pointer "
                      onClick={() => handleViewRepresentative(rep)}
                    >
                      View
                    </button>
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 cursor-pointer"
                      onClick={() => handleEditRepresentative(rep)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 cursor-pointer"
                      disabled={isLoading}
                      onClick={() => deleteMarketingRep({ id: rep?.id })}
                    >
                      Delete
                    </button>
                  </td>
                  <td className="px-6 pb-4 ">
                    <div className="flex gap-3 items-center">
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 cursor-pointer "
                        onClick={() => handleTaskViewRepresentative(rep)}
                      >
                        View
                      </button>

                      <button
                        className="bg-amber-500 text-white px-3 py-1 rounded text-xs hover:bg-amber-600 cursor-pointer "
                        onClick={() => handleTaskAssignRepresentative(rep)}
                      >
                        Assign
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Pagination */}
      <div className="border-t border-t-gray-200">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(allMarketingRep?.count / 10)}
          onPageChange={handlePageChange}
        />
      </div>
      <AddRepresentative
        isOpen={isAddModalOpen}
        onAdd={handleAddRepresentative}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditDistributor(null);
        }}
        initialData={editDistributor}
        mode={editDistributor ? "edit" : "add"}
      />

      {selectedRepresentative?.id ? (
        <RepresentativeDetails
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          representative={selectedRepresentative}
          onEdit={handleEditRepresentative}
        />
      ) : null}
      {selectedRepresentative?.id ? (
        <RepresentativeTaskView
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          representative={selectedRepresentative}
        />
      ) : null}
      {selectedRepresentative?.id ? (
        <RepresentativeAssignTask
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          representative={selectedRepresentative}
        />
      ) : null}
    </div>
  );
};

export default Representative;
