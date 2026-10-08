import { motion, useReducedMotion } from 'framer-motion'

function Reveal({ children, className, delay = 0, ...props }) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: reduceMotion ? 0 : 0.45, delay: reduceMotion ? 0 : delay, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default Reveal
