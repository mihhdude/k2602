"use client"

import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Percent, Trash2 } from "lucide-react"
import { useLanguage } from "./language-provider"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "../hooks/use-session"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface KpiReduction {
  id: number
  governor_id: string
  governor_name: string
  reduction_percentage: number
  reason: string
  power_at_reduction: number
  created_at: string
}

export function KpiReductions() {
  const [reductions, setReductions] = useState<KpiReduction[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const { t } = useLanguage()
  const { toast } = useToast()
  const { session } = useSession()
  const isAdmin = session?.user?.user_metadata?.role === "admin"

  useEffect(() => {
    fetchKpiReductions()
  }, [])

  const fetchKpiReductions = async () => {
    try {
      const { data, error } = await supabase
        .from("kpi_reductions")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        throw error
      }

      setReductions(data || [])
    } catch (error) {
      console.error("Error fetching KPI reductions:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteReduction = async (id: number) => {
    if (!isAdmin) return

    setIsDeleting(true)
    try {
      const { error } = await supabase
        .from("kpi_reductions")
        .delete()
        .eq("id", id)

      if (error) {
        throw error
      }

      toast({
        title: "Thành công",
        description: "Đã xóa giảm KPI",
        variant: "default",
      })

      // Refresh the list
      fetchKpiReductions()
    } catch (error) {
      console.error("Error deleting KPI reduction:", error)
      toast({
        title: "Lỗi",
        description: "Không thể xóa giảm KPI",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const filteredReductions = reductions.filter(
    (reduction) =>
      reduction.governor_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reduction.governor_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <div>Đang tải dữ liệu...</div>
  }

  // Nếu không phải admin, không hiển thị gì cả
  if (!isAdmin) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center">
          <Percent className="h-6 w-6 mr-2 text-yellow-500" />
          Danh sách giảm KPI
        </h1>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo ID hoặc tên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {filteredReductions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Percent className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Không có người chơi nào được giảm KPI</h3>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredReductions.map((reduction) => (
            <Card key={reduction.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{reduction.governor_name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">ID: {reduction.governor_id}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDeleteReduction(reduction.id)}
                      disabled={isDeleting}
                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phần trăm giảm:</span>
                    <span className="font-medium">{reduction.reduction_percentage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Power tại thời điểm giảm:</span>
                    <span className="font-medium">{reduction.power_at_reduction.toLocaleString()}</span>
                  </div>
                  {reduction.reason && (
                    <div>
                      <span className="text-muted-foreground">Lý do:</span>
                      <p className="mt-1">{reduction.reason}</p>
                    </div>
                  )}
                  <div className="text-sm text-muted-foreground">
                    Thời gian: {new Date(reduction.created_at).toLocaleString()}
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