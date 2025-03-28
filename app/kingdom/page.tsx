"use client"

import { useState } from "react"
import { SubNavigation } from "@/components/sub-navigation"
import { Info, Crown } from "lucide-react"

export default function KingdomPage() {
  const [activeTab, setActiveTab] = useState("kingdom")

  const tabs = [
    {
      id: "kingdom",
      label: "Vương quốc",
      icon: <Info className="w-4 h-4" />
    },
    {
      id: "current-king",
      label: "Vua hiện tại",
      icon: <Crown className="w-4 h-4" />
    }
  ]

  return (
    <div className="container py-6">
      <SubNavigation 
        tabs={tabs} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
      <div className="mt-6">
        {activeTab === "kingdom" && (
          <div className="space-y-4">
            <h1>Thông tin Vương quốc</h1>
            {/* Kingdom content */}
          </div>
        )}
        {activeTab === "current-king" && (
          <div className="space-y-4">
            <h1>Vua hiện tại</h1>
            {/* Current king content */}
          </div>
        )}
      </div>
    </div>
  )
} 