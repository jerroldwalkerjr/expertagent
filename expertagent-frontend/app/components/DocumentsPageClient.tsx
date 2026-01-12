"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";

type DocumentEntry = {
  id: number;
  name: string;
  status: string;
  updated: string;
  folderId: number;
  mimeType?: string | null;
  dataUrl?: string | null;
};

type Folder = {
  id: number;
  name: string;
};

type ApiFolder = {
  id: number;
  name: string;
};

type ApiDocument = {
  id: number;
  name: string;
  status: string;
  updated: string;
  folder_id: number;
  data_url?: string | null;
  mime_type?: string | null;
};

export default function DocumentsPageClient() {
  const [documents, setDocuments] = useState<DocumentEntry[]>([]);
  const [folders, setFolders] = useState<Folder[]>([
    { id: 0, name: "General" },
  ]);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(
    null
  );
  const [newFolderName, setNewFolderName] = useState("");
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [editingFolderId, setEditingFolderId] = useState<number | null>(null);
  const [editingFolderName, setEditingFolderName] = useState("");
  const [openFolderIds, setOpenFolderIds] = useState<number[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const toDocumentEntry = (doc: ApiDocument): DocumentEntry => ({
    id: doc.id,
    name: doc.name,
    status: doc.status,
    updated: doc.updated,
    folderId: doc.folder_id,
    dataUrl: doc.data_url ?? null,
    mimeType: doc.mime_type ?? null,
  });

  const toFolderEntry = (folder: ApiFolder): Folder => ({
    id: folder.id,
    name: folder.name,
  });

  const getDefaultFolderId = (list: Folder[]): number | null => {
    const defaultFolder =
      list.find((folder) => folder.name === "General") ?? list[0];
    return defaultFolder ? defaultFolder.id : null;
  };

  useEffect(() => {
    let isMounted = true;

    const loadDocuments = async () => {
      try {
        const [foldersResponse, documentsResponse] = await Promise.all([
          fetch("/api/document-folders"),
          fetch("/api/documents"),
        ]);

        if (!foldersResponse.ok || !documentsResponse.ok) {
          return;
        }

        const folderData = (await foldersResponse.json()) as ApiFolder[];
        const documentData = (await documentsResponse.json()) as ApiDocument[];

        if (!isMounted) {
          return;
        }

        const mappedFolders = folderData.map(toFolderEntry);
        setFolders(mappedFolders);
        setDocuments(documentData.map(toDocumentEntry));

        const defaultId = getDefaultFolderId(mappedFolders);
        if (defaultId !== null) {
          setSelectedFolderId(defaultId);
          setOpenFolderIds((prevOpenIds) =>
            prevOpenIds.length === 0 ? [defaultId] : prevOpenIds
          );
        }
      } catch {
        // Ignore load errors and keep local state.
      }
    };

    loadDocuments();

    return () => {
      isMounted = false;
    };
  }, []);

  const createFolder = async (name: string) => {
    const response = await fetch("/api/document-folders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      throw new Error("Unable to create folder.");
    }

    const data = (await response.json()) as ApiFolder;
    return toFolderEntry(data);
  };

  const renameFolder = async (folderId: number, name: string) => {
    const response = await fetch(`/api/document-folders/${folderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      throw new Error("Unable to rename folder.");
    }

    const data = (await response.json()) as ApiFolder;
    return toFolderEntry(data);
  };

  const removeFolder = async (folderId: number) => {
    const response = await fetch(`/api/document-folders/${folderId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Unable to delete folder.");
    }
  };

  const createDocument = async (payload: {
    name: string;
    status: string;
    updated: string;
    folder_id: number;
    data_url?: string | null;
    mime_type?: string | null;
  }) => {
    const response = await fetch("/api/documents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Unable to save document.");
    }

    const data = (await response.json()) as ApiDocument;
    return toDocumentEntry(data);
  };

  const updateDocument = async (
    documentId: number,
    payload: { folder_id?: number }
  ) => {
    const response = await fetch(`/api/documents/${documentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Unable to update document.");
    }

    const data = (await response.json()) as ApiDocument;
    return toDocumentEntry(data);
  };

  const removeDocument = async (documentId: number) => {
    const response = await fetch(`/api/documents/${documentId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Unable to delete document.");
    }
  };

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFiles = (files: File[]) => {
    if (files.length === 0) {
      return;
    }

    const targetFolderId = selectedFolderId ?? getDefaultFolderId(folders);
    if (targetFolderId === null) {
      return;
    }

    files.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        const payload = {
          name: file.name,
          status: "Uploaded",
          updated: "Just now",
          folder_id: targetFolderId,
          data_url: typeof result === "string" ? result : null,
          mime_type: file.type || "application/octet-stream",
        };

        void (async () => {
          try {
            const savedDoc = await createDocument(payload);
            setDocuments((prevDocuments) => [savedDoc, ...prevDocuments]);
          } catch {
            // Ignore save errors for now.
          }
        })();
      };
      reader.onerror = () => {
        const payload = {
          name: file.name,
          status: "Uploaded",
          updated: "Just now",
          folder_id: targetFolderId,
          data_url: null,
          mime_type: file.type || "application/octet-stream",
        };

        void (async () => {
          try {
            const savedDoc = await createDocument(payload);
            setDocuments((prevDocuments) => [savedDoc, ...prevDocuments]);
          } catch {
            // Ignore save errors for now.
          }
        })();
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

  const handleDeleteDocument = (id: number) => {
    const documentId = id;
    void (async () => {
      try {
        await removeDocument(documentId);
        setDocuments((prevDocuments) =>
          prevDocuments.filter((doc) => doc.id !== documentId)
        );
      } catch {
        // Ignore delete errors for now.
      }
    })();
  };

  const handleCreateFolder = () => {
    const name = newFolderName.trim();
    if (!name) {
      return;
    }
    void (async () => {
      try {
        const createdFolder = await createFolder(name);
        setFolders((prevFolders) => [...prevFolders, createdFolder]);
        setSelectedFolderId(createdFolder.id);
        setOpenFolderIds((prevOpenIds) => [
          ...prevOpenIds,
          createdFolder.id,
        ]);
        setNewFolderName("");
        setIsCreatingFolder(false);
      } catch {
        // Ignore create errors for now.
      }
    })();
  };

  const handleStartRenameFolder = (folderId: number, name: string) => {
    setEditingFolderId(folderId);
    setEditingFolderName(name);
  };

  const handleSaveRenameFolder = () => {
    const name = editingFolderName.trim();
    if (editingFolderId === null || !name) {
      return;
    }
    void (async () => {
      try {
        const updatedFolder = await renameFolder(editingFolderId, name);
        setFolders((prevFolders) =>
          prevFolders.map((folder) =>
            folder.id === updatedFolder.id ? updatedFolder : folder
          )
        );
        setEditingFolderId(null);
        setEditingFolderName("");
      } catch {
        // Ignore rename errors for now.
      }
    })();
  };

  const handleDeleteFolder = (folderId: number) => {
    const defaultId = getDefaultFolderId(folders);
    if (defaultId !== null && folderId === defaultId) {
      return;
    }

    void (async () => {
      try {
        await removeFolder(folderId);
        setFolders((prevFolders) =>
          prevFolders.filter((folder) => folder.id !== folderId)
        );
        setDocuments((prevDocuments) =>
          prevDocuments.map((doc) =>
            doc.folderId === folderId && defaultId !== null
              ? { ...doc, folderId: defaultId }
              : doc
          )
        );
        if (selectedFolderId === folderId) {
          setSelectedFolderId(defaultId);
        }
        setOpenFolderIds((prevOpenIds) =>
          prevOpenIds.filter((id) => id !== folderId)
        );
      } catch {
        // Ignore delete errors for now.
      }
    })();
  };

  const handleMoveDocument = (docId: number, folderId: number) => {
    void (async () => {
      try {
        const updatedDoc = await updateDocument(docId, {
          folder_id: folderId,
        });
        setDocuments((prevDocuments) =>
          prevDocuments.map((doc) =>
            doc.id === updatedDoc.id ? updatedDoc : doc
          )
        );
      } catch {
        // Ignore move errors for now.
      }
    })();
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

  const documentsBySystemFolder = folders.map((folder) => ({
    folder,
    documents: documents.filter((doc) => doc.folderId === folder.id),
  }));
  const defaultFolderId = getDefaultFolderId(folders);

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
                value={selectedFolderId ?? ""}
                onChange={(event) =>
                  setSelectedFolderId(Number(event.target.value))
                }
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
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Folders
              </p>
              <button
                type="button"
                onClick={() => setIsCreatingFolder(true)}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
              >
                Create Folder
              </button>
            </div>
            {isCreatingFolder && (
              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(event) => setNewFolderName(event.target.value)}
                  placeholder="New folder name"
                  className="w-full rounded-full border border-slate-200 px-3 py-2 text-xs text-slate-700 focus:border-indigo-500 focus:outline-none"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCreateFolder}
                    className="rounded-full bg-slate-900 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-white transition hover:bg-slate-800"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreatingFolder(false);
                      setNewFolderName("");
                    }}
                    className="rounded-full border border-slate-200 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            <div className="mt-3 space-y-2">
              {documentsBySystemFolder.map(
                ({ folder, documents: folderDocuments }) => {
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
                                      Number(event.target.value)
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
