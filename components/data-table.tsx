"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Database, Loader2, Info, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

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

interface DataTableProps {
  data: PlayerData[]
  isLoading: boolean
}

export function DataTable({ data, isLoading }: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 50
  const totalPages = Math.ceil(data.length / itemsPerPage)

  // Thêm hàm formatNumber để định dạng số liệu đồng nhất
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Database className="h-8 w-8 text-gray-400 mb-2" />
        <p>Không có dữ liệu</p>
        <p className="text-sm text-gray-500">Vui lòng chọn loại dữ liệu khác</p>
      </div>
    )
  }

  // Tính toán dữ liệu cho trang hiện tại
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const displayData = data.slice(startIndex, endIndex)

  // Xử lý chuyển trang
  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Info className="h-4 w-4" />
          <span>
            Hiển thị {startIndex + 1}-{Math.min(endIndex, data.length)} / {data.length} thống đốc
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Trang trước
          </Button>
          <span className="text-sm">
            Trang {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Trang sau
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">STT</TableHead>
              <TableHead>Tên</TableHead>
              <TableHead>ID</TableHead>
              <TableHead className="text-right">Power</TableHead>
              <TableHead className="text-right">Kill Points</TableHead>
              <TableHead className="text-right">Deads</TableHead>
              <TableHead className="text-right">T1 Kills</TableHead>
              <TableHead className="text-right">T2 Kills</TableHead>
              <TableHead className="text-right">T3 Kills</TableHead>
              <TableHead className="text-right">T4 Kills</TableHead>
              <TableHead className="text-right">T5 Kills</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayData.map((row, index) => (
              <TableRow key={row.id} className={index % 2 === 0 ? "bg-muted/50" : ""}>
                <TableCell>{startIndex + index + 1}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.id}</TableCell>
                <TableCell className="text-right">{formatNumber(row.power)}</TableCell>
                <TableCell className="text-right">{formatNumber(row.killPoints)}</TableCell>
                <TableCell className="text-right">{formatNumber(row.deads)}</TableCell>
                <TableCell className="text-right">{formatNumber(row.t1Kills)}</TableCell>
                <TableCell className="text-right">{formatNumber(row.t2Kills)}</TableCell>
                <TableCell className="text-right">{formatNumber(row.t3Kills)}</TableCell>
                <TableCell className="text-right">{formatNumber(row.t4Kills)}</TableCell>
                <TableCell className="text-right">{formatNumber(row.t5Kills)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 