"use client"

import * as React from "react"
import { Eye } from "lucide-react"

import type { Lead, LeadStage } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { LeadDetailDialog } from "@/components/dashboard/LeadDetailDialog"

const COMMISSION_RATE = 0.10;

const stageBadgeVariant: Record<LeadStage, string> = {
  New: "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300",
  "In Progress": "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300",
  Qualified: "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-300",
  Closed: "bg-accent text-accent-foreground hover:bg-accent/80",
};

interface LeadsDataTableProps {
  leads: Lead[]
}

export function LeadsDataTable({ leads }: LeadsDataTableProps) {
  const [selectedLead, setSelectedLead] = React.useState<Lead | null>(null)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead)
    setIsDialogOpen(true)
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
    }).format(value)

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lead Name</TableHead>
              <TableHead className="hidden sm:table-cell">Contact</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead className="text-right">Deal Value</TableHead>
              <TableHead className="text-right hidden md:table-cell">Commission</TableHead>
              <TableHead className="w-[80px]"><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id} className="group transition-colors hover:bg-muted/50" >
                <TableCell className="font-medium">{lead.LeadName}</TableCell>
                <TableCell className="hidden sm:table-cell text-muted-foreground">{lead.ContactDetails}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("border-transparent", stageBadgeVariant[lead.Stage])}>
                    {lead.Stage}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{formatCurrency(lead.Budget)}</TableCell>
                <TableCell className="text-right hidden md:table-cell text-muted-foreground">
                  {lead.Stage === "Closed"
                    ? formatCurrency(lead.Budget * COMMISSION_RATE)
                    : "-"}
                </TableCell>
                 <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleViewLead(lead)} aria-label={`View details for ${lead.LeadName}`}>
                        <Eye className="h-4 w-4" />
                    </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedLead && (
        <LeadDetailDialog
          lead={selectedLead}
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
      )}
    </>
  )
}
