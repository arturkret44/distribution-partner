"use client";

import { useState } from "react";

export default function UploadForm({ uploadAction }: { uploadAction: any }) {
  const [file, setFile] = useState<File | null>(null);

  return (
    <form
      action={uploadAction}
      className="space-y-6"
    >
      {/* DROPZONE */}
      <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 bg-gray-50 hover:border-green-400 transition">
        
        <label className="flex flex-col items-center justify-center text-center cursor-pointer">

          {/* ICON / TEXT */}
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

          {/* INPUT (hidden visually) */}
          <input
            type="file"
            name="file"
            accept="image/*"
            required
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
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
        Max 5 images per profile
      </p>
    </form>
  );
}
