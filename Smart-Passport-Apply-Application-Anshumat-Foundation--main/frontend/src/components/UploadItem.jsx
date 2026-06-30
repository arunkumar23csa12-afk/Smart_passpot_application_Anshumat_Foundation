import React from 'react';

export default function UploadItem({ title, status }) {
  return (
    <div className="bg-white p-4 rounded flex justify-between items-center">
      <p>{title}</p>
      {status ? (
        <span className="text-green-600">{status}</span>
      ) : (
        <button className="bg-gray-200 px-4 py-1 rounded">Upload</button>
      )}
    </div>
  );
}
