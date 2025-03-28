"use client"

import { useState } from "react"
import { Moon, Sun, Globe } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useLanguage } from "./language-provider"
import { LoginDialog } from "./login-dialog"
import { useAuth } from "@/hooks/use-auth"

export function Header() {
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()
  const { isAdmin, logout } = useAuth()
  const [supportOpen, setSupportOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)

  return (
    <header className="border-b sticky top-0 bg-background z-10">
      <div className="container mx-auto px-2 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-8 w-8"
            aria-label="Toggle theme"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLanguage(language === "en" ? "vi" : "en")}
            className="h-8 w-8"
            aria-label="Toggle language"
          >
            <Globe className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center">
          <h1 className="text-3xl font-bold">
            <span className="gradient-text">K2602</span>
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => setSupportOpen(true)} className="text-rose-500">
            {t("support")}
          </Button>

          {isAdmin ? (
            <Button variant="ghost" size="sm" onClick={logout}>
              {t("logout")}
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => setLoginOpen(true)}>
              {t("admin")}
            </Button>
          )}
        </div>
      </div>

      <Dialog open={supportOpen} onOpenChange={setSupportOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("support")}</DialogTitle>
            <DialogDescription>{t("supportText")}</DialogDescription>
          </DialogHeader>
          <div className="flex justify-center p-4">
            <div className="bg-gray-200 w-48 h-48 flex items-center justify-center">
              <p className="text-sm text-gray-500">QR Code Placeholder</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </header>
  )
}

