import React, { useState, Fragment } from "react";
import { motion } from "framer-motion";
import { FaUpload } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
interface ContractFormProps {
  onClose: () => void;
}
const ContractForm = ({ onClose }: ContractFormProps) => {
  const [step, setStep] = useState(1);
  const steps = [
    {
      number: 1,
      title: "Tenant Information",
    },
    {
      number: 2,
      title: "Contract Details",
    },
    {
      number: 3,
      title: "Utilities & Payments",
    },
  ];
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">New Rental Contract</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <FaX size={20} />
        </button>
      </div>
      <div className="flex justify-between items-center mb-8">
        {steps.map((s, index) => (
          <Fragment key={s.number}>
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= s.number
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {s.number}
              </div>
              <span className="ml-2 text-sm font-medium text-gray-600">
                {s.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-4 bg-gray-200" />
            )}
          </Fragment>
        ))}
      </div>
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.3,
        }}
      >
        {step === 1 && <TenantInformationForm />}
        {step === 2 && <ContractDetailsForm />}
        {step === 3 && <UtilitiesAndPaymentForm />}
      </motion.div>
      <div className="flex justify-between mt-8 pt-6 border-t">
        <button
          onClick={() => step > 1 && setStep(step - 1)}
          className={`px-4 py-2 border border-gray-200 rounded-md ${
            step === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
          }`}
          disabled={step === 1}
        >
          Previous
        </button>
        <button
          onClick={() => (step < 3 ? setStep(step + 1) : onClose())}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          {step === 3 ? "Create Contract" : "Next"}
        </button>
      </div>
    </div>
  );
};
const TenantInformationForm = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Full Name
      </label>
      <input
        type="text"
        className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        ID Card/Passport
      </label>
      <input
        type="text"
        className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Date of Birth
      </label>
      <input
        type="date"
        className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Phone Number
      </label>
      <input
        type="tel"
        className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Permanent Address
      </label>
      <textarea
        rows={3}
        className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  </div>
);
const ContractDetailsForm = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Building
      </label>
      <select className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
        <option>Select Building</option>
        <option>Sunset Apartments</option>
        <option>Ocean View Complex</option>
        <option>City Center Residences</option>
      </select>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Unit Number
      </label>
      <input
        type="text"
        className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Start Date
      </label>
      <input
        type="date"
        className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        End Date
      </label>
      <input
        type="date"
        className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Monthly Rent
      </label>
      <input
        type="number"
        className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Security Deposit
      </label>
      <input
        type="number"
        className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Contract Documents
      </label>
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
        <div className="space-y-1 text-center">
          <FaUpload
            className="mx-auto h-12 w-12 text-gray-400"
            stroke-width="1"
          />
          <div className="flex text-sm text-gray-600">
            <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
              <span>Upload a file</span>
              <input
                type="file"
                className="sr-only"
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">PDF up to 10MB</p>
        </div>
      </div>
    </div>
  </div>
);
const UtilitiesAndPaymentForm = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Initial Electric Meter Reading
      </label>
      <input
        type="text"
        className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Initial Water Meter Reading
      </label>
      <input
        type="text"
        className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Payment Method
      </label>
      <select className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
        <option>Bank Transfer</option>
        <option>Credit Card</option>
        <option>Cash</option>
      </select>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Payment Due Date
      </label>
      <select className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
        <option>1st of every month</option>
        <option>5th of every month</option>
        <option>10th of every month</option>
        <option>15th of every month</option>
      </select>
    </div>
  </div>
);
export default ContractForm;
