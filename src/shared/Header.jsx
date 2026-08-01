const Header = () => {
  return (
    <div className="bg-white border-b border-b-gray-200 px-6 py-[18px] flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Fabricator Management
        </h1>
        <p className="text-gray-600">
          Manage and review fabricator applications
        </p>
      </div>
      <div className="flex items-center space-x-4">
        {/* <button className="p-2 text-gray-400 hover:text-gray-600">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button> */}
        <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
          <span className="text-white font-semibold">A</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
