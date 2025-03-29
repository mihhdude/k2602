"use client"

import { useState } from "react"
import { Moon, Sun, Globe, Copy } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useLanguage } from "./language-provider"
import { LoginDialog } from "./login-dialog"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/components/ui/use-toast"

export function Header() {
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()
  const { isAdmin, logout } = useAuth()
  const [supportOpen, setSupportOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const { toast } = useToast()

  const handleCopyId = () => {
    navigator.clipboard.writeText("48387831")
    toast({
      description: "ID đã được sao chép!",
      duration: 2000,
    })
  }

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
            {String(t("support"))}
          </Button>

          {isAdmin ? (
            <Button variant="ghost" size="sm" onClick={logout}>
              {String(t("logout"))}
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => setLoginOpen(true)}>
              {String(t("admin"))}
            </Button>
          )}
        </div>
      </div>

      <Dialog open={supportOpen} onOpenChange={setSupportOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{String(t("support"))}</DialogTitle>
            <DialogDescription>{String(t("supportText"))}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm font-medium mb-2">Người nhận: Nguyễn Minh Đức</p>
              <div className="flex items-center justify-center gap-2">
                <p className="text-sm">ID: 48387831</p>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6" 
                  onClick={handleCopyId}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <img 
                src="/bank.jpg" 
                alt="QR Code" 
                className="w-48 h-48 object-cover rounded-lg"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </header>
  )
}

