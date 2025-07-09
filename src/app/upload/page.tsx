import { SingleLeadForm } from "@/components/upload/SingleLeadForm";
import { BulkLeadUpload } from "@/components/upload/BulkLeadUpload";

export default function UploadPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Upload Leads</h1>
        <p className="text-muted-foreground">Add new leads to your pipeline individually or in bulk.</p>
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
        <SingleLeadForm />
        <BulkLeadUpload />
      </div>
    </div>
  );
}
