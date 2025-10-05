import { motion } from 'framer-motion';

export const Loading = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-center text-gray-500 p-4"
  >
    Загрузка...
  </motion.div>
);
