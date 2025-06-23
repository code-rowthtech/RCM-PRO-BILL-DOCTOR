import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Toolbar } from './Toolbar';
import { cleanHTML } from './editorUtils';

export const TextEditor = ({
  value = '',
  onChange,
  placeholder = 'Start typing...',
  className = '',
  minHeight = 200,
}) => {
  const editorRef = useRef(null);
  const [content, setContent] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  // Update content when value prop changes
  useEffect(() => {
    if (value !== content && editorRef.current) {
      editorRef.current.innerHTML = value;
      setContent(value);
    }
  }, [value]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      const cleanedHTML = cleanHTML(html);
      setContent(cleanedHTML);
      if (onChange) onChange(cleanedHTML);
    }
  }, [onChange]);

  const handleFormatChange = useCallback(() => {
    // Trigger input event to update content after formatting
    setTimeout(() => {
      handleInput();
    }, 0);
  }, [handleInput]);

  const handleKeyDown = (e) => {
    // Handle tab key
    if (e.key === 'Tab') {
      e.preventDefault();
      document.execCommand('insertHTML', false, '&nbsp;&nbsp;&nbsp;&nbsp;');
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm ${className}`}>
      <Toolbar onFormatChange={handleFormatChange} />

      <div className={`relative transition-all duration-200 ${isFocused ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}>
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          className="p-4 outline-none prose prose-sm max-w-none"
          style={{ minHeight: `${minHeight}px` }}
          suppressContentEditableWarning={true}
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {!content && !isFocused && (
          <div className="absolute top-4 left-4 text-gray-400 pointer-events-none">
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
};
