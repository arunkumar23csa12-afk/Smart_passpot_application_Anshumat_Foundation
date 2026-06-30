import React from 'react';

export default function Input({ label, ...props }) {
  return (
    <div>
      <label className="text-xs text-gray-500">{label}</label>
      <input {...props} className="w-full border-b p-2 outline-none" />
    </div>
  );
}
