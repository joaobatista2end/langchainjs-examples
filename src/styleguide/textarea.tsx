import React from 'react';

interface TextareaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  cols?: number;
  label?: string;
}

const BaseTextarea: React.FC<TextareaProps> = ({ value, onChange, placeholder, rows = 4, cols = 50 , label}) => {
  return (
    <div>
        <label htmlFor="" className='text-md text-gray-900/70 mb-2 inline-block'>{label}</label>
        <textarea
        className="border border-gray-900/10 rounded-sm p-2 w-full focus:outline-none focus:ring-1 focus:ring-gray-900/20 text-sm font-mono text-gray-600"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        cols={cols}
        />
    </div>
  );
};

export default BaseTextarea;
