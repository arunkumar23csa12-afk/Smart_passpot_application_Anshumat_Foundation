import React from 'react';

export default function ServiceCard({ title, desc }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
      <h4 className="font-semibold text-lg">{title}</h4>
      <p className="text-gray-500 mt-2">{desc}</p>
    </div>
  );
}
