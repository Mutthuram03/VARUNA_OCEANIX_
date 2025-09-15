import { useState } from 'react';
import { FileUploadService } from '../services/firebase.js';

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const uploadFiles = async (files, basePath = 'hazard-reports') => {
    if (!files || files.length === 0) {
      return { success: false, error: 'No files provided' };
    }

    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      const result = await FileUploadService.uploadMultipleFiles(files, basePath);
      
      if (result.success) {
        setProgress(100);
        return { success: true, uploads: result.uploads };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setUploading(false);
    }
  };

  const uploadSingleFile = async (file, path) => {
    setUploading(true);
    setError(null);

    try {
      const result = await FileUploadService.uploadFile(file, path);
      return result;
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setUploading(false);
    }
  };

  const validateFile = (file, maxSize = 10 * 1024 * 1024) => { // 10MB default
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'video/mp4',
      'video/quicktime',
      'audio/mpeg',
      'audio/wav'
    ];

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'File type not supported' };
    }

    if (file.size > maxSize) {
      return { valid: false, error: 'File size too large' };
    }

    return { valid: true };
  };

  const validateFiles = (files, maxSize = 10 * 1024 * 1024) => {
    const results = [];
    
    for (let i = 0; i < files.length; i++) {
      const validation = validateFile(files[i], maxSize);
      results.push({
        file: files[i],
        index: i,
        ...validation
      });
    }

    const validFiles = results.filter(r => r.valid).map(r => r.file);
    const errors = results.filter(r => !r.valid);

    return {
      validFiles,
      errors,
      allValid: errors.length === 0
    };
  };

  return {
    uploading,
    progress,
    error,
    uploadFiles,
    uploadSingleFile,
    validateFile,
    validateFiles
  };
};

