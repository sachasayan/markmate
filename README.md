# React Markdown Editor Component

This project is a simple markdown editor component built with React and TypeScript, using Vite as a build tool.

## Features

- Split-pane view for simultaneous markdown editing and preview.
- Toggleable views for markdown only, preview only, or split view.
- Uses Radix UI and Tailwind CSS for styling and UI components.
- Basic markdown editing capabilities.

## Technologies Used

- React
- TypeScript
- Vite
- Radix UI
- Tailwind CSS
- react-markdown
- react-resizable-panels
- lucide-react

## Getting Started

1.  Clone the repository.
2.  Install dependencies: `npm install`
3.  Run development server: `npm run dev`
4.  Open your browser and navigate to http://localhost:5173.

## Project Structure

-   `src/`: Contains the source code.
    -   `components/`: React components, including:
        -   `ui/`: Radix UI components.
        -   `EditorPane.tsx`: Markdown editor pane.
        -   `PreviewPane.tsx`: Markdown preview pane.
        -   `MarkdownEditor.tsx`: Main markdown editor component.
    -   `App.tsx`: Main application component with basic routing.
    -   `main.tsx`: Entry point of the application.
    -   `index.css`: Global CSS styles.
-   `public/`: Static assets.
-   `index.html`: HTML entry point.
-   `package.json`: Project dependencies and scripts.
-   `vite.config.ts`: Vite configuration file.
-   `tailwind.config.js`: Tailwind CSS configuration file.
-   `postcss.config.js`: PostCSS configuration file.
-   `tsconfig.json`, `tsconfig.node.json`: TypeScript configuration files.

## Next Steps (Optional)

-   Implement more advanced markdown editing features (e.g., toolbar actions, syntax highlighting).
-   Add styling customization options.
-   Explore saving and loading markdown content.
-   Improve responsiveness and accessibility.

## License

[MIT License](LICENSE)
