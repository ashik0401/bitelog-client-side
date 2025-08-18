import { motion } from "framer-motion";

export function Reviews() {
  const reviews = [
    { name: "Rahim", text: "The meals are delicious and fresh!" },
    { name: "Ayesha", text: "Affordable and convenient hostel food." },
    { name: "Karim", text: "Love the membership benefits and offers!" },
  ];

  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-center mb-10 text-black dark:text-white"
        >
          ⭐ Student Reviews
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div key={i} className="bg-white dark:bg-transparent  p-6 rounded-xl shadow-lg border border-gray-200">
              <p className="text-gray-600 dark:text-white italic mb-4">“{r.text}”</p>
              <h4 className="font-semibold text-orange-500">— {r.name}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
