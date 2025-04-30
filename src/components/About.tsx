import React from 'react';
import { Star, Award, Users, MapPin, Phone, Mail, Clock, Instagram, Facebook } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

interface AboutConfig {
  title: string;
  description: string;
  paragraphs: {
    intro: string;
    mission: string;
  };
  features: {
    icon: string;
    title: string;
    description: string;
  }[];
}

interface WebsiteConfig {
  address: {
    state: string;
    city: string;
    street: string;
    other: string;
  };
  contact: {
    phone: string;
    mail: string;
  };
  social: {
    instagram: string;
    facebook: string;
    x: string;
    tiktok: string;
  };
  workingDays: (string | null)[];
}

interface AboutProps {
  config: AboutConfig;
  websiteConfig: WebsiteConfig;
}

const About: React.FC<AboutProps> = ({ config, websiteConfig }) => {
  const { t, language } = useLanguage();

  const formatWorkingHours = () => {
    const days = language === 'he' 
      ? ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת']
      : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    return websiteConfig.workingDays
      .map((hours, index) => ({
        day: days[index],
        hours: hours === null 
          ? (language === 'he' ? 'סגור' : 'Closed')
          : language === 'he'
            ? hours
            : hours.split('-').map(time => {
                const [h, m] = time.split(':');
                const hour = parseInt(h);
                return `${hour > 12 ? hour - 12 : hour}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
              }).join(' - ')
      }))
      .filter(schedule => schedule.hours !== 'Closed' && schedule.hours !== 'סגור');
  };

  const getFullAddress = () => {
    return `${websiteConfig.address.street}, ${websiteConfig.address.other}, ${websiteConfig.address.city}, ${websiteConfig.address.state}`;
  };

  const socialLinks = [
    { 
      icon: Instagram, 
      href: websiteConfig.social.instagram,
      color: 'bg-[#F77EB9]/10 text-[#F77EB9] hover:bg-[#F77EB9] hover:text-white dark:hover:text-white'
    },
    { 
      icon: Facebook, 
      href: websiteConfig.social.facebook,
      color: 'bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white dark:hover:text-white'
    },
    { 
      icon: () => (
        <svg 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          className="h-5 w-5 text-white"
          aria-hidden="true"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      href: websiteConfig.social.x,
      color: 'bg-[#000000]/10 text-white dark:text-white hover:bg-[#000000]'
    },
    { 
      icon: () => (
        <svg 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          className="h-6 w-6 text-white"
          aria-hidden="true"
        >
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
        </svg>
      ),
      href: websiteConfig.social.tiktok,
      color: 'bg-[#000000]/10 text-white dark:text-white hover:bg-[#000000]'
    }
  ];

  const contactInfo = [
    { 
      icon: MapPin, 
      title: t('about.location'), 
      content: getFullAddress(),
      action: `https://maps.google.com/?q=${encodeURIComponent(getFullAddress())}`,
      isLink: true,
      color: 'bg-rose-500/10 text-rose-500 dark:text-rose-400'
    },
    { 
      icon: Phone, 
      title: t('about.phone'), 
      content: websiteConfig.contact.phone,
      action: `tel:${websiteConfig.contact.phone.replace(/[^0-9+]/g, '')}`,
      isLink: true,
      color: 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400'
    },
    { 
      icon: Mail, 
      title: t('about.email'), 
      content: websiteConfig.contact.mail,
      action: `mailto:${websiteConfig.contact.mail}`,
      isLink: true,
      color: 'bg-blue-500/10 text-blue-500 dark:text-blue-400'
    },
    { 
      icon: Clock, 
      title: t('about.hours'), 
      content: formatWorkingHours(),
      isLink: false,
      color: 'bg-amber-500/10 text-amber-500 dark:text-amber-400',
      isHours: true
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <section id="about" className="py-32 bg-gradient-to-b from-light-bg to-light-surface dark:from-dark-bg dark:to-dark-surface transition-colors duration-300">
      <motion.div 
        className="container mx-auto px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="text-center mb-20">
          <h2 className="text-4xl font-bold text-light-text dark:text-dark-text mb-6">{config.title}</h2>
          <div className="w-24 h-1 bg-primary dark:bg-primary-light mx-auto mb-8"></div>
          <p className="text-xl text-light-text/80 dark:text-dark-text/80">{config.description}</p>
        </motion.div>
        
        <motion.div 
          className="max-w-3xl mx-auto text-center mb-20"
          variants={itemVariants}
        >
          <p className="text-xl text-light-text dark:text-dark-text leading-relaxed mb-8">
            {config.paragraphs.intro}
          </p>
          <p className="text-lg text-light-text/80 dark:text-dark-text/80 leading-relaxed">
            {config.paragraphs.mission}
          </p>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-3 gap-12 mb-20"
          variants={containerVariants}
        >
          {config.features.map((feature, index) => (
            <motion.div
              key={index}
              className="group relative h-full"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="absolute inset-0 bg-primary/10 dark:bg-primary-light/10 rounded-2xl transform -rotate-6 group-hover:rotate-0 transition-transform"></div>
              <div className="relative bg-light-surface dark:bg-dark-surface p-8 rounded-2xl shadow-lg h-full flex flex-col">
                <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 dark:bg-primary-light/10 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
                  {feature.icon === 'Star' && <Star className="h-8 w-8 text-primary dark:text-primary-light" />}
                  {feature.icon === 'Award' && <Award className="h-8 w-8 text-primary dark:text-primary-light" />}
                  {feature.icon === 'Users' && <Users className="h-8 w-8 text-primary dark:text-primary-light" />}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-light-text dark:text-dark-text text-center">{feature.title}</h3>
                <p className="text-light-text/80 dark:text-dark-text/80 text-center flex-grow">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="relative"
          variants={itemVariants}
        >
          <div className="relative bg-light-surface dark:bg-dark-surface rounded-3xl shadow-2xl p-12 backdrop-blur-lg">
            <h3 className="text-3xl font-bold text-center mb-12 text-light-text dark:text-dark-text">
              {t('about.visit')}
              <div className="w-20 h-1 bg-primary dark:bg-primary-light mx-auto mt-4"></div>
            </h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {contactInfo.map((item, index) => (
                <motion.div
                  key={index}
                  className="h-full"
                  variants={itemVariants}
                >
                  <motion.div 
                    className="h-full p-6 rounded-2xl bg-light-surface dark:bg-dark-surface border-2 border-primary/10 dark:border-primary-light/10 shadow-lg flex flex-col items-center text-center"
                    whileHover={{ 
                      y: -5,
                      transition: { duration: 0.2 }
                    }}
                  >
                    <motion.div 
                      className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center mb-4`}
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <item.icon className="h-6 w-6" />
                    </motion.div>
                    <h4 className="font-semibold mb-2 text-light-text dark:text-dark-text">{item.title}</h4>
                    <div className="flex-grow flex items-center justify-center">
                      {item.isHours ? (
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-light-text/80 dark:text-dark-text/80">
                          {item.content.map((schedule: { day: string; hours: string }, idx: number) => (
                            <div key={idx} className="flex flex-col">
                              <div className="font-medium">{schedule.day}</div>
                              <div>{schedule.hours}</div>
                            </div>
                          ))}
                        </div>
                      ) : item.isLink ? (
                        <a 
                          href={item.action}
                          className="text-light-text/80 dark:text-dark-text/80 hover:text-primary dark:hover:text-primary-light transition-colors"
                          target={item.icon === MapPin ? "_blank" : undefined}
                          rel={item.icon === MapPin ? "noopener noreferrer" : undefined}
                        >
                          {item.content}
                        </a>
                      ) : (
                        <p className="text-light-text/80 dark:text-dark-text/80 whitespace-pre-line">{item.content}</p>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 flex justify-center space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 rounded-xl transition-colors ${social.color}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {typeof social.icon === 'function' ? 
                    <social.icon /> : 
                    <social.icon className="h-6 w-6" />
                  }
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default About;