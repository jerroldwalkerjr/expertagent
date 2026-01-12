"use client";

import { useRef, useState, type ChangeEvent, type DragEvent } from "react";

type DocumentEntry = {
  id: string;
  name: string;
  status: string;
  updated: string;
  folderId: string;
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
    folderId: "folder-general",
  },
  {
    id: "doc-2",
    name: "Learning Outcomes Survey.csv",
    status: "Processing",
    updated: "Yesterday",
    folderId: "folder-general",
  },
  {
    id: "doc-3",
    name: "Trust Evaluation Summary.docx",
    status: "Indexed",
    updated: "3 days ago",
    folderId: "folder-general",
  },
];

export default function DocumentsPageClient() {
  const defaultFolderId = "folder-general";
  const [documents, setDocuments] = useState(initialDocuments);
  const [folders, setFolders] = useState([
    { id: defaultFolderId, name: "General" },
  ]);
  const [selectedFolderId, setSelectedFolderId] =
    useState(defaultFolderId);
  const [newFolderName, setNewFolderName] = useState("");
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingFolderName, setEditingFolderName] = useState("");
  const [openFolderIds, setOpenFolderIds] = useState<string[]>([
    defaultFolderId,
  ]);
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
        const targetFolderId = selectedFolderId || defaultFolderId;
        newDocuments.push({
          id:
            typeof crypto !== "undefined" && "randomUUID" in crypto
              ? crypto.randomUUID()
              : `doc-${Date.now()}-${file.name}-${index}`,
          name: file.name,
          status: "Uploaded",
          updated: "Just now",
          folderId: targetFolderId,
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
          folderId: defaultFolderId,
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

  const handleCreateFolder = () => {
    const name = newFolderName.trim();
    if (!name) {
      return;
    }
    const exists = folders.some(
      (folder) => folder.name.toLowerCase() === name.toLowerCase()
    );
    if (exists) {
      return;
    }
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `folder-${Date.now()}`;
    setFolders((prevFolders) => [...prevFolders, { id, name }]);
    setSelectedFolderId(id);
    setOpenFolderIds((prevOpenIds) => [...prevOpenIds, id]);
    setNewFolderName("");
  };

  const handleStartRenameFolder = (folderId: string, name: string) => {
    setEditingFolderId(folderId);
    setEditingFolderName(name);
  };

  const handleSaveRenameFolder = () => {
    const name = editingFolderName.trim();
    if (!editingFolderId || !name) {
      return;
    }
    setFolders((prevFolders) =>
      prevFolders.map((folder) =>
        folder.id === editingFolderId ? { ...folder, name } : folder
      )
    );
    setEditingFolderId(null);
    setEditingFolderName("");
  };

  const handleDeleteFolder = (folderId: string) => {
    if (folderId === defaultFolderId) {
      return;
    }
    setFolders((prevFolders) =>
      prevFolders.filter((folder) => folder.id !== folderId)
    );
    setDocuments((prevDocuments) =>
      prevDocuments.map((doc) =>
        doc.folderId === folderId
          ? { ...doc, folderId: defaultFolderId }
          : doc
      )
    );
    if (selectedFolderId === folderId) {
      setSelectedFolderId(defaultFolderId);
    }
    setOpenFolderIds((prevOpenIds) =>
      prevOpenIds.filter((id) => id !== folderId)
    );
  };

  const handleMoveDocument = (docId: string, folderId: string) => {
    setDocuments((prevDocuments) =>
      prevDocuments.map((doc) =>
        doc.id === docId ? { ...doc, folderId } : doc
      )
    );
  };

  const handleToggleFolder = (folderId: string) => {
    setOpenFolderIds((prevOpenIds) =>
      prevOpenIds.includes(folderId)
        ? prevOpenIds.filter((id) => id !== folderId)
        : [...prevOpenIds, folderId]
    );
  };

  const handleManage = () => {
    // TODO: navigate to document management tools.
    console.info("Manage documents clicked");
  };

  const documentsByFolder = folders.map((folder) => ({
    folder,
    documents: documents.filter((doc) => doc.folderId === folder.id),
  }));

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
            <div className="mt-2 flex items-center gap-2 text-xs text-slate-600">
              <span>Upload to</span>
              <select
                value={selectedFolderId}
                onChange={(event) => setSelectedFolderId(event.target.value)}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600 focus:border-indigo-500 focus:outline-none"
              >
                {folders.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
              </select>
            </div>
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
        <div className="mt-4 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Folders
            </p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                type="text"
                value={newFolderName}
                onChange={(event) => setNewFolderName(event.target.value)}
                placeholder="New folder name"
                className="w-full rounded-full border border-slate-200 px-3 py-2 text-xs text-slate-700 focus:border-indigo-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCreateFolder}
                className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-slate-800"
              >
                Create Folder
              </button>
            </div>
            <div className="mt-3 space-y-2">
              {documentsByFolder.map(({ folder, documents: folderDocuments }) => {
                const isOpen = openFolderIds.includes(folder.id);
                return (
                  <div
                    key={folder.id}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleFolder(folder.id)}
                          className="rounded-full border border-slate-200 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
                        >
                          {isOpen ? "Collapse" : "Expand"}
                        </button>
                        {editingFolderId === folder.id ? (
                          <input
                            type="text"
                            value={editingFolderName}
                            onChange={(event) =>
                              setEditingFolderName(event.target.value)
                            }
                            className="w-full rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-700 focus:border-indigo-500 focus:outline-none"
                          />
                        ) : (
                          <p className="text-sm font-semibold text-slate-700">
                            {folder.name}
                          </p>
                        )}
                        <span className="text-xs text-slate-500">
                          {folderDocuments.length} items
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {editingFolderId === folder.id ? (
                          <>
                            <button
                              type="button"
                              onClick={handleSaveRenameFolder}
                              className="rounded-full bg-indigo-600 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white transition hover:bg-indigo-500"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingFolderId(null);
                                setEditingFolderName("");
                              }}
                              className="rounded-full border border-slate-200 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                handleStartRenameFolder(
                                  folder.id,
                                  folder.name
                                )
                              }
                              className="rounded-full border border-slate-200 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
                            >
                              Rename
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteFolder(folder.id)}
                              disabled={folder.id === defaultFolderId}
                              className="rounded-full border border-red-200 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-red-600 transition hover:border-red-300 hover:text-red-700 disabled:cursor-not-allowed disabled:border-slate-100 disabled:text-slate-400"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    {isOpen && (
                      <div className="mt-3 space-y-3">
                        {folderDocuments.length === 0 ? (
                          <p className="text-xs text-slate-500">
                            No documents in this folder yet.
                          </p>
                        ) : (
                          folderDocuments.map((doc) => (
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
                              <div className="flex flex-wrap items-center gap-3">
                                <span className="rounded-full bg-indigo-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-indigo-700">
                                  {doc.status}
                                </span>
                                <label
                                  className="sr-only"
                                  htmlFor={`folder-${doc.id}`}
                                >
                                  Move to folder
                                </label>
                                <select
                                  id={`folder-${doc.id}`}
                                  value={doc.folderId}
                                  onChange={(event) =>
                                    handleMoveDocument(
                                      doc.id,
                                      event.target.value
                                    )
                                  }
                                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600 focus:border-indigo-500 focus:outline-none"
                                >
                                  {folders.map((folderOption) => (
                                    <option
                                      key={folderOption.id}
                                      value={folderOption.id}
                                    >
                                      {folderOption.name}
                                    </option>
                                  ))}
                                </select>
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
                          ))
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
