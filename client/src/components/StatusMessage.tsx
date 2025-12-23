import { AnimatePresence, motion } from "framer-motion";

interface MessageProps {
  isVisible: boolean;
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export const FloatingOrb: React.FC<MessageProps> = ({ isVisible, message, type, onClose }) => {
  const isSuccess = type === 'success';
  const glow = isSuccess ? 'rgba(92, 160, 242, 0.5)' : 'rgba(255, 71, 87, 0.5)';

  return (
    <AnimatePresence>
      {isVisible && (
        <div style={{
            position: 'fixed',
            bottom: '40px',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            zIndex: 10000,
            pointerEvents: 'none'
        }}>
            <motion.div
            initial={{ y: 100, scale: 0.5, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 100, scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{
                pointerEvents: 'auto',
                background: 'rgba(20, 20, 20, 0.6)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '50px', // Full pill shape
                padding: '10px 25px',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                boxShadow: `0 20px 40px -10px #000, 0 0 20px ${glow}`,
                cursor: 'pointer'
            }}
            onClick={onClose}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            >
            <div style={{
                background: isSuccess ? '#5CA0F2' : '#ff4757',
                borderRadius: '50%',
                width: '10px',
                height: '10px',
                boxShadow: `0 0 10px ${isSuccess ? '#5CA0F2' : '#ff4757'}`
            }} />
            
            <span style={{ 
                color: '#fff', 
                fontSize: '0.95rem',
                fontWeight: 500 
            }}>
                {message}
            </span>
            </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};