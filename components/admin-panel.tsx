"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { SubNavigation } from "./sub-navigation"
import { useLanguage } from "./language-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Upload,
  UserCheck,
  FileSpreadsheet,
  Database,
  Save,
  AlertCircle,
  UserX,
  UserMinus,
  TractorIcon as Farm,
  Shield,
  Users,
  FileText,
  Swords,
  Trophy,
  Search,
  Medal,
  Crown,
  Award,
  Loader2,
  Edit2,
  Percent,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@supabase/supabase-js"
import * as XLSX from "xlsx"
import { cn } from "@/lib/utils"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"

// Type definitions
type PlayerData = {
  governor_id: string
  governor_name: string
  power: number
  kill_points: number
  phase: string
  created_at: string
}

type PlayerStatus = {
  governor_id: string
  governor_name: string
  status: string
  created_at: string
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Thêm kiểu dữ liệu cho row
interface ExcelRow {
  "Governor ID"?: string;
  "governor_id"?: string;
  "ID"?: string;
  "Governor Name"?: string;
  "governor_name"?: string;
  "Name"?: string;
  "Power"?: string | number;
  "power"?: string | number;
  "Kill Points"?: string | number;
  "kill_points"?: string | number;
  "KillPoints"?: string | number;
  "Dead"?: string | number;
  "Deads"?: string | number;
  "deads"?: string | number;
  "Kill T1"?: string | number;
  "Kill T2"?: string | number;
  "Kill T3"?: string | number;
  "Kill T4"?: string | number;
  "Kill T5"?: string | number;
  "T1 Kills"?: string | number;
  "T2 Kills"?: string | number;
  "T3 Kills"?: string | number;
  "T4 Kills"?: string | number;
  "T5 Kills"?: string | number;
  "Tier 1 Kills"?: string | number;
  "Tier 2 Kills"?: string | number;
  "Tier 3 Kills"?: string | number;
  "Tier 4 Kills"?: string | number;
  "Tier 5 Kills"?: string | number;
  "t1_kills"?: string | number;
  "t2_kills"?: string | number;
  "t3_kills"?: string | number;
  "t4_kills"?: string | number;
  "t5_kills"?: string | number;
}

export function AdminPanel() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [activeSubTab, setActiveSubTab] = useState("uploadData")
  const [selectedPhase, setSelectedPhase] = useState("dataStart")
  const [governorId, setGovernorId] = useState("")
  const [governorName, setGovernorName] = useState("")
  const [onLeave, setOnLeave] = useState(false)
  const [zeroed, setZeroed] = useState(false)
  const [farmAccount, setFarmAccount] = useState(false)
  const [blacklisted, setBlacklisted] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [totalDeads, setTotalDeads] = useState("")
  const [totalDeadsGovernorId, setTotalDeadsGovernorId] = useState("")
  const [kpiReductionGovernorId, setKpiReductionGovernorId] = useState("")
  const [kpiReductionPercentage, setKpiReductionPercentage] = useState("")
  const [kpiReductionReason, setKpiReductionReason] = useState("")
  const [loading, setLoading] = useState(true)
  const [playerData, setPlayerData] = useState<PlayerData[]>([])
  const [playerStatus, setPlayerStatus] = useState<PlayerStatus[]>([])
  const [searchId, setSearchId] = useState("")

  const subTabs = [
    {
      id: "uploadData",
      label: String(t("uploadData")),
      icon: <Upload className="h-4 w-4" />,
    },
    {
      id: "manageUsers",
      label: String(t("manageUsers")),
      icon: <Users className="h-4 w-4" />,
    },
    {
      id: "manageDeads",
      label: "Quản lý Total Deads",
      icon: <Swords className="h-4 w-4" />,
    },
    {
      id: "kpi-reduction",
      label: "Giảm KPI",
      icon: <Percent className="h-4 w-4" />,
    },
  ]

  // Handle Excel file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    try {
      // Read the Excel file
      const reader = new FileReader()

      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer)
          const workbook = XLSX.read(data, { type: "array" })

          // Get the first worksheet
          const worksheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[worksheetName]

          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet) as ExcelRow[];

          // Validate data format
          if (!Array.isArray(jsonData) || jsonData.length === 0) {
            toast({
              title: "Error",
              description: "Invalid data format. Excel file must contain data in the correct format.",
              variant: "destructive",
            })
            setIsUploading(false)
            return
          }

          // Map Excel columns to database fields
          const mappedData = jsonData.map((row: ExcelRow) => {
            const data = {
              governor_id: row["Governor ID"] || row["governor_id"] || row["ID"] || "",
              governor_name: row["Governor Name"] || row["governor_name"] || row["Name"] || "",
              power: Number(row["Power"] || row["power"] || 0),
              kill_points: Number(row["Kill Points"] || row["kill_points"] || row["KillPoints"] || 0),
              deads: Number(row["Dead"] || row["Deads"] || row["deads"] || 0),
              t1_kills: Number(row["Kill T1"] || row["T1 Kills"] || row["Tier 1 Kills"] || row["t1_kills"] || 0),
              t2_kills: Number(row["Kill T2"] || row["T2 Kills"] || row["Tier 2 Kills"] || row["t2_kills"] || 0),
              t3_kills: Number(row["Kill T3"] || row["T3 Kills"] || row["Tier 3 Kills"] || row["t3_kills"] || 0),
              t4_kills: Number(row["Kill T4"] || row["T4 Kills"] || row["Tier 4 Kills"] || row["t4_kills"] || 0),
              t5_kills: Number(row["Kill T5"] || row["T5 Kills"] || row["Tier 5 Kills"] || row["t5_kills"] || 0),
              phase: selectedPhase,
            }
            console.log("Mapped data for row:", data)
            return data
          })

          // Validate required fields
          const invalidData = mappedData.some(
            (item) =>
              !item.governor_id ||
              !item.governor_name ||
              isNaN(item.power) ||
              isNaN(item.kill_points) ||
              isNaN(item.deads) ||
              isNaN(item.t1_kills) ||
              isNaN(item.t2_kills) ||
              isNaN(item.t3_kills) ||
              isNaN(item.t4_kills) ||
              isNaN(item.t5_kills)
          )

          if (invalidData) {
            toast({
              title: "Error",
              description: "Some rows have missing or invalid data. Please check your Excel file.",
              variant: "destructive",
            })
            setIsUploading(false)
            return
          }

          // First, delete existing data for this phase
          await supabase.from("player_data").delete().eq("phase", selectedPhase)

          // Then insert new data
          const { error } = await supabase.from("player_data").insert(mappedData)

          if (error) {
            console.error("Error uploading data:", error)
            toast({
              title: "Error",
              description: `Failed to upload data: ${error.message}`,
              variant: "destructive",
            })
          } else {
            toast({
              title: "Success",
              description: `Data uploaded successfully for ${selectedPhase}`,
              variant: "default",
            })

            // Also update player_status table with new players
            for (const player of mappedData) {
              // Check if player exists
              const { data: existingPlayer } = await supabase
                .from("player_status")
                .select("*")
                .eq("governor_id", player.governor_id)
                .single()

              if (!existingPlayer) {
                // Add new player with default status
                await supabase.from("player_status").insert({
                  governor_id: player.governor_id,
                  governor_name: player.governor_name,
                  on_leave: false,
                  zeroed: false,
                  farm_account: false,
                  blacklisted: false,
                })
              }
            }
          }
        } catch (error) {
          console.error("Error processing file:", error)
          toast({
            title: "Error",
            description: "Error processing Excel file. Please check the format.",
            variant: "destructive",
          })
        } finally {
          setIsUploading(false)
        }
      }

      reader.readAsArrayBuffer(file)
    } catch (error) {
      console.error("Error reading file:", error)
      toast({
        title: "Error",
        description: "Error reading Excel file.",
        variant: "destructive",
      })
      setIsUploading(false)
    }
  }

  // Handle player status update
  const handlePlayerStatusUpdate = async () => {
    if (!governorId) {
      toast({
        title: "Error",
        description: "Please enter a Governor ID",
        variant: "destructive",
      })
      return
    }

    setIsUpdating(true)

    try {
      // Check if player exists
      const { data: existingPlayer } = await supabase
        .from("player_status")
        .select("*")
        .eq("governor_id", governorId)
        .single()

      if (existingPlayer) {
        // Update existing player
        const { error } = await supabase
          .from("player_status")
          .update({
            governor_name: governorName || existingPlayer.governor_name,
            on_leave: onLeave,
            zeroed: zeroed,
            farm_account: farmAccount,
            blacklisted: blacklisted,
            updated_at: new Date().toISOString(),
          })
          .eq("governor_id", governorId)

        if (error) {
          throw error
        }
      } else {
        // Insert new player
        if (!governorName) {
          toast({
            title: "Error",
            description: "Please enter a Governor Name for new player",
            variant: "destructive",
          })
          setIsUpdating(false)
          return
        }

        const { error } = await supabase.from("player_status").insert({
          governor_id: governorId,
          governor_name: governorName,
          on_leave: onLeave,
          zeroed: zeroed,
          farm_account: farmAccount,
          blacklisted: blacklisted,
        })

        if (error) {
          throw error
        }
      }

      toast({
        title: "Success",
        description: `Player status updated for ID: ${governorId}`,
        variant: "default",
      })

      // Reset form
      setGovernorId("")
      setGovernorName("")
      setOnLeave(false)
      setZeroed(false)
      setFarmAccount(false)
      setBlacklisted(false)
    } catch (error: unknown) {
      console.error("Error updating player status:", error)
      toast({
        title: "Error",
        description: `Failed to update player status: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  // Handle total deads update
  const handleTotalDeadsUpdate = async () => {
    if (!totalDeadsGovernorId || !totalDeads) {
      toast({
        title: "Error",
        description: "Please enter both Governor ID and Total Deads",
        variant: "destructive",
      })
      return
    }

    const deadsValue = parseInt(totalDeads)
    if (isNaN(deadsValue)) {
      toast({
        title: "Error",
        description: "Total Deads must be a valid number",
        variant: "destructive",
      })
      return
    }

    setIsUpdating(true)

    try {
      // First check if player exists
      const { data: existingPlayer, error: checkError } = await supabase
        .from("player_data")
        .select("governor_id")  // Chỉ select governor_id thôi
        .eq("governor_id", totalDeadsGovernorId)
        .eq("phase", "dataKingland")
        .single()

      if (checkError) {
        console.error("Check error:", checkError)
        throw new Error(`Failed to check player existence: ${checkError.message}`)
      }

      if (!existingPlayer) {
        toast({
          title: "Error",
          description: "Player not found in the database",
          variant: "destructive",
        })
        return
      }

      // Update the player's total_deads
      const { data: updatedData, error: updateError } = await supabase
        .from("player_data")
        .update({ total_deads: deadsValue })
        .eq("governor_id", totalDeadsGovernorId)
        .eq("phase", "dataKingland")
        .select()

      if (updateError) {
        console.error("Update error:", updateError)
        throw new Error(`Failed to update total deads: ${updateError.message}`)
      }

      if (!updatedData || updatedData.length === 0) {
        throw new Error("No data was updated")
      }

      toast({
        title: "Success",
        description: "Total deads updated successfully",
        variant: "default",
      })

      setTotalDeadsGovernorId("")
      setTotalDeads("")
    } catch (error) {
      console.error("Error updating total_deads:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update total deads",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleKpiReduction = async () => {
    if (!kpiReductionGovernorId || !kpiReductionPercentage) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin",
        variant: "destructive",
      })
      return
    }

    setIsUpdating(true)

    try {
      // Lấy dữ liệu người chơi từ phase dataStart
      const { data: startData, error: startError } = await supabase
        .from("player_data")
        .select("*")
        .eq("governor_id", kpiReductionGovernorId)
        .eq("phase", "dataStart")
        .single()

      if (startError) throw startError

      if (!startData) {
        toast({
          title: "Lỗi",
          description: "Không tìm thấy dữ liệu người chơi",
          variant: "destructive",
        })
        return
      }

      // Lưu thông tin giảm KPI vào bảng kpi_reductions
      const { error: reductionError } = await supabase
        .from("kpi_reductions")
        .insert({
          governor_id: kpiReductionGovernorId,
          governor_name: startData.governor_name,
          reduction_percentage: parseFloat(kpiReductionPercentage),
          reason: "Admin adjustment", // Lý do mặc định, chỉ admin biết
          power_at_reduction: startData.power,
          created_at: new Date().toISOString(),
        })

      if (reductionError) throw reductionError

      toast({
        title: "Thành công",
        description: "Đã giảm KPI cho người chơi",
        variant: "default",
      })

      // Reset form
      setKpiReductionGovernorId("")
      setKpiReductionPercentage("")
    } catch (error) {
      console.error("Error reducing KPI:", error)
      toast({
        title: "Lỗi",
        description: "Không thể giảm KPI. Vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-4">
        <SubNavigation tabs={subTabs} activeTab={activeSubTab} setActiveTab={setActiveSubTab} />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {activeSubTab === "uploadData" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="h-5 w-5 mr-2" />
                  {String(t("uploadData"))}
                </CardTitle>
                <CardDescription>{String(t("uploadDescription"))}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="phase" className="flex items-center">
                      <Database className="h-4 w-4 mr-2" />
                      {String(t("selectPhase"))}
                    </Label>
                    <Select value={selectedPhase} onValueChange={setSelectedPhase}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select phase" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dataStart">{String(t("dataStart"))}</SelectItem>
                        <SelectItem value="dataPass4">{String(t("dataPass4"))}</SelectItem>
                        <SelectItem value="dataPass7">{String(t("dataPass7"))}</SelectItem>
                        <SelectItem value="dataKingland">{String(t("dataKingland"))}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="file" className="flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      {String(t("selectFile"))}
                    </Label>
                    <Input id="file" type="file" accept=".xlsx,.xls,.csv" onChange={handleFileUpload} disabled={isUploading} />
                    <p className="text-xs text-gray-500 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      File must be an Excel file with columns: Governor ID, Governor Name, Power, Kill Points, Deads, T1-T5
                      Kills
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button disabled={isUploading} className="ml-auto">
                  {isUploading ? (
                    <>
                      <span className="animate-spin mr-2">
                        <Upload className="h-4 w-4" />
                      </span>
                      {String(t("uploading"))}
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      {String(t("readyToUpload"))}
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          )}

          {activeSubTab === "manageUsers" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserCheck className="h-5 w-5 mr-2" />
                  {String(t("manageUsers"))}
                </CardTitle>
                <CardDescription>Quản lý trạng thái người chơi</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="governorId" className="flex items-center">
                      <Database className="h-4 w-4 mr-2" />
                      {String(t("governorId"))}
                    </Label>
                    <Input
                      id="governorId"
                      value={governorId}
                      onChange={(e) => setGovernorId(e.target.value)}
                      placeholder="Nhập ID Thống đốc"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="governorName" className="flex items-center">
                      <UserCheck className="h-4 w-4 mr-2" />
                      Tên Thống đốc (Tùy chọn)
                    </Label>
                    <Input
                      id="governorName"
                      value={governorName}
                      onChange={(e) => setGovernorName(e.target.value)}
                      placeholder="Nhập tên Thống đốc"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label className="flex items-center">
                      <Shield className="h-4 w-4 mr-2" />
                      {String(t("status"))}
                    </Label>
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        variant={onLeave ? "default" : "outline"}
                        onClick={() => setOnLeave(!onLeave)}
                        className="w-full"
                      >
                        <UserMinus className="h-4 w-4 mr-2" />
                        {String(t("onLeave"))}
                      </Button>
                      <Button
                        variant={zeroed ? "default" : "outline"}
                        onClick={() => setZeroed(!zeroed)}
                        className="w-full"
                      >
                        <Swords className="h-4 w-4 mr-2" />
                        {String(t("zeroed"))}
                      </Button>
                      <Button
                        variant={farmAccount ? "default" : "outline"}
                        onClick={() => setFarmAccount(!farmAccount)}
                        className="w-full"
                      >
                        <Farm className="h-4 w-4 mr-2" />
                        {String(t("farmAccount"))}
                      </Button>
                      <Button
                        variant={blacklisted ? "destructive" : "outline"}
                        onClick={() => setBlacklisted(!blacklisted)}
                        className="w-full"
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        {String(t("blacklisted"))}
                      </Button>
                    </div>
                  </div>

                  <Button onClick={handlePlayerStatusUpdate} disabled={isUpdating} className="w-full">
                    {isUpdating ? (
                      <>
                        <span className="animate-spin mr-2">
                          <Save className="h-4 w-4" />
                        </span>
                        {String(t("updating"))}
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {String(t("updateStatus"))}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSubTab === "manageDeads" && (
            <Card>
              <CardHeader>
                <CardTitle>Quản lý Total Deads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="totalDeadsFile" className="flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        Upload file Excel
                      </Label>
                      <Input 
                        id="totalDeadsFile" 
                        type="file" 
                        accept=".xlsx,.xls,.csv" 
                        onChange={async (e) => {
                          const file = e.target.files?.[0]
                          if (!file) return

                          setIsUploading(true)

                          try {
                            const reader = new FileReader()
                            reader.onload = async (e) => {
                              try {
                                const data = new Uint8Array(e.target?.result as ArrayBuffer)
                                const workbook = XLSX.read(data, { type: "array" })
                                const worksheetName = workbook.SheetNames[0]
                                const worksheet = workbook.Sheets[worksheetName]
                                const jsonData = XLSX.utils.sheet_to_json(worksheet) as { "Governor ID": string, "Total Deads": number }[]

                                // Validate data format
                                if (!Array.isArray(jsonData) || jsonData.length === 0) {
                                  throw new Error("Invalid data format")
                                }

                                // Update total_deads for each player
                                for (const row of jsonData) {
                                  if (!row["Governor ID"] || !row["Total Deads"]) {
                                    continue
                                  }

                                  await supabase
                                    .from("player_data")
                                    .update({ total_deads: row["Total Deads"] })
                                    .eq("governor_id", row["Governor ID"])
                                    .eq("phase", "dataKingland")
                                }

                                toast({
                                  title: "Success",
                                  description: "Total deads updated successfully",
                                  variant: "default",
                                })

                              } catch (error) {
                                console.error("Error processing file:", error)
                                toast({
                                  title: "Error",
                                  description: "Error processing Excel file. Please check the format.",
                                  variant: "destructive",
                                })
                              }
                            }
                            reader.readAsArrayBuffer(file)
                          } catch (error) {
                            console.error("Error reading file:", error)
                            toast({
                              title: "Error",
                              description: "Error reading Excel file.",
                              variant: "destructive",
                            })
                          } finally {
                            setIsUploading(false)
                          }
                        }}
                      />
                      <p className="text-xs text-gray-500 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        File Excel phải có 2 cột: Governor ID và Total Deads
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label>Hoặc cập nhật thủ công:</Label>
                    </div>
                    <form onSubmit={(e) => { e.preventDefault(); handleTotalDeadsUpdate(); }} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="totalDeadsGovernorId">Governor ID</Label>
                        <Input
                          id="totalDeadsGovernorId"
                          value={totalDeadsGovernorId}
                          onChange={(e) => setTotalDeadsGovernorId(e.target.value)}
                          placeholder="Nhập Governor ID"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="totalDeads">Total Deads</Label>
                        <Input
                          id="totalDeads"
                          type="number"
                          value={totalDeads}
                          onChange={(e) => setTotalDeads(e.target.value)}
                          placeholder="Nhập số deads"
                          required
                        />
                      </div>
                      <Button type="submit" disabled={isUpdating}>
                        {isUpdating ? "Đang cập nhật..." : "Cập nhật"}
                      </Button>
                    </form>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSubTab === "kpi-reduction" && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label>Giảm KPI cho người chơi</Label>
                    <p className="text-sm text-gray-500">
                      Chức năng này cho phép giảm KPI cho người chơi được chọn. KPI sẽ được tính dựa trên dữ liệu ban đầu từ phase dataStart.
                    </p>
                  </div>
                  <form onSubmit={(e) => { e.preventDefault(); handleKpiReduction(); }} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="kpiReductionGovernorId">Governor ID</Label>
                      <Input
                        id="kpiReductionGovernorId"
                        value={kpiReductionGovernorId}
                        onChange={(e) => setKpiReductionGovernorId(e.target.value)}
                        placeholder="Nhập Governor ID"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="kpiReductionPercentage">Phần trăm giảm KPI</Label>
                      <Input
                        id="kpiReductionPercentage"
                        type="number"
                        value={kpiReductionPercentage}
                        onChange={(e) => setKpiReductionPercentage(e.target.value)}
                        placeholder="Nhập phần trăm giảm (ví dụ: 20)"
                        required
                      />
                    </div>
                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating ? "Đang cập nhật..." : "Giảm KPI"}
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}

