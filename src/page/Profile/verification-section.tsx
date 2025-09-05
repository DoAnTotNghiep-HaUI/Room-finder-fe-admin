"use client";

import DragAndDropUploader from "@/components/Input/drag-and-drop-uploader";
import FileUploadMultiple from "@/components/Input/file-upload-multiple";
import { useForm, useFormContext } from "react-hook-form";

interface VerificationSectionProps {
  idCardPhoto: File | null;
  setIdCardPhoto: (file: File | null) => void;
  idCardPhotoPreview: string | null;
  setIdCardPhotoPreview: (preview: string | null) => void;
  businessLicense: File | null;
  setBusinessLicense: (file: File | null) => void;
  businessLicensePreview: string | null;
  setBusinessLicensePreview: (preview: string | null) => void;
  portraitPhoto: File | null;
  setPortraitPhoto: (file: File | null) => void;
  portraitPhotoPreview: string | null;
  setPortraitPhotoPreview: (preview: string | null) => void;
}

export default function VerificationSection({
  idCardPhoto,
  setIdCardPhoto,
  idCardPhotoPreview,
  setIdCardPhotoPreview,
  businessLicense,
  setBusinessLicense,
  businessLicensePreview,
  setBusinessLicensePreview,
  portraitPhoto,
  setPortraitPhoto,
  portraitPhotoPreview,
  setPortraitPhotoPreview,
}: VerificationSectionProps) {
  const {
    formState: { errors },
  } = useFormContext();
  const { control } = useForm();
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Verification Documents
      </h2>

      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            ID Card Photo
          </h3>
          <div className="flex gap-20">
            <div>
              <p className="text-sm text-gray-500 mb-4">
                Tải lên ảnh căn cước công dân mặt trước. Tối đa 5MB.
              </p>
              <DragAndDropUploader
                file={idCardPhoto}
                setFile={setIdCardPhoto}
                filePreview={idCardPhotoPreview}
                setFilePreview={setIdCardPhotoPreview}
                acceptedFileTypes={["image/png", "image/jpeg", "image/jpg"]}
                maxSizeMB={5}
                fieldName="verification.idCardPhoto"
              />
              {errors.verification?.idCardPhoto && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.verification.idCardPhoto.message as string}
                </p>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-4">
                Tải lên ảnh căn cước công dân mặt sau. Tối đa 5MB.
              </p>
              <DragAndDropUploader
                file={idCardPhoto}
                setFile={setIdCardPhoto}
                filePreview={idCardPhotoPreview}
                setFilePreview={setIdCardPhotoPreview}
                acceptedFileTypes={["image/png", "image/jpeg", "image/jpg"]}
                maxSizeMB={5}
                fieldName="verification.idCardPhoto"
              />
              {errors.verification?.idCardPhoto && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.verification.idCardPhoto.message as string}
                </p>
              )}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Business License
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Upload your business license or rental property registration. Max
            size 5MB.
          </p>
          <FileUploadMultiple
            control={control}
            name="businessLicense"
            accept={[".png", ".jpg", ".jpeg", ".gif"]}
            multiple
            onChange={(files) => {
              // Handle multiple files
              console.log("Files changed:", files);
            }}
            onDelete={(index) => {
              // Handle image deletion
              console.log("Image deleted at index:", index);
            }}
          />
          {/* <DragAndDropUploader
            file={businessLicense}
            setFile={setBusinessLicense}
            filePreview={businessLicensePreview}
            setFilePreview={setBusinessLicensePreview}
            acceptedFileTypes={["image/png", "image/jpeg", "image/jpg"]}
            maxSizeMB={5}
            fieldName="verification.businessLicense"
          /> */}
          {errors.verification?.businessLicense && (
            <p className="mt-1 text-sm text-red-600">
              {errors.verification.businessLicense.message as string}
            </p>
          )}
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Portrait Photo
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Upload a recent portrait photo of yourself. This will be used for
            verification. Max size 5MB.
          </p>
          {/* <FileUpload
            control={control}
            name="portraitPhoto"
            accept={[".png", ".jpg", ".jpeg", ".gif"]}
            multiple={false}
            onChange={(files) => {
              // Handle multiple files
              console.log("Files changed:", files);
            }}
            onDelete={(index) => {
              // Handle image deletion
              console.log("Image deleted at index:", index);
            }}
          /> */}
          <DragAndDropUploader
            file={portraitPhoto}
            setFile={setPortraitPhoto}
            filePreview={portraitPhotoPreview}
            setFilePreview={setPortraitPhotoPreview}
            acceptedFileTypes={["image/png", "image/jpeg", "image/jpg"]}
            maxSizeMB={5}
            fieldName="verification.portraitPhoto"
          />
          {errors.verification?.portraitPhoto && (
            <p className="mt-1 text-sm text-red-600">
              {errors.verification.portraitPhoto.message as string}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
