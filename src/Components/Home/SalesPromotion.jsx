import { motion } from "framer-motion";
import { Link } from "react-router";


export function SalesPromotion() {
    return (
        <section className="py-16 ">
            <div className="max-w-6xl bg-orange-100  mx-auto px-4 text-center py-10 rounded-2xl">
                <motion.h2
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-3xl md:text-4xl font-bold mb-6"
                >
                    🎉 Special Hostel Meal Membership Offers!
                </motion.h2>
                <p className="mb-8 text-lg">
                    Get up to <span className="font-semibold text-primary">30% off</span> on Silver, Gold, and Platinum meal packages.
                </p>
                <button
                    onClick={() => {
                        const membershipSection = document.getElementById("membership");
                        membershipSection?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="bg-white text-primary font-semibold px-6 py-3 rounded-2xl shadow-md"
                >
                    Grab Your Offer
                </button>

            </div>
        </section>
    );
}