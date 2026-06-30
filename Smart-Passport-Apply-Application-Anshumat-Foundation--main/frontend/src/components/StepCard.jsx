import React from 'react';

export default function StepCard({ num, title, highlight }) {
  return (
    <div className={`p-6 rounded ${highlight ? "bg-green-300" : "bg-white"}`}>
      <h1 className="text-3xl font-bold opacity-30">{num}</h1>
      <h4 className="font-semibold mt-2">{title}</h4>
    </div>
  );
}
