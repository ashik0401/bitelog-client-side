import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useEffect, useState } from 'react'
import CountUp from './CountUp'

const StatsSection = () => {
  const controls = useAnimation()
  const [ref, inView] = useInView({ threshold: 0.3 })
  const [animateCount, setAnimateCount] = useState(false)

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, y: 0, transition: { duration: 0.6 } })
      setAnimateCount(true)
    } else {
      controls.start({ opacity: 0, y: 40 })
      setAnimateCount(false)
    }
  }, [inView, controls])

  const stats = [
    { label: 'Students Served', value: 1250, icon: '👨‍🎓' },
    { label: 'Monthly Meals Delivered', value: 10000, icon: '🍱' },
    { label: 'Verified Reviews', value: 4800, icon: '📝' },
    { label: 'Active Subscriptions', value: 800, icon: '💳' },
  ]

  return (
    <section ref={ref} className=" py-16 ">
      <motion.div animate={controls} initial={{ opacity: 0, y: 40 }} className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-4 text-[#012200] ">Our Impact at a Glance</h2>
        <p className="text-gray-600 mb-12 max-w-xl mx-auto ">A trusted system delivering daily value across the university community.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div key={i} whileHover={{ scale: 1.05 }} className="bg-white text-black border-gray-500 shadow-md  p-6 rounded-xl text-center transition">
              <div className="text-4xl mb-2">{stat.icon}</div>
              {animateCount ? (
                <CountUp target={stat.value} duration={1.5} />
              ) : (
                <span className="text-3xl font-bold ">0</span>
              )}
              <p className="text-sm text-gray-600  mt-1 ">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

export default StatsSection
