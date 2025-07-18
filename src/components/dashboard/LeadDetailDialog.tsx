"use client"

import * as React from "react"
import { BrainCircuit, Loader2 } from "lucide-react"

import { leadInsights, type LeadInsightsOutput } from "@/ai/flows/lead-insights"
import { useToast } from "@/hooks/use-toast"
import type { Lead } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "../ui/badge"

interface LeadDetailDialogProps {
  lead: Lead | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function LeadDetailDialog({
  lead,
  isOpen,
  onOpenChange,
}: LeadDetailDialogProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = React.useState(false)
  const [insights, setInsights] = React.useState<LeadInsightsOutput | null>(null)

  React.useEffect(() => {
    // Reset insights when dialog opens with a new lead
    if (isOpen) {
      setInsights(null)
    }
  }, [isOpen, lead])

  if (!lead) return null

  const handleGetInsights = async () => {
    setIsLoading(true)
    setInsights(null)
    try {
      const result = await leadInsights({
        leadName: lead.LeadName,
        contactDetails: lead.ContactDetails,
        dealValue: lead.Budget,
        stage: lead.Stage,
        lastInteraction: lead.LastInteraction,
        additionalDetails: lead.AdditionalDetails || "N/A",
      })
      setInsights(result)
    } catch (error) {
      console.error("Failed to get AI insights:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not fetch AI insights. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{lead.LeadName}</DialogTitle>
          <DialogDescription>
            Detailed information and AI-powered insights for your lead.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div><Badge variant="outline">{lead.Stage}</Badge></div>
            <div className="text-right font-semibold text-lg">{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(lead.Budget)}</div>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Contact Details</h4>
            <p className="text-muted-foreground">{lead.ContactDetails}</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Last Interaction</h4>
            <p className="text-muted-foreground">{lead.LastInteraction}</p>
          </div>
          {lead.AdditionalDetails && (
            <div className="space-y-2">
              <h4 className="font-medium">Additional Details</h4>
              <p className="text-muted-foreground">{lead.AdditionalDetails}</p>
            </div>
          )}
          
          <Separator className="my-4" />

          <div className="space-y-4">
             <Button onClick={handleGetInsights} disabled={isLoading} className="w-full">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <BrainCircuit className="mr-2 h-4 w-4" />
              )}
              {isLoading ? "Analyzing..." : "Get AI Insights"}
            </Button>
            
            {insights && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in-50">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Next Best Action</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{insights.nextBestAction}</p>
                  </CardContent>
                </Card>
                 <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Reasoning</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{insights.reasoning}</p>

                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
