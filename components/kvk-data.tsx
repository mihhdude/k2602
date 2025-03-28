"use client"

import { useState } from "react"
import { KvKDataFilter } from "./kvk-data-filter"
import { DataTable } from "./data-table"
import { useKvkData } from "@/hooks/use-kvk-data"

interface PlayerData {
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

export function KvKData() {
  const [selectedDataType, setSelectedDataType] = useState("")
  const [searchId, setSearchId] = useState("")
  const { data, isLoading } = useKvkData(selectedDataType)

  const filteredData = data?.filter((item: PlayerData) => {
    if (!searchId) return true
    return item.id.includes(searchId)
  })

  return (
    <div className="space-y-4">
      <KvKDataFilter
        onDataTypeChange={setSelectedDataType}
        onSearch={setSearchId}
      />
      
      {selectedDataType && (
        <DataTable 
          data={filteredData || []} 
          isLoading={isLoading} 
        />
      )}
    </div>
  )
}

