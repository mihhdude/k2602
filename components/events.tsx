"use client"

import { useState, useEffect } from "react"
import { Calendar, Trophy, Gem, Swords, Users, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@supabase/supabase-js"
import { useLanguage } from "./language-provider"
import { useAuth } from "@/hooks/use-auth"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
        title: "Mightiest Governor - Infantry",
        event_type: "MGE",
        start_date: "2025-04-07",
        end_date: "2025-04-12",
        description: "Top 15 người chơi sẽ nhận được tượng tướng."
      },
      {
        id: 2,
        title: "More Than Gems",
        event_type: "MoreThanGems",
        start_date: "2025-04-12",
        end_date: "2025-04-13",
        description: "Tiêu Gems để nhận thêm phần thưởng giá trị. Nhận Universal Gold Heads và nhiều phần thưởng khác."
      },
      {
        id: 3,
        title: "Kingdom vs Kingdom Season 12",
        event_type: "KvK",
        start_date: "2025-03-05",
        end_date: "2025-04-25",
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
    <div className="w-full p-4">
      <Tabs defaultValue="mge" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="mge">MGE</TabsTrigger>
          <TabsTrigger value="gems">Tiêu Gem</TabsTrigger>
          <TabsTrigger value="other">Event Khác</TabsTrigger>
        </TabsList>
        
        <TabsContent value="mge" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events
              .filter(event => event.event_type === "MGE")
              .map((event) => (
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
        </TabsContent>
        
        <TabsContent value="gems" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events
              .filter(event => event.event_type === "MoreThanGems")
              .map((event) => (
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
        </TabsContent>
        
        <TabsContent value="other" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events
              .filter(event => !["MGE", "MoreThanGems"].includes(event.event_type))
              .map((event) => (
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
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface EventCardProps {
  title: string
  type: string
  description: string
  startDate: string
  endDate: string
  icon: string
}

function EventCard({ title, type, description, startDate, endDate, icon }: EventCardProps) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">{icon}</span>
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{type}</p>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <div className="flex flex-col gap-1 text-sm">
        <div className="flex items-center gap-2">
          <span>Bắt đầu:</span>
          <span className="text-muted-foreground">{startDate}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Kết thúc:</span>
          <span className="text-muted-foreground">{endDate}</span>
        </div>
      </div>
    </div>
  )
}

