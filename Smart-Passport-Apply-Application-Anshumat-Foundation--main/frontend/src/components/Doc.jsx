import React from 'react';

export default function Doc({ title }) {
  return (
    <div className="bg-white p-4 rounded-lg">
      <h4 className="font-semibold">{title}</h4>
    </div>
  );
}
