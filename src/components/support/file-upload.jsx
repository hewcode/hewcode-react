import { File, Image as ImageIcon, Upload, X } from 'lucide-react';
import { useCallback, useState } from 'react';
import useTranslator from '../../hooks/useTranslator.js';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button.jsx';
import Label from './label.jsx';

const FileUpload = ({
  value,
  onChange,
  label,
  description,
  error,
  required = false,
  placeholder,
  disabled = false,
  className,
  acceptedFileTypes = [],
  maxSize,
  multiple = false,
  maxFiles,
  image = false,
  enablePreview = true,
  accept = '*/*',
  name,
  ...props
}) => {
  const { __ } = useTranslator();
  const [isDragging, setIsDragging] = useState(false);
  const [previews, setPreviews] = useState([]);

  const hasError = error && error.length > 0;
  const files = Array.isArray(value) ? value : value ? [value] : [];
  const defaultPlaceholder = __('hewcode.file_upload.click_to_upload_or_drag_and_drop');

  // Helper to check if value is a File object
  const isFileObject = (val) => val && typeof val === 'object' && val.constructor && val.constructor.name === 'File';

  // Helper to check if value is a metadata object from backend
  const isMetadata = (val) => val && typeof val === 'object' && 'url' in val && 'path' in val && !isFileObject(val);

  // Helper to get preview URL for a file (File object, metadata object, or URL string)
  const getPreviewUrl = (file) => {
    if (isMetadata(file)) {
      // Metadata object from backend
      return file.url;
    }
    if (typeof file === 'string') {
      // Legacy: URL string from backend
      return file;
    }
    // File object - find in previews
    const preview = previews.find((p) => p.file === file);
    return preview?.url;
  };

  // Helper to get filename
  const getFilename = (file) => {
    if (isMetadata(file)) {
      return file.filename;
    }
    if (isFileObject(file)) {
      return file.name;
    }
    return __('hewcode.common.uploaded_file');
  };

  // Helper to get file size in bytes
  const getFileSize = (file) => {
    if (isMetadata(file)) {
      return file.size;
    }
    if (isFileObject(file)) {
      return file.size;
    }
    return null;
  };

  // Handle file selection
  const handleFiles = useCallback(
    (fileList) => {
      const newFiles = Array.from(fileList);

      // Validate file count
      if (maxFiles && files.length + newFiles.length > maxFiles) {
        console.error(`Maximum ${maxFiles} files allowed`);
        return;
      }

      // Validate file sizes
      if (maxSize) {
        const oversized = newFiles.filter((f) => f.size > maxSize * 1024);
        if (oversized.length > 0) {
          console.error(`File size exceeds ${maxSize}KB limit`);
          return;
        }
      }

      // Generate previews for images
      if (enablePreview && (image || acceptedFileTypes.some((t) => t.match(/jpg|jpeg|png|gif|webp/)))) {
        newFiles.forEach((file) => {
          if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
              setPreviews((prev) => [...prev, { file, url: e.target.result }]);
            };
            reader.readAsDataURL(file);
          }
        });
      }

      // Update value
      if (multiple) {
        onChange([...files, ...newFiles]);
      } else {
        onChange(newFiles[0]);
        // Generate preview for single file
        if (newFiles[0] && newFiles[0].type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setPreviews([{ file: newFiles[0], url: e.target.result }]);
          };
          reader.readAsDataURL(newFiles[0]);
        }
      }
    },
    [files, maxFiles, maxSize, enablePreview, image, acceptedFileTypes, multiple, onChange],
  );

  // Drag and drop handlers
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);

      if (disabled) return;

      const droppedFiles = e.dataTransfer.files;
      if (droppedFiles.length > 0) {
        handleFiles(droppedFiles);
      }
    },
    [disabled, handleFiles],
  );

  // Remove file
  const handleRemove = useCallback(
    (index) => {
      if (multiple) {
        const newFiles = files.filter((_, i) => i !== index);
        onChange(newFiles);
        setPreviews((prev) => prev.filter((_, i) => i !== index));
      } else {
        onChange(null);
        setPreviews([]);
      }
    },
    [files, multiple, onChange],
  );

  // File input change
  const handleInputChange = useCallback(
    (e) => {
      const selectedFiles = e.target.files;
      if (selectedFiles.length > 0) {
        handleFiles(selectedFiles);
      }
    },
    [handleFiles],
  );

  return (
    <div className={cn('w-full', className)}>
      {label && <Label required={required}>{label}</Label>}

      {/* Hidden file input */}
      <input
        type="file"
        id={name || 'file-upload'}
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={handleInputChange}
        className="sr-only"
      />

      {/* Single file mode with file selected - show preview card instead */}
      {!multiple && files.length > 0 ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'relative overflow-hidden rounded-lg border-2 border-dashed transition-colors',
            isDragging && 'border-primary bg-primary/5',
            !isDragging && 'border-muted-foreground/25',
            hasError && 'border-destructive',
            disabled && 'cursor-not-allowed opacity-50',
          )}
        >
          <label htmlFor={name || 'file-upload'} className={cn('group relative block cursor-pointer', disabled && 'cursor-not-allowed')}>
            {getPreviewUrl(files[0]) ? (
              // Image preview
              <div className="relative">
                <img src={getPreviewUrl(files[0])} alt={getFilename(files[0])} className="h-auto max-h-96 w-full object-contain" />
                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="text-center text-white">
                    <Upload className="mx-auto mb-2 h-8 w-8" />
                    <p className="text-sm">{__('hewcode.file_upload.click_or_drag_to_replace')}</p>
                  </div>
                </div>
              </div>
            ) : (
              // Non-image file preview
              <div className="flex items-center gap-3 p-6">
                {image ? <ImageIcon className="text-muted-foreground h-12 w-12" /> : <File className="text-muted-foreground h-12 w-12" />}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{getFilename(files[0])}</p>
                  {getFileSize(files[0]) && <p className="text-muted-foreground text-xs">{(getFileSize(files[0]) / 1024).toFixed(2)} KB</p>}
                </div>
              </div>
            )}
          </label>

          {/* Remove button - always visible */}
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => handleRemove(0)}
            disabled={disabled}
            className="absolute right-2 top-2 z-10"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <>
          {/* Drop zone - shown when no file (or multiple mode) */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              'relative rounded-lg border-2 border-dashed transition-colors',
              isDragging && 'border-primary bg-primary/5',
              !isDragging && 'border-muted-foreground/25',
              hasError && 'border-destructive',
              disabled && 'cursor-not-allowed opacity-50',
            )}
          >
            <label
              htmlFor={name || 'file-upload'}
              className={cn('flex cursor-pointer flex-col items-center justify-center gap-2 p-8', disabled && 'cursor-not-allowed')}
            >
              <Upload className="text-muted-foreground h-8 w-8" />
              <p className="text-muted-foreground text-sm">{placeholder || defaultPlaceholder}</p>
              {maxSize && <p className="text-muted-foreground text-xs">Max file size: {maxSize}KB</p>}
            </label>
          </div>

          {/* File previews for multiple mode */}
          {multiple && files.length > 0 && (
            <div className="mt-4 space-y-2">
              {files.map((file, index) => {
                const previewUrl = getPreviewUrl(file);

                return (
                  <div key={index} className="flex items-center gap-3 rounded-md border p-3">
                    {/* Preview thumbnail or icon */}
                    {previewUrl ? (
                      <img src={previewUrl} alt={getFilename(file)} className="h-10 w-10 rounded object-cover" />
                    ) : image ? (
                      <ImageIcon className="text-muted-foreground h-10 w-10" />
                    ) : (
                      <File className="text-muted-foreground h-10 w-10" />
                    )}

                    {/* File info */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{getFilename(file)}</p>
                      {getFileSize(file) && <p className="text-muted-foreground text-xs">{(getFileSize(file) / 1024).toFixed(2)} KB</p>}
                    </div>

                    {/* Remove button */}
                    <Button type="button" variant="ghost" size="sm" onClick={() => handleRemove(index)} disabled={disabled}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Error message */}
      {hasError && <p className="text-destructive mt-1 text-sm">{error}</p>}

      {/* Description */}
      {description && !hasError && <p className="text-muted-foreground mt-2 text-sm">{description}</p>}
    </div>
  );
};

export default FileUpload;
