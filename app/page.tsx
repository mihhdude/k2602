"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { MainNavigation } from "@/components/main-navigation"
import { Introduction } from "@/components/introduction"
import { KvKData } from "@/components/kvk-data"
import { HallOfFame } from "@/components/hall-of-fame"
import { Events } from "@/components/events"
import { More } from "@/components/more"
import { AdminPanel } from "@/components/admin-panel"
import { Footer } from "@/components/footer"
import { useAuth } from "@/hooks/use-auth"
import { MGEEvent } from './components/mge-event'

export default function Home() {
  const [activeTab, setActiveTab] = useState("kingdom")
  const { isAdmin } = useAuth()

  // Ensure mobile-first design by setting viewport meta tag
  useEffect(() => {
    const meta = document.createElement("meta")
    meta.name = "viewport"
    meta.content = "width=device-width, initial-scale=1, maximum-scale=1"
    document.head.appendChild(meta)

    return () => {
      document.head.removeChild(meta)
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-2 sm:px-4 pb-6">
        <div className="my-4">
          <MainNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        <div className="mt-6">
          {activeTab === "kingdom" && <Introduction />}
          {activeTab === "kvk" && <KvKData />}
          {activeTab === "hall" && <HallOfFame />}
          {activeTab === "events" && (
            <>
              <Events />
              <MGEEvent />
            </>
          )}
          {activeTab === "more" && <More />}
          {isAdmin && activeTab === "admin" && <AdminPanel />}
        </div>
      </main>
      <Footer />
    </div>
  )
}

