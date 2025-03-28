"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "./language-provider"
import { Blacklist } from "./blacklist"
import { OnLeave } from "./on-leave"
import { ShieldAlert, UserMinus } from "lucide-react"

export function More() {
  const [activeTab, setActiveTab] = useState("blacklist")
  const { t } = useLanguage()

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="blacklist" className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4" />
          <span>{String(t("blacklistTab"))}</span>
        </TabsTrigger>
        <TabsTrigger value="onLeave" className="flex items-center gap-2">
          <UserMinus className="h-4 w-4" />
          <span>{String(t("onLeaveTab"))}</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="blacklist" className="space-y-4">
        <Blacklist />
      </TabsContent>
      <TabsContent value="onLeave" className="space-y-4">
        <OnLeave />
      </TabsContent>
    </Tabs>
  )
} 