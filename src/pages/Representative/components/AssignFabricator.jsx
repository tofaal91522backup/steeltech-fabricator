import { useState } from "react";

const AssignFabricator = ({
  data,
  selectFab,
  setSelectFab,
  isLoading,
  handleAddFabricatorToMR,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFabricators = data?.filter((record) =>
    record?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCheckboxChange = (id, checked) => {
    if (checked) {
      setSelectFab((prev) => [...prev, id]);
    } else {
      setSelectFab((prev) => prev.filter((item) => item !== id));
    }
  };

  const selectedDistributors = data?.filter((record) =>
    selectFab.includes(record?.id)
  );

  return (
    <div className="mb-8">
      <p className="text-xl pb-3">Select Fabricator</p>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search fabricator..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md"
      />

      {/* Selected List */}
      {selectedDistributors?.length > 0 && (
        <div className="mb-6">
          <p className="text-lg font-semibold mb-2">Selected Fabricators:</p>
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
      {filteredFabricators?.map((record) => {
        const isChecked = selectFab.includes(record?.id);

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
            <label htmlFor={`mr-${record?.id}`}>{record?.name}</label>
          </div>
        );
      })}

      {filteredFabricators?.length === 0 && (
        <p className="text-gray-500">No fabricator found.</p>
      )}

      {/* Submit Button */}
      <div className="py-4">
        <button
          disabled={isLoading}
          onClick={handleAddFabricatorToMR}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 font-medium cursor-pointer"
        >
          {isLoading ? "Processing" : "Assign Fabricator"}
        </button>
      </div>
    </div>
  );
};

export default AssignFabricator;
