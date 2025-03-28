"use client"

import { useState, useEffect } from "react"
import { Calendar, Trophy, Gem, Swords, Users, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@supabase/supabase-js"
import { useLanguage } from "./language-provider"
import { useAuth } from "@/hooks/use-auth"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface GameEvent {
  id: number
  title: string
  event_type: "MGE" | "MoreThanGems" | "KvK" | "Alliance" | "Other"
  start_date: string
  end_date: string
  description: string | null
  created_at?: string
}

export function Events() {
  const [events, setEvents] = useState<GameEvent[]>([])
  const [loading, setLoading] = useState(true)
  const { t } = useLanguage()
  const { isAdmin } = useAuth()

  useEffect(() => {
    fetchEvents()
  }, [])

  const getMockEvents = (): GameEvent[] => {
    return [
      {
        id: 1,
        title: "Mightiest Governor - YSS",
        event_type: "MGE",
        start_date: "2024-03-20",
        end_date: "2024-03-27",
        description: "Tranh đấu để giành được tướng Yi Sun-sin. Top 15 người chơi sẽ nhận được tượng tướng."
      },
      {
        id: 2,
        title: "More Than Gems",
        event_type: "MoreThanGems",
        start_date: "2024-03-15",
        end_date: "2024-03-17",
        description: "Tiêu Gems để nhận thêm phần thưởng giá trị. Nhận Universal Gold Heads và nhiều phần thưởng khác."
      },
      {
        id: 3,
        title: "Kingdom vs Kingdom Season 1",
        event_type: "KvK",
        start_date: "2024-04-01",
        end_date: "2024-04-30",
        description: "Chiến đấu với các kingdom khác để giành vinh quang và phần thưởng. Chuẩn bị quân đội và tài nguyên cho sự kiện lớn này."
      }
    ]
  }

  const fetchEvents = async () => {
    try {
      if (!supabaseUrl || !supabaseAnonKey) {
        console.error("Missing Supabase credentials - URL:", !!supabaseUrl, "Key:", !!supabaseAnonKey)
        setEvents(getMockEvents())
        setLoading(false)
        return
      }

      console.log("Fetching events from:", supabaseUrl)
      
      const { data, error } = await supabase
        .from("events")
        .select("id, title, event_type, start_date, end_date, description, created_at")
        .order("start_date", { ascending: true })

      if (error) {
        console.error("Supabase error details:", {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        })
        setEvents(getMockEvents())
      } else if (!data) {
        console.log("No data returned from Supabase")
        setEvents(getMockEvents())
      } else if (data.length === 0) {
        console.log("Empty data array returned from Supabase")
        setEvents(getMockEvents())
      } else {
        console.log("Successfully fetched events:", data)
        setEvents(data as GameEvent[])
      }
    } catch (err) {
      console.error("Unexpected error:", err)
      if (err instanceof Error) {
        console.error("Error details:", {
          name: err.name,
          message: err.message,
          stack: err.stack
        })
      }
      setEvents(getMockEvents())
    } finally {
      setLoading(false)
    }
  }

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case "MGE":
        return <Trophy className="h-6 w-6 text-yellow-500" />
      case "MoreThanGems":
        return <Gem className="h-6 w-6 text-purple-500" />
      case "KvK":
        return <Swords className="h-6 w-6 text-blue-500" />
      case "Alliance":
        return <Users className="h-6 w-6 text-green-500" />
      default:
        return <Calendar className="h-6 w-6 text-gray-500" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  if (loading) {
    return <div>Đang tải dữ liệu...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center">
          <Calendar className="h-6 w-6 mr-2 text-blue-500" />
          Sự kiện
        </h1>
      </div>

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Chưa có sự kiện nào</h3>
          {isAdmin && (
            <p className="text-sm text-gray-500">
              Bạn có thể thêm sự kiện mới trong tab Quản trị
            </p>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event.id}>
              <CardHeader className="flex flex-row items-center gap-4">
                {getEventIcon(event.event_type)}
                <div>
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {event.event_type}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {event.description}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Bắt đầu: {formatDate(event.start_date)}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Kết thúc: {formatDate(event.end_date)}</span>
                    </div>
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

