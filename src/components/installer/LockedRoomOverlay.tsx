import { ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";

interface LockedRoomOverlayProps {
  children: ReactNode;
}

// Rendered via a portal directly into document.body so the "room" truly fills the
// whole viewport (frosted glass over the blurred app background) instead of being
// confined to the app's rounded card, which a plain fixed div nested inside a
// framer-motion-animated ancestor can't reliably do.
export function LockedRoomOverlay({ children }: LockedRoomOverlayProps) {
  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[100] locked-room-glass flex flex-col safe-top safe-bottom"
    >
      {children}
    </motion.div>,
    document.body
  );
}
