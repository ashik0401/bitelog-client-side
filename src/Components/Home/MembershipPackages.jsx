import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "../../Pages/Payments/PaymentForm";

const stripePromise = loadStripe(import.meta.env.VITE_payment_key);

const getStyles = (badge) => {
  if (badge === "Silver") {
    return {
      bg: "bg-gray-100 dark:bg-transparent",
      text: "text-black dark:text-white",
      border: "border-[#012200]/20 dark:border-gray-500",
      btn: "bg-[#066303] hover:bg-[#043f02]",
    };
  }
  if (badge === "Gold") {
    return {
      bg: "bg-[#012200] dark:bg-transparent",
      text: "text-white",
      border: "border-[#012200]",
      btn: "bg-[#066303] hover:bg-[#043f02]",
    };
  }
  return {
    bg: "bg-gray-100 dark:bg-transparent",
    text: "text-black dark:text-white",
    border: "border-[#012200]/20 dark:border-gray-500",
    btn: "bg-[#066303] hover:bg-[#043f02]",
  };
};

const MembershipPackages = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [selectedPackage, setSelectedPackage] = useState(null);

  const { data: packages = [], isLoading, isError } = useQuery({
    queryKey: ["membership-packages"],
    queryFn: async () => {
      const res = await axiosSecure.get("/membership/packages");
      return res.data;
    },
  });

  const { data: userMembership = {} } = useQuery({
    enabled: !!user?.email,
    queryKey: ["user-membership", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/user/membership/${user.email}`);
      return res.data;
    },
  });

  const openModal = (pkg) => setSelectedPackage(pkg);
  const closeModal = () => setSelectedPackage(null);

  if (isLoading)
    return (
      <div className="text-center py-20">
        <span className="loading loading-ring loading-sm"></span>
      </div>
    );

  if (isError)
    return (
      <div className="text-center py-20 text-red-500">
        Failed to load packages
      </div>
    );

  return (
    <div id="membership" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 text-[#012200] dark:text-white">
        Get Paid Membership
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 sm:gap-6 gap-2 justify-items-center">
        {packages.map((pkg) => {
          const styles = getStyles(pkg.badge);
          const isCurrent = userMembership?.membershipId === pkg._id;
          const featureTextColor =
            pkg.badge === "Gold" ? "text-white" : "text-black dark:text-white";
          const bgColorClass =
            pkg.badge === "Gold" ? "bg-[#012200]" : styles.bg;

          return (
            <div
              key={pkg._id}
              className={`shadow-md border ${styles.border} ${bgColorClass} flex flex-col justify-between rounded-lg p-4 sm:p-5 w-full max-w-[16rem] sm:max-w-[18rem] md:max-w-[19rem] min-h-[20rem] hover:scale-105 transition-transform duration-300`}
            >
              <div className="flex-1 flex flex-col">
                <h3 className={`text-xl sm:text-2xl font-semibold mb-2 ${styles.text}`}>
                  {pkg.badge}
                </h3>
                <div className="w-full flex justify-center mb-4">
                  <p className="text-2xl sm:text-3xl font-bold bg-[#015500] rounded-full w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-white">
                    ${pkg.price}
                  </p>
                </div>
                <ul className={`mb-6 list-disc list-inside text-sm sm:text-base space-y-1 ${featureTextColor}`}>
                  {pkg.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => openModal(pkg)}
                disabled={isCurrent}
                className={`mt-auto w-full py-2 rounded-lg font-semibold text-white transition duration-300 ${
                  isCurrent ? "bg-gray-300 cursor-not-allowed" : styles.btn
                }`}
              >
                {isCurrent ? "Current Plan" : "Choose"}
              </button>
            </div>
          );
        })}
      </div>

      {selectedPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-3 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white text-2xl"
            >
              &times;
            </button>
            <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-center text-black dark:text-white">
              Pay for {selectedPackage.badge} Plan
            </h3>
            <Elements stripe={stripePromise}>
              <PaymentForm
                id={selectedPackage._id}
                price={selectedPackage.price}
                badge={selectedPackage.badge}
                closeModal={closeModal}
              />
            </Elements>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembershipPackages;
