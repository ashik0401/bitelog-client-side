import React from "react";
import { motion } from "framer-motion";
import { Users, UtensilsCrossed, ShieldCheck, Star } from "lucide-react";
import Footer from "../shared/Footer";
import Navbar from "../shared/Navbar";

const AboutUs = () => {
  return (
   <>
   <Navbar/>
   <section>
     <div className="bg-gradient-to-b from-orange-50 to-white  pt-30 px-6 md:px-12 lg:px-24 pb-2">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center max-w-3xl mx-auto mb-12"
      >
        <h2 className="text-4xl font-extrabold text-gray-800 mb-4">
          About <span className="text-orange-600">BiteLog</span>
        </h2>
        <p className="text-gray-600 leading-relaxed">
          BiteLog is a smart hostel meal management system designed for
          university students. We make dining simple, transparent, and fair with
          advanced meal tracking, requests, reviews, and membership perks.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-lg rounded-2xl p-6 text-center hover:shadow-xl transition"
        >
          <Users className="w-12 h-12 mx-auto text-orange-600 mb-4" />
          <h3 className="text-lg font-bold mb-2">Student Friendly</h3>
          <p className="text-sm text-gray-600">
            Designed for hostel life, BiteLog gives students complete control
            over their dining experience.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white shadow-lg rounded-2xl p-6 text-center hover:shadow-xl transition"
        >
          <UtensilsCrossed className="w-12 h-12 mx-auto text-orange-600 mb-4" />
          <h3 className="text-lg font-bold mb-2">Meal Management</h3>
          <p className="text-sm text-gray-600">
            From viewing meals to requesting, liking, and reviewing, everything
            is managed with just a click.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white shadow-lg rounded-2xl p-6 text-center hover:shadow-xl transition"
        >
          <ShieldCheck className="w-12 h-12 mx-auto text-orange-600 mb-4" />
          <h3 className="text-lg font-bold mb-2">Secure & Reliable</h3>
          <p className="text-sm text-gray-600">
            With role-based dashboards, JWT authentication, and Stripe
            integration, your data and payments are safe.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white shadow-lg rounded-2xl p-6 text-center hover:shadow-xl transition"
        >
          <Star className="w-12 h-12 mx-auto text-orange-600 mb-4" />
          <h3 className="text-lg font-bold mb-2">Membership Badges</h3>
          <p className="text-sm text-gray-600">
            Unlock Silver, Gold, and Platinum benefits — get more features,
            priority access, and premium perks.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-12 text-center max-w-4xl mx-auto"
      >
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          🎯 Our Mission
        </h3>
        <p className="text-gray-600 leading-relaxed pb-4">
          We believe hostel dining should be fair, transparent, and enjoyable.
          BiteLog bridges the gap between students and meal distributors by
          creating a reliable and engaging platform that empowers both sides.
        </p>
      </motion.div>
    </div>
   </section>
    <Footer></Footer>
   </>
  );
};

export default AboutUs;
