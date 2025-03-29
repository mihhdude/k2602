"use client"

import React from 'react'

interface Stage {
  id: number
  name: string
  reward: string
  points: number
}

interface Player {
  rank: number
  name: string
  points: number
}

interface MGEDataType {
  title: string
  type: string
  timeRange: string
  commanders: string[]
  stages: Stage[]
  finalRewards: string[]
  topPlayers: Player[]
}

const mgeData: MGEDataType = {
  title: "Thống đốc hùng mạnh nhất",
  type: "Kỵ binh",
  timeRange: "UTC 2025/03/24 - 2025/03/29",
  commanders: [
    "Subutai",
    "Eleanor xứ Aquitaine",
    "Justinian I",
    "Jan Zizka",
    "Bertrand du Guesclin",
    "Jadwiga",
    "Chandragupta Maurya",
    "Attila",
    "Thành Cát Tư Hãn"
  ],
  stages: [
    {
      id: 1,
      name: "Huấn Luyện Đội Quân",
      reward: "Tượng vàng tướng, Tài nguyên",
      points: 40000
    },
    {
      id: 2,
      name: "Đánh bại quân man rợ",
      reward: "Tượng vàng tướng, Đá quý",
      points: 160000
    },
    {
      id: 3,
      name: "Thu thập tài nguyên",
      reward: "Tượng vàng tướng, Vật phẩm đặc biệt",
      points: 252000
    },
    {
      id: 4,
      name: "Nâng cấp sức mạnh",
      reward: "Tượng vàng tướng, Tài nguyên cao cấp",
      points: 300000
    },
    {
      id: 5,
      name: "Đánh bại kẻ thù",
      reward: "Tượng vàng tướng, Đá quý",
      points: 400000
    },
    {
      id: 6,
      name: "Nước rút cuối",
      reward: "Tượng vàng tướng, Vật phẩm đặc biệt",
      points: 500000
    }
  ],
  finalRewards: [
    "Tượng vàng tướng đặc biệt x100",
    "Đầu tướng đặc biệt",
    "Khung Avatar độc quyền",
    "Danh hiệu độc quyền"
  ],
  topPlayers: [
    { rank: 1, name: "Player1", points: 1735800 },
    { rank: 2, name: "Player2", points: 1650400 },
    { rank: 3, name: "Player3", points: 1520300 },
    { rank: 4, name: "Player4", points: 1480200 },
    { rank: 5, name: "Player5", points: 1320100 },
    { rank: 6, name: "Player6", points: 1280000 },
    { rank: 7, name: "Player7", points: 1150000 },
    { rank: 8, name: "Player8", points: 1020000 },
    { rank: 9, name: "Player9", points: 980000 },
    { rank: 10, name: "Player10", points: 920000 },
    { rank: 11, name: "Player11", points: 880000 },
    { rank: 12, name: "Player12", points: 820000 },
    { rank: 13, name: "Player13", points: 780000 },
    { rank: 14, name: "Player14", points: 720000 },
    { rank: 15, name: "Player15", points: 680000 }
  ]
}

export function MGEEvent(): React.ReactElement {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-orange-100 dark:bg-orange-900 rounded-lg p-6 mb-8">
        <h1 className="text-3xl font-bold mb-4 text-orange-800 dark:text-orange-100">{mgeData.title}</h1>
        <div className="mb-4">
          <p className="text-lg mb-2">Thời gian: {mgeData.timeRange}</p>
          <p className="text-lg mb-2">Loại binh: {mgeData.type}</p>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Tướng lĩnh:</h2>
          <div className="flex flex-wrap gap-2">
            {mgeData.commanders.map((commander, index) => (
              <span key={index} className="bg-orange-200 dark:bg-orange-800 px-3 py-1 rounded-full">
                {commander}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Các giai đoạn:</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mgeData.stages.map((stage) => (
              <div key={stage.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h3 className="font-semibold mb-2">Giai đoạn {stage.id}: {stage.name}</h3>
                <p className="text-sm mb-1">Điểm yêu cầu: {stage.points.toLocaleString()}</p>
                <p className="text-sm">Phần thưởng: {stage.reward}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Phần thưởng cuối cùng:</h2>
          <ul className="list-disc list-inside">
            {mgeData.finalRewards.map((reward, index) => (
              <li key={index} className="mb-1">{reward}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Bảng xếp hạng Top 15:</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white dark:bg-gray-800 rounded-lg">
              <thead>
                <tr className="bg-orange-200 dark:bg-orange-800">
                  <th className="px-4 py-2">Hạng</th>
                  <th className="px-4 py-2">Tên</th>
                  <th className="px-4 py-2">Điểm</th>
                </tr>
              </thead>
              <tbody>
                {mgeData.topPlayers.map((player) => (
                  <tr key={player.rank} className="border-b dark:border-gray-700">
                    <td className="px-4 py-2 text-center">{player.rank}</td>
                    <td className="px-4 py-2">{player.name}</td>
                    <td className="px-4 py-2 text-right">{player.points.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
} 