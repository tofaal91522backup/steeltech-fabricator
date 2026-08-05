
import { useModalContext } from "../context/ModalContext";
import ToastModal from "../components/ToastModal";

export default function SuccessMessage() {
  const {
    modalData: { showSuccess, message },
    dispatch,
  } = useModalContext();


  return (
    <ToastModal
      open={showSuccess}
      control={() => dispatch({ type: "close" })}
      width="max-w-[550px] w-full"
    >
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold  text-green-500">
          Operation Success
        </h2>
        <p className="text-green-500">* {message}</p>
        <button
          className="bg-green-500 px-4 py-2 rounded-md  text-white cursor-pointer"
          onClick={() => dispatch({ type: "close" })}
        >
          Dismiss Alert
        </button>
      </div>
    </ToastModal>
  );
}
