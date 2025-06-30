import React, { useState } from 'react';
import { Palette } from 'lucide-react';

const textColors = [
  { name: 'Black', value: '#000000' },
  { name: 'Dark Gray', value: '#374151' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Orange', value: '#F97316' },
  { name: 'Yellow', value: '#EAB308' },
  { name: 'Green', value: '#22C55E' },
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Pink', value: '#EC4899' },
];

const backgroundColors = [
  { name: 'None', value: 'transparent' },
  { name: 'Light Gray', value: '#F3F4F6' },
  { name: 'Light Red', value: '#FEE2E2' },
  { name: 'Light Orange', value: '#FED7AA' },
  { name: 'Light Yellow', value: '#FEF3C7' },
  { name: 'Light Green', value: '#D1FAE5' },
  { name: 'Light Blue', value: '#DBEAFE' },
  { name: 'Light Purple', value: '#E9D5FF' },
  { name: 'Light Pink', value: '#FCE7F3' },
];

export const ColorPicker = ({ onColorSelect, type }) => {
  const [isOpen, setIsOpen] = useState(false);

  const colors = type === 'text' ? textColors : backgroundColors;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded hover:bg-gray-100 transition-colors duration-200"
        title={type === 'text' ? 'Text Color' : 'Background Color'}
      >
        <Palette size={16} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-1 p-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            <div className="grid grid-cols-3 gap-1 w-24">
              {colors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => {
                    onColorSelect(color.value);
                    setIsOpen(false);
                  }}
                  className="w-6 h-6 rounded border border-gray-200 hover:scale-110 transition-transform duration-200"
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
