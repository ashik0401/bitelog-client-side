import { motion } from "framer-motion";
import { Link } from "react-router";


export function SalesPromotion() {
    return (
        <section className="py-16 ">
            <div className="max-w-6xl bg-orange-100 dark:bg-transparent   mx-auto px-4 text-center py-10 rounded-2xl">
                <motion.h2
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-3xl md:text-4xl font-bold mb-6 text-black dark:text-white"
                >
                    🎉 Special Hostel Meal Membership Offers!
                </motion.h2>
                <p className="mb-8 text-lg text-black dark:text-white">
                    Get up to <span className="font-semibold text-orange-500 dark:text-orange-500 ">30% off</span> on Silver, Gold, and Platinum meal packages.
                </p>
                <button
                    onClick={() => {
                        const membershipSection = document.getElementById("membership");
                        membershipSection?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="bg-white text-orange-500 font-semibold px-6 py-6 rounded-md shadow-md dark:text-orange-500 dark:bg-transparent border border-orange-300 cursor-pointer btn "
                >
                    Grab Your Offer
                </button>

            </div>
        </section>
    );
}