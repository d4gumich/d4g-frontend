import { writable } from "svelte/store";
export const num_keywords = writable(0);
export const checkboxes = writable([
    { id: 1, label: "Document language", checked: false, var_name: 'document_language'},
    { id: 2, label: "Document title", checked: false, var_name: 'document_title' },
    { id: 3, label: "Document summary", checked: false, var_name: 'document_summary'},
    { id: 4, label: "Content", checked: false, var_name: 'content' }, 
    { id: 5, label: "Report type", checked: false, var_name: 'report_type' },
    { id: 6, label: "Locations", checked: false, var_name: 'locations' },
    { id: 7, label: "Full content", checked: false, var_name: 'full_content' },
    { id: 8, label: "Markdown text", checked: false, var_name: 'markdown_text' },
    { id: 9, label: "Document theme", checked: false, var_name: 'document_theme' },
    { id: 10, label: "New detected disasters", checked: false, var_name: 'new_detected_disasters' },
    { id: 11, label: "Author", checked: false, var_name: 'Author' },
    { id: 12, label: "Document created date", checked: false, var_name: 'doc_created_date' },
    { id: 13, label: "Document modified date", checked: false, var_name: 'doc_modified_date' },
    { id: 14, label: "Number of pages", checked: false, var_name: 'num_of_pages' },
    { id: 15, label: "Characters per page", checked: false, var_name: 'charsPerPage' },
  ]);