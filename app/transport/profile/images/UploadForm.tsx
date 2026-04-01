"use client";
import { uploadTransportImage } from "./actions";
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
      await uploadTransportImage(formData);
      setStatus("Uploaded successfully!");
      window.location.reload();
    } catch (err: any) {
      setStatus("Error: " + err.message);
    }
  }

  return (
    <div className="mt-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* DROPZONE */}
        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 bg-gray-50 hover:border-green-400 transition">
          
          <label className="flex flex-col items-center justify-center text-center cursor-pointer">

            {/* TEXT */}
            <div className="text-gray-400 text-sm">
              {file ? (
                <span className="text-green-700 font-medium">
                  {file.name}
                </span>
              ) : (
                <>
                  <p className="font-medium text-gray-700">
                    Click to upload image
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG up to ~5MB
                  </p>
                </>
              )}
            </div>

            {/* INPUT */}
            <input
              type="file"
              accept="image/*"
              required
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setFile(e.target.files[0]);
                }
              }}
            />
          </label>

          {/* PREVIEW */}
          {file && (
            <div className="mt-4">
              <img
                src={URL.createObjectURL(file)}
                alt="Preview"
                className="w-full h-48 object-cover rounded-xl border"
              />
            </div>
          )}
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          className="w-full px-4 py-3 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition shadow-sm"
        >
          Upload image
        </button>

        {/* INFO */}
        <p className="text-xs text-gray-400 text-center">
          You can upload up to 5 images. Currently: {currentCount}/5
        </p>

        {/* STATUS */}
        {status && (
          <p className="text-sm text-center text-gray-600">
            {status}
          </p>
        )}
      </form>
    </div>
  );
}
