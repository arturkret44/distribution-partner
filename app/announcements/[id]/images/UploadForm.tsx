"use client";

import { uploadImage } from "./actions";
import { useState } from "react";

export default function UploadForm({
  announcementId,
  currentCount,
}: {
  announcementId: string;
  currentCount: number;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!file) {
      alert("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("announcement_id", announcementId);
    formData.append("file", file);

    setStatus("Uploading...");

    try {
      await uploadImage(formData);
      setStatus("Uploaded successfully!");
      window.location.reload();
    } catch (err: any) {
      setStatus("Error: " + err.message);
    }
  }

  return (
    <div className="mt-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          accept="image/*"
          required
          className="block border p-2"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              setFile(e.target.files[0]);
            }
          }}
        />

        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Upload image
        </button>

        <p className="text-sm text-gray-500">
          You can upload up to 5 images. Currently: {currentCount}/5
        </p>

        {status && (
          <p className="text-sm text-blue-600">
            {status}
          </p>
        )}
      </form>
    </div>
  );
}
