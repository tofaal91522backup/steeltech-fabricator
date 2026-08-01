import { useEffect, useState } from "react";
import logo from "../../assets/images/steeltech_logo.svg";
import spinner from "../../assets/images/spinner.webp";
import { uploadFile } from "../../utils/uploadFile";
import {
  useGetAllDistributorForRegQuery,
  useGetAllMRForRegQuery,
  useRegisterFabricatorMutation,
} from "../../features/fabricartorApi/fabricartorApi";
import useAuthAdminCheck from "../../hooks/useAuthAdminCheck";
import ErrorMessage from "../../shared/ErrorMessage";
import { useModalContext } from "../../context/ModalContext";
import SuccessMessage from "../../shared/SuccessMessage";
import {
  useGetDistrictQuery,
  useGetUpazilasQuery,
} from "../../features/districtApi/districtApi";
import Select from "react-select";
import CameraCapture from "../../components/CameraCapture";

const FabricatorRegistration = () => {
  const authIsReady = useAuthAdminCheck();

  const { dispatch: modalDispatch } = useModalContext();

  const [loadingImages, setLoadingImages] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    institution: "",
    phone_number: "",
    district: "",
    sub_district: "",
    email: "", // optional
    address: "",
    distributor: "",
    marketing_representative: "",
    trade_license_img_url: "",
    visiting_card_img_url: "",
    profile_img_url: "",
  });

  const [dummyUrl, setDummyUrl] = useState({
    trade_license_img_url: "",
    visiting_card_img_url: "",
    profile_img_url: "",
  });
  const [tempFiles, setTempFiles] = useState({});

  const [selectDistrict, setSelectDistrict] = useState(null);

  const { data: districts } = useGetDistrictQuery();
  const { data: upaZila } = useGetUpazilasQuery(
    {
      id: selectDistrict,
    },
    { skip: !selectDistrict }
  );
  const { data: allMr } = useGetAllMRForRegQuery();
  const { data: allDistributor } = useGetAllDistributorForRegQuery();
  const [registerFabricator, { data, isLoading, isSuccess, isError, error }] =
    useRegisterFabricatorMutation();


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
      // navigate("/fabricator-management");

      modalDispatch({
        type: "success",
        payload: "Your registration has been successfully completed",
      });
      setDummyUrl({
        trade_license_img_url: "",
        visiting_card_img_url: "",
        profile_img_url: "",
      });
      setFormData({
        name: "",
        institution: "",
        phone_number: "",
        district: "",
        sub_district: "",
        email: "", // optional
        address: "",
        marketing_representative: "",
        trade_license_img_url: "",
        visiting_card_img_url: "",
        profile_img_url: "",
      });
    }
  }, [isSuccess]);


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


  const MAX_FILE_SIZE_MB = 20;

  // const handleFileChange = async (type, file) => {
  //   const maxSizeInBytes = MAX_FILE_SIZE_MB * 1024 * 1024;

  //   if (file.size > maxSizeInBytes) {
  //     modalDispatch({
  //       type: "open",
  //       payload: `File size should not exceed ${MAX_FILE_SIZE_MB}MB.`,
  //     });
  //     return;
  //   }

  //   if (file) {
  //     console.log("type", type);
  //     setFormData((prev) => ({
  //       ...prev,
  //       [type]: file, // store actual File object
  //     }));

  //     const previewUrl = URL.createObjectURL(file);
  //     setDummyUrl((prev) => ({
  //       ...prev,
  //       [type]: previewUrl, // e.g., formData.trade_license_img_url
  //     }));
  //   }
  // };

  const handleFileChange = async (type, file) => {
    const maxSizeInBytes = MAX_FILE_SIZE_MB * 1024 * 1024;

    if (file.size > maxSizeInBytes) {
      modalDispatch({
        type: "open",
        payload: `File size should not exceed ${MAX_FILE_SIZE_MB}MB.`,
      });
      return;
    }

    if (file) {
      // ✅ Only update dummyUrl for preview
      const previewUrl = URL.createObjectURL(file);
      setDummyUrl((prev) => ({
        ...prev,
        [type]: previewUrl,
      }));

      // ✅ Temporarily store the file in a temp state (optional)
      setTempFiles((prev) => ({
        ...prev,
        [type]: file,
      }));
    }
  };

  // FOR SEARCHING START HERE
  const options = allMr?.data?.map((mr) => ({
    value: mr.id,
    label: mr.name,
  }));

  const handleChange = (selectedOption) => {
    setFormData({
      ...formData,
      marketing_representative: selectedOption?.value || "",
    });
  };

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
  // FOR SEARCHING END HERE

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData?.name ||
      !formData?.phone_number ||
      !formData?.institution ||
      !formData?.district ||
      !formData?.sub_district
    ) {
      modalDispatch({
        type: "open",
        payload: "Please fill all the required input fields",
      });
      return;
    }

    const imageFields = [
      "trade_license_img_url",
      "visiting_card_img_url",
      "profile_img_url",
    ];

    // Ensure files are selected before uploading
    for (const field of imageFields) {
      if (!tempFiles?.[field]) {
        modalDispatch({
          type: "open",
          payload: `Please upload ${field.replace(/_/g, " ")}`,
        });
        return;
      }
    }

    setLoadingImages(true);
    const updatedData = { ...formData };

    try {
      // Upload files
      for (const field of imageFields) {
        const file = tempFiles[field];
        let success = false;
        let attempts = 0;
        let uploadedUrl = null;

        while (!success && attempts < 2) {
          try {
            uploadedUrl = await uploadFile(file);
            success = true;
          } catch (err) {
            attempts++;
            modalDispatch({
              type: "open",
              payload: `Error uploading ${field.replace(/_/g, " ")}: ${
                err?.message || String(err)
              }`,
            });
          }
        }

        if (!success || !uploadedUrl) {
          // modalDispatch({
          //   type: "open",
          //   payload: `Failed to upload ${field.replace(/_/g, " ")}`,
          // });
          setLoadingImages(false);
          return;
        }

        updatedData[field] = uploadedUrl;
      }

      // ✅ Final check: all uploaded URLs must be non-empty
      const anyMissing = imageFields.some((field) => !updatedData[field]);
      if (anyMissing) {
        modalDispatch({
          type: "open",
          payload:
            "All images must be successfully uploaded before registration. Please try again",
        });
        setLoadingImages(false);
        return;
      }

      await registerFabricator(updatedData);
    } catch (err) {
      console.error("Registration failed:", err);
      modalDispatch({
        type: "open",
        payload: "Something went wrong. Please try again.",
      });
    } finally {
      setLoadingImages(false);
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (
  //     !formData?.name ||
  //     !formData?.phone_number ||
  //     !formData?.institution ||
  //     !formData?.district ||
  //     !formData?.sub_district ||
  //     // !formData?.distributor ||
  //     !formData?.trade_license_img_url ||
  //     !formData?.visiting_card_img_url ||
  //     !formData?.profile_img_url
  //   ) {
  //     modalDispatch({
  //       type: "open",
  //       payload: "Please fill all the required input field",
  //     });
  //     return;
  //   }
  //   setLoadingImages(true);

  //   const updatedData = { ...formData };
  //   const imageFields = [
  //     "trade_license_img_url",
  //     "visiting_card_img_url",
  //     "profile_img_url",
  //   ];

  //   try {
  //     for (const field of imageFields) {
  //       const value = formData[field];

  //       if (value && typeof value === "object") {
  //         let success = false;
  //         let attempts = 0;
  //         let uploadedUrl = null;

  //         while (!success && attempts < 2) {
  //           // Allow 1 retry
  //           try {
  //             uploadedUrl = await uploadFile(value);
  //             success = true;
  //           } catch (err) {
  //             attempts++;
  //             // console.warn(`Upload failed for ${field}, attempt ${attempts}`);
  //             modalDispatch({
  //               type: "open",
  //               payload: String(err),
  //             });
  //           }
  //         }

  //         if (!success) {
  //           modalDispatch({
  //             type: "open",
  //             payload: `Failed to upload image: ${field.replace(/_/g, " ")}`,
  //           });
  //           setLoadingImages(false);
  //           return;
  //         }

  //         updatedData[field] = uploadedUrl;
  //       }
  //     }

  //     await registerFabricator(updatedData);
  //   } catch (err) {
  //     console.error("Image upload failed", err);
  //     // Optionally show error to user
  //     modalDispatch({
  //       type: "open",
  //       payload: "Something went wrong. Please try again.",
  //     });
  //   } finally {
  //     setLoadingImages(false);
  //   }
  // };

  const FileUploadArea = ({ title, type, acceptedFormats }) => (
    <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
      {dummyUrl[type] ? (
        // <img src={dummyUrl[type]} alt="" />
        <>
          {formData[type]?.type === "application/pdf" ? (
            <embed
              src={dummyUrl[type]}
              type="application/pdf"
              width="100%"
              height="500px"
              className="mt-4 border"
            />
          ) : (
            <img
              src={dummyUrl[type]}
              alt="Preview"
              className="mt-4 max-h-[300px] mx-auto border"
            />
          )}
        </>
      ) : (
        <>
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          <p className="text-sm text-gray-600 mb-2">Click to upload {title} </p>
          <p className="text-xs text-gray-500">{acceptedFormats}</p>
        </>
      )}
      <div className="flex flex-col gap-1">
        <div className="md:hidden flex  flex-col gap-3 relative">
          <p className="text-green-500">From Gallery</p>
          <input
            type="file"
            className="absolute top-0 left-0 right-0 w-full h-full opacity-0 cursor-pointer"
            onChange={(e) => handleFileChange(type, e.target.files[0])}
            // accept=".pdf,.jpg,.jpeg,.png"
            accept="image/*"
            // capture="user"
          />
        </div>
        <div className="md:hidden flex flex-col  gap-3 relative">
          <p className="text-blue-500">From Camera</p>
          <input
            type="file"
            className="absolute top-0 left-0 right-0 w-full h-full opacity-0 cursor-pointer"
            onChange={(e) => handleFileChange(type, e.target.files[0])}
            // accept=".pdf,.jpg,.jpeg,.png"
            accept="image/*"
            capture="user"
          />
        </div>
        <div className="hidden md:flex">
          <input
            type="file"
            className="absolute top-0 left-0 right-0 w-full h-full opacity-0 cursor-pointer"
            onChange={(e) => handleFileChange(type, e.target.files[0])}
            // accept=".pdf,.jpg,.jpeg,.png"
            accept="image/*"
            // capture="user"
          />
        </div>
      </div>
    </div>
  );

  return !authIsReady ? (
    <div>Loading</div>
  ) : (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src={logo} alt="" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Heroes of Steeltech Registration
          </h1>
          <p className="text-gray-600">
            Join our trusted fabricator network and grow your business with us.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Form Header */}
          <div className="bg-primary text-white p-4">
            <h2 className="text-xl font-semibold">Registration Form</h2>
            <p className="text-white text-sm">
              Please fill in all the required information to complete your
              registration.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Personal Information */}
              <div className="flex gap-6 flex-col">
                <div className="bg-secondary p-6 border border-gray-300 rounded-md">
                  <div className="flex items-center mb-6 ">
                    <svg
                      className="w-5 h-5 text-gray-600 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Personal Information
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name of the Institution *
                      </label>
                      <input
                        type="text"
                        name="institution"
                        value={formData.institution}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Enter your institution name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                </div>

                {/* Location Information */}
                <div className="bg-secondary p-6 border border-gray-300 rounded-md">
                  <div className="mt-4">
                    <div className="flex items-center mb-6">
                      <svg
                        className="w-5 h-5 text-gray-600 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Location Details
                      </h3>
                    </div>

                    <div className="space-y-4">
                      {/* <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          District *
                        </label>
                        <select
                          name="district"
                          value={formData.district}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                        >
                          <option value="">Select the district</option>
                          {districts?.districts?.map((district) => (
                            <option value={district?.name}>
                              {district?.name}
                            </option>
                          ))}
                        </select>
                      </div> */}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          District *
                        </label>
                        <Select
                          options={districtOptions}
                          onChange={handleDistrictChange}
                          value={
                            formData.district
                              ? districtOptions?.find(
                                  (opt) => opt.value === formData.district
                                )
                              : null
                          }
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

                      {/* <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Thana *
                        </label>
                        <select
                          name="sub_district"
                          value={formData.sub_district}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                        >
                          {formData?.district ? (
                            <option value="">Select the thana</option>
                          ) : (
                            <option value="">Select district first</option>
                          )}
                          {upaZila?.upazilas?.map((district) => (
                            <option value={district?.name}>
                              {district?.name}
                            </option>
                          ))}
                        </select>
                      </div> */}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Address
                        </label>
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Full address"
                        />
                      </div>

                      {/* <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Distributor *
                        </label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          value={formData?.distributor}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              distributor: e.target.value,
                            })
                          }
                        >
                          <option>Select the distributor</option>
                          {allDistributor?.data?.map((distributor) => (
                            <option value={distributor?.id}>
                              {distributor?.name}
                            </option>
                          ))}
                        </select>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Document Upload */}
              <div className="bg-secondary p-6 border border-gray-300 rounded-md">
                <div className="space-y-6">
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Marketing Representative
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      value={formData?.marketing_representative}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          marketing_representative: e.target.value,
                        })
                      }
                    >
                      <option>Select the marketing representative</option>
                      {allMr?.data?.map((mr) => (
                        <option value={mr?.id}>{mr?.name}</option>
                      ))}
                    </select>
                  </div> */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Marketing Representative
                    </label>
                    <Select
                      options={options}
                      onChange={handleChange}
                      value={
                        formData?.marketing_representative
                          ? options.find(
                              (opt) =>
                                opt.value === formData.marketing_representative
                            )
                          : null
                      }
                      placeholder="Select the marketing representative"
                      isClearable
                    />
                  </div>

                  {/* Document Upload Section */}
                  <div className="flex items-center mb-4">
                    <svg
                      className="w-5 h-5 text-gray-600 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Document Upload
                    </h3>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Trade license *{" "}
                      </label>

                      <FileUploadArea
                        title={`Trade license`}
                        type="trade_license_img_url"
                        acceptedFormats="PDF, JPG, PNG upto 20 MB"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Visiting Card *{" "}
                      </label>
                      <FileUploadArea
                        title="Visiting Card"
                        type="visiting_card_img_url"
                        acceptedFormats="JPG, PNG upto 20 MB"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Profile Picture *
                      </label>
                      <FileUploadArea
                        title="Profile Picture"
                        type="profile_img_url"
                        acceptedFormats="JPG, PNG upto 20 MB"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex justify-start">
              <button
                type="submit"
                disabled={loadingImages}
                className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 font-medium flex items-center cursor-pointer"
              >
                {loadingImages ? (
                  <div className="flex gap-2 items-center">
                    <img src={spinner} alt="" className="w-6 h-6" /> Processing
                  </div>
                ) : (
                  <div className="flex gap-2 items-center">
                    Registration
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ErrorMessage />
      <SuccessMessage />
    </div>
  );
};

export default FabricatorRegistration;
