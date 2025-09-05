import { FaFacebook, FaTiktok, FaTwitter, FaYoutube } from "react-icons/fa";

import { useFormContext } from "react-hook-form";

export default function SocialMediaLinksInput() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-4">
      <h3 className="text-md font-medium text-gray-700">Social Media Links</h3>

      <div className="space-y-3">
        <div className="flex items-center">
          <div className="w-10 flex justify-center">
            <FaFacebook className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1 ml-2">
            <input
              type="text"
              placeholder="Facebook profile URL"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              {...register("profile.socialLinks.facebook")}
            />
            {errors.profile?.socialLinks?.facebook && (
              <p className="mt-1 text-sm text-red-600">
                {errors.profile.socialLinks.facebook.message as string}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center">
          <div className="w-10 flex justify-center">
            <FaTwitter className="h-5 w-5 text-blue-400" />
          </div>
          <div className="flex-1 ml-2">
            <input
              type="text"
              placeholder="Twitter profile URL"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              {...register("profile.socialLinks.twitter")}
            />
            {errors.profile?.socialLinks?.twitter && (
              <p className="mt-1 text-sm text-red-600">
                {errors.profile.socialLinks.twitter.message as string}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center">
          <div className="w-10 flex justify-center">
            <FaTiktok className="h-5 w-5" />
          </div>
          <div className="flex-1 ml-2">
            <input
              type="text"
              placeholder="TikTok profile URL"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              {...register("profile.socialLinks.tiktok")}
            />
            {errors.profile?.socialLinks?.tiktok && (
              <p className="mt-1 text-sm text-red-600">
                {errors.profile.socialLinks.tiktok.message as string}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center">
          <div className="w-10 flex justify-center">
            <FaYoutube className="h-5 w-5 text-red-600" />
          </div>
          <div className="flex-1 ml-2">
            <input
              type="text"
              placeholder="YouTube channel URL"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              {...register("profile.socialLinks.youtube")}
            />
            {errors.profile?.socialLinks?.youtube && (
              <p className="mt-1 text-sm text-red-600">
                {errors?.profile?.socialLinks.youtube.message as string}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
