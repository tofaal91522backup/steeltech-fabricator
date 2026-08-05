"use client";

import { useEffect, useState } from "react";
import DistributorDetails from "./components/DistributorDetails";
import AddDistributor from "./components/AddDistributor";
import Pagination from "../../components/Pagination";
import {
  useDeleteDistributorMutation,
  useGetDistributorsQuery,
} from "../../features/distributorApi/distributorApi";
import { useDispatch } from "react-redux";
import { adminLoggedOut } from "../../features/auth/adminAuthSlice";

const Distributors = () => {
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

  const { data: allDistributors, error } = useGetDistributorsQuery({
    page: currentPage,
    searchTerm: debouncedSearchTerm,
  });
  const [deleteDistributor] = useDeleteDistributorMutation();

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
  const [selectedDistributor, setSelectedDistributor] = useState(null);
  // const [currentPage, setCurrentPage] = useState(1);

  // const itemsPerPage = 10;
  // const totalPages = 68; // As shown in the pagination

  const handleViewDistributor = (distributor) => {
    setSelectedDistributor(distributor);
    setIsDetailsModalOpen(true);
  };

  const handleEditDistributor = (distributor) => {
    setEditDistributor(distributor);
    setIsAddModalOpen(true);
  };

  // const handlePageChange = (page) => {
  //   setCurrentPage(page);
  // };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow">
        {/* Header */}
        <div className="p-6 border-b border-b-gray-200 flex items-center justify-between">
          <h2 className="w-full text-xl font-semibold text-gray-900">
            Distributors
          </h2>
          <div className="w-full text-center ">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Distributor"
              className="border border-gray-200 w-[300px] p-2 rounded-md"
            />
          </div>
          <div className="w-full text-right">
            <button
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 font-medium cursor-pointer"
              onClick={() => setIsAddModalOpen(true)}
            >
              Add Distributor
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Distributor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  District
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thana
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Added
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allDistributors?.results?.map((distributor, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center bg-primary`}
                      >
                        <span className="text-white font-semibold">
                          {distributor.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {distributor.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {distributor.phone_number}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {distributor.district}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {distributor.sub_district}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {distributor.created_at?.slice(0, 10)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-3 items-center">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 cursor-pointer"
                      onClick={() => handleViewDistributor(distributor)}
                    >
                      View
                    </button>
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 cursor-pointer"
                      onClick={() => handleEditDistributor(distributor)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 cursor-pointer"
                      onClick={() => deleteDistributor({ id: distributor?.id })}
                    >
                      Delete
                    </button>
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
            totalPages={Math.ceil(allDistributors?.count / 10)}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {/* Modals */}
      <AddDistributor
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditDistributor(null);
        }}
        initialData={editDistributor}
        mode={editDistributor ? "edit" : "add"}
      />

      {selectedDistributor?.id ? (
        <DistributorDetails
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          distributor={selectedDistributor}
          onEdit={handleEditDistributor}
        />
      ) : null}
    </div>
  );
};

export default Distributors;
