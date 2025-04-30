'use client';

import { useState } from 'react';

export default function AnalyzePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 5) {
      setError('You can upload up to 5 files only.');
      return;
    }
    setFiles(selectedFiles);
    setError('');
  };

  const handleSubmit = async () => {
    if (!files.length) {
      setError('Please upload at least one CSV or Excel file.');
      return;
    }

    if (description.length > 2000) {
      setError('Description exceeds 2000 characters.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    files.forEach((file, idx) => formData.append(`file${idx + 1}`, file));
    formData.append('description', description);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || ''}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to generate summary.');

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError((err as Error).message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-white text-black px-6 py-12 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Upload Data & Context</h1>

      {/* Upload section */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Upload CSV or Excel Files:</label>
        <input
          type="file"
          accept=".csv,.xlsx"
          multiple
          onChange={handleFileChange}
          className="block w-full p-2 border border-gray-300 rounded"
        />
        {files.length > 0 && (
          <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
            {files.map((file, idx) => (
              <li key={idx}>{file.name}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Description section */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Describe the context of the data (max 2000 characters):</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
          maxLength={2000}
          placeholder="What story are you trying to uncover? Business goals? Strategic needs?"
          className="w-full p-3 border border-gray-300 rounded resize-none"
        />
        <p className="text-sm text-gray-500 text-right mt-1">{description.length} / 2000</p>
      </div>

      {/* Submit */}
      <div className="mb-6">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-[#00c851] text-white px-6 py-3 rounded hover:bg-green-600 transition disabled:opacity-50"
        >
          {loading ? 'Generating Summary...' : 'Generate Summary'}
        </button>
      </div>

      {/* Error message */}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* Results */}
      {result && (
        <section className="mt-10 bg-gray-50 p-6 rounded shadow">
          <h2 className="text-2xl font-bold mb-4">Executive Summary</h2>
          <p className="mb-6 text-gray-800">{result.summary}</p>

          <h3 className="text-xl font-semibold mb-2">Recommended Actions:</h3>
          <ul className="list-disc list-inside text-gray-700 mb-6">
            {result.action_items?.map((item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>

          <h3 className="text-xl font-semibold mb-2">File Insights:</h3>
          <div className="space-y-4">
            {Object.entries(result.insights || {}).map(([filename, data]: [string, any]) => (
              <div key={filename} className="bg-white border p-4 rounded shadow-sm">
                <h4 className="font-bold text-gray-800">{filename}</h4>
                <ul className="list-disc list-inside text-sm mt-2 text-gray-700">
                  {Object.entries(data).map(([key, value]) => (
                    <li key={key}>
                      <strong>{key}:</strong> {String(value)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
} 