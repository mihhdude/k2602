"use client"

import { useState } from "react"
import { SubNavigation } from "@/components/sub-navigation"
import { useLanguage } from "@/components/language-provider"
import { FileText, Crown, Info, User, Users, Shield } from "lucide-react"
import { TranslationValue } from "@/components/language-provider"

export function Introduction() {
  const { t } = useLanguage()
  const [activeSubTab, setActiveSubTab] = useState("kingdom")

  const subTabs = [
    {
      id: "kingdom",
      label: String(t("kingdomTab")),
      icon: <Info className="h-4 w-4" />,
    },
    {
      id: "king",
      label: String(t("kingTab")),
      icon: <Crown className="h-4 w-4" />,
    },
  ]

  return (
    <>
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-4">
        <SubNavigation 
          tabs={subTabs} 
          activeTab={activeSubTab} 
          setActiveTab={setActiveSubTab} 
        />
      </div>

      {activeSubTab === "kingdom" && (
        <div className="border rounded-md p-4 sm:p-6">
          <div className="mb-6 flex items-center">
            <Info className="h-6 w-6 mr-2 text-blue-500" />
            <div>
              <h1 className="text-2xl font-bold">Kingdom 2602</h1>
              <p className="text-gray-500">{t("introduction") as string}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden">
              <img 
                src="/flag02.jpg"
                alt="Kingdom 2602 Flag"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-2 flex items-center">
                  <Info className="h-5 w-5 mr-2 text-blue-500" />
                  {t("aboutKingdom") as string}
                </h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {t("kingdomDescription") as string}
                </p>
              </div>

              <div>
                <p className="text-gray-700 dark:text-gray-300">
                  {t("kingdomPride") as string}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-2 flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-blue-500" />
                  {t("kingdomRules") as string}
                </h2>
                <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                  {Array.isArray(t("rules")) &&
                    (t("rules") as string[]).map((rule, index) => (
                      <li key={index}>{rule}</li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === "king" && (
        <div className="border rounded-md p-4 sm:p-6">
          <div className="mb-6 flex items-center">
            <Crown className="h-6 w-6 mr-2 text-yellow-500" />
            <div>
              <h1 className="text-2xl font-bold">{t("currentKingTitle") as string}</h1>
              <p className="text-gray-500">{t("leadershipInfo") as string}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden">
              <img 
                src="/image/players/king.jpg" 
                alt={t("currentKingTitle") as string}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-2 flex items-center">
                  <User className="h-5 w-5 mr-2 text-yellow-500" />
                  {t("kingInfo") as string}
                </h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {t("kingDescription") as string}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-2 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-yellow-500" />
                  {t("leadershipTeam") as string}
                </h2>
                <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                  <li>
                    <strong>{t("kingLabel") as string}</strong> ᵛᶰKemsiro - ID: 27879774
                  </li>
                  <li>
                    <strong>{t("r4Officers") as string}</strong>
                  </li>
                  <li>ᵛᶰCrazyDude - ID: 48387831 ({t("supportContact") as string})</li>
                  <li>ᵛᶰ Gaara - ID: 55277161</li>
                  <li>ᴮ Pink Cloud - ID: 72097985</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

