import React, { useEffect, useState } from "react";
import Modal from "../../../components/Modal";
import {
  useAssignMrMutation,
  useGetAllMRQuery,
} from "../../../features/fabricartorApi/fabricartorApi";
import { useModalContext } from "../../../context/ModalContext";

export default function FabricatorsAssign({ isOpen, onClose, fabricator }) {
  const [selectMr, setSelectMr] = useState();
  const { data } = useGetAllMRQuery();

  const [assignMr, { data: assignData, isLoading, isSuccess, error, isError }] =
    useAssignMrMutation();


  const { dispatch: modalDispatch } = useModalContext();

  useEffect(() => {
    if (isSuccess) {
      modalDispatch({
        type: "success",
        payload: "Fabricator is assign to a Marketing Representative",
      });
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

  const handleAssignMr = () => {
    assignMr({
      data: {
        id: fabricator?.id,
        marketing_rep_id: selectMr,
      },
    });
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Fabricator Details">
      {/* Tab Content */}
      <div className="mb-8">
        <p className="text-xl pb-3">Select Marketing Representative</p>
        {data?.data?.map((record) => (
          <div className="flex gap-3 items-center">
            <input
              type="checkbox"
              name={`mr-${record?.id}`}
              id={`mr-${record?.id}`}
              value={record?.id}
              checked={selectMr == record?.id}
              onChange={(e) => setSelectMr(e.target.value)}
            />
            <label htmlFor={`mr-${record?.id}`}>{record?.name}</label>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t">
        <div className="flex space-x-3">
          <button
            disabled={isLoading}
            onClick={handleAssignMr}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 font-medium cursor-pointer"
          >
            {isLoading ? "Processing" : "Assign Marketing Representer"}
          </button>
        </div>
        <button
          onClick={onClose}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 font-medium cursor-pointer"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}
