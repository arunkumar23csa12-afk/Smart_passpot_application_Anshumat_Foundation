import React from 'react';

export default function ProgressBar({ step }) {
  const total = 5;
  const percent = (step / total) * 100;
  return (
    <div className="mb-6">
      <p className="text-sm text-gray-500">Step {step} of {total}</p>
      <div className="bg-gray-200 h-2 rounded mt-2">
        <div className="bg-blue-700 h-2 rounded" style={{ width: percent + "%" }} />
      </div>
    </div>
  );
}
