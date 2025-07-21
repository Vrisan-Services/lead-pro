"use client"

import * as React from "react"
import Link from "next/link"
import { redirect, usePathname } from "next/navigation"
import { LayoutDashboard, Upload, Users, Briefcase, LogOutIcon } from "lucide-react"

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  function Logout() {
    localStorage.clear();
    sessionStorage.clear();
    redirect("/auth/sign-in");
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 p-2">
              <Button variant="ghost" size="icon" className="shrink-0" asChild>
                <Link href="/dashboard"><Briefcase className="size-5 text-primary" /></Link>
              </Button>
              <h1 className="text-xl font-semibold truncate">LeadPro Hub</h1>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith("/dashboard")}
                  tooltip="Dashboard"
                >
                  <Link href="/dashboard">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith("/upload")}
                  tooltip="Upload Leads"
                >
                  <Link href="/upload">
                    <Upload />
                    <span>Upload Leads</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  onClick={Logout}
                  // isActive={pathname.startsWith("/auth/sign-in")}
                  tooltip="Logout"
                >
                  <Link href="/auth/sign-in">
                    <LogOutIcon />
                    <span>Logout</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:h-16 sm:px-6 md:hidden">
            <SidebarTrigger />
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <Briefcase className="h-6 w-6 text-primary" />
              <span>LeadPro Hub</span>
            </Link>
          </header>
          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
