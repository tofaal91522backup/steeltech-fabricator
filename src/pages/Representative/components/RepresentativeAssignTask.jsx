import React, { useEffect, useState } from "react";
import Modal from "../../../components/Modal";
import { useCreateMarketingRepTaskMutation } from "../../../features/MarRepApi/MarRepApi";
import { useModalContext } from "../../../context/ModalContext";

export default function RepresentativeAssignTask({
  isOpen,
  onClose,
  representative,
}) {
  const [description, setDescription] = useState("");

  const [
    createTask,
    { data: assignData, isLoading, isSuccess, error, isError },
  ] = useCreateMarketingRepTaskMutation();

  const { dispatch: modalDispatch } = useModalContext();

  useEffect(() => {
    if (isSuccess) {
      modalDispatch({
        type: "success",
        payload: "Task assigned successfully",
      });
      setTimeout(() => {
        onClose();
      }, 2000);
    }
    if (isError) {
      modalDispatch({
        type: "open",
        payload: error?.data?.message,
      });
    }
  }, [isSuccess, isError]);

  const handleAssignTask = () => {
    createTask({
      id: representative?.id,
      description,
    });
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign a task to marketing rep"
    >
      {/* Tab Content */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Task
        </label>
        <input
          type="text"
          name="name"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Task Description"
          required
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 ">
        <div className="flex space-x-3">
          <button
            disabled={isLoading}
            onClick={handleAssignTask}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 font-medium cursor-pointer"
          >
            {isLoading ? "Processing" : "Assign Task"}
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
