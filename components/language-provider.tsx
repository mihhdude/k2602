"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"

export type Language = "en" | "vi"

export type TranslationValue = string | string[] | { [key: string]: string }

export interface Translations {
  [key: string]: {
    en: TranslationValue;
    vi: TranslationValue;
  }
}

const translations: Translations = {
  introduction: {
    en: "Kingdom Introduction",
    vi: "Giới thiệu Vương quốc",
  },
  kvkData: {
    en: "KVK Data",
    vi: "Dữ liệu KVK",
  },
  hallOfFame: {
    en: "Hall of Fame",
    vi: "Đại sảnh anh hùng",
  },
  events: {
    en: "Events",
    vi: "Sự kiện",
  },
  blacklist: {
    en: "Blacklist",
    vi: "Danh sách đen",
  },
  admin: {
    en: "Admin",
    vi: "Quản trị",
  },
  support: {
    en: "Support",
    vi: "Hỗ trợ",
  },
  kingdom: {
    en: "Kingdom",
    vi: "Vương quốc",
  },
  currentKing: {
    en: "Current King",
    vi: "Vua hiện tại",
  },
  dataStart: {
    en: "DATA START",
    vi: "DỮ LIỆU BẮT ĐẦU",
  },
  dataPass4: {
    en: "DATA PASS 4",
    vi: "DỮ LIỆU PASS 4",
  },
  dataPass7: {
    en: "DATA PASS 7",
    vi: "DỮ LIỆU PASS 7",
  },
  dataKingland: {
    en: "DATA KINGLAND",
    vi: "DỮ LIỆU KINGLAND",
  },
  top3: {
    en: "Top 3 Players",
    vi: "Top 3 Người chơi",
  },
  results: {
    en: "Results",
    vi: "Kết quả",
  },
  supportText: {
    en: "For questions and support, please contact governor ᵛᶰCrazyDude, ID: 48387831",
    vi: "Mọi thắc mắc và hỗ trợ vui lòng liên hệ thống đốc ᵛᶰCrazyDude, ID: 48387831",
  },
  login: {
    en: "Login",
    vi: "Đăng nhập",
  },
  logout: {
    en: "Logout",
    vi: "Đăng xuất",
  },
  username: {
    en: "Username",
    vi: "Tên đăng nhập",
  },
  password: {
    en: "Password",
    vi: "Mật khẩu",
  },
  uploadData: {
    en: "Upload Data",
    vi: "Tải lên dữ liệu",
  },
  manageUsers: {
    en: "Manage Users",
    vi: "Quản lý người dùng",
  },
  governorId: {
    en: "Governor ID",
    vi: "ID Thống đốc",
  },
  onLeave: {
    en: "On Leave",
    vi: "Nghỉ phép",
  },
  zeroed: {
    en: "Zeroed",
    vi: "Đã bị zero",
  },
  farmAccount: {
    en: "Farm Account",
    vi: "Tài khoản farm",
  },
  blacklisted: {
    en: "Blacklisted",
    vi: "Danh sách đen",
  },
  currentKingTitle: {
    en: "Current King",
    vi: "Vua hiện tại",
  },
  leadershipInfo: {
    en: "Leadership Information",
    vi: "Thông tin lãnh đạo",
  },
  kingInfo: {
    en: "King Information",
    vi: "Thông tin nhà vua",
  },
  kingDescription: {
    en: "Our current king is ᵛᶰKemsiro, who has been leading our kingdom since 2025. Under their leadership, our kingdom has achieved significant victories in KvK events.",
    vi: "Vua hiện tại của chúng ta là ᵛᶰKemsiro, người đã lãnh đạo vương quốc từ 2025. Dưới sự lãnh đạo của ngài, vương quốc đã đạt được nhiều chiến thắng quan trọng trong các sự kiện KvK.",
  },
  leadershipTeam: {
    en: "Leadership Team",
    vi: "Đội ngũ lãnh đạo",
  },
  kingLabel: {
    en: "King:",
    vi: "Vua:",
  },
  r4Officers: {
    en: "R4 Officers:",
    vi: "Quan chức R4:",
  },
  supportContact: {
    en: "Support Contact",
    vi: "Liên hệ hỗ trợ",
  },
  aboutKingdom: {
    en: "About Kingdom 2602",
    vi: "Giới thiệu Vương quốc 2602",
  },
  kingdomDescription: {
    en: "Kingdom 2602 is a powerful and united kingdom in Rise of Kingdoms. Founded in 24-01-2022, our kingdom has grown to become one of the most respected and feared kingdoms in the game.",
    vi: "Vương quốc 2602 là một vương quốc hùng mạnh và đoàn kết trong Rise of Kingdoms. Được thành lập vào 24-01-2022, vương quốc của chúng ta đã phát triển để trở thành một trong những vương quốc được kính trọng và đáng gờm nhất trong trò chơi.",
  },
  kingdomPride: {
    en: "We pride ourselves on our strong community, strategic gameplay, and dedication to excellence in Kingdom vs Kingdom events. Our leadership structure ensures fair play and maximum participation from all members.",
    vi: "Chúng tôi tự hào về cộng đồng vững mạnh, lối chơi chiến lược và sự cống hiến cho sự xuất sắc trong các sự kiện KvK. Cơ cấu lãnh đạo của chúng tôi đảm bảo công bằng và sự tham gia tối đa từ tất cả thành viên.",
  },
  kingdomRules: {
    en: "Kingdom Rules",
    vi: "Luật Vương quốc",
  },
  rules: {
    en: [
      "Respect all members of the kingdom",
      "Participate in kingdom events",
      "Follow leadership instructions during KVK",
      "Help fellow kingdom members",
      "Maintain active gameplay"
    ],
    vi: [
      "Tôn trọng tất cả thành viên trong vương quốc",
      "Tham gia các sự kiện của vương quốc",
      "Tuân theo chỉ dẫn của lãnh đạo trong KVK",
      "Giúp đỡ các thành viên khác",
      "Duy trì hoạt động thường xuyên"
    ]
  },
  kingdomTab: {
    en: "About Kingdom",
    vi: "Giới thiệu Vương quốc",
  },
  kingTab: {
    en: "Current King",
    vi: "Vua hiện tại",
  },
  kvkTab: {
    en: "KvK",
    vi: "KvK",
  },
  hallOfFameTab: {
    en: "Hall of Fame",
    vi: "Hall of Fame",
  },
  eventsTab: {
    en: "Events",
    vi: "Sự kiện",
  },
  blacklistTab: {
    en: "Blacklist",
    vi: "Blacklist",
  },
  adminTab: {
    en: "Admin",
    vi: "Quản trị",
  },
  searchById: {
    en: "Search by ID...",
    vi: "Tìm theo ID...",
  },
  moreTab: {
    en: "More",
    vi: "Thêm",
  },
  onLeaveList: {
    en: "On Leave List",
    vi: "Danh sách nghỉ phép",
  },
  onLeaveTab: {
    en: "On Leave",
    vi: "Nghỉ phép",
  },
}

export interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => TranslationValue;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: "vi",
  setLanguage: () => {},
  t: () => "",
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("vi")

  // Load language preference from localStorage on client side
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "vi")) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Save language preference to localStorage
  useEffect(() => {
    localStorage.setItem("language", language)
  }, [language])

  const t = useCallback(
    (key: string): TranslationValue => {
      if (!translations[key]) {
        console.warn(`Translation key "${key}" not found.`);
        return key;
      }
      return translations[key][language];
    },
    [language]
  );

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export const useLanguage = () => useContext(LanguageContext)

