import { useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  FiFileText,
  FiBold,
  FiItalic,
  FiUnderline,
  FiList,
} from "react-icons/fi";

export default function NotesEditor() {
  const { register, setValue } = useFormContext();
  const [editorContent, setEditorContent] = useState("");

  const handleFormat = (format: string) => {
    const textarea = document.getElementById("notes") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = editorContent.substring(start, end);

    let formattedText = "";
    let cursorPosition = 0;

    switch (format) {
      case "bold":
        formattedText = `**${selectedText}**`;
        cursorPosition = start + 2;
        break;
      case "italic":
        formattedText = `*${selectedText}*`;
        cursorPosition = start + 1;
        break;
      case "underline":
        formattedText = `_${selectedText}_`;
        cursorPosition = start + 1;
        break;
      case "list":
        formattedText = `\n- ${selectedText}`;
        cursorPosition = start + 3;
        break;
      default:
        return;
    }

    const newContent =
      editorContent.substring(0, start) +
      formattedText +
      editorContent.substring(end);
    setEditorContent(newContent);
    setValue("notes", newContent);

    // Set cursor position after formatting
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        cursorPosition + (selectedText.length > 0 ? 0 : 0),
        cursorPosition + selectedText.length
      );
    }, 0);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 flex items-center">
        <FiFileText className="mr-2" />
        Invoice Notes
      </h2>

      <div className="border border-gray-300 rounded-md overflow-hidden">
        <div className="bg-gray-50 px-3 py-2 border-b border-gray-300 flex space-x-2">
          <button
            type="button"
            className="p-1 rounded hover:bg-gray-200"
            onClick={() => handleFormat("bold")}
            title="Bold"
          >
            <FiBold className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="p-1 rounded hover:bg-gray-200"
            onClick={() => handleFormat("italic")}
            title="Italic"
          >
            <FiItalic className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="p-1 rounded hover:bg-gray-200"
            onClick={() => handleFormat("underline")}
            title="Underline"
          >
            <FiUnderline className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="p-1 rounded hover:bg-gray-200"
            onClick={() => handleFormat("list")}
            title="List"
          >
            <FiList className="h-4 w-4" />
          </button>
        </div>

        <textarea
          id="notes"
          rows={5}
          className="w-full px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Add notes to the invoice..."
          {...register("notes")}
          value={editorContent}
          onChange={(e) => {
            setEditorContent(e.target.value);
            setValue("notes", e.target.value);
          }}
        ></textarea>
      </div>

      <div className="text-xs text-gray-500">
        <p>Formatting: **bold**, *italic*, _underline_, - list item</p>
      </div>
    </div>
  );
}
