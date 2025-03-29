"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Info, Database, Award, Calendar, ShieldAlert, Settings, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "./language-provider"
import { useAuth } from "@/hooks/use-auth"

interface MainNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function MainNavigation({ activeTab, onTabChange }: MainNavigationProps) {
  const { t } = useLanguage()
  const { isAdmin } = useAuth()
  const pathname = usePathname()

  const tabs = [
    { id: "kingdom", label: "kingdomTab", icon: <Info className="h-4 w-4 mr-1" /> },
    { id: "kvk", label: "kvkTab", icon: <Database className="h-4 w-4 mr-1" /> },
    { id: "hall", label: "hallOfFameTab", icon: <Award className="h-4 w-4 mr-1" /> },
    { id: "events", label: "eventsTab", icon: <Calendar className="h-4 w-4 mr-1" /> },
    { id: "more", label: "moreTab", icon: <MoreHorizontal className="h-4 w-4 mr-1" /> },
  ]

  // Add admin tab if user is admin
  if (isAdmin) {
    tabs.push({ id: "admin", label: "adminTab", icon: <Settings className="h-4 w-4 mr-1" /> })
  }

  return (
    <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg shadow-md">
      <div className={cn(
        "grid gap-2",
        isAdmin 
          ? "grid-cols-3 sm:grid-cols-6" // Khi có admin tab, giữ nguyên layout cũ
          : "grid-cols-2 sm:grid-cols-5" // Khi không có admin tab, điều chỉnh số cột để giãn đều
      )}>
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "outline"}
            className={cn(
              activeTab === tab.id ? "bg-blue-600 border-blue-700" : "bg-white dark:bg-gray-800",
              "text-xs sm:text-sm px-2 sm:px-4 flex items-center justify-center shadow-sm w-full"
            )}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.icon}
            <span className="truncate">{String(t(tab.label))}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}

export function MainNav({ className }: { className?: string }) {
  const pathname = usePathname()

  return (
    <nav className={cn("main-nav", className)}>
      <Link 
        href="/kingdom" 
        className={cn(
          "main-nav-item",
          pathname.startsWith("/kingdom") && "active"
        )}
      >
        Giới thiệu Vương quốc
      </Link>
      <Link 
        href="/kvk" 
        className={cn(
          "main-nav-item",
          pathname.startsWith("/kvk") && "active"
        )}
      >
        Dữ liệu KVK
      </Link>
      <Link 
        href="/hall-of-fame" 
        className={cn(
          "main-nav-item",
          pathname.startsWith("/hall-of-fame") && "active"
        )}
      >
        Đại sảnh anh hùng
      </Link>
      <Link 
        href="/events" 
        className={cn(
          "main-nav-item",
          pathname.startsWith("/events") && "active"
        )}
      >
        Sự kiện
      </Link>
      <Link 
        href="/blacklist" 
        className={cn(
          "main-nav-item",
          pathname.startsWith("/blacklist") && "active"
        )}
      >
        Danh sách đen
      </Link>
    </nav>
  )
}

