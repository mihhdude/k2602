"use client"

import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface PlayerData {
  id: string
  name: string
  power: number
  killPoints: number
  deads: number
  t1Kills: number
  t2Kills: number
  t3Kills: number
  t4Kills: number
  t5Kills: number
}

export interface PlayerStatus {
  id: string
  name: string
  onLeave: boolean
  zeroed: boolean
  farmAccount: boolean
  blacklisted: boolean
}

export interface KpiData {
  id: string
  name: string
  kpIncrease: number
  deadsIncrease: number
  kpiPercentage: number
}

interface RawPlayerData {
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

const dataTypeToPhase: { [key: string]: string } = {
  dataStart: "dataStart",
  dataPass4: "dataPass4",
  dataPass7: "dataPass7",
  dataKingland: "dataKingland",
}

export function useKvkData(dataType: string) {
  const [data, setData] = useState<PlayerData[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (!dataType) return

      setIsLoading(true)
      try {
        const { data: playerData, error } = await supabase
          .from("player_data")
          .select("*")
          .eq("phase", dataTypeToPhase[dataType])

        if (error) {
          console.error("Error fetching data:", error)
          setData([])
        } else {
          const formattedData: PlayerData[] = (playerData as RawPlayerData[]).map((player) => ({
            id: player.governor_id,
            name: player.governor_name,
            power: player.power,
            killPoints: player.kill_points,
            deads: player.deads,
            t1Kills: player.t1_kills,
            t2Kills: player.t2_kills,
            t3Kills: player.t3_kills,
            t4Kills: player.t4_kills,
            t5Kills: player.t5_kills,
          }))
          setData(formattedData)
        }
      } catch (error) {
        console.error("Error:", error)
        setData([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [dataType])

  return { data, isLoading }
} 