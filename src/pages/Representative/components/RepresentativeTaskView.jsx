import Modal from "../../../components/Modal";
import { useViewTaskQuery } from "../../../features/MarRepApi/MarRepApi";

const RepresentativeTaskView = ({ isOpen, onClose, representative }) => {
  const { data: tasks } = useViewTaskQuery({
    id: representative?.id,
  });

  console.log("tasks", tasks);
  if (!representative) return null;

  // const handleEdit = () => {
  //   onEdit(representative);
  //   onClose();
  // };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-6">
        {/* Header with Avatar and Name */}
        <div className="flex items-center space-x-4 pb-4 border-b">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center bg-primary`}
          >
            <span className="text-white font-bold text-xl">
              {representative.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {representative.name}
            </h2>
            <p className="text-gray-600">Marketing Representative Tasks</p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 gap-6">
          {tasks?.results?.length ? (
            tasks?.results?.map((task) => (
              <div className="px-3 py-4 bg-gray-100 rounded-md ">
                <p>
                  <span className="font-bold">Task:</span> {task?.description}
                </p>
                <p>
                  <span className="font-bold">Status:</span> {task?.status}
                </p>
              </div>
            ))
          ) : (
            <div className="py-4">
              <h2>No Task Found</h2>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-6 border-t">
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

export default RepresentativeTaskView;
