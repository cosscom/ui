"use client";

import {
  AlertCircleIcon,
  DownloadIcon,
  FileArchiveIcon,
  FileIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  HeadphonesIcon,
  ImageIcon,
  Trash2Icon,
  UploadCloudIcon,
  UploadIcon,
  VideoIcon,
} from "lucide-react";
import {
  formatBytes,
  useFileUpload,
} from "@/registry/default/hooks/use-file-upload";
import { Button } from "@/registry/default/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/default/ui/table";

// Create some dummy initial files
const initialFiles = [
  {
    id: "document.pdf-1744638436563-8u5xuls",
    name: "document.pdf",
    size: 528737,
    type: "application/pdf",
    url: "https://coss.com/origin",
  },
  {
    id: "intro.zip-1744638436563-8u5xuls",
    name: "intro.zip",
    size: 252873,
    type: "application/zip",
    url: "https://coss.com/origin",
  },
  {
    id: "conclusion.xlsx-1744638436563-8u5xuls",
    name: "conclusion.xlsx",
    size: 352873,
    type: "application/xlsx",
    url: "https://coss.com/origin",
  },
];

const getFileIcon = (file: { file: File | { type: string; name: string } }) => {
  const fileType = file.file instanceof File ? file.file.type : file.file.type;
  const fileName = file.file instanceof File ? file.file.name : file.file.name;

  if (
    fileType.includes("pdf") ||
    fileName.endsWith(".pdf") ||
    fileType.includes("word") ||
    fileName.endsWith(".doc") ||
    fileName.endsWith(".docx")
  ) {
    return <FileTextIcon className="size-4 opacity-60" />;
  }
  if (
    fileType.includes("zip") ||
    fileType.includes("archive") ||
    fileName.endsWith(".zip") ||
    fileName.endsWith(".rar")
  ) {
    return <FileArchiveIcon className="size-4 opacity-60" />;
  }
  if (
    fileType.includes("excel") ||
    fileName.endsWith(".xls") ||
    fileName.endsWith(".xlsx")
  ) {
    return <FileSpreadsheetIcon className="size-4 opacity-60" />;
  }
  if (fileType.includes("video/")) {
    return <VideoIcon className="size-4 opacity-60" />;
  }
  if (fileType.includes("audio/")) {
    return <HeadphonesIcon className="size-4 opacity-60" />;
  }
  if (fileType.startsWith("image/")) {
    return <ImageIcon className="size-4 opacity-60" />;
  }
  return <FileIcon className="size-4 opacity-60" />;
};

export default function Component() {
  const maxSize = 10 * 1024 * 1024; // 10MB default
  const maxFiles = 10;

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      clearFiles,
      getInputProps,
    },
  ] = useFileUpload({
    initialFiles,
    maxFiles,
    maxSize,
    multiple: true,
  });

  return (
    <div className="flex flex-col gap-2">
      {/* Drop area */}
      <div
        className="flex min-h-56 flex-col items-center not-data-[files]:justify-center rounded-xl border border-input border-dashed p-4 transition-colors has-[input:focus]:border-ring has-[input:focus]:ring-[3px] has-[input:focus]:ring-ring/50 data-[files]:hidden data-[dragging=true]:bg-accent/50"
        data-dragging={isDragging || undefined}
        data-files={files.length > 0 || undefined}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          {...getInputProps()}
          aria-label="Upload files"
          className="sr-only"
        />
        <div className="flex flex-col items-center justify-center text-center">
          <div
            aria-hidden="true"
            className="mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border bg-background"
          >
            <FileIcon className="size-4 opacity-60" />
          </div>
          <p className="mb-1.5 font-medium text-sm">Upload files</p>
          <p className="text-muted-foreground text-xs">
            Max {maxFiles} files ∙ Up to {formatBytes(maxSize)}
          </p>
          <Button className="mt-4" onClick={openFileDialog} variant="outline">
            <UploadIcon aria-hidden="true" className="-ms-1 opacity-60" />
            Select files
          </Button>
        </div>
      </div>
      {files.length > 0 && (
        <>
          {/* Table with files */}
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-medium text-sm">Files ({files.length})</h3>
            <div className="flex gap-2">
              <Button onClick={openFileDialog} size="sm" variant="outline">
                <UploadCloudIcon
                  aria-hidden="true"
                  className="-ms-0.5 size-3.5 opacity-60"
                />
                Add files
              </Button>
              <Button onClick={clearFiles} size="sm" variant="outline">
                <Trash2Icon
                  aria-hidden="true"
                  className="-ms-0.5 size-3.5 opacity-60"
                />
                Remove all
              </Button>
            </div>
          </div>
          <div className="overflow-hidden rounded-md border bg-background">
            <Table>
              <TableHeader className="text-xs">
                <TableRow className="bg-muted/50">
                  <TableHead className="h-9 py-2">Name</TableHead>
                  <TableHead className="h-9 py-2">Type</TableHead>
                  <TableHead className="h-9 py-2">Size</TableHead>
                  <TableHead className="h-9 w-0 py-2 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-[13px]">
                {files.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell className="max-w-48 py-2 font-medium">
                      <span className="flex items-center gap-2">
                        <span className="shrink-0">{getFileIcon(file)}</span>{" "}
                        <span className="truncate">{file.file.name}</span>
                      </span>
                    </TableCell>
                    <TableCell className="py-2 text-muted-foreground">
                      {file.file.type.split("/")[1]?.toUpperCase() || "UNKNOWN"}
                    </TableCell>
                    <TableCell className="py-2 text-muted-foreground">
                      {formatBytes(file.file.size)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap py-2 text-right">
                      <Button
                        aria-label={`Download ${file.file.name}`}
                        className="size-8 text-muted-foreground/80 hover:bg-transparent hover:text-foreground"
                        onClick={() => window.open(file.preview, "_blank")}
                        size="icon"
                        variant="ghost"
                      >
                        <DownloadIcon className="size-4" />
                      </Button>
                      <Button
                        aria-label={`Remove ${file.file.name}`}
                        className="size-8 text-muted-foreground/80 hover:bg-transparent hover:text-foreground"
                        onClick={() => removeFile(file.id)}
                        size="icon"
                        variant="ghost"
                      >
                        <Trash2Icon className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      {errors.length > 0 && (
        <div
          className="flex items-center gap-1 text-destructive text-xs"
          role="alert"
        >
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}

      <p
        aria-live="polite"
        className="mt-2 text-center text-muted-foreground text-xs"
        role="region"
      >
        Multiple files uploader w/ table ∙{" "}
        <a
          className="underline hover:text-foreground"
          href="https://github.com/cosscom/ui/blob/main/apps/origin/docs/use-file-upload.md"
        >
          API
        </a>
      </p>
    </div>
  );
}
