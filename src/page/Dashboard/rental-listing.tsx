import React from "react";
import { FiEdit } from "react-icons/fi";
import { MdBlockFlipped } from "react-icons/md";
import { CiTrash } from "react-icons/ci";

import { motion } from "framer-motion";
interface Listing {
  id: number;
  title: string;
  location: string;
  price: number;
  status: "approved" | "pending" | "sold" | "rented";
  image: string;
}
const RentalListings = () => {
  // Sample data
  const listings: Listing[] = [
    {
      id: 1,
      title: "Modern Apartment",
      location: "Downtown, New York",
      price: 2500,
      status: "approved",
      image:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: 2,
      title: "Cozy Studio",
      location: "Brooklyn, New York",
      price: 1800,
      status: "pending",
      image:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: 3,
      title: "Luxury Villa",
      location: "Miami, Florida",
      price: 5000,
      status: "rented",
      image:
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
  ];
  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "sold":
        return "bg-blue-100 text-blue-800";
      case "rented":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Latest Rental Listings</h2>
        <button className="text-sm text-indigo-600 hover:text-indigo-800">
          View All
        </button>
      </div>
      <div className="space-y-4">
        {listings.map((listing, index) => (
          <motion.div
            key={listing.id}
            className="flex items-center border border-gray-100 rounded-lg overflow-hidden"
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
              delay: index * 0.1,
            }}
            whileHover={{
              scale: 1.01,
              transition: {
                duration: 0.2,
              },
            }}
          >
            <div className="w-24 h-24 flex-shrink-0">
              <img
                src={listing.image}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 p-4">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium">{listing.title}</h3>
                  <p className="text-sm text-gray-500">{listing.location}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${listing.price}/mo</p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                      listing.status
                    )}`}
                  >
                    {listing.status.charAt(0).toUpperCase() +
                      listing.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 p-4">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <FiEdit
                  size={16}
                  className="text-gray-500"
                />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <MdBlockFlipped
                  size={16}
                  className="text-gray-500"
                />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <CiTrash
                  size={16}
                  className="text-gray-500"
                />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
export default RentalListings;
