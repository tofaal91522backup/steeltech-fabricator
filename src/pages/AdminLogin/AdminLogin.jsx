import React, { useEffect, useState } from "react";
import logo from "../../assets/images/steeltech_logo.svg";
import { useAdminLoginMutation } from "../../features/auth/adminAuthApi";
import { useNavigate } from "react-router-dom";
import { useModalContext } from "../../context/ModalContext";
import ErrorMessage from "../../shared/ErrorMessage";
import { LuLoader } from "react-icons/lu";

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [login, { isLoading, isSuccess, isError, error: responseError }] =
    useAdminLoginMutation();

  const navigate = useNavigate();

  const { dispatch: modalDispatch } = useModalContext();

  useEffect(() => {
    if (isSuccess) {
      navigate("/dashboard");
    }
  }, [isSuccess, navigate]);
  useEffect(() => {
    if (isError) {
      modalDispatch({
        type: "open",
        payload: responseError?.data?.message,
      });
    }
  }, [isError]);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="" />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Steeltech Admin Portal
          </h1>
          <p className="text-gray-600">
            Sign in to manage fabricator registrations
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={formData?.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="admin@steeltech.com"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formData?.password}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  password: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Remember Me and Forgot Password */}
          {/* <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label
                htmlFor="remember"
                className="ml-2 block text-sm text-gray-700"
              >
                Remember me
              </label>
            </div>
            <a href="#" className="text-sm text-primary hover:text-primary">
              Forgot password?
            </a>
          </div> */}

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 font-medium cursor-pointer"
          >
            {isLoading ? (
              <>
                <LuLoader className="animate-spin inline-block mr-2" />
                <span> Processing...</span>
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Register Link */}
        {/* <div className="text-center mt-6">
          <a href="#" className="text-primary hover:text-primary text-sm">
            New fabricator? Register here
          </a>
        </div> */}
      </div>
      <ErrorMessage />
    </div>
  );
}
