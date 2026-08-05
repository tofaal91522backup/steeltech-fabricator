import { useEffect, useState } from "react";
import Modal from "../../../components/Modal";
import {
  useCreateMarketingRepMutation,
  useUpdateMarketingRepMutation,
} from "../../../features/MarRepApi/MarRepApi";
import {
  useGetDistrictQuery,
  useGetUpazilasQuery,
} from "../../../features/districtApi/districtApi";
import { useModalContext } from "../../../context/ModalContext";
import Select from "react-select";

const AddRepresentative = ({
  isOpen,
  onClose,
  initialData = null,
  mode = "add",
}) => {
  const inititlaObj = {
    employee_id: "", // new
    name: "",
    phone_number: "",
    district: "",
    sub_district: "",
    email: "",
  };
  // const [formData, setFormData] = useState({
  //   ...inititlaObj,
  // });

  const [formData, setFormData] = useState(initialData || inititlaObj);

  const { dispatch: modalDispatch } = useModalContext();

  const [selectDistrict, setSelectDistrict] = useState(null);

  const { data: districts } = useGetDistrictQuery();
  const { data: upaZila } = useGetUpazilasQuery(
    {
      id: selectDistrict,
    },
    { skip: !selectDistrict }
  );

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      // Optionally set selectDistrict based on initial district name
      const matched = districts?.districts?.find(
        (d) => d.name === initialData.district
      );
      if (matched) setSelectDistrict(matched.id);
    }
  }, [initialData, districts]);

  const districtOptions = districts?.districts?.map((district) => ({
    value: district.name,
    label: district.name,
  }));

  const handleDistrictChange = (selectedOption) => {
    const selectedValue = selectedOption?.value || "";

    // Update formData
    setFormData((prev) => ({
      ...prev,
      district: selectedValue,
      sub_district: "", // Reset sub_district
    }));

    // Set district ID if matched
    const selectedDistrict = districts.districts.find(
      (d) => d.name === selectedValue
    );
    if (selectedDistrict) {
      setSelectDistrict(selectedDistrict.id);
    } else {
      setSelectDistrict(null); // Optional: clear if not found
    }
  };

  const thanaOptions = upaZila?.upazilas?.map((thana) => ({
    value: thana.name,
    label: thana.name,
  }));

  const handleThanaChange = (selectedOption) => {
    const selectedValue = selectedOption?.value || "";

    // Update formData for sub_district
    setFormData((prev) => ({
      ...prev,
      sub_district: selectedValue,
    }));
  };

  console.log("selectDistrict", selectDistrict, formData, upaZila);
  const [createMarketingRep, { isLoading, isSuccess, isError, error }] =
    useCreateMarketingRepMutation();

  const [
    updateMarketingRep,
    { isLoading: isLoadingEdit, isSuccess: isSuccessEdit },
  ] = useUpdateMarketingRepMutation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "district") {
      // Update name in formData
      setFormData((prev) => ({
        ...prev,
        district: value,
        sub_district: "",
      }));

      // Find corresponding ID
      const selectedDistrict = districts.districts.find(
        (d) => d.name === value
      );
      if (selectedDistrict) {
        setSelectDistrict(selectedDistrict.id); // set the ID separately
      }
    } else if (name === "sub_district") {
      setFormData((prev) => ({
        ...prev,
        sub_district: value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.name ||
      !formData.phone_number ||
      !formData.email ||
      !formData.district
    ) {
      modalDispatch({
        type: "open",
        payload: "Please fill in all required fields",
      });
      return;
    }

    if (mode === "edit") {
      updateMarketingRep({ id: initialData.id, data: formData });
    } else {
      createMarketingRep(formData);
    }
  };

  useEffect(() => {
    if (isError) {
      modalDispatch({
        type: "open",
        payload: error?.data?.message,
      });
    }
  }, [isError]);

  useEffect(() => {
    if (isSuccess) {
      onClose();
      // Reset form
      setFormData({
        ...inititlaObj,
      });
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isSuccessEdit) {
      onClose();
      // Reset form
      setFormData({
        ...inititlaObj,
      });
    }
  }, [isSuccessEdit]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Representative">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Enter Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Enter Name"
            required
          />
        </div>

        {/* Phone Number Field */}
        <div>
          <label
            htmlFor="phone_number"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone_number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Phone Number"
            required
          />
        </div>

        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Email"
            required
          />
        </div>
        <div>
          <label
            htmlFor="employee_id"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Employee Id (optional)
          </label>
          <input
            type="text"
            id="employee_id"
            name="employee_id"
            value={formData.employee_id}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Create your own, otherwise we will generate one"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            District *
          </label>
          <Select
            options={districtOptions}
            onChange={handleDistrictChange}
            value={districtOptions?.find(
              (opt) => opt.value === formData.district
            )}
            placeholder="Select the district"
            isClearable
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Thana *
          </label>

          {formData.district ? (
            <Select
              name="sub_district"
              options={thanaOptions}
              value={thanaOptions?.find(
                (opt) => opt.value === formData.sub_district
              )}
              onChange={handleThanaChange}
              placeholder="Select the thana"
              isClearable
              className="react-select-container"
              classNamePrefix="react-select"
            />
          ) : (
            <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
              Select district first
            </div>
          )}
        </div>

        {/* District Field */}
        {/* <div>
          <label
            htmlFor="district"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            District *
          </label>
          <select
            id="district"
            name="district"
            value={formData.district}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
            required
          >
            <option value="">Select District</option>
            {districts?.districts?.map((district) => (
              <option key={district.id} value={district.name}>
                {district.name}
              </option>
            ))}
          </select>
        </div> */}

        {/* Sub Districk */}
        {/* <div>
          <label
            htmlFor="sub_district"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Thana *
          </label>

          <select
            name="sub_district"
            value={formData.sub_district}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            required
          >
            {formData?.district ? (
              <option value="">Select Thana</option>
            ) : (
              <option value="">Select District</option>
            )}
            {upaZila?.upazilas?.map((district) => (
              <option value={district?.name}>{district?.name}</option>
            ))}
          </select>
        </div> */}

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isLoading || isLoadingEdit}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 font-medium cursor-pointer"
          >
            {isLoading || isLoadingEdit
              ? "Processing"
              : mode === "edit"
              ? "Edit Representative"
              : "Add Representative"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddRepresentative;
