'use client';

import { useState, useCallback } from 'react';
import { FaFileUpload, FaSpinner, FaCopy, FaFileWord, FaCheck } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

interface FileWithPreview extends File {
  preview?: string;
}

export default function AnalyzePage() {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 5) {
      setError('You can upload up to 5 files only.');
      return;
    }
    setFiles(selectedFiles);
    setError('');
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 5) {
      setError('You can upload up to 5 files only.');
      return;
    }
    setFiles(droppedFiles);
    setError('');
  }, []);

  const handleSubmit = async () => {
    if (!files.length) {
      setError('Please upload at least one file.');
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
    files.forEach((file, idx) => formData.append('files', file));
    formData.append('description', description);

    try {
      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to generate summary.');

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setResult(data);
    } catch (err) {
      setError((err as Error).message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    
    const textToCopy = `
Executive Summary:
${result.summary}

Action Items:
${result.actionItems?.map((item: string, idx: number) => `${idx + 1}. ${item}`).join('\n')}

File Statistics:
${result.fileStats?.map((stat: any) => `
${stat.fileName}:
${Object.entries(stat.stats).map(([key, value]) => `${key}: ${value}`).join('\n')}`).join('\n')}
    `.trim();

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleExport = async () => {
    if (!result) return;

    const content = `
Executive Summary:
${result.summary}

Action Items:
${result.actionItems?.map((item: string, idx: number) => `${idx + 1}. ${item}`).join('\n')}

File Statistics:
${result.fileStats?.map((stat: any) => `
${stat.fileName}:
${Object.entries(stat.stats).map(([key, value]) => `${key}: ${value}`).join('\n')}`).join('\n')}
    `.trim();

    const blob = new Blob([content], { type: 'application/msword' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dava-ai-analysis.doc';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Analyze Your Data</h1>

          {/* File Upload Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Files (CSV/XLSX)
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                isDragging ? 'border-[#00c851] bg-[#00c851]/5' : 'border-gray-300'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept=".csv,.xlsx"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <FaFileUpload className="w-8 h-8 text-[#00c851] mb-2" />
                <p className="text-sm text-gray-600">
                  Drag and drop files here, or click to select files
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: CSV, Excel (.xlsx)
                </p>
              </label>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                {files.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-gray-50 p-2 rounded"
                  >
                    <span className="text-sm text-gray-600">{file.name}</span>
                    <button
                      onClick={() => setFiles(files.filter((_, i) => i !== idx))}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Description Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (max 2000 characters)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              maxLength={2000}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#00c851] focus:ring-[#00c851]"
              placeholder="Enter your description here..."
            />
            <p className="text-xs text-gray-500 text-right mt-1">
              {description.length}/2000 characters
            </p>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-[#00c851] text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-[#00b548] transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <FaSpinner className="animate-spin mr-2" />
                Generating Summary...
              </span>
            ) : (
              'Generate Summary'
            )}
          </button>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Results Section */}
          {result && (
            <div className="mt-8 space-y-6">
              <div className="bg-white border-2 border-[#00c851] rounded-lg p-6 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Analysis Results</h2>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleCopy}
                      className="flex items-center px-3 py-2 text-sm font-medium text-[#00c851] hover:text-[#00b548] transition-colors"
                    >
                      {copied ? (
                        <>
                          <FaCheck className="mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <FaCopy className="mr-2" />
                          Copy
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleExport}
                      className="flex items-center px-3 py-2 text-sm font-medium text-[#00c851] hover:text-[#00b548] transition-colors"
                    >
                      <FaFileWord className="mr-2" />
                      Export
                    </button>
                  </div>
                </div>

                {/* Executive Summary */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Executive Summary
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-gray-600 whitespace-pre-wrap">{result.summary}</p>
                  </div>
                </div>

                {/* Action Items */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Action Items
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <ul className="space-y-4">
                      {result.actionItems?.map((item: string, idx: number) => (
                        <li key={idx} className="flex items-start">
                          <span className="flex-shrink-0 h-6 w-6 rounded-full bg-[#00c851] flex items-center justify-center text-white font-semibold">
                            {idx + 1}
                          </span>
                          <span className="ml-3 text-gray-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* File Stats */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    File Statistics
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {result.fileStats?.map((stat: any, idx: number) => (
                      <div
                        key={idx}
                        className="bg-gray-50 p-4 rounded-md"
                      >
                        <h4 className="font-medium text-gray-900 mb-2">
                          {stat.fileName}
                        </h4>
                        <dl className="space-y-1">
                          {Object.entries(stat.stats).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <dt className="text-sm text-gray-500">{key}</dt>
                              <dd className="text-sm text-gray-900">{value}</dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 