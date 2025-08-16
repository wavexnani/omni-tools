# Forward Feature Implementation

## Overview

The Forward feature allows users to send the output of one tool as the input of another tool, creating a seamless workflow for multi-step operations. For example, you can compress an image and then instantly rotate the compressed result.

## Implementation Details

### 1. Forward Button
- Added to `ResultFooter` component with "Next Operation" label
- Available in both `ToolFileResult` and `ToolMultiFileResult` components
- Automatically disabled when no result is available

### 2. Data Persistence
- **IndexedDB**: Stores the actual file data for persistence across sessions
- **localStorage**: Stores lightweight metadata (forwarded state, tool name)
- Database name: `OmniToolsDB` with object store `files`

### 3. Forwarded Data Handling
- **Hook**: `useForwardedData()` manages forwarded data state
- **Provider**: `ForwardedDataProvider` wraps tool components
- **Preview**: `ForwardedFilePreview` shows forwarded file in Picture-in-Picture mode

### 4. Input Type Filtering
- Added `inputType` field to tool definitions
- Automatically filters tools based on file type compatibility
- Supported types: `image`, `video`, `audio`, `pdf`, `csv`, `json`, `xml`, `text`

### 5. File Type Detection
The system automatically detects file types based on:
- MIME type (primary method)
- File extension (fallback for certain formats)

## Usage Flow

1. **Forward**: User clicks "Next Operation" button on any tool result
2. **Storage**: File is saved to IndexedDB with tool path as key
3. **Navigation**: User is redirected to home page
4. **Detection**: When visiting a compatible tool, forwarded data is detected
5. **Injection**: File is automatically injected into the tool's input
6. **Preview**: Forwarded file preview appears with delete and hide options
7. **Processing**: Tool automatically processes the forwarded file

## Components

### Core Components
- `ForwardedFilePreview`: Picture-in-Picture preview with delete and hide buttons
- `useForwardedData`: Hook for managing forwarded data state

### Updated Components
- `ToolContent`: Integrated forwarded data handling and preview
- `ToolFileResult`: Added Forward button and functionality
- `ToolMultiFileResult`: Added Forward button and functionality
- `ResultFooter`: Added Forward button support
- `defineTool`: Added inputType support

### Hooks
- `useForwardedData`: Manages forwarded data state and operations

## Translation Support

Added translations for:
- `resultFooter.forward`: "Next Operation" button text
- `forwardedFilePreview.forwardedFile`: Preview header text

Supported languages: English, German, Spanish, French, Hindi, Japanese, Dutch, Portuguese, Russian, Chinese

## Technical Implementation

### IndexedDB Operations
```typescript
// Save file
await saveFileToIndexedDB(toolName, file);

// Retrieve file
const file = await getFileFromIndexedDB(toolName);

// Remove file
await removeFileFromIndexedDB(toolName);
```

### Tool Definition
```typescript
export const tool = defineTool('image-generic', {
  // ... other options
  inputType: 'image', // Automatically enables forwarding
  component: lazy(() => import('./index'))
});
```

### Usage in Tool Components
```typescript
// Tool components automatically get forwarded data functionality
// when inputType is specified in their meta definition
export default function MyTool({ title, inputType }: ToolComponentProps) {
  return (
    <ToolContent
      title={title}
      inputType={inputType} // Pass through for validation
      // ... other props
    />
  );
}
```

## Error Handling

- **File Type Mismatch**: Automatically clears incompatible forwarded data
- **Storage Errors**: Graceful fallback with console warnings
- **Missing Data**: No action taken if forwarded data is not found

## Browser Compatibility

- Requires IndexedDB support (all modern browsers)
- Requires localStorage support (all modern browsers)
- Graceful degradation for older browsers

## Testing the Forward Feature

### **Step 1: Forward a File**
1. Go to any tool that produces a file output (e.g., Image Compress)
2. Upload an image and process it
3. Click the **"Next Operation"** button in the result footer
4. You should see a success message and be redirected to the home page

### **Step 2: Verify IndexedDB Storage**
1. Open browser Developer Tools (F12)
2. Go to **Application** tab → **IndexedDB** → **OmniToolsDB** → **files**
3. You should see the forwarded file stored with the tool path as the key

### **Step 3: Test Forwarded Data Injection**
1. Go to a compatible tool (e.g., Image Resize if you forwarded an image)
2. The forwarded file should automatically appear in the input
3. A **Picture-in-Picture preview** should appear in the top-right corner
4. The tool should automatically process the forwarded file

### **Step 4: Test Delete Functionality**
1. Click the **🗑️ Delete button** in the Picture-in-Picture preview
2. The preview should disappear and data should be removed from IndexedDB
3. Check IndexedDB again - the file should be removed
4. The tool input should be cleared

### **Step 5: Test Hide Functionality**
1. Click the **X button** in the Picture-in-Picture preview
2. The preview should disappear but data remains in IndexedDB
3. The tool input should remain populated

### **Step 6: Test Type Validation**
1. Forward an image file
2. Try to visit a tool that expects a different file type (e.g., PDF tool)
3. The forwarded data should be automatically cleared with a console warning

## Future Enhancements

1. **Tool Chain History**: Track and display previous operations
2. **Batch Operations**: Forward multiple files at once
3. **Custom Workflows**: Save and reuse common tool chains
4. **Export/Import**: Share tool chains with other users
