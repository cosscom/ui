"use client";

import {
  AlertCircleIcon,
  FileArchiveIcon,
  FileIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  HeadphonesIcon,
  ImageIcon,
  Trash2Icon,
  UploadIcon,
  VideoIcon,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import {
  type FileWithPreview,
  formatBytes,
  useFileUpload,
} from "@/registry/default/hooks/use-file-upload";
import { Button } from "@/registry/default/ui/button";

// Create some dummy initial files
const initialFiles = [
  {
    id: "intro.zip-1744638436563-8u5xuls",
    name: "intro.zip",
    size: 252873,
    type: "application/zip",
    url: "https://example.com/intro.zip",
  },
  {
    id: "image-01-123456789",
    name: "image-01.jpg",
    size: 1528737,
    type: "image/jpeg",
    url: "https://picsum.photos/1000/800?grayscale&random=1",
  },
  {
    id: "audio-123456789",
    name: "audio.mp3",
    size: 1528737,
    type: "audio/mpeg",
    url: "https://example.com/audio.mp3",
  },
];

const getFileIcon = (file: { file: File | { type: string; name: string } }) => {
  const fileType = file.file instanceof File ? file.file.type : file.file.type;
  const fileName = file.file instanceof File ? file.file.name : file.file.name;

  const iconMap = {
    archive: {
      conditions: (type: string, name: string) =>
        type.includes("zip") ||
        type.includes("archive") ||
        name.endsWith(".zip") ||
        name.endsWith(".rar"),
      icon: FileArchiveIcon,
    },
    audio: {
      conditions: (type: string) => type.includes("audio/"),
      icon: HeadphonesIcon,
    },
    excel: {
      conditions: (type: string, name: string) =>
        type.includes("excel") ||
        name.endsWith(".xls") ||
        name.endsWith(".xlsx"),
      icon: FileSpreadsheetIcon,
    },
    image: {
      conditions: (type: string) => type.startsWith("image/"),
      icon: ImageIcon,
    },
    pdf: {
      conditions: (type: string, name: string) =>
        type.includes("pdf") ||
        name.endsWith(".pdf") ||
        type.includes("word") ||
        name.endsWith(".doc") ||
        name.endsWith(".docx"),
      icon: FileTextIcon,
    },
    video: {
      conditions: (type: string) => type.includes("video/"),
      icon: VideoIcon,
    },
  };

  for (const { icon: Icon, conditions } of Object.values(iconMap)) {
    if (conditions(fileType, fileName)) {
      return <Icon className="size-5 opacity-60" />;
    }
  }

  return <FileIcon className="size-5 opacity-60" />;
};

const _getFilePreview = (file: {
  file: File | { type: string; name: string; url?: string };
}) => {
  const fileType = file.file instanceof File ? file.file.type : file.file.type;
  const fileName = file.file instanceof File ? file.file.name : file.file.name;

  const renderImage = (src: string) => (
    <img
      alt={fileName}
      className="size-full rounded-t-[inherit] object-cover"
      src={src}
    />
  );

  return (
    <div className="flex aspect-square items-center justify-center overflow-hidden rounded-t-[inherit] bg-accent">
      {fileType.startsWith("image/") ? (
        file.file instanceof File ? (
          (() => {
            const previewUrl = URL.createObjectURL(file.file);
            return renderImage(previewUrl);
          })()
        ) : file.file.url ? (
          renderImage(file.file.url)
        ) : (
          <ImageIcon className="size-5 opacity-60" />
        )
      ) : (
        getFileIcon(file)
      )}
    </div>
  );
};

// Type for tracking upload progress
type UploadProgress = {
  fileId: string;
  progress: number;
  completed: boolean;
};

// Function to simulate file upload with more realistic timing and progress
const simulateUpload = (
  totalBytes: number,
  onProgress: (progress: number) => void,
  onComplete: () => void,
) => {
  let timeoutId: NodeJS.Timeout;
  let uploadedBytes = 0;
  let lastProgressReport = 0;

  const simulateChunk = () => {
    // Simulate variable network conditions with random chunk sizes
    const chunkSize = Math.floor(Math.random() * 300000) + 2000;
    uploadedBytes = Math.min(totalBytes, uploadedBytes + chunkSize);

    // Calculate progress percentage (0-100)
    const progressPercent = Math.floor((uploadedBytes / totalBytes) * 100);

    // Only report progress if it's changed by at least 1%
    if (progressPercent > lastProgressReport) {
      lastProgressReport = progressPercent;
      onProgress(progressPercent);
    }

    // Continue simulation if not complete
    if (uploadedBytes < totalBytes) {
      // Variable delay between 50ms and 500ms to simulate network fluctuations (reduced for faster uploads)
      const delay = Math.floor(Math.random() * 450) + 50;

      // Occasionally add a longer pause to simulate network congestion (5% chance, shorter duration)
      const extraDelay = Math.random() < 0.05 ? 500 : 0;

      timeoutId = setTimeout(simulateChunk, delay + extraDelay);
    } else {
      // Upload complete
      onComplete();
    }
  };

  // Start the simulation
  timeoutId = setTimeout(simulateChunk, 100);

  // Return a cleanup function to cancel the simulation
  return () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };
};

export default function Component() {
  const maxSizeMB = 5;
  const maxSize = maxSizeMB * 1024 * 1024; // 5MB default
  const maxFiles = 6;

  // State to track upload progress for each file
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);

  // Function to handle newly added files
  const handleFilesAdded = (addedFiles: FileWithPreview[]) => {
    const newProgressItems = addedFiles.map((file) => ({
      completed: false,
      fileId: file.id,
      progress: 0,
    }));

    setUploadProgress((prev) => [...prev, ...newProgressItems]);

    const cleanupFunctions: Array<() => void> = [];

    for (const file of addedFiles) {
      const fileSize =
        file.file instanceof File ? file.file.size : file.file.size;

      const cleanup = simulateUpload(
        fileSize,
        (progress) => {
          setUploadProgress((prev) =>
            prev.map((item) =>
              item.fileId === file.id ? { ...item, progress } : item,
            ),
          );
        },
        () => {
          setUploadProgress((prev) =>
            prev.map((item) =>
              item.fileId === file.id ? { ...item, completed: true } : item,
            ),
          );
        },
      );

      cleanupFunctions.push(cleanup);
    }

    return () => {
      for (const cleanup of cleanupFunctions) {
        cleanup();
      }
    };
  };

  // Remove the progress tracking for the file
  const handleFileRemoved = (fileId: string) => {
    setUploadProgress((prev) => prev.filter((item) => item.fileId !== fileId));
  };

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
    onFilesAdded: handleFilesAdded,
  });

  return (
    <div className="flex flex-col gap-2">
      {/* Drop area */}
      <div
        className="relative flex min-h-52 flex-col items-center not-data-[files]:justify-center overflow-hidden rounded-xl border border-input border-dashed p-4 transition-colors has-[input:focus]:border-ring has-[input:focus]:ring-[3px] has-[input:focus]:ring-ring/50 data-[dragging=true]:bg-accent/50"
        data-dragging={isDragging || undefined}
        data-files={files.length > 0 || undefined}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          {...getInputProps()}
          aria-label="Upload image file"
          className="sr-only"
        />
        {files.length > 0 ? (
          <div className="flex w-full flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="truncate font-medium text-sm">
                Files ({files.length})
              </h3>
              <div className="flex gap-2">
                <Button onClick={openFileDialog} size="sm" variant="outline">
                  <UploadIcon
                    aria-hidden="true"
                    className="-ms-0.5 size-3.5 opacity-60"
                  />
                  Add files
                </Button>
                <Button
                  onClick={() => {
                    // Clear all progress tracking
                    setUploadProgress([]);
                    clearFiles();
                  }}
                  size="sm"
                  variant="outline"
                >
                  <Trash2Icon
                    aria-hidden="true"
                    className="-ms-0.5 size-3.5 opacity-60"
                  />
                  Remove all
                </Button>
              </div>
            </div>

            <div className="w-full space-y-2">
              {files.map((file) => {
                // Find the upload progress for this file once to avoid repeated lookups
                const fileProgress = uploadProgress.find(
                  (p) => p.fileId === file.id,
                );
                const isUploading = fileProgress && !fileProgress.completed;

                return (
                  <div
                    className="flex flex-col gap-1 rounded-lg border bg-background p-2 pe-3 transition-opacity duration-300"
                    data-uploading={isUploading || undefined}
                    key={file.id}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3 overflow-hidden in-data-[uploading=true]:opacity-50">
                        <div className="flex aspect-square size-10 shrink-0 items-center justify-center rounded border">
                          {getFileIcon(file)}
                        </div>
                        <div className="flex min-w-0 flex-col gap-0.5">
                          <p className="truncate font-medium text-[13px]">
                            {file.file instanceof File
                              ? file.file.name
                              : file.file.name}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {formatBytes(
                              file.file instanceof File
                                ? file.file.size
                                : file.file.size,
                            )}
                          </p>
                        </div>
                      </div>
                      <Button
                        aria-label="Remove file"
                        className="-me-2 size-8 text-muted-foreground/80 hover:bg-transparent hover:text-foreground"
                        onClick={() => {
                          handleFileRemoved(file.id);
                          removeFile(file.id);
                        }}
                        size="icon"
                        variant="ghost"
                      >
                        <XIcon aria-hidden="true" className="size-4" />
                      </Button>
                    </div>

                    {/* Upload progress bar */}
                    {fileProgress &&
                      (() => {
                        const progress = fileProgress.progress || 0;
                        const completed = fileProgress.completed || false;

                        if (completed) return null;

                        return (
                          <div className="mt-1 flex items-center gap-2">
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                              <div
                                className="h-full bg-primary transition-all duration-300 ease-out"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <span className="w-10 text-muted-foreground text-xs tabular-nums">
                              {progress}%
                            </span>
                          </div>
                        );
                      })()}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
            <div
              aria-hidden="true"
              className="mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border bg-background"
            >
              <ImageIcon className="size-4 opacity-60" />
            </div>
            <p className="mb-1.5 font-medium text-sm">Drop your files here</p>
            <p className="text-muted-foreground text-xs">
              Max {maxFiles} files ∙ Up to {maxSizeMB}MB
            </p>
            <Button className="mt-4" onClick={openFileDialog} variant="outline">
              <UploadIcon aria-hidden="true" className="-ms-1 opacity-60" />
              Select images
            </Button>
          </div>
        )}
      </div>

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
        With simulated progress track ∙{" "}
        <a
          className="underline hover:text-foreground"
          href="https://github.com/cosscom/ui/blob/main/apps/origin/docs/use-file-upload.md"
          rel="noreferrer"
          target="_blank"
        >
          API
        </a>
      </p>
    </div>
  );
}
