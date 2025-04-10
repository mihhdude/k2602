"use client"

import { useState, useEffect } from "react"
import { SubNavigation } from "./sub-navigation"
import { useLanguage } from "./language-provider"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Search, Medal, Crown, Award, Loader2, UserCheck, BarChart4, Edit2, Save, X } from "lucide-react"
import { createClient } from "@supabase/supabase-js"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Define player data types
interface PlayerData {
  governor_id: string
  governor_name: string
  power: number
  kill_points: number
  deads: number
  t1_kills: number
  t2_kills: number
  t3_kills: number
  t4_kills: number
  t5_kills: number
}

interface PlayerStatus {
  governor_id: string
  governor_name: string
  on_leave: boolean
  zeroed: boolean
  farm_account: boolean
  blacklisted: boolean
}

interface KpiData {
  governor_id: string
  governor_name: string
  kp_increase: number
  kpi_percentage: number
  kp_percentage?: number
  kp_target?: number
  total_deads?: number
  deads_percentage?: number
  deads_target?: number
  is_kpi_achieved: boolean
}

// Thêm keyframes animation cho top 1 vào đầu file, sau phần imports:
const shimmerAnimation = `
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

@keyframes soft-pulse {
  0% { 
    box-shadow: 0 0 30px rgba(234, 179, 8, 0.15);
  }
  50% { 
    box-shadow: 0 0 50px rgba(234, 179, 8, 0.25);
  }
  100% { 
    box-shadow: 0 0 30px rgba(234, 179, 8, 0.15);
  }
}

@keyframes crown-rotate {
  0% { transform: rotate(-5deg); }
  50% { transform: rotate(5deg); }
  100% { transform: rotate(-5deg); }
}
`

export function HallOfFame() {
  const { t } = useLanguage()
  const [activeSubTab, setActiveSubTab] = useState("top3")
  const [searchId, setSearchId] = useState("")
  const [top3Players, setTop3Players] = useState<PlayerData[]>([])
  const [kpiData, setKpiData] = useState<KpiData[]>([])
  const [loading, setLoading] = useState(true)
  const [resultsData, setResultsData] = useState<KpiData[]>([])
  const [editingPlayer, setEditingPlayer] = useState<string | null>(null)
  const [editTotalDeads, setEditTotalDeads] = useState<string>("")

  const subTabs = [
    { id: "top3", label: String(t("top3")), icon: <Crown className="h-4 w-4 mr-2" /> },
    { id: "pass4", label: String(t("dataPass4")), icon: <Trophy className="h-4 w-4 mr-2" /> },
    { id: "pass7", label: String(t("dataPass7")), icon: <Trophy className="h-4 w-4 mr-2" /> },
    { id: "kingland", label: String(t("dataKingland")), icon: <Award className="h-4 w-4 mr-2" /> },
    { id: "results", label: String(t("results")), icon: <BarChart4 className="h-4 w-4 mr-2" /> },
  ]

  // Fetch results data on component mount
  useEffect(() => {
    fetchResultsData()
  }, [])

  // Fetch results data
  const fetchResultsData = async () => {
    setLoading(true)
    try {
      // Get player statuses
      const { data: playerStatuses } = await supabase.from("player_status").select("*")

      // Get all phases data
      const { data: startData } = await supabase.from("player_data").select("*").eq("phase", "dataStart")

      // Get KPI reductions
      const { data: kpiReductions } = await supabase.from("kpi_reductions").select("*")

      if (!startData || !playerStatuses) {
        setResultsData([])
        setLoading(false)
        return
      }

      // Get other phases data (might be empty)
      const { data: pass4Data } = await supabase.from("player_data").select("*").eq("phase", "dataPass4")
      const { data: pass7Data } = await supabase.from("player_data").select("*").eq("phase", "dataPass7")
      const { data: kinglandData } = await supabase.from("player_data").select("*").eq("phase", "dataKingland")

      // Calculate total KP for each player
      const totalResults: KpiData[] = []

      for (const startPlayer of startData) {
        // Find player status
        const status = playerStatuses.find((s: PlayerStatus) => s.governor_id === startPlayer.governor_id)

        // Skip players with special status
        if (status && (status.on_leave || status.farm_account || status.zeroed || status.blacklisted)) continue

        // Find player in other phases (if available)
        const pass4Player = pass4Data?.find((p: PlayerData) => p.governor_id === startPlayer.governor_id)
        const pass7Player = pass7Data?.find((p: PlayerData) => p.governor_id === startPlayer.governor_id)
        const kinglandPlayer = kinglandData?.find((p: PlayerData) => p.governor_id === startPlayer.governor_id)

        // Calculate increases for each phase (use 0 if phase data is missing)
        const pass4Increase = pass4Player ? pass4Player.kill_points - startPlayer.kill_points : 0
        const pass7Increase = pass7Player && pass4Player ? pass7Player.kill_points - pass4Player.kill_points : 0
        const kinglandIncrease =
          kinglandPlayer && pass7Player ? kinglandPlayer.kill_points - pass7Player.kill_points : 0

        // Calculate total kill points (sum of all increases)
        const totalKp = pass4Increase + pass7Increase + kinglandIncrease

        // Calculate KPI target based on power
        let deadsTarget = 0
        const power = startPlayer.power

        if (power >= 100000000) deadsTarget = 1500000
        else if (power >= 90000000) deadsTarget = 1100000
        else if (power >= 80000000) deadsTarget = 850000
        else if (power >= 70000000) deadsTarget = 700000
        else if (power >= 60000000) deadsTarget = 600000
        else if (power >= 50000000) deadsTarget = 500000
        else if (power >= 40000000) deadsTarget = 400000
        else if (power >= 30000000) deadsTarget = 300000
        else if (power >= 20000000) deadsTarget = 200000
        else deadsTarget = 0

        // If player is zeroed, set KPI to 0
        if (status && status.zeroed) deadsTarget = 0

        // Calculate KPI percentage
        // KP target is 3x power
        const kpTarget = startPlayer.power * 3

        // Calculate percentages
        const kpPercentage = (totalKp / kpTarget) * 100
        const deadsPercentage = kinglandPlayer?.total_deads ? (kinglandPlayer.total_deads / deadsTarget) * 100 : 0

        // Check if player has KPI reduction
        const reduction = kpiReductions?.find(r => r.governor_id === startPlayer.governor_id)
        let reductionPercentage = 0
        if (reduction) {
          reductionPercentage = reduction.reduction_percentage
        }

        // Apply KPI reduction if exists
        const adjustedKpPercentage = kpPercentage * (1 - reductionPercentage / 100)
        const adjustedDeadsPercentage = deadsPercentage * (1 - reductionPercentage / 100)

        // Total KPI percentage is sum of adjusted KP percentage and adjusted Dead percentage
        const kpiPercentage = adjustedKpPercentage + adjustedDeadsPercentage

        // Kiểm tra điều kiện đạt KPI
        const isKpiAchieved = adjustedKpPercentage >= 50 && kpiPercentage >= 200

        totalResults.push({
          governor_id: startPlayer.governor_id,
          governor_name: startPlayer.governor_name,
          kp_increase: totalKp,
          kpi_percentage: kpiPercentage,
          kp_percentage: adjustedKpPercentage,
          kp_target: kpTarget,
          total_deads: kinglandPlayer?.total_deads || 0,
          deads_percentage: adjustedDeadsPercentage,
          deads_target: deadsTarget,
          is_kpi_achieved: isKpiAchieved
        })
      }

      // Sort by total kill points
      const sortedResults = [...totalResults].sort((a, b) => b.kp_increase - a.kp_increase)

      setResultsData(sortedResults)

      // Update top3Players with the top 3 from results
      if (sortedResults.length > 0) {
        // Get the top 3 players from results
        const top3FromResults = sortedResults.slice(0, 3)

        // Find their full data in kinglandData or startData
        const top3FullData = top3FromResults.map((player) => {
          const fullData =
            kinglandData?.find((p) => p.governor_id === player.governor_id) ||
            startData.find((p) => p.governor_id === player.governor_id)
          return {
            governor_id: player.governor_id,
            governor_name: player.governor_name,
            power: fullData?.power || 0,
            kill_points: player.kp_increase, // Use the total KP increase
            deads: 0,
            t1_kills: fullData?.t1_kills || 0,
            t2_kills: fullData?.t2_kills || 0,
            t3_kills: fullData?.t3_kills || 0,
            t4_kills: fullData?.t4_kills || 0,
            t5_kills: fullData?.t5_kills || 0,
          }
        })

        setTop3Players(top3FullData)
      }
    } catch (error) {
      console.error("Error fetching results data:", error)
      setResultsData([])
    } finally {
      setLoading(false)
    }
  }

  // Fetch KPI data for specific phases
  useEffect(() => {
    const fetchKpiData = async () => {
      if (activeSubTab === "top3" || activeSubTab === "results") {
        // For top3 and results, we already have the data
        if (activeSubTab === "results") {
          setKpiData(resultsData)
        } else if (activeSubTab === "top3") {
          fetchTotalKpiData()
        }
        return
      }

      setLoading(true)
      try {
        let previousPhase = ""
        let currentPhase = ""

        // Determine phases to compare
        switch (activeSubTab) {
          case "pass4":
            previousPhase = "dataStart"
            currentPhase = "dataPass4"
            break
          case "pass7":
            previousPhase = "dataPass4"
            currentPhase = "dataPass7"
            break
          case "kingland":
            previousPhase = "dataPass7"
            currentPhase = "dataKingland"
            break
        }

        // Get player statuses
        const { data: playerStatuses } = await supabase.from("player_status").select("*")

        // Get start data for power calculation
        const { data: startData } = await supabase.from("player_data").select("*").eq("phase", "dataStart")

        // Get previous phase data
        const { data: previousData } = await supabase.from("player_data").select("*").eq("phase", previousPhase)

        // Get current phase data
        const { data: currentData } = await supabase.from("player_data").select("*").eq("phase", currentPhase)

        if (!previousData || !currentData || !playerStatuses || !startData) {
          setKpiData([])
          setLoading(false)
          return
        }

        // Calculate KPI for each player
        const kpiResults: KpiData[] = []

        for (const currentPlayer of currentData) {
          // Find player in previous data and start data
          const previousPlayer = previousData.find((p: PlayerData) => p.governor_id === currentPlayer.governor_id)
          const startPlayer = startData.find((p: PlayerData) => p.governor_id === currentPlayer.governor_id)

          if (!previousPlayer || !startPlayer) continue

          // Find player status
          const status = playerStatuses.find((s: PlayerStatus) => s.governor_id === currentPlayer.governor_id)

          // Skip players with special status
          if (status && (status.on_leave || status.farm_account || status.zeroed || status.blacklisted)) continue

          // Calculate increases
          const kpIncrease = currentPlayer.kill_points - previousPlayer.kill_points

          // Calculate KPI target based on power from dataStart
          let deadsTarget = 0
          const power = startPlayer.power // Use power from dataStart

          if (power >= 100000000) deadsTarget = 1500000
          else if (power >= 90000000) deadsTarget = 1100000
          else if (power >= 80000000) deadsTarget = 850000
          else if (power >= 70000000) deadsTarget = 700000
          else if (power >= 60000000) deadsTarget = 600000
          else if (power >= 50000000) deadsTarget = 500000
          else if (power >= 40000000) deadsTarget = 400000
          else if (power >= 30000000) deadsTarget = 300000
          else if (power >= 20000000) deadsTarget = 200000
          else deadsTarget = 0

          // If player is zeroed, set KPI to 0
          if (status && status.zeroed) deadsTarget = 0

          // Calculate KPI percentage
          // KP target is 3x power from dataStart
          const kpTarget = startPlayer.power * 3

          // Calculate percentages
          const kpPercentage = (kpIncrease / kpTarget) * 100
          const deadsPercentage = currentPlayer.total_deads ? (currentPlayer.total_deads / deadsTarget) * 100 : 0

          // Total KPI percentage is sum of KP percentage and Dead percentage
          const kpiPercentage = kpPercentage + deadsPercentage

          // Kiểm tra điều kiện đạt KPI
          const isKpiAchieved = kpPercentage >= 50 && kpiPercentage >= 200

          kpiResults.push({
            governor_id: currentPlayer.governor_id,
            governor_name: currentPlayer.governor_name,
            kp_increase: kpIncrease,
            kpi_percentage: kpiPercentage,
            kp_percentage: kpPercentage,
            kp_target: kpTarget,
            total_deads: currentPlayer.total_deads || 0,
            deads_percentage: deadsPercentage,
            deads_target: deadsTarget,
            is_kpi_achieved: isKpiAchieved
          })
        }

        // Sort by KP increase
        const sortedResults = [...kpiResults].sort((a, b) => b.kp_increase - a.kp_increase)

        setKpiData(sortedResults)
      } catch (error) {
        console.error("Error fetching KPI data:", error)
        setKpiData([])
      } finally {
        setLoading(false)
      }
    }

    fetchKpiData()
  }, [activeSubTab, resultsData])

  // Filter data by ID if search is active
  const filteredData = searchId
    ? kpiData.filter(
        (player) =>
          player.governor_id.includes(searchId) || player.governor_name.toLowerCase().includes(searchId.toLowerCase()),
      )
    : kpiData

  // Update the fetchTotalKpiData function to calculate total KPI correctly
  const fetchTotalKpiData = async () => {
    try {
      // Get player statuses
      const { data: playerStatuses } = await supabase.from("player_status").select("*")

      // Get all phases data
      const { data: startData } = await supabase.from("player_data").select("*").eq("phase", "dataStart")

      const { data: pass4Data } = await supabase.from("player_data").select("*").eq("phase", "dataPass4")

      const { data: pass7Data } = await supabase.from("player_data").select("*").eq("phase", "dataPass7")

      const { data: kinglandData } = await supabase.from("player_data").select("*").eq("phase", "dataKingland")

      if (!startData || !playerStatuses) {
        setKpiData([])
        setLoading(false)
        return
      }

      // Calculate total KPI for each player
      const totalResults: KpiData[] = []

      for (const startPlayer of startData) {
        // Find player status
        const status = playerStatuses.find((s: PlayerStatus) => s.governor_id === startPlayer.governor_id)

        // Skip players with special status
        if (status && (status.on_leave || status.farm_account || status.zeroed || status.blacklisted)) continue

        // Find player in other phases (if available)
        const pass4Player = pass4Data?.find((p: PlayerData) => p.governor_id === startPlayer.governor_id)
        const pass7Player = pass7Data?.find((p: PlayerData) => p.governor_id === startPlayer.governor_id)
        const kinglandPlayer = kinglandData?.find((p: PlayerData) => p.governor_id === startPlayer.governor_id)

        // Calculate increases for each phase (use 0 if phase data is missing)
        const pass4Increase = pass4Player ? pass4Player.kill_points - startPlayer.kill_points : 0
        const pass7Increase = pass7Player && pass4Player ? pass7Player.kill_points - pass4Player.kill_points : 0
        const kinglandIncrease =
          kinglandPlayer && pass7Player ? kinglandPlayer.kill_points - pass7Player.kill_points : 0

        // Calculate total kill points (sum of all increases)
        const totalKp = pass4Increase + pass7Increase + kinglandIncrease

        // Calculate KPI target based on power
        let deadsTarget = 0
        const power = startPlayer.power

        if (power >= 100000000) deadsTarget = 1500000
        else if (power >= 90000000) deadsTarget = 1100000
        else if (power >= 80000000) deadsTarget = 850000
        else if (power >= 70000000) deadsTarget = 700000
        else if (power >= 60000000) deadsTarget = 600000
        else if (power >= 50000000) deadsTarget = 500000
        else if (power >= 40000000) deadsTarget = 400000
        else if (power >= 30000000) deadsTarget = 300000
        else if (power >= 20000000) deadsTarget = 200000
        else deadsTarget = 0

        // If player is zeroed, set KPI to 0
        if (status && status.zeroed) deadsTarget = 0

        // Calculate KPI percentage
        // KP target is 3x power
        const kpTarget = startPlayer.power * 3

        // Calculate percentages
        const kpPercentage = (totalKp / kpTarget) * 100
        const deadsPercentage = kinglandPlayer?.total_deads ? (kinglandPlayer.total_deads / deadsTarget) * 100 : 0

        // Total KPI percentage is sum of KP percentage and Dead percentage
        const kpiPercentage = kpPercentage + deadsPercentage

        // Kiểm tra điều kiện đạt KPI
        const isKpiAchieved = kpPercentage >= 50 && kpiPercentage >= 200

        totalResults.push({
          governor_id: startPlayer.governor_id,
          governor_name: startPlayer.governor_name,
          kp_increase: totalKp,
          kpi_percentage: kpiPercentage,
          kp_percentage: kpPercentage,
          kp_target: kpTarget,
          total_deads: kinglandPlayer?.total_deads || 0,
          deads_percentage: deadsPercentage,
          deads_target: deadsTarget,
          is_kpi_achieved: isKpiAchieved
        })
      }

      // Sort by total kill points
      const sortedResults = [...totalResults].sort((a, b) => b.kp_increase - a.kp_increase)

      setKpiData(sortedResults)

      // Update top3Players with the top 3 from results
      if (sortedResults.length > 0) {
        // Get the top 3 players from results
        const top3FromResults = sortedResults.slice(0, 3)

        // Find their full data in kinglandData or startData
        const top3FullData = top3FromResults.map((player) => {
          const fullData =
            kinglandData?.find((p) => p.governor_id === player.governor_id) ||
            startData.find((p) => p.governor_id === player.governor_id)
          return {
            governor_id: player.governor_id,
            governor_name: player.governor_name,
            power: fullData?.power || 0,
            kill_points: player.kp_increase, // Use the total KP increase
            deads: 0,
            t1_kills: fullData?.t1_kills || 0,
            t2_kills: fullData?.t2_kills || 0,
            t3_kills: fullData?.t3_kills || 0,
            t4_kills: fullData?.t4_kills || 0,
            t5_kills: fullData?.t5_kills || 0,
          }
        })

        setTop3Players(top3FullData)
      }
    } catch (error) {
      console.error("Error fetching total KPI data:", error)
      setKpiData([])
    } finally {
      setLoading(false)
    }
  }

  const handleEditClick = (player: KpiData) => {
    setEditingPlayer(player.governor_id)
    setEditTotalDeads(player.total_deads?.toString() || "0")
  }

  const handleSaveClick = async (player: KpiData) => {
    try {
      // Update the player's total_deads in the database
      const { error } = await supabase
        .from("player_data")
        .update({ total_deads: parseInt(editTotalDeads) || 0 })
        .eq("governor_id", player.governor_id)
        .eq("phase", "dataKingland")

      if (error) throw error

      // Update local state
      const updatedData = kpiData.map((p) =>
        p.governor_id === player.governor_id
          ? { ...p, total_deads: parseInt(editTotalDeads) || 0 }
          : p
      )
      setKpiData(updatedData)
      setEditingPlayer(null)
    } catch (error) {
      console.error("Error updating total_deads:", error)
    }
  }

  const handleCancelClick = () => {
    setEditingPlayer(null)
    setEditTotalDeads("")
  }

  return (
    <div>
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-4">
        <SubNavigation tabs={subTabs} activeTab={activeSubTab} setActiveTab={setActiveSubTab} />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {activeSubTab === "top3" && (
            <>
              <style>{shimmerAnimation}</style>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Top 2 player (left) */}
                {top3Players[1] && (
                  <Card className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 overflow-hidden transform hover:scale-105 transition-transform duration-200 md:translate-y-4">
                    <div className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 h-4"></div>
                    <CardContent className="pt-6 flex flex-col items-center">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-300 to-gray-100 dark:from-gray-600 dark:to-gray-800 flex items-center justify-center mb-4 shadow-lg">
                          <Medal className="h-12 w-12 text-gray-400" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-300 flex items-center justify-center text-white font-bold shadow-lg">
                          2
                        </div>
                      </div>
                      <h3 className="font-bold text-xl mb-1">{top3Players[1].governor_name}</h3>
                      <p className="text-sm text-gray-500 mb-3">ID: {top3Players[1].governor_id}</p>
                      <div className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-gray-400" />
                        <p className="font-semibold">{top3Players[1].kill_points.toLocaleString()} KP</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Top 1 player (center) */}
                {top3Players[0] && (
                  <Card className="bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-900 dark:to-amber-950 overflow-hidden transform md:scale-110 z-10 hover:scale-115 transition-transform duration-200 animate-[soft-pulse_8s_ease-in-out_infinite] relative">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.15)_0%,transparent_70%)]"></div>
                    <div className="bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-500 h-6 animate-[shimmer_8s_linear_infinite] relative"></div>
                    <CardContent className="pt-8 flex flex-col items-center relative">
                      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.1)_0%,transparent_60%)]"></div>
                      <div className="relative">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 dark:from-yellow-600 dark:to-amber-800 flex items-center justify-center mb-4 shadow-xl border-4 border-yellow-300">
                          <Crown className="h-16 w-16 text-yellow-100 animate-[crown-rotate_8s_ease-in-out_infinite]" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-white font-bold text-xl shadow-lg border-2 border-yellow-300">
                          1
                        </div>
                      </div>
                      <h3 className="font-bold text-2xl mb-1 text-amber-900 dark:text-amber-100">{top3Players[0].governor_name}</h3>
                      <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">ID: {top3Players[0].governor_id}</p>
                      <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-500 px-4 py-2 rounded-full shadow-lg">
                        <Trophy className="h-6 w-6 text-yellow-100" />
                        <p className="font-bold text-white">{top3Players[0].kill_points.toLocaleString()} KP</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Top 3 player (right) */}
                {top3Players[2] && (
                  <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900 dark:to-amber-950 overflow-hidden transform hover:scale-105 transition-transform duration-200 md:translate-y-8">
                    <div className="bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 h-4"></div>
                    <CardContent className="pt-6 flex flex-col items-center">
                      <div className="relative">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-600 to-amber-400 dark:from-amber-700 dark:to-amber-900 flex items-center justify-center mb-4 shadow-lg">
                          <Medal className="h-10 w-10 text-amber-100" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-amber-700 to-amber-600 flex items-center justify-center text-white font-bold shadow-lg">
                          3
                        </div>
                      </div>
                      <h3 className="font-bold text-lg mb-1">{top3Players[2].governor_name}</h3>
                      <p className="text-sm text-gray-500 mb-3">ID: {top3Players[2].governor_id}</p>
                      <div className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-amber-700" />
                        <p className="font-semibold">{top3Players[2].kill_points.toLocaleString()} KP</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {top3Players.length === 0 && (
                  <div className="col-span-3 flex flex-col items-center justify-center py-8">
                    <Trophy className="h-12 w-12 text-gray-400 mb-2" />
                    <p>No data available for top players</p>
                    <p className="text-sm text-gray-500">Upload data in the Admin panel</p>
                  </div>
                )}
              </div>
            </>
          )}

          {activeSubTab === "results" && (
            <div className="border rounded-md p-4">
              {/* Add search input */}
              <div className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by ID or name..."
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    className="w-full p-2 pl-8 border rounded-md"
                  />
                  <Search className="h-4 w-4 absolute left-2 top-3 text-gray-400" />
                </div>
              </div>

              <div className="overflow-x-auto">
                <div className="flex items-center mb-2 text-sm text-gray-500">
                  <UserCheck className="h-4 w-4 mr-1" />
                  <span>
                    Showing {filteredData.length} players for {activeSubTab}
                  </span>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Rank</TableHead>
                      <TableHead>Governor Name</TableHead>
                      <TableHead>Governor ID</TableHead>
                      <TableHead className="text-right">Total Kill Points</TableHead>
                      <TableHead className="text-right">Total Deads</TableHead>
                      <TableHead className="text-right">KP %</TableHead>
                      <TableHead className="text-right">Dead %</TableHead>
                      <TableHead className="text-right">KPI %</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.length > 0 ? (
                      filteredData.map((row, index) => (
                        <TableRow key={index} className={index % 2 === 0 ? "bg-muted/50" : ""}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{row.governor_name}</TableCell>
                          <TableCell>{row.governor_id}</TableCell>
                          <TableCell className="text-right">{row.kp_increase.toLocaleString()}</TableCell>
                          <TableCell className="text-right">{row.total_deads?.toLocaleString() || 0}</TableCell>
                          <TableCell className="text-right">
                            <span
                              className={cn(
                                "font-bold",
                                (row.kp_percentage || 0) >= 50 ? "text-green-500" : "text-red-500"
                              )}
                            >
                              {(row.kp_percentage || 0).toFixed(1)}%
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <span
                              className={cn(
                                "font-bold",
                                (row.deads_percentage || 0) >= 100 ? "text-green-500" : "text-red-500"
                              )}
                            >
                              {(row.deads_percentage || 0).toFixed(1)}%
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <span
                              className={cn(
                                "font-bold",
                                row.is_kpi_achieved ? "text-green-500" : "text-red-500"
                              )}
                            >
                              {(row.kpi_percentage || 0).toFixed(1)}%
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center">
                          No data available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {activeSubTab !== "top3" && activeSubTab !== "results" && (
            <div className="border rounded-md p-4">
              {/* Add search input */}
              <div className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by ID or name..."
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    className="w-full p-2 pl-8 border rounded-md"
                  />
                  <Search className="h-4 w-4 absolute left-2 top-3 text-gray-400" />
                </div>
              </div>

              <div className="overflow-x-auto">
                <div className="flex items-center mb-2 text-sm text-gray-500">
                  <UserCheck className="h-4 w-4 mr-1" />
                  <span>
                    Showing {filteredData.length} players for {activeSubTab}
                  </span>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">No.</TableHead>
                      <TableHead>Governor Name</TableHead>
                      <TableHead>Governor ID</TableHead>
                      <TableHead className="text-right">KP Increase</TableHead>
                      <TableHead className="text-right">KPI KP</TableHead>
                      <TableHead className="text-right">KP %</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.length > 0 ? (
                      filteredData.map((row, index) => (
                        <TableRow key={index} className={index % 2 === 0 ? "bg-muted/50" : ""}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{row.governor_name}</TableCell>
                          <TableCell>{row.governor_id}</TableCell>
                          <TableCell className="text-right">{row.kp_increase.toLocaleString()}</TableCell>
                          <TableCell className="text-right">{row.kp_target?.toLocaleString()}</TableCell>
                          <TableCell className="text-right">
                            <span
                              className={cn(
                                "font-bold",
                                (row.kp_percentage || 0) >= 50 ? "text-green-500" : "text-red-500"
                              )}
                            >
                              {(row.kp_percentage || 0).toFixed(1)}%
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center">
                          No data available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

