"use client"

import { useState } from "react";
import { FileUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export function BulkLeadUpload() {
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) return;

    // In a real app, you would parse the CSV and send it to the server.
    // For this example, we'll just show a success message.
    console.log("Uploading file:", file.name);
    toast({
      title: "File Uploaded!",
      description: `${file.name} has been processed. Leads will appear on the dashboard shortly.`,
    });
    setFile(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bulk Lead Upload</CardTitle>
        <CardDescription>Upload a CSV file to add multiple leads at once.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
                Ensure your CSV has columns: <code>leadName</code>, <code>contactDetails</code>, <code>dealValue</code>, <code>stage</code>, <code>lastInteraction</code>, <code>additionalDetails</code> (optional).
            </p>
            <div className="flex items-center justify-center w-full">
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted/50 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FileUp className="w-8 h-8 mb-4 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-muted-foreground">CSV (MAX. 5MB)</p>
                    </div>
                    <Input id="dropzone-file" type="file" className="hidden" accept=".csv" onChange={handleFileChange} />
                </label>
            </div>
        </div>

        {file && (
          <div className="text-sm text-center text-muted-foreground">
            Selected file: <span className="font-medium text-foreground">{file.name}</span>
          </div>
        )}
        <Button onClick={handleUpload} disabled={!file} className="w-full">
          <FileUp className="mr-2 h-4 w-4" />
          Upload CSV
        </Button>
      </CardContent>
    </Card>
  );
}
