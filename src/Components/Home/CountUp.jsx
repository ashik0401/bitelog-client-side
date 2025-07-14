import { useEffect, useState } from 'react'
import { motion, useMotionValue, animate } from 'framer-motion'

const CountUp = ({ target, duration = 1.5 }) => {
  const count = useMotionValue(0)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const controls = animate(count, target, {
      duration,
      onUpdate: (latest) => setDisplay(Math.floor(latest)),
    })
    return controls.stop
  }, [target])

  return (
    <motion.span className="text-3xl font-bold text-primary">
      {display.toLocaleString()}
    </motion.span>
  )
}

export default CountUp
