import { motion } from "framer-motion";

export function BackgroundGlows() {
  return (
    <div className="pointer-events-none absolute inset-0">
      {/* Верхній лівий */}
      <motion.div
        className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-[#22E4FF] opacity-25 blur-3xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.25, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      {/* Верхній правий */}
      <motion.div
        className="absolute right-[-40px] top-0 h-80 w-80 rounded-full bg-[#F044FF] opacity-20 blur-3xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.2, scale: 1 }}
        transition={{ duration: 1.4, ease: "easeOut", delay: 0.1 }}
      />
      {/* Центр / низ */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#5B5BFF] opacity-20 blur-3xl"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{
          opacity: 0.2,
          scale: 1,
          y: 0,
        }}
        transition={{ duration: 1.6, ease: "easeOut", delay: 0.15 }}
      />
    </div>
  );
}
