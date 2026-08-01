import { TiDelete } from "react-icons/ti";

export default function ToastModal({
  open,
  control,
  children,
  width,
  padding,
}) {
  return (
    open && (
      <div
        className={`fixed top-0 left-0 w-full h-full bg-black/70 z-50 flex justify-center items-center`}
      >
        <div
          className={`relative bg-secondary border border-primary text-white max-h-[550px] md:max-h-[750px] max-w-[900px] ${
            width ? width : "w-full"
          }  h- mx-4 shadow-xl ${
            padding ? padding : "p-6 md:p-10"
          } rounded-2xl overflow-y-scroll`}
        >
          <span
            className="absolute top-2 right-2 z-50 cursor-pointer  rounded-full  p-2"
            onClick={control}
          >
            <TiDelete className="fill-primary  w-6  h-6  z-50" />
          </span>
          {children}
        </div>
      </div>
    )
  );
}
