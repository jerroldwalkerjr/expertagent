"use client";

import { useRef, useState, type ChangeEvent, type DragEvent } from "react";

type DocumentEntry = {
  id: string;
  name: string;
  status: string;
  updated: string;
  content?: string;
  mimeType?: string;
  dataUrl?: string;
};

const initialDocuments: DocumentEntry[] = [
  {
    id: "doc-1",
    name: "ExpertGen Study Notes.pdf",
    status: "Indexed",
    updated: "2 hours ago",
  },
  {
    id: "doc-2",
    name: "Learning Outcomes Survey.csv",
    status: "Processing",
    updated: "Yesterday",
  },
  {
    id: "doc-3",
    name: "Trust Evaluation Summary.docx",
    status: "Indexed",
    updated: "3 days ago",
  },
];

export default function DocumentsPageClient() {
  const [documents, setDocuments] = useState(initialDocuments);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFiles = (files: File[]) => {
    if (files.length === 0) {
      return;
    }

    const newDocuments: DocumentEntry[] = [];

    files.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        newDocuments.push({
          id:
            typeof crypto !== "undefined" && "randomUUID" in crypto
              ? crypto.randomUUID()
              : `doc-${Date.now()}-${file.name}-${index}`,
          name: file.name,
          status: "Uploaded",
          updated: "Just now",
          content:
            typeof result === "string"
              ? "File ready for download."
              : "File ready for download.",
          mimeType: file.type || "application/octet-stream",
          dataUrl: typeof result === "string" ? result : undefined,
        });
        if (newDocuments.length === files.length) {
          setDocuments((prevDocuments) => [
            ...newDocuments,
            ...prevDocuments,
          ]);
        }
      };
      reader.onerror = () => {
        newDocuments.push({
          id:
            typeof crypto !== "undefined" && "randomUUID" in crypto
              ? crypto.randomUUID()
              : `doc-${Date.now()}-${file.name}-${index}`,
          name: file.name,
          status: "Uploaded",
          updated: "Just now",
          content: "Unable to read file contents.",
          mimeType: file.type || "application/octet-stream",
          dataUrl: undefined,
        });
        if (newDocuments.length === files.length) {
          setDocuments((prevDocuments) => [
            ...newDocuments,
            ...prevDocuments,
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    handleFiles(files);

    event.target.value = "";
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const files = Array.from(event.dataTransfer.files ?? []);
    handleFiles(files);
  };

  const handleDownload = (doc: DocumentEntry) => {
    if (!doc.dataUrl) {
      return;
    }
    const link = document.createElement("a");
    link.href = doc.dataUrl;
    link.download = doc.name;
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments((prevDocuments) =>
      prevDocuments.filter((doc) => doc.id !== id)
    );
  };

  const handleManage = () => {
    // TODO: navigate to document management tools.
    console.info("Manage documents clicked");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">
          Document Management
        </h2>
        <p className="text-sm text-slate-500">
          Upload, organize, and manage learning resources for Expert Agent.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-700">
            Upload Materials
          </h3>
          <div
            className={`mt-4 flex h-36 flex-col items-center justify-center rounded-xl border-2 border-dashed ${
              isDragging
                ? "border-indigo-400 bg-indigo-50"
                : "border-slate-200 bg-slate-50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <p className="text-xs text-slate-500">
              Drag files here or upload from your device.
            </p>
            <button
              type="button"
              onClick={handleUpload}
              className="mt-3 rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow transition hover:bg-indigo-500"
            >
              Upload Files
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-700">
            Knowledge Base Status
          </h3>
          <ul className="mt-3 space-y-2 text-xs text-slate-600">
            <li className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
              <span>Active modules</span>
              <span className="font-semibold text-slate-800">12</span>
            </li>
            <li className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
              <span>Sources indexed</span>
              <span className="font-semibold text-slate-800">38</span>
            </li>
            <li className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
              <span>Pending reviews</span>
              <span className="font-semibold text-slate-800">3</span>
            </li>
          </ul>
          <button
            type="button"
            onClick={handleManage}
            className="mt-4 w-full rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
          >
            Manage Sources
          </button>
        </section>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-700">
          Uploaded Documents
        </h3>
        <div className="mt-4 space-y-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-800">
                  {doc.name}
                </p>
                <p className="text-xs text-slate-500">
                  Updated {doc.updated}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-indigo-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-indigo-700">
                  {doc.status}
                </span>
                <button
                  type="button"
                  onClick={() => handleDownload(doc)}
                  disabled={!doc.dataUrl}
                  className="rounded-full border border-slate-200 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600 transition hover:border-slate-300 hover:text-slate-800 disabled:cursor-not-allowed disabled:border-slate-100 disabled:text-slate-400"
                >
                  Download
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteDocument(doc.id)}
                  className="rounded-full border border-red-600 bg-red-600 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow transition hover:border-red-500 hover:bg-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
