"use client";

import { useFormContext } from "react-hook-form";
import { useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";

export default function PasswordUpdateSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Update Password
      </h2>

      <div className="space-y-6 max-w-md">
        <div className="relative">
          <label
            htmlFor="currentPassword"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Current Password
          </label>
          <div className="relative">
            <input
              id="currentPassword"
              type={showCurrentPassword ? "text" : "password"}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10"
              {...register("password.currentPassword")}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              {showCurrentPassword ? (
                <HiEyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <HiEye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
          {errors.password?.currentPassword && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.currentPassword.message as string}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            New Password
          </label>
          <div className="relative">
            <input
              id="newPassword"
              type={showNewPassword ? "text" : "password"}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10"
              {...register("password.newPassword")}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? (
                <HiEyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <HiEye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
          {errors.password?.newPassword && (
            <p className="mt-1 text-sm text-red-600">
              {errors?.password?.newPassword.message as string}
            </p>
          )}

          <div className="mt-2 text-sm text-gray-500">
            <p>Password must:</p>
            <ul className="list-disc pl-5 space-y-1 mt-1">
              <li>Be at least 8 characters long</li>
              <li>Include at least one uppercase letter</li>
              <li>Include at least one number</li>
              <li>Include at least one special character</li>
            </ul>
          </div>
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Confirm New Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10"
              {...register("password.confirmPassword")}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <HiEyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <HiEye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
          {errors.password?.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.confirmPassword.message as string}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
