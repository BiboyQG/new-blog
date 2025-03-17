import { useState, useEffect } from "react";
import MDEditor from "@uiw/react-md-editor";
import { useTheme } from "../context/ThemeContext";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number;
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = "Write your content here...",
  height = 400,
}: MarkdownEditorProps) {
  const { theme } = useTheme();
  const [editorValue, setEditorValue] = useState(value);

  // Update local state when value prop changes
  useEffect(() => {
    setEditorValue(value);
  }, [value]);

  // Handle content change and call parent onChange
  const handleChange = (newValue?: string) => {
    const updatedValue = newValue || "";
    setEditorValue(updatedValue);
    onChange(updatedValue);
  };

  return (
    <div data-color-mode={theme}>
      <MDEditor
        value={editorValue}
        onChange={handleChange}
        height={height}
        preview="live"
        textareaProps={{
          placeholder: placeholder,
        }}
        className="rounded-md border border-gray-300 dark:border-gray-700"
        enableScroll={true}
        hideToolbar={true}
      />
    </div>
  );
}
