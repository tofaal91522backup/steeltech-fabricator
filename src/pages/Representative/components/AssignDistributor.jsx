import { useState } from "react";

const AssignDistributor = ({
  data,
  selectMr,
  setSelectMr,
  isLoading,
  handleAddDistributorToMR,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDistributors = data?.data?.filter((record) =>
    record?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCheckboxChange = (id, checked) => {
    if (checked) {
      setSelectMr((prev) => [...prev, id]);
    } else {
      setSelectMr((prev) => prev.filter((item) => item !== id));
    }
  };

  const selectedDistributors = data?.data?.filter((record) =>
    selectMr.includes(record?.id)
  );

  return (
    <div className="mb-8">
      <p className="text-xl pb-3">Select Distributor</p>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search distributor..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md"
      />

      {/* Selected List */}
      {selectedDistributors?.length > 0 && (
        <div className="mb-6">
          <p className="text-lg font-semibold mb-2">Selected Distributors:</p>
          <div className="flex flex-wrap gap-2">
            {selectedDistributors.map((dist) => (
              <div
                key={dist.id}
                className="flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full text-sm"
              >
                <span>{dist.name}</span>
                <button
                  onClick={() => handleCheckboxChange(dist.id, false)}
                  className="text-red-500 hover:text-red-700 font-bold"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Distributor List */}
      {filteredDistributors?.map((record) => {
        const isChecked = selectMr.includes(record?.id);

        return (
          <div key={record?.id} className="flex gap-3 items-center mb-2">
            <input
              type="checkbox"
              id={`mr-${record?.id}`}
              checked={isChecked}
              onChange={(e) =>
                handleCheckboxChange(record?.id, e.target.checked)
              }
            />
            <label htmlFor={`mr-${record?.id}`}>
              {record?.name} - ({record?.district}, {record?.sub_district})
            </label>
          </div>
        );
      })}

      {filteredDistributors?.length === 0 && (
        <p className="text-gray-500">No distributor found.</p>
      )}

      {/* Submit Button */}
      <div className="py-4">
        <button
          disabled={isLoading}
          onClick={handleAddDistributorToMR}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 font-medium cursor-pointer"
        >
          {isLoading ? "Processing" : "Assign Distributor"}
        </button>
      </div>
    </div>
  );
};

export default AssignDistributor;
