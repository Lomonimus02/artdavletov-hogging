'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/contexts/AdminContext';
import Link from 'next/link';
import ImageUpload from '@/components/ImageUpload';

export default function NewProject() {
  const { isAdmin } = useAdmin();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    type: 'Дизайн-проект',
    city: '',
    area: '',
    year: new Date().getFullYear().toString(),
    section: 'interior',
    image: '',
    gallery: ['']
  });

  // Проверяем авторизацию
  useEffect(() => {
    if (!isAdmin) {
      router.push('/admin');
    }
  }, [isAdmin, router]);

  // Set page identifier for mobile menu styling
  useEffect(() => {
    document.body.setAttribute('data-page', 'admin');
    return () => {
      document.body.removeAttribute('data-page');
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGalleryChange = (index: number, value: string) => {
    const newGallery = [...formData.gallery];
    newGallery[index] = value;
    setFormData(prev => ({
      ...prev,
      gallery: newGallery
    }));
  };

  const addGalleryImage = () => {
    setFormData(prev => ({
      ...prev,
      gallery: [...prev.gallery, '']
    }));
  };

  const removeGalleryImage = (index: number) => {
    if (formData.gallery.length > 1) {
      const newGallery = formData.gallery.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        gallery: newGallery
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Фильтруем пустые изображения из галереи
      const filteredGallery = formData.gallery.filter(img => img.trim() !== '');
      
      const response = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-session': 'true'
        },
        body: JSON.stringify({
          ...formData,
          gallery: filteredGallery.length > 0 ? filteredGallery : [formData.image]
        }),
      });

      if (response.ok) {
        router.push('/admin/dashboard');
      } else {
        alert('Ошибка при создании проекта');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Ошибка при создании проекта');
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-white pt-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-black text-gray-500 uppercase tracking-wider">
            Загрузка...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <Link
              href="/admin/dashboard"
              className="text-blue-600 hover:text-blue-800 font-black uppercase tracking-wider text-sm mb-2 block"
            >
              ← Назад к панели
            </Link>
            <h1 className="text-3xl md:text-4xl font-black text-black uppercase tracking-wider">
              Добавить проект
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-lg font-black text-black mb-2 uppercase tracking-wide">
              Название проекта *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border-2 border-black bg-transparent text-black placeholder-gray-600 focus:border-gray-600 focus:outline-none transition-colors duration-300 text-lg font-bold uppercase tracking-wide"
              placeholder="Введите название проекта"
            />
          </div>

          {/* Category and Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className="block text-lg font-black text-black mb-2 uppercase tracking-wide">
                Категория *
              </label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-black bg-transparent text-black placeholder-gray-600 focus:border-gray-600 focus:outline-none transition-colors duration-300 text-lg font-bold uppercase tracking-wide"
                placeholder="Частный дом, Апартаменты и т.д."
              />
            </div>
            <div>
              <label htmlFor="type" className="block text-lg font-black text-black mb-2 uppercase tracking-wide">
                Тип проекта *
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-black bg-white text-black focus:border-gray-600 focus:outline-none transition-colors duration-300 text-lg font-bold uppercase tracking-wide"
              >
                <option value="Дизайн-проект">Дизайн-проект</option>
                <option value="Эскизный проект">Эскизный проект</option>
                <option value="Архитектурный проект">Архитектурный проект</option>
              </select>
            </div>
          </div>

          {/* City and Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="city" className="block text-lg font-black text-black mb-2 uppercase tracking-wide">
                Город/Локация *
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-black bg-transparent text-black placeholder-gray-600 focus:border-gray-600 focus:outline-none transition-colors duration-300 text-lg font-bold uppercase tracking-wide"
                placeholder="Москва, Санкт-Петербург и т.д."
              />
            </div>
            <div>
              <label htmlFor="area" className="block text-lg font-black text-black mb-2 uppercase tracking-wide">
                Площадь
              </label>
              <input
                type="text"
                id="area"
                name="area"
                value={formData.area}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-black bg-transparent text-black placeholder-gray-600 focus:border-gray-600 focus:outline-none transition-colors duration-300 text-lg font-bold uppercase tracking-wide"
                placeholder="250 м²"
              />
            </div>
          </div>

          {/* Year and Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="year" className="block text-lg font-black text-black mb-2 uppercase tracking-wide">
                Год *
              </label>
              <input
                type="text"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-black bg-transparent text-black placeholder-gray-600 focus:border-gray-600 focus:outline-none transition-colors duration-300 text-lg font-bold uppercase tracking-wide"
                placeholder="2024"
              />
            </div>
            <div>
              <label htmlFor="section" className="block text-lg font-black text-black mb-2 uppercase tracking-wide">
                Раздел *
              </label>
              <select
                id="section"
                name="section"
                value={formData.section}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-black bg-white text-black focus:border-gray-600 focus:outline-none transition-colors duration-300 text-lg font-bold uppercase tracking-wide"
              >
                <option value="architecture">Архитектура</option>
                <option value="urbanism">Благоустройство</option>
                <option value="interior">Интерьерный дизайн</option>
              </select>
            </div>
          </div>

          {/* Main Image */}
          <div>
            <ImageUpload
              label="Главное изображение *"
              currentImage={formData.image}
              onImageUploaded={(imageUrl) => {
                setFormData(prev => ({
                  ...prev,
                  image: imageUrl
                }));
              }}
            />
          </div>

          {/* Gallery */}
          <div>
            <label className="block text-lg font-black text-black mb-2 uppercase tracking-wide">
              Галерея изображений
            </label>
            <div className="space-y-6">
              {formData.gallery.map((image, index) => (
                <div key={index} className="border-2 border-gray-200 p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-md font-black text-gray-700 uppercase tracking-wide">
                      Изображение {index + 1}
                    </h4>
                    {formData.gallery.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="bg-red-600 text-white px-3 py-1 font-black uppercase tracking-wider text-xs hover:bg-red-700 transition-colors duration-300"
                      >
                        Удалить
                      </button>
                    )}
                  </div>
                  <ImageUpload
                    label=""
                    currentImage={image}
                    onImageUploaded={(imageUrl) => handleGalleryChange(index, imageUrl)}
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={addGalleryImage}
                className="bg-gray-600 text-white px-4 py-2 font-black uppercase tracking-wider text-sm hover:bg-gray-700 transition-colors duration-300"
              >
                Добавить изображение в галерею
              </button>
            </div>
          </div>



          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-8 py-4 font-black uppercase tracking-wider text-xl hover:bg-green-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Создание...' : 'Создать проект'}
            </button>
            <Link
              href="/admin/dashboard"
              className="bg-gray-600 text-white px-8 py-4 font-black uppercase tracking-wider text-xl hover:bg-gray-700 transition-colors duration-300 inline-block text-center"
            >
              Отмена
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
