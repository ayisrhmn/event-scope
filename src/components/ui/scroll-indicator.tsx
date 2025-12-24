"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

export function ScrollIndicator() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 100], [1, 0]);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (y) => setVisible(y < 150));
    return () => unsubscribe();
  }, [scrollY]);

  if (!visible) return null;

  return (
    <motion.div
      style={{ opacity }}
      className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center text-muted-foreground"
    >
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <ChevronDown className="w-6 h-6" />
      </motion.div>
      <p className="text-sm mt-1">Scroll</p>
    </motion.div>
  );
}
