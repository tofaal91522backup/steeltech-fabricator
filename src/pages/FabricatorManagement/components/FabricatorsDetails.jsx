"use client";

import { useEffect, useState } from "react";
import Modal from "../../../components/Modal";
import {
  useChangeStatusMutation,
  useGetFabricatorByIdQuery,
} from "../../../features/fabricartorApi/fabricartorApi";
import { useModalContext } from "../../../context/ModalContext";

const FabricatorsDetails = ({ isOpen, onClose, fabricator }) => {
  const [activeTab, setActiveTab] = useState("personal");
  const [previewImage, setPreviewImage] = useState(null);

  const { data: fabricatorDetails } = useGetFabricatorByIdQuery({
    id: fabricator?.id,
  });

  const { dispatch: modalDispatch } = useModalContext();

  const [changeStatus, { data, isSuccess, isError }] =
    useChangeStatusMutation();

  useEffect(() => {
    if (isSuccess || isError) {
      onClose();
      modalDispatch({
        type: "success",
        payload: data?.message,
      });
    }
  }, [isSuccess, isError]);


  if (!fabricator) return null;

  const tabs = [
    { id: "personal", label: "Personal Info" },
    { id: "documents", label: "Documents" },
    // { id: "application", label: "Distributor Info" },
    { id: "mar", label: "Marketing Representative" },
  ];

  const handleApprove = () => {
    // Add approval logic here
    // onClose();
    changeStatus({
      data: {
        id: fabricatorDetails?.id,
        status: "approved",
      },
    });
  };

  const handleReject = () => {
    // Add rejection logic here
    // onClose();
    changeStatus({
      data: {
        id: fabricatorDetails?.id,
        status: "rejected",
      },
    });
  };

  const renderPersonalInfo = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <label className="block text-md text-gray-700 mb-1 font-bold">
            Full Name
          </label>
          <p className="text-gray-900">{fabricatorDetails?.name}</p>
        </div>
        <div>
          <label className="block text-md text-gray-700 mb-1 font-bold">
            Institution
          </label>
          <p className="text-gray-900">{fabricatorDetails?.institution}</p>
        </div>
        <div>
          <label className="block text-md text-gray-700 mb-1 font-bold">
            Area
          </label>
          <p className="text-gray-900">
            {fabricatorDetails?.sub_district}, {fabricatorDetails?.sub_district}
          </p>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-md text-gray-700 mb-1 font-bold">
            Registration No.
          </label>
          <p className="text-gray-900">
            {fabricatorDetails?.registration_number}
          </p>
        </div>
        <div>
          <label className="block text-md text-gray-700 mb-1 font-bold">
            Phone Number
          </label>
          <p className="text-gray-900">{fabricatorDetails?.phone_number}</p>
        </div>
        <div>
          <label className="block text-md text-gray-700 mb-1 font-bold">
            Business Address
          </label>
          <p className="text-gray-900">{fabricatorDetails?.address}</p>
        </div>
      </div>
    </div>
  );

  const renderDocumentCard = (title, url) => (
    <div className="border rounded-lg p-4" key={title}>
      <h4 className="font-medium text-gray-900 mb-2">{title}</h4>
      <button
        type="button"
        onClick={() => setPreviewImage({ url, title })}
        className="block w-full rounded overflow-hidden bg-gray-50 cursor-zoom-in group"
      >
        <img
          src={url}
          alt={title}
          className="w-full h-40 object-cover group-hover:opacity-90 transition-opacity"
        />
      </button>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {fabricatorDetails?.trade_license_img_url
          ? renderDocumentCard(
              "Trade License",
              fabricatorDetails.trade_license_img_url
            )
          : null}

        {fabricatorDetails?.visiting_card_img_url
          ? renderDocumentCard(
              "Business Certificate",
              fabricatorDetails.visiting_card_img_url
            )
          : null}

        {fabricatorDetails?.profile_img_url
          ? renderDocumentCard(
              "Profile Image",
              fabricatorDetails.profile_img_url
            )
          : null}
      </div>
      {/* <div className="border rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Additional Documents</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <span className="text-sm text-gray-900">visiting_card.jpg</span>
            <button className="text-blue-600 hover:text-blue-800 text-sm">
              View
            </button>
          </div>
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <span className="text-sm text-gray-900">business_photo.jpg</span>
            <button className="text-blue-600 hover:text-blue-800 text-sm">
              View
            </button>
          </div>
        </div>
      </div> */}
    </div>
  );

  const renderApplication = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-md text-gray-700 mb-1 font-bold">
            Application Date
          </label>
          <p className="text-gray-900">
            {fabricatorDetails?.distributor?.created_at?.slice(0, 10)}
          </p>
        </div>
        <div>
          <label className="block text-md text-gray-700 mb-1 font-bold">
            Distributor
          </label>
          <div>
            <p className="text-gray-900">
              <span className="font-bold">Name: </span>
              {fabricatorDetails?.distributor?.name}
            </p>
            <p className="text-gray-900">
              <span className="font-bold">Email: </span>
              {fabricatorDetails?.distributor?.email}
            </p>
            <p className="text-gray-900">
              <span className="font-bold">Phone: </span>
              {fabricatorDetails?.distributor?.phone_number}
            </p>
            <p className="text-gray-900">
              <span className="font-bold">District: </span>
              {fabricatorDetails?.distributor?.sub_district},{" "}
              {fabricatorDetails?.distributor?.district}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
  const renderMarketingRep = () =>
    !fabricatorDetails?.marketing_representative ? (
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
              {fabricatorDetails?.marketing_representative.created_at?.slice(
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
                {fabricatorDetails?.marketing_representative?.name}
              </p>
              <p className="text-gray-900">
                <span className="font-bold">Email: </span>
                {fabricatorDetails?.marketing_representative?.email}
              </p>
              <p className="text-gray-900">
                <span className="font-bold">Phone: </span>
                {fabricatorDetails?.marketing_representative?.phone_number}
              </p>
              <p className="text-gray-900">
                <span className="font-bold">District: </span>
                {
                  fabricatorDetails?.marketing_representative?.sub_district
                }, {fabricatorDetails?.marketing_representative?.district}
              </p>
            </div>
          </div>
        </div>
      </div>
    );

  const renderTabContent = () => {
    switch (activeTab) {
      case "personal":
        return renderPersonalInfo();
      case "documents":
        return renderDocuments();
      case "application":
        return renderApplication();
      case "mar":
        return renderMarketingRep();
      default:
        return renderPersonalInfo();
    }
  };

  return (
    <>
    <Modal isOpen={isOpen} onClose={onClose} title="Fabricator Details">
      {/* Tabs */}
      <div className="border-b mb-6">
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

      {/* Tab Content */}
      <div className="mb-8">{renderTabContent()}</div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t">
        <div className="flex space-x-3">
          <button
            onClick={handleApprove}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 font-medium cursor-pointer"
          >
            Approve Application
          </button>
          <button
            onClick={handleReject}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-medium cursor-pointer"
          >
            Reject Application
          </button>
          {/* <button
            onClick={handleReassign}
            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 font-medium"
          >
            Reassign
          </button> */}
        </div>
        <button
          onClick={onClose}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 font-medium cursor-pointer"
        >
          Close
        </button>
      </div>
    </Modal>

    {previewImage ? (
      <div
        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4"
        onClick={() => setPreviewImage(null)}
      >
        <div
          className="relative max-w-4xl w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => setPreviewImage(null)}
            className="absolute -top-10 right-0 text-white hover:text-gray-300 cursor-pointer"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <img
            src={previewImage.url}
            alt={previewImage.title}
            className="max-w-full max-h-[85vh] mx-auto rounded-lg shadow-2xl object-contain"
          />
          <p className="text-center text-white mt-2 text-sm">
            {previewImage.title}
          </p>
        </div>
      </div>
    ) : null}
    </>
  );
};

export default FabricatorsDetails;
