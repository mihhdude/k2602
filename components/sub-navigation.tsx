"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface SubNavigationProps {
  tabs: { id: string; label: string; icon?: React.ReactNode }[]
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function SubNavigation({ tabs, activeTab, setActiveTab }: SubNavigationProps) {
  return (
    <div className="relative p-1 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "relative px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
              "hover:bg-white/80 dark:hover:bg-gray-700/80",
              "flex items-center gap-2",
              activeTab === tab.id ? "text-primary" : "text-muted-foreground"
            )}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-white dark:bg-gray-700 rounded-lg shadow-sm"
                transition={{ type: "spring", duration: 0.5 }}
                initial={false}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              {tab.icon}
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

