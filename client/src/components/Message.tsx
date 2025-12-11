import React, { useEffect, useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { createPortal } from "react-dom";

// --- CSS Styles (Enhanced for Glossy/Animatic feel) ---
const toastStyles = `
  .custom-toast-container {
    /* Glassmorphism base */
    background: rgba(255, 255, 255, 0.85); /* More transparent */
    backdrop-filter: blur(12px) saturate(150%); /* Frosted glass effect */
    border: 1px solid rgba(255, 255, 255, 0.5); /* Subtle reflective border */
    box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.15); /* Deeper, softer shadow */

    /* Initial Animation State */
    opacity: 0;
    /* Spring physics bezier curve for a energetic "pop" */
    transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  /* Hover effect - slight lift */
  .custom-toast-container:hover {
      transform: translateY(-3px) scale(1.01) !important; /* Important overrides the entrance transform */
      box-shadow: 0 15px 35px -5px rgba(0, 0, 0, 0.2);
  }

  /* The active state */
  .custom-toast-container.enter {
    opacity: 1;
    /* Transform reset is handled inline to account for positioning */
  }

  /* Icon container gradient backgrounds */
  .toast-icon-bg-success { background: linear-gradient(135deg, #d1e7dd 0%, #a8dbbf 100%); }
  .toast-icon-bg-error { background: linear-gradient(135deg, #f8d7da 0%, #e6b3b9 100%); }
  .toast-icon-bg-warning { background: linear-gradient(135deg, #fff3cd 0%, #ffe69c 100%); }
  .toast-icon-bg-info { background: linear-gradient(135deg, #cff4fc 0%, #a5eeff 100%); }

  /* Progress Bar Animation */
  @keyframes toastProgress {
    from { width: 100%; }
    to { width: 0%; }
  }

  /* Shimmer effect overlay for progress bar */
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  .progress-shimmer-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(255,255,255,0) 0%,
      rgba(255,255,255,0.4) 50%,
      rgba(255,255,255,0) 100%
    );
    animation: shimmer 2s infinite;
  }
`;

// Use a portal to attach toasts to the body, preventing z-index issues within other components
const Portal = ({ children }: { children: React.ReactNode }) => {
    // Need to check if document exists for SSR compatibility (like Next.js)
    if (typeof document === "undefined") return null;
    const mount = document.body;
    return createPortal(children, mount);
};


export type ToastPosition =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left"
  | "top-center"
  | "bottom-center";

interface MessageProps {
  variant?: "success" | "error" | "warning" | "info";
  show?: boolean;
  onClose?: () => void;
  duration?: number;
  dismissible?: boolean;
  children: React.ReactNode;
  className?: string;
  position?: ToastPosition;
}

const Message: React.FC<MessageProps> = ({
  variant = "info",
  show = true,
  onClose,
  duration = 4500,
  dismissible = true,
  children,
  className = "",
  position = "top-right",
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  // Use ReturnType<typeof setTimeout> for browser compatibility
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animationDuration = 500; // Matches CSS transition duration

  // --- Config & Gradients ---
  const config = {
    success: { color: "#198754", icon: "bi-check-circle-fill", gradientClass: "toast-icon-bg-success", barGradient: "linear-gradient(90deg, #198754, #20c997)" },
    error: { color: "#dc3545", icon: "bi-x-circle-fill", gradientClass: "toast-icon-bg-error", barGradient: "linear-gradient(90deg, #dc3545, #ff6b6b)" },
    warning: { color: "#c49300", icon: "bi-exclamation-triangle-fill", gradientClass: "toast-icon-bg-warning", barGradient: "linear-gradient(90deg, #ffc107, #ffca2c)" },
    info: { color: "#0dcaf0", icon: "bi-info-circle-fill", gradientClass: "toast-icon-bg-info", barGradient: "linear-gradient(90deg, #0dcaf0, #3dd5f3)" },
  }[variant];

  // --- Lifecycle Logic ---

  useEffect(() => {
    if (show) {
      // Tiny delay to allow DOM render before starting animation class
      requestAnimationFrame(() => {
          setTimeout(() => setIsMounted(true), 10);
      });
    } else {
      setIsMounted(false);
    }
  }, [show]);


  useEffect(() => {
    // Only start timer if showing, has duration, is fully mounted, and not hovered
    if (show && duration && !isHovered && isMounted) {
      closeTimerRef.current = setTimeout(() => {
        handleTriggerClose();
      }, duration);
    }

    // Clean up timer whenever dependencies change (e.g. hover starts)
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, [show, duration, isHovered, isMounted]);


  const handleTriggerClose = () => {
    setIsMounted(false); // Triggers CSS exit transition
    // Wait for animation to finish before unmounting from React tree
    setTimeout(() => {
      onClose?.();
    }, animationDuration);
  };

  if (!show) return null;

  // --- Positioning Styles ---
  const getPositionStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: "fixed",
      zIndex: 9999, // Extremely high z-index
      margin: "24px",
      // Define the starting "off-screen" position and scale for the entrance animation
      transform: position.includes("top") ? "translateY(-60px) scale(0.9)" : "translateY(60px) scale(0.9)",
      ...(position.includes("center") && {
         left: "50%",
         marginLeft: 0,
         // Adjust center transforms to account for the X offset
         transform: position.includes("top") ? "translate(-50%, -60px) scale(0.9)" : "translate(-50%, 60px) scale(0.9)"
      })
    };

    // Define final "on-screen" positions
    const activeTransforms = {
        standard: "translateY(0) scale(1)",
        center: "translate(-50%, 0) scale(1)"
    };

    // Apply the correct transform based on mounted state
    if (isMounted) {
       base.transform = position.includes("center") ? activeTransforms.center : activeTransforms.standard;
    }

    switch (position) {
      case "top-right": return { ...base, top: 0, right: 0 };
      case "top-left": return { ...base, top: 0, left: 0 };
      case "bottom-right": return { ...base, bottom: 0, right: 0 };
      case "bottom-left": return { ...base, bottom: 0, left: 0 };
      case "top-center": return { ...base, top: 0 };
      case "bottom-center": return { ...base, bottom: 0 };
      default: return base;
    }
  };

  // Wrap in portal so it attaches to body, outside main app flow
  return (
    <Portal>
      {/* Inject styles */}
      <style>{toastStyles}</style>

      <div
        className={`custom-toast-container rounded-4 overflow-hidden ${
          isMounted ? "enter" : ""
        } ${className}`}
        style={{
          ...getPositionStyles(),
          minWidth: "340px",
          maxWidth: "450px",
          // We replace the left border with a gradient accent border
          borderLeft: `6px solid ${config.color}`,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role="alert"
      >
        <div className="d-flex align-items-center p-3">
          {/* Icon Container with Gradient Background */}
          <div
            className={`rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0 shadow-sm ${config.gradientClass}`}
            style={{ width: "42px", height: "42px" }}
          >
            {/* Added a slight text shadow to the icon for pop */}
            <i className={`bi ${config.icon} fs-5`} style={{ color: config.color, filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.1))" }}></i>
          </div>

          {/* Content */}
          <div className="flex-grow-1 pe-3" style={{ fontSize: "0.95rem", color: "#2c3e50", fontWeight: 500 }}>
            {children}
          </div>

          {/* Close Button */}
          {dismissible && onClose && (
            <button
              type="button"
              className="btn-close btn-sm flex-shrink-0 align-self-start mt-1 opacity-50 hover-opacity-100"
              aria-label="Close"
              onClick={handleTriggerClose}
              style={{boxShadow:"none", transition: "opacity 0.2s"}}
            ></button>
          )}
        </div>

         {/* Animated Gradient Progress Bar with Shimmer overlay */}
         {duration && (
          <div style={{ height: "5px", backgroundColor: "rgba(0,0,0,0.05)", width: "100%", position: "relative", overflow:"hidden" }}>
            <div
              style={{
                height: "100%",
                background: config.barGradient, // Using gradient instead of solid color
                animation: `toastProgress ${duration}ms linear forwards`,
                animationPlayState: isHovered || !isMounted ? "paused" : "running",
                position: "relative",
                overflow: "hidden" // Ensure shimmer stays inside bar
              }}
            >
                 {/* The shimmer overlay */}
                <div className="progress-shimmer-overlay"></div>
            </div>
          </div>
        )}
      </div>
    </Portal>
  );
};

export default Message;