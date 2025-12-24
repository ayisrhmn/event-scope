"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { motion } from "framer-motion";
import { ArrowRight, Clock, FileCode2, Play, Zap } from "lucide-react";

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 md:p-8 relative overflow-x-hidden">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 md:top-8 md:right-8 z-50">
        <ThemeToggle />
      </div>

      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          className="absolute top-[-5%] left-[-5%] md:top-[-10%] md:left-[-10%] w-[60%] h-[60%] md:w-[40%] md:h-[40%] bg-primary/5 rounded-full blur-[80px] md:blur-[120px]"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", delay: 1 }}
          className="absolute bottom-[-5%] right-[-5%] md:bottom-[-10%] md:right-[-10%] w-[60%] h-[60%] md:w-[40%] md:h-[40%] bg-primary/10 rounded-full blur-[80px] md:blur-[120px]"
        />
      </div>

      <div className="max-w-5xl w-full space-y-12 md:space-y-16 py-12 md:py-20 relative">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6 md:space-y-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs md:sm font-medium mb-2 md:mb-4"
          >
            <Zap className="size-3 md:size-4" />
            <span>Introducing EventScope v1.0</span>
          </motion.div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
            Master Your <span className="text-primary">Event Tracking</span>{" "}
            <br className="hidden sm:block" />
            with Precision.
          </h1>

          <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2">
            The ultimate playground to design, simulate, and validate your analytics events before
            they hit production. Ensure data quality from the start.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 pt-2 md:pt-4"
          >
            <Button
              size="lg"
              onClick={onGetStarted}
              className="w-full sm:w-auto h-12 text-base gap-2 group"
            >
              Get Started
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
        >
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5 group">
            <CardContent className="p-5 md:p-6 space-y-4">
              <div className="p-2.5 md:p-3 rounded-xl bg-blue-500/10 text-blue-500 w-fit group-hover:scale-110 transition-transform">
                <FileCode2 className="size-5 md:size-6" />
              </div>
              <div className="space-y-1.5 md:space-y-2">
                <h3 className="font-semibold text-lg md:text-xl">Schema Builder</h3>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                  Define structured event data with ease. Create reusable templates for your
                  tracking plan.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5 group">
            <CardContent className="p-5 md:p-6 space-y-4">
              <div className="p-2.5 md:p-3 rounded-xl bg-green-500/10 text-green-500 w-fit group-hover:scale-110 transition-transform">
                <Play className="size-5 md:size-6" />
              </div>
              <div className="space-y-1.5 md:space-y-2">
                <h3 className="font-semibold text-lg md:text-xl">Event Simulator</h3>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                  Test your tracking implementation in real-time. Send mock events and see instant
                  results.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5 group sm:col-span-2 md:col-span-1">
            <CardContent className="p-5 md:p-6 space-y-4">
              <div className="p-2.5 md:p-3 rounded-xl bg-purple-500/10 text-purple-500 w-fit group-hover:scale-110 transition-transform">
                <Clock className="size-5 md:size-6" />
              </div>
              <div className="space-y-1.5 md:space-y-2">
                <h3 className="font-semibold text-lg md:text-xl">Event Timeline</h3>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                  Monitor chronological event history. Validate payloads against your schemas
                  automatically.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-auto py-8 text-xs md:text-sm text-muted-foreground text-center"
      >
        Built for developers who care about data quality.
      </motion.footer>
    </div>
  );
}
