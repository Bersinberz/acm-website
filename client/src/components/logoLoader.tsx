import { motion } from 'framer-motion';
import loadingImage from '../assets/acm-loader-logo.png';

const logoLoading = () => {
  return (
    <motion.div className="loading-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.img
        src={loadingImage}
        alt="Loading"
        className="loading-image"
        animate={{ rotateY: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
      <motion.p
        className="loading-text"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
      </motion.p>
    </motion.div>
  );
};

export default logoLoading;
