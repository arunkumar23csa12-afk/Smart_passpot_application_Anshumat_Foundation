import React from 'react';

export default function Feature({ title, desc }) {
  return (
    <div className="bg-white text-black p-4 rounded-lg w-40">
      <h4 className="font-semibold">{title}</h4>
      <p className="text-sm text-gray-500">{desc}</p>
    </div>
  );
}
