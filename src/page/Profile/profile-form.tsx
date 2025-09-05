"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ProfileInfoSection from "./profile-info-section";
import VerificationSection from "./verification-section";
import PasswordUpdateSection from "./password-update-section";

// Define the form schema with zod
const profileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phoneNumber: z
    .string()
    .regex(/^\+?[0-9]{10,15}$/, "Invalid phone number format"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  socialLinks: z.object({
    facebook: z.string().url("Invalid URL").or(z.literal("")),
    twitter: z.string().url("Invalid URL").or(z.literal("")),
    tiktok: z.string().url("Invalid URL").or(z.literal("")),
    youtube: z.string().url("Invalid URL").or(z.literal("")),
  }),
});

// Define the password schema
const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^a-zA-Z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Define the verification schema
const verificationSchema = z.object({
  idCardPhoto: z.any().optional(),
  businessLicense: z.any().optional(),
  portraitPhoto: z.any().optional(),
});

// Combine all schemas
const formSchema = z.object({
  profile: profileSchema,
  password: passwordSchema,
  verification: verificationSchema,
});

type FormValues = z.infer<typeof formSchema>;

interface ProfileFormProps {
  activeTab: string;
}

export default function ProfileForm({ activeTab }: ProfileFormProps) {
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [idCardPhoto, setIdCardPhoto] = useState<File | null>(null);
  const [idCardPhotoPreview, setIdCardPhotoPreview] = useState<string | null>(
    null
  );

  const [businessLicense, setBusinessLicense] = useState<File | null>(null);
  const [businessLicensePreview, setBusinessLicensePreview] = useState<
    string | null
  >(null);

  const [portraitPhoto, setPortraitPhoto] = useState<File | null>(null);
  const [portraitPhotoPreview, setPortraitPhotoPreview] = useState<
    string | null
  >(null);

  // Initialize form with default values
  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      profile: {
        fullName: "",
        phoneNumber: "",
        email: "",
        address: "",
        socialLinks: {
          facebook: "",
          twitter: "",
          tiktok: "",
          youtube: "",
        },
      },
      password: {
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
      verification: {
        idCardPhoto: undefined,
        businessLicense: undefined,
        portraitPhoto: undefined,
      },
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      // Simulate API call
      console.log("Form data:", data);
      console.log("Avatar:", avatar);
      console.log("ID Card Photo:", idCardPhoto);
      console.log("Business License:", businessLicense);
      console.log("Portrait Photo:", portraitPhoto);

      // Show success message
      //   toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      //   toast.error("Failed to update profile. Please try again.");
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        {activeTab === "profile" && (
          <ProfileInfoSection
            avatar={avatar}
            setAvatar={setAvatar}
            avatarPreview={avatarPreview}
            setAvatarPreview={setAvatarPreview}
          />
        )}

        {activeTab === "verification" && (
          <VerificationSection
            idCardPhoto={idCardPhoto}
            setIdCardPhoto={setIdCardPhoto}
            idCardPhotoPreview={idCardPhotoPreview}
            setIdCardPhotoPreview={setIdCardPhotoPreview}
            businessLicense={businessLicense}
            setBusinessLicense={setBusinessLicense}
            businessLicensePreview={businessLicensePreview}
            setBusinessLicensePreview={setBusinessLicensePreview}
            portraitPhoto={portraitPhoto}
            setPortraitPhoto={setPortraitPhoto}
            portraitPhotoPreview={portraitPhotoPreview}
            setPortraitPhotoPreview={setPortraitPhotoPreview}
          />
        )}

        {activeTab === "security" && <PasswordUpdateSection />}

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Save Changes
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
