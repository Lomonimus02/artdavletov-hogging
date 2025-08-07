'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function About() {
  const { t } = useLanguage();

  // Данные команды
  const teamMembers = [
    {
      name: t('about.team.member1.name'),
      position: t('about.team.member1.position'),
      image: "/images/team/artem.jpg"
    },
    {
      name: t('about.team.member2.name'),
      position: t('about.team.member2.position'),
      image: "/images/team/anna.jpg"
    },
    {
      name: t('about.team.member3.name'),
      position: t('about.team.member3.position'),
      image: "/images/team/mikhail.jpg"
    },
    {
      name: t('about.team.member4.name'),
      position: t('about.team.member4.position'),
      image: "/images/team/elena.jpg"
    },
    {
      name: t('about.team.member5.name'),
      position: t('about.team.member5.position'),
      image: "/images/team/dmitry.jpg"
    },
    {
      name: t('about.team.member6.name'),
      position: t('about.team.member6.position'),
      image: "/images/team/sofia.jpg"
    },
    {
      name: t('about.team.member7.name'),
      position: t('about.team.member7.position'),
      image: "/images/team/alexander.jpg"
    },
    {
      name: t('about.team.member8.name'),
      position: t('about.team.member8.position'),
      image: "/images/team/maria.jpg"
    },
    {
      name: t('about.team.member9.name'),
      position: t('about.team.member9.position'),
      image: "/images/team/igor.jpg"
    },
    {
      name: t('about.team.member10.name'),
      position: t('about.team.member10.position'),
      image: "/images/team/olga.jpg"
    }
  ];

  // Set page identifier for mobile menu styling
  useEffect(() => {
    document.body.setAttribute('data-page', 'about');
    return () => {
      document.body.removeAttribute('data-page');
    };
  }, []);

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white mobile-about-hero">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 mobile-about-heading-container">
            <h1 className="text-8xl md:text-9xl lg:text-[12rem] xl:text-[16rem] font-black text-black tracking-wider uppercase leading-tight mobile-hide-about-heading">
              О НАС
            </h1>
          </div>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto text-center desktop-about-content">
            <div className="bg-white p-12 lg:p-16">
              <p className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-black leading-relaxed mb-12 mobile-about-main-heading">
                {t('about.main.title')}
              </p>
              <p className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-medium text-black leading-relaxed mb-10">
                {t('about.main.description1')}
              </p>
              <p className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-medium text-black leading-relaxed mb-10">
                {t('about.main.description2')}
              </p>
              <p className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-medium text-black leading-relaxed">
                {t('about.main.description3')}
              </p>
            </div>
          </div>
        </div>
      </section>



      {/* Team Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-black mb-8 tracking-wider uppercase">
              {t('about.team.title')}
            </h2>
          </div>

          {/* Team Grid - 2 rows layout */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 lg:gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="group">
                <div className="relative overflow-hidden bg-gray-200 aspect-square mb-6 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                    <div className="text-6xl text-gray-500 group-hover:text-white transition-colors duration-500">
                      👤
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <p className="text-white font-black uppercase tracking-wider text-sm">
                      {member.position}
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl md:text-2xl font-black text-black uppercase tracking-wider mb-2 group-hover:text-black transition-colors duration-300">
                    {member.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



    </div>
  )
}
