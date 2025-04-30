import React from 'react';
import { Instagram, Facebook } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

interface FooterConfig {
  description: string;
}

interface SocialConfig {
  instagram: string;
  facebook: string;
  x: string;
  tiktok: string;
}

interface FooterProps {
  config: FooterConfig;
  social: SocialConfig;
  businessName: string;
  logoImageName: string;
  appointmentsType:{
    _id: string;
    name: string;
    price: string;
    durationMS: string;
  }[];
  websiteConfig: {
    components: {
      about: { visible: boolean };
      portfolio: { visible: boolean };
      contact: { visible: boolean };
    };
  };
}

const Footer: React.FC<FooterProps> = ({ config, social, businessName, logoImageName, appointmentsType, websiteConfig }) => {
  const { t, language } = useLanguage();

  const menuItems = [
    { href: "#about", label: t('nav.about'), visible: websiteConfig.components.about.visible },
    { href: "#portfolio", label: t('nav.portfolio'), visible: websiteConfig.components.portfolio.visible },
    { href: "#schedule", label: t('nav.schedule'), visible: true },
    { href: "#contact", label: t('nav.contact'), visible: websiteConfig.components.contact.visible }
  ].filter(item => item.visible === undefined || item.visible);

  const socialLinks = [
    { 
      icon: Instagram, 
      href: social.instagram,
      color: 'bg-[#F77EB9]/10 text-[#F77EB9] hover:bg-[#F77EB9] hover:text-white dark:hover:text-white',
      label: 'Follow us on Instagram'
    },
    { 
      icon: Facebook, 
      href: social.facebook,
      color: 'bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white dark:hover:text-white',
      label: 'Follow us on Facebook'
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
      href: social.x,
      color: 'bg-[#000000]/10 hover:bg-[#000000]',
      label: 'Follow us on Twitter'
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
      href: social.tiktok,
      color: 'bg-[#000000]/10 hover:bg-[#000000]',
      label: 'Follow us on TikTok'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer 
      className="bg-dark-surface text-dark-text pt-20 pb-10"
      role="contentinfo"
      aria-label="Site footer"
    >
      <motion.div 
        className="container mx-auto px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <motion.div variants={itemVariants} className="text-center md:text-right">
            <div className="flex items-center justify-center md:justify-start space-x-2 mb-6">
              <img 
                src={logoImageName} 
                alt="Logo" 
                className="h-8 w-8 rounded-full object-cover"
              />
              <span className="text-2xl font-bold">{businessName}</span>
            </div>
            <p className="text-dark-text/80 leading-relaxed">
              {config.description}
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="text-center md:text-right">
            <h3 
              className="text-lg font-semibold mb-6"
              id="footer-social"
            >
              {t('footer.follow')}
            </h3>
            <div 
              className="flex justify-center md:justify-start space-x-4"
              role="list"
              aria-labelledby="footer-social"
            >
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${social.color}`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  role="listitem"
                  aria-label={social.label}
                >
                  {typeof social.icon === 'function' ? 
                    <social.icon /> : 
                    <social.icon className="h-5 w-5" aria-hidden="true" />
                  }
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="text-center md:text-right">
            <h3 
              className="text-lg font-semibold mb-6"
              id="footer-links"
            >
              {t('footer.links')}
            </h3>
            <nav aria-labelledby="footer-links">
              <ul className="space-y-4" role="list">
                <motion.li whileHover={{ x: 5 }} role="listitem">
                    <button
                      onClick={handleScrollToTop}
                      className="text-dark-text/80 hover:text-primary-light transition-colors"
                    >
                      {t('nav.home')}
                    </button>
                  </motion.li>
                {menuItems.map((item, index) => (
                  <motion.li key={index} whileHover={{ x: 5 }} role="listitem">
                    <a 
                      href={item.href}
                      className="text-dark-text/80 hover:text-primary-light transition-colors"
                    >
                      {item.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>
          </motion.div>

          <motion.div variants={itemVariants} className="text-center md:text-right">
            <h3 
              className="text-lg font-semibold mb-6"
              id="footer-services"
            >
              {t('footer.services')}
            </h3>
            <ul className="space-y-4" role="list" aria-labelledby="footer-services">
              {appointmentsType.map((app, index) => (
                <motion.li 
                  key={index}
                  className="text-dark-text/80"
                  whileHover={{ x: 5 }}
                  role="listitem"
                >
                  {app.name}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div 
          className="border-t border-dark-bg pt-8 text-center text-dark-text/60 space-y-2"
          variants={itemVariants}
        >
          <p>
            &copy; {new Date().getFullYear()} {businessName}. {t('footer.rights')}
          </p>
          <motion.a
            href="https://stackblitz.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-primary-light hover:text-primary transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Create your own business website with StackBlitz"
          >
            {t('footer.business.link')}
          </motion.a>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;