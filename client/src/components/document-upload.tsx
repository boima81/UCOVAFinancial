import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Check } from "lucide-react";

interface DocumentUploadProps {
  type: string;
  label: string;
  icon?: React.ReactNode;
  onUpload?: (file: File, type: string) => void;
}

export function DocumentUpload({ type, label, icon, onUpload }: DocumentUploadProps) {
  const [isUploaded, setIsUploaded] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setIsUploaded(true);
      onUpload?.(file, type);
    }
  };

  return (
    <Card className="border-2 border-dashed border-gray-300 hover:border-ucova-blue transition-colors cursor-pointer">
      <CardContent className="p-6 text-center">
        <label htmlFor={`upload-${type}`} className="cursor-pointer block">
          <input
            id={`upload-${type}`}
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
          />
          
          {isUploaded ? (
            <div className="space-y-2">
              <Check className="h-8 w-8 text-ucova-success mx-auto" />
              <p className="text-sm font-medium text-gray-900">{label}</p>
              <p className="text-xs text-ucova-success">Uploaded: {fileName}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {icon || <Upload className="h-8 w-8 text-gray-400 mx-auto" />}
              <p className="text-sm font-medium text-gray-900">{label}</p>
              <p className="text-xs text-gray-500">Click to upload</p>
            </div>
          )}
        </label>
      </CardContent>
    </Card>
  );
}
