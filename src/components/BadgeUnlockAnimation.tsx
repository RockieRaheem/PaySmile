"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Confetti from "react-confetti";
import { X, ExternalLink, Share2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface BadgeUnlockAnimationProps {
  isOpen: boolean;
  onClose: () => void;
  badgeData: {
    tier: string;
    name: string;
    image: string;
    achievementTitle: string;
    achievementMessage: string;
    transactionHash?: string;
  };
}

export function BadgeUnlockAnimation({
  isOpen,
  onClose,
  badgeData,
}: BadgeUnlockAnimationProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      // Update window size for confetti
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      // Stop confetti after 5 seconds
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${badgeData.achievementTitle}!`,
        text: `I just earned the ${badgeData.name} badge on PaySmile! ${badgeData.achievementMessage}`,
        url: window.location.origin,
      });
    }
  };

  const handleViewOnExplorer = () => {
    if (badgeData.transactionHash) {
      window.open(
        `https://alfajores.celoscan.io/tx/${badgeData.transactionHash}`,
        "_blank"
      );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Confetti */}
          {showConfetti && (
            <Confetti
              width={windowSize.width}
              height={windowSize.height}
              recycle={false}
              numberOfPieces={500}
              gravity={0.3}
            />
          )}

          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200]"
            onClick={onClose}
          />

          {/* Achievement Card */}
          <div className="fixed inset-0 flex items-center justify-center z-[201] p-4">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
              }}
              className="max-w-md w-full"
            >
              <Card className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/10 border-2 border-primary/20 shadow-2xl">
                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 z-10"
                  onClick={onClose}
                >
                  <X className="h-4 w-4" />
                </Button>

                {/* Content */}
                <div className="p-8 text-center space-y-6">
                  {/* Achievement Title */}
                  <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h2 className="text-3xl font-bold text-primary mb-2">
                      {badgeData.achievementTitle}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Achievement Unlocked
                    </p>
                  </motion.div>

                  {/* Badge Image with Glow Effect */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="relative"
                  >
                    <div className="relative w-48 h-48 mx-auto">
                      {/* Glow effect */}
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 0.8, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="absolute inset-0 rounded-full bg-primary/20 blur-2xl"
                      />

                      {/* Badge */}
                      <motion.div
                        animate={{
                          y: [0, -10, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="relative z-10"
                      >
                        <Image
                          src={badgeData.image}
                          alt={badgeData.name}
                          width={192}
                          height={192}
                          className="w-full h-full object-contain drop-shadow-2xl"
                        />
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Badge Info */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-2"
                  >
                    <h3 className="text-2xl font-bold">{badgeData.name}</h3>
                    <div className="inline-block px-4 py-1 bg-primary/10 rounded-full">
                      <span className="text-sm font-medium text-primary">
                        {badgeData.tier} Tier
                      </span>
                    </div>
                    <p className="text-muted-foreground">
                      {badgeData.achievementMessage}
                    </p>
                  </motion.div>

                  {/* Actions */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex gap-2 justify-center"
                  >
                    {badgeData.transactionHash && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleViewOnExplorer}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View NFT
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={handleShare}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </motion.div>

                  {/* Continue Button */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Button
                      size="lg"
                      className="w-full font-semibold"
                      onClick={onClose}
                    >
                      Continue Your Journey ✨
                    </Button>
                  </motion.div>
                </div>

                {/* Decorative Elements */}
                <motion.div
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute -top-20 -left-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl"
                />
                <motion.div
                  animate={{
                    rotate: -360,
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute -bottom-20 -right-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl"
                />
              </Card>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
