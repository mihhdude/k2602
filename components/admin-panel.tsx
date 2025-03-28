"use client"

import type React from "react"

import { useState } from "react"
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
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@supabase/supabase-js"
import * as XLSX from "xlsx"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseAnonKey)

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

  const subTabs = [
    { id: "uploadData", label: t("uploadData"), icon: <Upload className="h-4 w-4 mr-2" /> },
    { id: "manageUsers", label: t("manageUsers"), icon: <UserCheck className="h-4 w-4 mr-2" /> },
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
          const jsonData = XLSX.utils.sheet_to_json(worksheet)

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
          const mappedData = jsonData.map((row: any) => ({
            governor_id: row["Governor ID"] || row["governor_id"] || row["ID"] || "",
            governor_name: row["Governor Name"] || row["governor_name"] || row["Name"] || "",
            power: Number.parseInt(row["Power"] || row["power"] || 0),
            kill_points: Number.parseInt(row["Kill Points"] || row["kill_points"] || row["KillPoints"] || 0),
            deads: Number.parseInt(row["Deads"] || row["deads"] || 0),
            t1_kills: Number.parseInt(row["Tier 1 Kills"] || row["t1_kills"] || row["T1 Kills"] || 0),
            t2_kills: Number.parseInt(row["Tier 2 Kills"] || row["t2_kills"] || row["T2 Kills"] || 0),
            t3_kills: Number.parseInt(row["Tier 3 Kills"] || row["t3_kills"] || row["T3 Kills"] || 0),
            t4_kills: Number.parseInt(row["Tier 4 Kills"] || row["t4_kills"] || row["T4 Kills"] || 0),
            t5_kills: Number.parseInt(row["Tier 5 Kills"] || row["t5_kills"] || row["T5 Kills"] || 0),
            phase: selectedPhase,
          }))

          // Validate required fields
          const invalidData = mappedData.some(
            (item) =>
              !item.governor_id ||
              !item.governor_name ||
              isNaN(item.power) ||
              isNaN(item.kill_points) ||
              isNaN(item.deads),
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
    } catch (error: any) {
      console.error("Error updating player status:", error)
      toast({
        title: "Error",
        description: `Failed to update player status: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div>
      <SubNavigation tabs={subTabs} activeTab={activeSubTab} setActiveTab={setActiveSubTab} />

      {activeSubTab === "uploadData" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileSpreadsheet className="h-5 w-5 mr-2" />
              {t("uploadData")}
            </CardTitle>
            <CardDescription>Upload Excel data for different KvK phases</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="phase" className="flex items-center">
                  <Database className="h-4 w-4 mr-2" />
                  Select Phase
                </Label>
                <Select value={selectedPhase} onValueChange={setSelectedPhase}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select phase" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dataStart">{t("dataStart")}</SelectItem>
                    <SelectItem value="dataPass4">{t("dataPass4")}</SelectItem>
                    <SelectItem value="dataPass7">{t("dataPass7")}</SelectItem>
                    <SelectItem value="dataKingland">{t("dataKingland")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="file" className="flex items-center">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Excel File
                </Label>
                <Input id="file" type="file" accept=".xlsx, .xls" onChange={handleFileUpload} disabled={isUploading} />
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
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Ready to Upload
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
              {t("manageUsers")}
            </CardTitle>
            <CardDescription>Manage player status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="governorId" className="flex items-center">
                  <Database className="h-4 w-4 mr-2" />
                  {t("governorId")}
                </Label>
                <Input
                  id="governorId"
                  value={governorId}
                  onChange={(e) => setGovernorId(e.target.value)}
                  placeholder="Enter Governor ID"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="governorName" className="flex items-center">
                  <UserCheck className="h-4 w-4 mr-2" />
                  Governor Name (Optional)
                </Label>
                <Input
                  id="governorName"
                  value={governorName}
                  onChange={(e) => setGovernorName(e.target.value)}
                  placeholder="Enter Governor Name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="onLeave"
                    checked={onLeave}
                    onCheckedChange={(checked) => setOnLeave(checked as boolean)}
                  />
                  <Label htmlFor="onLeave" className="flex items-center">
                    <UserMinus className="h-4 w-4 mr-2 text-yellow-500" />
                    {t("onLeave")}
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="zeroed" checked={zeroed} onCheckedChange={(checked) => setZeroed(checked as boolean)} />
                  <Label htmlFor="zeroed" className="flex items-center">
                    <UserX className="h-4 w-4 mr-2 text-red-500" />
                    {t("zeroed")}
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="farmAccount"
                    checked={farmAccount}
                    onCheckedChange={(checked) => setFarmAccount(checked as boolean)}
                  />
                  <Label htmlFor="farmAccount" className="flex items-center">
                    <Farm className="h-4 w-4 mr-2 text-green-500" />
                    {t("farmAccount")}
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="blacklisted"
                    checked={blacklisted}
                    onCheckedChange={(checked) => setBlacklisted(checked as boolean)}
                  />
                  <Label htmlFor="blacklisted" className="flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-gray-500" />
                    {t("blacklisted")}
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handlePlayerStatusUpdate} disabled={isUpdating} className="ml-auto">
              {isUpdating ? (
                <>
                  <span className="animate-spin mr-2">
                    <Save className="h-4 w-4" />
                  </span>
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Update Status
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

