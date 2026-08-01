import { useEffect, useState } from "react";
import Modal from "../../../components/Modal";
import {
  useAddDistributorToMRMutation,
  useAddFabricatorToMRMutation,
  useDeleteDisFromMRMutation,
  useDeleteFabFromMRMutation,
  useGetMarketingRepByIdQuery,
  useViewAllFabricatorListQuery,
  useViewAssignedDistributorQuery,
  useViewMarketingFabricatorQuery,
} from "../../../features/MarRepApi/MarRepApi";
import { useGetAllDistributorForRegQuery } from "../../../features/fabricartorApi/fabricartorApi";
import { useModalContext } from "../../../context/ModalContext";
import AssignDistributor from "./AssignDistributor";
import AssignFabricator from "./AssignFabricator";
import { FaTrash } from "react-icons/fa";
import Pagination from "../../../components/Pagination";

const RepresentativeDetails = ({ isOpen, onClose, representative }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageFab, setCurrentPageFab] = useState(1);
  const { data: representativeDetails } = useGetMarketingRepByIdQuery({
    id: representative?.id,
  });
  const { data: marketingFab } = useViewMarketingFabricatorQuery({
    id: representative?.id,
    page: currentPageFab,
  });
  const { data: assignedDistributor } = useViewAssignedDistributorQuery({
    id: representative?.id,
    page: currentPage,
  });

  const [selectMr, setSelectMr] = useState([]);
  const [selectFab, setSelectFab] = useState([]);
  const { data } = useGetAllDistributorForRegQuery();
  const { data: allFabricators } = useViewAllFabricatorListQuery();
 
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageChangeFab = (page) => {
    setCurrentPageFab(page);
  };

  const { dispatch: modalDispatch } = useModalContext();

  const [addDistributorToMR, { isLoading, isSuccess, error, isError }] =
    useAddDistributorToMRMutation();
  const [
    deleteFabFromMR,
    // {
    //   isLoading: isLoadingDeleteFab,
    //   isSuccess: isSuccessDeleteFab,
    //   error: errorDeleteFab,
    //   isError: isErrorDeleteFab,
    // },
  ] = useDeleteFabFromMRMutation();
  const [deleteDisFromMR] = useDeleteDisFromMRMutation();

  const [
    addFabricatorToMR,
    {
      isLoading: isLoadingAddFab,
      isSuccess: isSuccessAddFab,
      error: errorAddFab,
      isError: isErrorAddFab,
    },
  ] = useAddFabricatorToMRMutation();

  useEffect(() => {
    if (isSuccess) {
      modalDispatch({
        type: "success",
        payload: "Fabricator is assign to a Marketing Representative",
      });
      setSelectMr([]);
      onClose();
    }
    if (isError) {
      modalDispatch({
        type: "open",
        payload: error?.data?.message,
      });
      onClose();
    }
  }, [isSuccess, isError]);

  useEffect(() => {
    if (isSuccessAddFab) {
      modalDispatch({
        type: "success",
        payload: "Fabricator is assign to a Marketing Representative",
      });
      setSelectFab([]);
      onClose();
    }
    if (isError) {
      modalDispatch({
        type: "open",
        payload: errorAddFab?.data?.message,
      });
      onClose();
    }
  }, [isSuccessAddFab, isErrorAddFab]);

  const handleAddDistributorToMR = () => {
    addDistributorToMR({
      id: representative?.id,
      data: {
        distributors: selectMr,
      },
    });
  };
  const handleAddFabricatorToMR = () => {
    addFabricatorToMR({
      id: representative?.id,
      data: {
        fabricators: selectFab,
      },
    });
  };

  const handleRemoveFabricator = (fabId) => {
    deleteFabFromMR({
      repId: representative?.id,
      fabId,
    });
  };
  const handleRemoveDistributor = (disId) => {
    deleteDisFromMR({
      repId: representative?.id,
      disId,
    });
  };

  const [activeTab, setActiveTab] = useState("personal");

  const tabs = [
    { id: "personal", label: "Info" },
    { id: "fabricators", label: "Fabricators" },
    { id: "distributors", label: "Distributors" },
    { id: "assign_fabricator", label: "Assign Fabricator" },
    { id: "assign", label: "Assign Distributor" },
  ];

  if (!representative) return null;

  // const handleEdit = () => {
  //   onEdit(representative);
  //   onClose();
  // };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-6">
        {/* Header with Avatar and Name */}
        <div className="flex items-center space-x-4 pb-4 border-b border-b-gray-200">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center bg-primary`}
          >
            <span className="text-white font-bold text-xl">
              {representativeDetails?.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {representativeDetails?.name}
            </h2>
            <p className="text-gray-600">Marketing representativeDetails</p>
          </div>
        </div>

        {/* Tabs */}
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
        {activeTab == "personal" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-md font-bold text-gray-700 mb-1">
                  Email Address
                </label>
                <p className="text-gray-900">{representativeDetails?.email}</p>
              </div>
              <div>
                <label className="block text-md font-bold text-gray-700 mb-1">
                  Phone Number
                </label>
                <p className="text-gray-900">
                  {representativeDetails?.phone_number}
                </p>
              </div>
              <div>
                <label className="block text-md font-bold text-gray-700 mb-1">
                  Territory
                </label>
                <p className="text-gray-900">
                  {representativeDetails?.sub_district},{" "}
                  {representativeDetails?.district}
                </p>
              </div>
              <div>
                <label className="block text-md font-bold text-gray-700 mb-1">
                  Employee ID
                </label>
                <p className="text-gray-900">
                  {representativeDetails?.employee_id}
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-md font-bold text-gray-700 mb-1">
                  Total Fabricator
                </label>
                <p className="text-3xl font-bold text-gray-900">
                  {representativeDetails?.assigned_fabricators_count}
                </p>
              </div>
              <div>
                <label className="block text-md font-bold text-gray-700 mb-1">
                  Total Distributor
                </label>
                <p className="text-3xl font-bold text-gray-900">
                  {representativeDetails?.assigned_distributors_count}
                </p>
              </div>
              <div>
                <label className="block text-md font-bold text-gray-700 mb-1">
                  Join Date
                </label>
                <p className="text-gray-900">
                  {representativeDetails?.created_at?.slice(0, 10)}
                </p>
              </div>
            </div>
          </div>
        ) : activeTab == "fabricators" ? (
          <div className="flex flex-col gap-3">
            {marketingFab?.results?.length ? (
              marketingFab?.results?.map((fab) => (
                <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 border border-gray-200 rounded-md p-4">
                  <FaTrash
                    className="absolute top-3 right-3 fill-red-500 cursor-pointer"
                    onClick={() => handleRemoveFabricator(fab?.id)}
                  />
                  <div className="space-y-4">
                    <div>
                      <label className="block text-md text-gray-700 mb-1 font-bold">
                        Full Name
                      </label>
                      <p className="text-gray-900">{fab?.name}</p>
                    </div>
                    <div>
                      <label className="block text-md text-gray-700 mb-1 font-bold">
                        Institution
                      </label>
                      <p className="text-gray-900">{fab?.institution}</p>
                    </div>
                    <div>
                      <label className="block text-md text-gray-700 mb-1 font-bold">
                        Area
                      </label>
                      <p className="text-gray-900">
                        {fab?.sub_district}, {fab?.sub_district}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-md text-gray-700 mb-1 font-bold">
                        Registration No.
                      </label>
                      <p className="text-gray-900">
                        {fab?.registration_number}
                      </p>
                    </div>
                    <div>
                      <label className="block text-md text-gray-700 mb-1 font-bold">
                        Phone Number
                      </label>
                      <p className="text-gray-900">{fab?.phone_number}</p>
                    </div>
                    <div>
                      <label className="block text-md text-gray-700 mb-1 font-bold">
                        Business Address
                      </label>
                      <p className="text-gray-900">{fab?.address}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div>
                <h2>No fabricators found</h2>
              </div>
            )}
            <div className="border-t border-t-gray-200">
              <Pagination
                currentPage={currentPageFab}
                totalPages={Math.ceil(marketingFab?.count / 10)}
                onPageChange={handlePageChangeFab}
              />
            </div>
          </div>
        ) : activeTab == "distributors" ? (
          <div className="flex flex-col gap-3">
            {assignedDistributor?.results?.length ? (
              assignedDistributor?.results?.map((distributor) => (
                <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 border border-gray-200 rounded-md p-4">
                  <FaTrash
                    className="absolute top-3 right-3 fill-red-500 cursor-pointer"
                    onClick={() => handleRemoveDistributor(distributor?.id)}
                  />
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-md font-bold text-gray-700 mb-1">
                        Name
                      </label>
                      <p className="text-gray-900">{distributor.name}</p>
                    </div>
                    <div>
                      <label className="block text-md font-bold text-gray-700 mb-1">
                        Email Address
                      </label>
                      <p className="text-gray-900">{distributor.email}</p>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-md font-bold text-gray-700 mb-1">
                        District
                      </label>
                      <p className="text-gray-900">{distributor.district}</p>
                    </div>
                    <div>
                      <label className="block text-md font-bold text-gray-700 mb-1">
                        Sub District
                      </label>
                      <p className="text-gray-900">
                        {distributor.sub_district}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div>
                <h2>No assigned distributor found</h2>
              </div>
            )}
            <div className="border-t border-t-gray-200">
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(assignedDistributor?.count / 10)}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        ) : activeTab == "assign" ? (
          <AssignDistributor
            data={data}
            selectMr={selectMr}
            setSelectMr={setSelectMr}
            isLoading={isLoading}
            handleAddDistributorToMR={handleAddDistributorToMR}
          />
        ) : activeTab == "assign_fabricator" ? (
          <AssignFabricator
            data={allFabricators}
            selectFab={selectFab}
            setSelectFab={setSelectFab}
            isLoading={isLoadingAddFab}
            handleAddFabricatorToMR={handleAddFabricatorToMR}
          />
        ) : null}

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-t-gray-200">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 font-medium cursor-pointer"
          >
            Close
          </button>
          {/* <button
            onClick={handleEdit}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 font-medium"
          >
            Edit Representative
          </button> */}
        </div>
      </div>
    </Modal>
  );
};

export default RepresentativeDetails;
