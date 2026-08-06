import { useState } from "react";

const ImageAttachments = ({ urls = [] }) => {
  const [preview, setPreview] = useState(null);

  if (!urls?.length) return null;

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {urls.map((url) => (
          <button
            key={url}
            type="button"
            onClick={() => setPreview(url)}
            className="block h-20 w-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 cursor-zoom-in group shrink-0"
          >
            <img
              src={url}
              alt="attachment"
              className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
            />
          </button>
        ))}
      </div>

      {preview ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setPreview(null)}
        >
          <div
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreview(null)}
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
              src={preview}
              alt="attachment preview"
              className="max-w-full max-h-[85vh] mx-auto rounded-lg shadow-2xl object-contain"
            />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ImageAttachments;
