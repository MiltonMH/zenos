import { motion } from "framer-motion";
import zenionSquare from "@/assets/zenion-square.svg";
import zenionLogo from "@/assets/zenion-logo.png";

export function LoginBoltHero() {
  return (
    <div className="flex flex-col items-center mb-2">
      <div className="relative h-[130px] w-[130px] flex items-center justify-center mb-7">
        <div
          className="absolute h-[90px] w-[90px] rounded-full bg-primary/25"
          style={{ filter: "blur(22px)" }}
        />

        <motion.div
          className="absolute h-[105px] w-[105px] rounded-full bg-primary/30"
          style={{ filter: "blur(18px)" }}
          animate={{ opacity: [0.1, 0.7, 0.15, 0.55, 0.1] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", times: [0, 0.2, 0.5, 0.75, 1] }}
        />

        <motion.div
          className="absolute h-[65px] w-[65px] rounded-full bg-primary/55"
          style={{ filter: "blur(8px)" }}
          animate={{ opacity: [0.2, 0.8, 0.25, 0.65, 0.2] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", times: [0, 0.2, 0.5, 0.75, 1], delay: 0.15 }}
        />

        <motion.img
          src={zenionSquare}
          alt="Zenion"
          className="relative h-[70px] w-[70px]"
          style={{ filter: "drop-shadow(0 0 8px rgba(29,143,130,0.7))" }}
          animate={{ scale: [1, 1.04, 1, 1.03, 1], opacity: [0.82, 1, 0.88, 1, 0.82] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", times: [0, 0.2, 0.5, 0.75, 1] }}
        />

        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 130 130"
          fill="none"
          style={{ color: "hsl(var(--primary))" }}
        >
          <motion.path
            d="M90,40 L97,33 L93,28 L102,20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 0.9, repeat: Infinity, repeatDelay: 3.2, ease: "easeInOut" }}
          />
          <motion.path
            d="M40,40 L33,33 L37,28 L28,20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 0.9, repeat: Infinity, repeatDelay: 3.8, delay: 1.6, ease: "easeInOut" }}
          />
          <motion.path
            d="M100,63 L109,58 L105,52 L116,47"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 3.5, delay: 0.8, ease: "easeInOut" }}
          />
          <motion.path
            d="M90,90 L97,97 L93,103 L102,112"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 4.2, delay: 3.0, ease: "easeInOut" }}
          />
          <motion.path
            d="M65,30 L70,22 L66,17 L72,8"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 0.75, repeat: Infinity, repeatDelay: 4.5, delay: 0.4, ease: "easeInOut" }}
          />
          <motion.path
            d="M30,63 L21,58 L25,52 L14,47"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 0.75, repeat: Infinity, repeatDelay: 5.0, delay: 2.2, ease: "easeInOut" }}
          />
        </svg>
      </div>

      <img src={zenionLogo} alt="Zenion" className="h-7" />
    </div>
  );
}
