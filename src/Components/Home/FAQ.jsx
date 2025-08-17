import { motion } from "framer-motion";

export function FAQ() {
  const faqs = [
    { q: "How do I request a meal?", a: "Go to the Meals page, select a meal, and click 'Request'." },
    { q: "Can I change my membership plan?", a: "Yes, you can upgrade anytime." },
    { q: "How are reviews moderated?", a: "Admins can remove inappropriate reviews." },
  ];

  return (
    <section className="py-16">
      <div className="max-w-5xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-center mb-10"
        >
          ❓ Frequently Asked Questions
        </motion.h2>
        <div className="space-y-4">
          {faqs.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white dark:bg-transparent p-6 rounded-xl shadow-md"
            >
              <div className="collapse collapse-arrow bg-base-100">
                <input type="checkbox" aria-expanded="false" />
                <div className="collapse-title font-semibold cursor-pointer">{item.q}</div>
                <div className="collapse-content text-sm leading-relaxed">{item.a}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
