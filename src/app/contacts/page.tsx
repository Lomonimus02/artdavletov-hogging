'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Contacts() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Симуляция отправки формы
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Здесь можно добавить реальную отправку на сервер
      console.log('Form submitted:', formData);

      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Set page identifier for mobile menu styling
  useEffect(() => {
    document.body.setAttribute('data-page', 'contacts');
    return () => {
      document.body.removeAttribute('data-page');
    };
  }, []);

  return (
    <div className="min-h-screen bg-black">
      {/* Contacts Section - идентично главной странице */}
      <section className="px-4 sm:px-6 lg:px-8 bg-black h-screen flex items-center mobile-contact-section mobile-no-overflow">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-16">
            <p className="text-xl md:text-2xl lg:text-3xl text-white font-bold max-w-4xl mx-auto leading-relaxed uppercase tracking-wide mobile-contact-text">
              {t('contacts.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 mobile-contact-grid">
            {/* Contact Information */}
            <div className="space-y-16 h-full flex flex-col justify-center">
              <div className="space-y-12">
                <div>
                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6 uppercase tracking-wide mobile-contact-heading">{t('contacts.phone')}</h3>
                  <p className="text-2xl md:text-3xl lg:text-4xl text-white font-bold uppercase tracking-wide mobile-contact-text">+7 996 100 3484</p>
                </div>

                <div>
                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6 uppercase tracking-wide mobile-contact-heading">{t('contacts.email')}</h3>
                  <p className="text-2xl md:text-3xl lg:text-4xl text-white font-bold uppercase tracking-wide mobile-contact-text">main@artdavletov.ru</p>
                </div>

                <div>
                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6 uppercase tracking-wide mobile-contact-heading">{t('contacts.address')}</h3>
                  <p className="text-2xl md:text-3xl lg:text-4xl text-white font-bold uppercase tracking-wide leading-relaxed mobile-contact-text">
                    {t('contacts.address.line1')}<br />
                    {t('contacts.address.line2')}
                  </p>
                </div>

                <div>
                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6 uppercase tracking-wide mobile-contact-heading">{t('contacts.hours')}</h3>
                  <p className="text-2xl md:text-3xl lg:text-4xl text-white font-bold uppercase tracking-wide leading-relaxed mobile-contact-text">
                    {t('contacts.hours.weekdays')}<br />
                    {t('contacts.hours.weekends')}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="h-full flex items-center mobile-form-container">
              <form onSubmit={handleSubmit} className="space-y-8 w-full">
                <div>
                  <label htmlFor="name" className="block text-lg md:text-xl font-black text-white mb-4 uppercase tracking-wide mobile-form-label">
                    {t('contacts.form.name')} *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-6 py-4 border-2 border-white bg-transparent text-white placeholder-gray-300 focus:border-gray-300 focus:outline-none transition-colors duration-300 text-lg font-bold uppercase tracking-wide mobile-form-input"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-lg md:text-xl font-black text-white mb-4 uppercase tracking-wide mobile-form-label">
                    {t('contacts.form.email')} *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-6 py-4 border-2 border-white bg-transparent text-white placeholder-gray-300 focus:border-gray-300 focus:outline-none transition-colors duration-300 text-lg font-bold uppercase tracking-wide mobile-form-input"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-lg md:text-xl font-black text-white mb-4 uppercase tracking-wide mobile-form-label">
                    {t('contacts.form.phone')}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 border-2 border-white bg-transparent text-white placeholder-gray-300 focus:border-gray-300 focus:outline-none transition-colors duration-300 text-lg font-bold uppercase tracking-wide mobile-form-input"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-lg md:text-xl font-black text-white mb-4 uppercase tracking-wide mobile-form-label">
                    {t('contacts.form.message')} *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    className="w-full px-6 py-4 border-2 border-white bg-transparent text-white placeholder-gray-300 focus:border-gray-300 focus:outline-none transition-colors duration-300 resize-vertical text-lg font-bold uppercase tracking-wide mobile-form-input"
                    disabled={isSubmitting}
                  ></textarea>
                </div>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <div className="p-4 bg-green-100 border-2 border-green-500">
                    <p className="text-green-700 font-black uppercase tracking-wide">
                      {t('contacts.form.success')}
                    </p>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="p-4 bg-red-100 border-2 border-red-500">
                    <p className="text-red-700 font-black uppercase tracking-wide">
                      {t('contacts.form.error')}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-white text-black px-8 py-4 font-black uppercase tracking-wider text-xl hover:bg-gray-200 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed mobile-form-button"
                >
                  {isSubmitting ? t('contacts.form.sending') : t('contacts.form.submit')}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
