"use client";

import { useFormContext } from "react-hook-form";
import AvatarUploader from "./avatar-uploader";
import SocialMediaLinksInput from "./social-media-links-input";

interface ProfileInfoSectionProps {
  avatar: File | null;
  setAvatar: (file: File | null) => void;
  avatarPreview: string | null;
  setAvatarPreview: (preview: string | null) => void;
}

export default function ProfileInfoSection({
  avatar,
  setAvatar,
  avatarPreview,
  setAvatarPreview,
}: ProfileInfoSectionProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Profile Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <AvatarUploader
            avatar={avatar}
            setAvatar={setAvatar}
            avatarPreview={avatarPreview}
            setAvatarPreview={setAvatarPreview}
          />
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                {...register("profile.fullName")}
              />
              {errors.profile?.fullName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.profile.fullName.message as string}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number
              </label>
              <input
                id="phoneNumber"
                type="tel"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                {...register("profile.phoneNumber")}
              />
              {errors.profile?.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.profile.phoneNumber.message as string}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              {...register("profile.email")}
            />
            {errors.profile?.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.profile.email.message as string}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Address
            </label>
            <textarea
              id="address"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              {...register("profile.address")}
            />
            {errors.profile?.address && (
              <p className="mt-1 text-sm text-red-600">
                {errors.profile.address.message as string}
              </p>
            )}
          </div>

          <SocialMediaLinksInput />
        </div>
      </div>
    </div>
  );
}
