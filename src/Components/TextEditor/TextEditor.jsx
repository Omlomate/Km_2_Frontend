import React from "react";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import './textEditor.css'; // Add this import for the custom CSS

const TextEditor = ({ value, onChange }) => {
  // Quill editor modules and formats configuration
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline',  ],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link',  ],
    ],
    clipboard: {
      matchVisual: false,
    },
    // Add auto-link detection
    autoLinks: true,
    // Add link handler to ensure links open in new tab
    keyboard: {
      bindings: {
        link: {
          key: 'k',
          shortKey: true,
          handler: function(range, context) {
            this.quill.theme.tooltip.edit('link');
          }
        }
      }
    }
  };
  
  const formats = [
    'header',
    'bold', 'italic', 'underline',  
    'list',
    'link',
  ];

  // Custom CSS for links in the editor
  const customStyles = `
    .ql-editor a {
      color: #3b82f6; /* Blue color */
      text-decoration: underline;
      pointer-events: auto !important;
      cursor: pointer !important;
    }
  `;

  // Initialize Quill with auto-link detection
  React.useEffect(() => {
    // Add auto-link functionality to Quill
    if (typeof window !== 'undefined') {
      const Quill = ReactQuill.Quill;
      const urlRegex = /https?:\/\/[^\s]+/g;
      
      const originalTextChangeHandler = Quill.prototype.onTextChange;
      
      Quill.prototype.onTextChange = function(delta, oldDelta, source) {
        if (source === 'user' && delta.ops) {
          delta.ops.forEach(op => {
            if (op.insert && typeof op.insert === 'string') {
              const matches = op.insert.match(urlRegex);
              if (matches) {
                matches.forEach(match => {
                  const index = this.getText().indexOf(match);
                  if (index !== -1) {
                    this.formatText(index, match.length, 'link', match);
                  }
                });
              }
            }
          });
        }
        
        originalTextChangeHandler.call(this, delta, oldDelta, source);
      };
    }
  }, []);

  return (
    <div className="rounded-lg bg-white">
      <style>{customStyles}</style>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder="Add Body"
        className="min-h-[100px] custom-quill-editor"
      />
    </div>
  );
};

export default TextEditor;