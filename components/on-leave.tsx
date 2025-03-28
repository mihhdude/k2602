"use client"

import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, UserMinus, Calendar } from "lucide-react"
import { useLanguage } from "./language-provider"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface OnLeavePlayer {
  governor_id: string
  governor_name: string
  on_leave: boolean
  updated_at: string
}

export function OnLeave() {
  const [players, setPlayers] = useState<OnLeavePlayer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { t } = useLanguage()

  useEffect(() => {
    fetchOnLeavePlayers()
  }, [])

  const fetchOnLeavePlayers = async () => {
    try {
      const { data, error } = await supabase
        .from("player_status")
        .select("*")
        .eq("on_leave", true)
        .order("updated_at", { ascending: false })

      if (error) {
        throw error
      }

      setPlayers(data || [])
    } catch (error) {
      console.error("Error fetching on leave players:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPlayers = players.filter(
    (player) =>
      player.governor_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.governor_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <div>Đang tải dữ liệu...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center">
          <UserMinus className="h-6 w-6 mr-2 text-yellow-500" />
          {String(t("onLeaveList"))}
        </h1>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={String(t("searchById"))}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {filteredPlayers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <UserMinus className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Không có người chơi nào đang nghỉ phép</h3>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPlayers.map((player) => (
            <Card key={player.governor_id}>
              <CardHeader className="flex flex-row items-center gap-4">
                <UserMinus className="h-8 w-8 text-yellow-500" />
                <div>
                  <CardTitle className="text-lg">{player.governor_name}</CardTitle>
                  <p className="text-sm text-muted-foreground">ID: {player.governor_id}</p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Cập nhật: {new Date(player.updated_at).toLocaleDateString("vi-VN")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 