import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const MediaUpload = ({ 
  files = [], 
  onFilesChange, 
  maxFiles = 3, 
  maxSizePerFile = 10, // MB
  className = '' 
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadErrors, setUploadErrors] = useState([]);
  const fileInputRef = useRef(null);

  const acceptedTypes = {
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/webp': ['.webp'],
    'video/mp4': ['.mp4'],
    'video/webm': ['.webm'],
    'video/quicktime': ['.mov']
  };

  const validateFile = (file) => {
    const errors = [];
    
    // Check file type
    if (!Object.keys(acceptedTypes)?.includes(file?.type)) {
      errors?.push(`${file?.name}: Unsupported file type. Please use JPG, PNG, WebP, MP4, WebM, or MOV files.`);
    }
    
    // Check file size
    if (file?.size > maxSizePerFile * 1024 * 1024) {
      errors?.push(`${file?.name}: File size exceeds ${maxSizePerFile}MB limit.`);
    }
    
    return errors;
  };

  const handleFiles = (newFiles) => {
    const fileArray = Array.from(newFiles);
    const allErrors = [];
    const validFiles = [];

    // Check total file count
    if (files?.length + fileArray?.length > maxFiles) {
      allErrors?.push(`Maximum ${maxFiles} files allowed. Please remove some files first.`);
      setUploadErrors(allErrors);
      return;
    }

    // Validate each file
    fileArray?.forEach(file => {
      const fileErrors = validateFile(file);
      if (fileErrors?.length === 0) {
        validFiles?.push({
          id: Date.now() + Math.random(),
          file,
          name: file?.name,
          size: file?.size,
          type: file?.type,
          preview: file?.type?.startsWith('image/') ? URL.createObjectURL(file) : null
        });
      } else {
        allErrors?.push(...fileErrors);
      }
    });

    setUploadErrors(allErrors);
    
    if (validFiles?.length > 0) {
      onFilesChange([...files, ...validFiles]);
    }
  };

  const handleDrag = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (e?.type === 'dragenter' || e?.type === 'dragover') {
      setDragActive(true);
    } else if (e?.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDragActive(false);
    
    if (e?.dataTransfer?.files && e?.dataTransfer?.files?.[0]) {
      handleFiles(e?.dataTransfer?.files);
    }
  };

  const handleInputChange = (e) => {
    if (e?.target?.files && e?.target?.files?.[0]) {
      handleFiles(e?.target?.files);
    }
  };

  const removeFile = (fileId) => {
    const updatedFiles = files?.filter(file => file?.id !== fileId);
    onFilesChange(updatedFiles);
    
    // Clear any errors when files are removed
    if (uploadErrors?.length > 0) {
      setUploadErrors([]);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center space-x-2 mb-3">
        <Icon name="Camera" size={20} className="text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Media Upload</h3>
        <span className="text-sm text-muted-foreground">(Optional)</span>
      </div>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors duration-200 ${
          dragActive 
            ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={Object.values(acceptedTypes)?.flat()?.join(',')}
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="text-center">
          <Icon name="Upload" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h4 className="text-lg font-medium text-foreground mb-2">
            Upload Photos or Videos
          </h4>
          <p className="text-sm text-muted-foreground mb-4">
            Drag and drop files here, or click to select files
          </p>
          <Button
            variant="outline"
            onClick={() => fileInputRef?.current?.click()}
            iconName="Plus"
            iconPosition="left"
          >
            Choose Files
          </Button>
          <div className="mt-4 text-xs text-muted-foreground space-y-1">
            <p>Supported formats: JPG, PNG, WebP, MP4, WebM, MOV</p>
            <p>Maximum {maxFiles} files, {maxSizePerFile}MB per file</p>
          </div>
        </div>
      </div>
      {/* Upload Errors */}
      {uploadErrors?.length > 0 && (
        <div className="bg-error/10 border border-error/20 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <Icon name="AlertCircle" size={16} className="text-error mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-error mb-2">Upload Errors:</h4>
              <ul className="text-xs text-error space-y-1">
                {uploadErrors?.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      {/* File Preview */}
      {files?.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">
            Uploaded Files ({files?.length}/{maxFiles})
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {files?.map((fileObj) => (
              <div key={fileObj?.id} className="bg-card border border-border rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <Icon 
                      name={fileObj?.type?.startsWith('image/') ? 'Image' : 'Video'} 
                      size={16} 
                      className="text-primary flex-shrink-0" 
                    />
                    <span className="text-sm font-medium text-foreground truncate">
                      {fileObj?.name}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(fileObj?.id)}
                    className="p-1 h-auto"
                  >
                    <Icon name="X" size={14} />
                  </Button>
                </div>
                
                {fileObj?.preview && (
                  <div className="mb-2 rounded overflow-hidden">
                    <Image
                      src={fileObj?.preview}
                      alt={`Preview of ${fileObj?.name}`}
                      className="w-full h-24 object-cover"
                    />
                  </div>
                )}
                
                <div className="text-xs text-muted-foreground">
                  {formatFileSize(fileObj?.size)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaUpload;