"use client"

import { useState } from "react"
import { FileUp, Loader2 } from "lucide-react"
import * as Papa from "papaparse"
import toast from "react-hot-toast"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { leadsAPI } from "@/lib/leads"

interface CSVLead {
  leadName: string
  contactDetails: string
  dealValue: string
  stage: "New" | "In Progress" | "Qualified" | "Closed"
  lastInteraction: string
  additionalDetails?: string
}

export function BulkLeadUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    const toastId = toast.loading("Processing CSV file...")

    try {
      // Parse CSV file
      const results = await new Promise<Papa.ParseResult<CSVLead>>((resolve) => {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: resolve,
        })
      })

      // Check for errors
      if (results.errors.length > 0) {
        throw new Error("Invalid CSV format")
      }

      const leads = results.data
      if (leads.length === 0) {
        throw new Error("No valid leads found in CSV")
      }

      toast.loading(`Uploading ${leads.length} leads...`, { id: toastId })

      const BATCH_SIZE = 5
      let successfulUploads = 0

      for (let i = 0; i < leads.length; i += BATCH_SIZE) {
        const batch = leads.slice(i, i + BATCH_SIZE)

        for (const lead of batch) {
          const singleLeadPayload = {
            leadName: lead.leadName,
            contactDetails: lead.contactDetails,
            dealValue: parseFloat(lead.dealValue) || 0,
            stage: lead.stage || "New",
            lastInteraction: lead.lastInteraction,
            additionalDetails: lead.additionalDetails || "",
          }

          const response = await leadsAPI.createSingleLead(singleLeadPayload)

          if (!response.success) {
            throw new Error(`Failed to upload lead: ${lead.leadName}`)
          }

          successfulUploads += 1
          toast.loading(
            `Uploaded ${successfulUploads} of ${leads.length} leads...`,
            { id: toastId }
          )
        }
      }

      toast.success(
        <div>
          <p className="font-bold">Bulk Upload Complete!</p>
          <p>Successfully uploaded {successfulUploads} leads.</p>
        </div>,
        { id: toastId, duration: 5000 }
      )
    } catch (error) {
      toast.error(
        <div>
          <p className="font-bold">Upload Error</p>
          <p>
            {error instanceof Error
              ? error.message
              : "Failed to process CSV file"}
          </p>
        </div>,
        { id: toastId, duration: 5000 }
      )
    } finally {
      setIsUploading(false)
      setFile(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bulk Lead Upload</CardTitle>
        <CardDescription>
          Upload a CSV file to add multiple leads at once.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Ensure your CSV has columns:{" "}
            <code>leadName</code>, <code>contactDetails</code>,{" "}
            <code>dealValue</code>, <code>stage</code>,{" "}
            <code>lastInteraction</code>, <code>additionalDetails</code>{" "}
            (optional).
          </p>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted/50 transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FileUp className="w-8 h-8 mb-4 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold">Click to upload</span> or
                  drag and drop
                </p>
                <p className="text-xs text-muted-foreground">CSV (MAX. 5MB)</p>
              </div>
              <Input
                id="dropzone-file"
                type="file"
                className="hidden"
                accept=".csv"
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </label>
          </div>
        </div>

        {file && (
          <div className="text-sm text-center text-muted-foreground">
            Selected file:{" "}
            <span className="font-medium text-foreground">{file.name}</span>
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={!file || isUploading}
          className="w-full"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <FileUp className="mr-2 h-4 w-4" />
              Upload CSV
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
