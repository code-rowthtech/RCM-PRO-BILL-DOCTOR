import React, { useState } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link,
  Type
} from 'lucide-react';
import { ColorPicker } from './TextEditor/ColorPicker';
import { LinkDialog } from './TextEditor/LinkDialog';
import { executeCommand, getSelectedText, isCommandActive, insertHTML } from './TextEditor/editorUtils';

interface ToolbarProps {
  onFormatChange: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ onFormatChange }) => {
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [selectedText, setSelectedText] = useState('');

  const handleCommand = (command: string, value?: string) => {
    executeCommand(command, value);
    onFormatChange();
  };

  const handleHeading = (level: string) => {
    executeCommand('formatBlock', `h${level}`);
    onFormatChange();
  };

  const handleTextColor = (color: string) => {
    executeCommand('foreColor', color);
    onFormatChange();
  };

  const handleBackgroundColor = (color: string) => {
    if (color === 'transparent') {
      executeCommand('backColor', 'transparent');
    } else {
      executeCommand('backColor', color);
    }
    onFormatChange();
  };

  const handleLinkClick = () => {
    const text = getSelectedText();
    setSelectedText(text);
    setShowLinkDialog(true);
  };

  const handleInsertLink = (url: string, text: string) => {
    const linkHTML = `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`;
    insertHTML(linkHTML);
    onFormatChange();
  };

  const ToolbarButton: React.FC<{
    onClick: () => void;
    isActive?: boolean;
    title: string;
    children: React.ReactNode;
  }> = ({ onClick, isActive = false, title, children }) => (
    <button
      type="button"
      onClick={onClick}
      className={`p-2 rounded transition-colors duration-200 ${
        isActive 
          ? 'bg-blue-100 text-blue-600' 
          : 'hover:bg-gray-100 text-gray-700'
      }`}
      title={title}
    >
      {children}
    </button>
  );

  return (
    <>
      <div className="border-b border-gray-200 p-3 bg-gray-50">
        <div className="flex flex-wrap items-center gap-1">
          {/* Headings */}
          <div className="flex items-center border-r border-gray-300 pr-2 mr-2">
            <select
              onChange={(e) => handleHeading(e.target.value)}
              className="text-sm border border-gray-300 rounded px-2 py-1 bg-white"
              defaultValue=""
            >
              <option value="">Normal</option>
              <option value="1">Heading 1</option>
              <option value="2">Heading 2</option>
              <option value="3">Heading 3</option>
            </select>
          </div>

          {/* Text Formatting */}
          <div className="flex items-center border-r border-gray-300 pr-2 mr-2">
            <ToolbarButton
              onClick={() => handleCommand('bold')}
              isActive={isCommandActive('bold')}
              title="Bold"
            >
              <Bold size={16} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => handleCommand('italic')}
              isActive={isCommandActive('italic')}
              title="Italic"
            >
              <Italic size={16} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => handleCommand('underline')}
              isActive={isCommandActive('underline')}
              title="Underline"
            >
              <Underline size={16} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => handleCommand('strikeThrough')}
              isActive={isCommandActive('strikeThrough')}
              title="Strikethrough"
            >
              <Strikethrough size={16} />
            </ToolbarButton>
          </div>

          {/* Lists */}
          <div className="flex items-center border-r border-gray-300 pr-2 mr-2">
            <ToolbarButton
              onClick={() => handleCommand('insertUnorderedList')}
              isActive={isCommandActive('insertUnorderedList')}
              title="Bullet List"
            >
              <List size={16} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => handleCommand('insertOrderedList')}
              isActive={isCommandActive('insertOrderedList')}
              title="Numbered List"
            >
              <ListOrdered size={16} />
            </ToolbarButton>
          </div>

          {/* Alignment */}
          <div className="flex items-center border-r border-gray-300 pr-2 mr-2">
            <ToolbarButton
              onClick={() => handleCommand('justifyLeft')}
              isActive={isCommandActive('justifyLeft')}
              title="Align Left"
            >
              <AlignLeft size={16} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => handleCommand('justifyCenter')}
              isActive={isCommandActive('justifyCenter')}
              title="Align Center"
            >
              <AlignCenter size={16} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => handleCommand('justifyRight')}
              isActive={isCommandActive('justifyRight')}
              title="Align Right"
            >
              <AlignRight size={16} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => handleCommand('justifyFull')}
              isActive={isCommandActive('justifyFull')}
              title="Justify"
            >
              <AlignJustify size={16} />
            </ToolbarButton>
          </div>

          {/* Colors */}
          <div className="flex items-center border-r border-gray-300 pr-2 mr-2">
            <ColorPicker onColorSelect={handleTextColor} type="text" />
            <ColorPicker onColorSelect={handleBackgroundColor} type="background" />
          </div>

          {/* Link */}
          <div className="flex items-center">
            <ToolbarButton
              onClick={handleLinkClick}
              title="Insert Link"
            >
              <Link size={16} />
            </ToolbarButton>
          </div>
        </div>
      </div>

      <LinkDialog
        isOpen={showLinkDialog}
        onClose={() => setShowLinkDialog(false)}
        onInsert={handleInsertLink}
        selectedText={selectedText}
      />
    </>
  );
};