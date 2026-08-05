import { useState } from "react";
import Modal from "../../../components/Modal";
import { useGetDistributorByIdQuery } from "../../../features/distributorApi/distributorApi";

const DistributorDetails = ({ isOpen, onClose, distributor }) => {
  const { data: DistributorDetails } = useGetDistributorByIdQuery({
    id: distributor?.id,
  });

  const [activeTab, setActiveTab] = useState("personal");

  const tabs = [
    { id: "personal", label: "Personal Info" },
    { id: "mar", label: "Marketing Representative" },
  ];

  if (!distributor) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-6">
        {/* Header with Avatar and Name */}
        <div className="flex items-center space-x-4 pb-4 border-b border-b-gray-200">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center bg-primary`}
          >
            <span className="text-white font-bold text-xl">
              {DistributorDetails?.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {DistributorDetails?.name}
            </h2>
            <p className="text-gray-600">Distributor</p>
          </div>
        </div>

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
        {activeTab === "personal" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-md font-bold text-gray-700 mb-1">
                  Email Address
                </label>
                <p className="text-gray-900">{DistributorDetails?.email}</p>
              </div>
              <div>
                <label className="block text-md font-bold text-gray-700 mb-1">
                  Phone Number
                </label>
                <p className="text-gray-900">
                  {DistributorDetails?.phone_number}
                </p>
              </div>
              <div>
                <label className="block text-md font-bold text-gray-700 mb-1">
                  District
                </label>
                <p className="text-gray-900">{DistributorDetails?.district}</p>
              </div>
              <div>
                <label className="block text-md font-bold text-gray-700 mb-1">
                  Sub District
                </label>
                <p className="text-gray-900">
                  {DistributorDetails?.sub_district}
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-md font-bold text-gray-700 mb-1">
                  Join Date
                </label>
                <p className="text-gray-900">
                  {DistributorDetails?.created_at?.slice(0, 10)}
                </p>
              </div>
            </div>
          </div>
        ) : null}
        {activeTab === "mar" ? (
          !DistributorDetails?.marketing_representative ? (
            <div>
              <h2>No marketing representative assigned</h2>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-md text-gray-700 mb-1 font-bold">
                    Application Date
                  </label>
                  <p className="text-gray-900">
                    {DistributorDetails?.marketing_representative.created_at?.slice(
                      0,
                      10
                    )}
                  </p>
                </div>
                <div>
                  <label className="block text-md text-gray-700 mb-1 font-bold">
                    Marketing Representative
                  </label>
                  <div>
                    <p className="text-gray-900">
                      <span className="font-bold">Name: </span>
                      {DistributorDetails?.marketing_representative?.name}
                    </p>
                    <p className="text-gray-900">
                      <span className="font-bold">Email: </span>
                      {DistributorDetails?.marketing_representative?.email}
                    </p>
                    <p className="text-gray-900">
                      <span className="font-bold">Phone: </span>
                      {
                        DistributorDetails?.marketing_representative
                          ?.phone_number
                      }
                    </p>
                    <p className="text-gray-900">
                      <span className="font-bold">District: </span>
                      {
                        DistributorDetails?.marketing_representative
                          ?.sub_district
                      }
                      , {DistributorDetails?.marketing_representative?.district}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
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
            Edit Distributor
          </button> */}
        </div>
      </div>
    </Modal>
  );
};

export default DistributorDetails;
