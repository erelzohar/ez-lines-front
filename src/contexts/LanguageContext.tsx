import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'he';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.portfolio': 'Portfolio',
    'nav.schedule': 'Schedule',
    'nav.contact': 'Contact',

    // Hero
    'hero.book': 'Book Appointment',
    'hero.portfolio': 'View Portfolio',

    // About
    'about.title': 'About StyleTime Studio',
    'about.location': 'Location',
    'about.phone': 'Phone',
    'about.email': 'Email',
    'about.hours': 'Work Hours',
    'about.visit': 'Visit Our Studio',

    // Portfolio
    'portfolio.title': 'Our Latest Works',
    'portfolio.view.slideshow': 'Slideshow',
    'portfolio.view.grid': 'Grid',

    // Schedule
    'schedule.title': 'Schedule Your Visit',
    'schedule.select.date': 'Select Date',
    'schedule.select.time': 'Select Time',
    'schedule.available.times': 'Available Times for',
    'schedule.book': 'Book Appointment',
    'schedule.success': 'Appointment booked successfully!',
    'schedule.form.name': 'Full Name',
    'schedule.form.phone': 'Phone Number',
    'schedule.form.verification': 'Verification Code',
    'schedule.form.verification.message': 'A verification code has been sent to your phone',
    'schedule.form.send.code': 'Send Verification Code',
    'schedule.form.verify': 'Verify and Book',

    // Contact
    'contact.title': 'Get in Touch',
    'contact.form.name': 'Name',
    'contact.form.phone': 'Phone',
    'contact.form.message': 'Message',
    'contact.form.send': 'Send Message',
    'contact.form.success': 'Message sent successfully!',

    // Footer
    'footer.links': 'Quick Links',
    'footer.services': 'Services',
    'footer.follow': 'Follow Us',
    'footer.rights': 'All rights reserved.',
    'footer.business.link': 'Want this for your business? Click here',

  },
  he: {
    // Navigation
    'nav.home': 'בית',
    'nav.about': 'אודות',
    'nav.portfolio': 'תיק עבודות',
    'nav.schedule': 'קביעת תור',
    'nav.contact': 'צור קשר',

    // Hero
    'hero.book': 'קבע תור',
    'hero.portfolio': 'צפה בתיק העבודות',

    // About
    'about.title': 'אודות סטייל טיים סטודיו',
    'about.location': 'מיקום',
    'about.phone': 'טלפון',
    'about.email': 'אימייל',
    'about.hours': 'שעות פעילות',
    'about.visit': 'בקר בסטודיו שלנו',

    // Portfolio
    'portfolio.title': 'העבודות האחרונות שלנו',
    'portfolio.view.slideshow': 'מצגת',
    'portfolio.view.grid': 'רשת',

    // Schedule
    'schedule.title': 'קבע את הביקור שלך',
    'schedule.select.date': 'בחר תאריך',
    'schedule.select.time': 'בחר שעה',
    'schedule.available.times': 'שעות זמינות ל',
    'schedule.book': 'קבע תור',
    'schedule.success': 'התור נקבע בהצלחה!',
    'schedule.form.name': 'שם מלא',
    'schedule.form.phone': 'מספר טלפון',
    'schedule.form.verification': 'קוד אימות',
    'schedule.form.verification.message': 'קוד אימות נשלח למספר הטלפון שלך',
    'schedule.form.send.code': 'שלח קוד אימות',
    'schedule.form.verify': 'אמת וקבע תור',

    // Contact
    'contact.title': 'צור קשר',
    'contact.form.name': 'שם',
    'contact.form.phone': 'טלפון',
    'contact.form.message': 'הודעה',
    'contact.form.send': 'שלח הודעה',
    'contact.form.success': 'ההודעה נשלחה בהצלחה!',

    // Footer
    'footer.links': 'קישורים מהירים',
    'footer.services': 'שירותים',
    'footer.follow': 'עקבו אחרינו',
    'footer.rights': 'כל הזכויות שמורות.',
    'footer.business.link': 'רוצה כזה לעסק שלך? לחץ כאן',

  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: React.ReactNode;
  defaultLanguage?: Language;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children, defaultLanguage = 'he' }) => {
  const [language, setLanguage] = useState<Language>(defaultLanguage);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <div dir={language === 'he' ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};