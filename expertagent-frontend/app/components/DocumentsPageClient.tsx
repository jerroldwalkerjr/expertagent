"use client";

const documents = [
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
  const handleUpload = () => {
    // TODO: open file picker and upload documents.
    console.info("Upload clicked");
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
          <div className="mt-4 flex h-36 flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50">
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
              className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {doc.name}
                </p>
                <p className="text-xs text-slate-500">Updated {doc.updated}</p>
              </div>
              <span className="rounded-full bg-indigo-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-indigo-700">
                {doc.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
