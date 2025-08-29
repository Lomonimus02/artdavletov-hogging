'use client';

import { useState, useRef } from 'react';

interface ImageUploadProps {
  onImageUploaded: (imageUrl: string) => void;
  currentImage?: string;
  label: string;
}

export default function ImageUpload({ onImageUploaded, currentImage, label }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB
      alert('Размер файла не должен превышать 10MB');
      return;
    }

    setUploading(true);

    try {
      // Создаем FormData для загрузки
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          'x-admin-session': 'true'
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        onImageUploaded(data.imageUrl);
      } else {
        alert('Ошибка при загрузке изображения');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Ошибка при загрузке изображения');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-lg font-black text-black mb-2 uppercase tracking-wide">
        {label}
      </label>
      
      {/* Current Image Preview */}
      {currentImage && (
        <div className="mb-4">
          <img
            src={currentImage}
            alt="Current image"
            className="w-32 h-32 object-cover border-2 border-gray-300"
          />
          <p className="text-sm text-gray-600 mt-2">Текущее изображение</p>
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed p-8 text-center cursor-pointer transition-colors duration-300 ${
          dragOver
            ? 'border-blue-500 bg-blue-50'
            : uploading
            ? 'border-gray-300 bg-gray-50'
            : 'border-gray-400 hover:border-gray-600'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={!uploading ? handleClick : undefined}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={uploading}
        />
        
        {uploading ? (
          <div>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-lg font-black text-gray-600 uppercase tracking-wide">
              Загрузка...
            </p>
          </div>
        ) : (
          <div>
            <div className="text-4xl mb-4">📁</div>
            <p className="text-lg font-black text-gray-600 uppercase tracking-wide mb-2">
              Загрузите изображение с компьютера
            </p>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">
              Перетащите файл сюда или нажмите для выбора
            </p>
            <p className="text-xs text-gray-400">
              Поддерживаются: JPG, PNG, GIF (до 10MB)
            </p>
          </div>
        )}
      </div>


    </div>
  );
}
