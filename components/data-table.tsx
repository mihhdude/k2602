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
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Tên</TableHead>
              <TableHead>Lực chiến</TableHead>
              <TableHead>Kill Points</TableHead>
              <TableHead>Deads</TableHead>
              <TableHead>T4 Kills</TableHead>
              <TableHead>T5 Kills</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{formatNumber(item.power)}</TableCell>
                <TableCell>{formatNumber(item.killPoints)}</TableCell>
                <TableCell>{formatNumber(item.deads)}</TableCell>
                <TableCell>{formatNumber(item.t4Kills)}</TableCell>
                <TableCell>{formatNumber(item.t5Kills)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
