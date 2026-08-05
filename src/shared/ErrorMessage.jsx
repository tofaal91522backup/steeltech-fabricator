import { useModalContext } from "../context/ModalContext";
import ToastModal from "../components/ToastModal";
// import { useModalContext } from "../context/ModalContext";

export default function ErrorMessage() {
  const {
    modalData: { showError, message },
    dispatch,
  } = useModalContext();

  return (
    <ToastModal
      open={showError}
      control={() => dispatch({ type: "close" })}
      width="max-w-[550px] w-full"
    >
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-primary">
          An error occurred while trying to perform this operation
        </h2>
        <p className="text-red-500">* {message}</p>
        <button
          className="bg-primary px-4 py-2 rounded-md  text-white cursor-pointer"
          onClick={() => dispatch({ type: "close" })}
        >
          Dismiss
        </button>
      </div>
    </ToastModal>
  );
}
