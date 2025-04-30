import React from 'react';
import { Routes, Route, useParams, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Portfolio from './components/Portfolio';
import Schedule from './components/Schedule';
import Contact from './components/Contact';
import Footer from './components/Footer';
import IntroPopup from './components/IntroPopup';
import ContactButton from './components/ContactButton';
import ErrorBoundary from './components/ErrorBoundary';
import NotFound from './components/NotFound';
import { useLanguage } from './contexts/LanguageContext';

// Website configuration
const websiteConfig = [{
  admin_id: "bdfgdfgfgdgd",
  businessName:"אריאל אדרי עיצוב שיער",
  logoImageName: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800",
  workingDays: [
    null, // Sunday - Closed
    "09:00-19:00", // Monday
    "09:00-19:00", // Tuesday
    "09:00-19:00", // Wednesday
    "09:00-19:00", // Thursday
    "09:00-14:00", // Friday
    null  // Saturday - Closed
  ],
  address: {
    state: "ישראל",
    city: "רמלה",
    street: "חטיבת גולני 6",
    other: "קומה 12"
  },
  contact: {
    phone: "+972537131173",
    mail: "contact@styletime.com"
  },
  social: {
    instagram: "https://www.instagram.com/ariel_edri.3/",
    facebook: "https://www.facebook.com/profile.php?id=100033295129831",
    x: "https://twitter.com/styletime",
    tiktok: "http://tiktoktiktok"
  },
  pallete: {
    dark: {
      primary: '#06B6D4',
      accent: {
        purple: '#A78BFA',
        teal: '#14B8A6',
        violet: '#8B5CF6',
        lime: '#84CC16',
        cyan: '#06B6D4'
      },
      bg: '#111827',
      surface: '#1F2937',
      gray: '#9CA3AF',
      text: '#F9FAFB'
    },
    light: {
      primary: '#8B5CF6',
      accent: {
        purple: '#A78BFA',
        teal: '#14B8A6',
        violet: '#8B5CF6',
        lime: '#84CC16',
        cyan: '#06B6D4'
      },
      bg: '#F9FAFB',
      surface: '#FFFFFF',
      gray: '#E5E7EB',
      text: '#374151'
    }
  },
  components: {
    navbar: {
      visible: true,
      darkMode: true,
      languageSwitcher: true,
      defaultLanguage: "he"
    },
    hero: {
      visible: true,
      title: "Transform",
      subtitle: "Journey",
      description: "Experience premium styling services tailored just for you. Let our expert stylists enhance your unique beauty and help you discover your perfect look.",
      heroImageSrc: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800"
    },
    about: {
      visible: true,
      title: "About StyleTime Studio",
      description: "Premium styling services for those who appreciate quality and excellence.",
      paragraphs: {
        intro: "Welcome to StyleTime Studio, where beauty meets expertise. Established in 2020, we've quickly become one of the most sought-after styling destinations in Fashion City.",
        mission: "With a team of internationally trained stylists and beauty experts, we pride ourselves on staying ahead of the latest trends while maintaining the highest standards of service and professionalism."
      },
      features: [
        {
          icon: "Star",
          title: "Premium Service",
          description: "Dedicated to providing exceptional styling experiences with attention to detail and personalized care for each client."
        },
        {
          icon: "Award",
          title: "Expert Stylists",
          description: "Our team of certified professionals brings years of experience and expertise, ensuring you receive the highest quality service."
        },
        {
          icon: "Users",
          title: "Happy Clients",
          description: "Thousands of satisfied customers trust us with their style needs, making us one of the most recommended studios in the area."
        }
      ]
    },
    portfolio: {
      visible: true,
      isGrid: false,
      title: "Our Latest Works",
      description: "Explore our collection of stunning transformations and beautiful styles created for our valued clients.",
      items: [
        {
          url: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=800",
          title: "Premium Styling",
          description: "Expert hair styling and coloring services"
        },
        {
          url: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&q=80&w=800",
          title: "Modern Techniques",
          description: "Latest trends and styling methods"
        },
        {
          url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800",
          title: "Personalized Care",
          description: "Tailored solutions for your unique style"
        },
        {
          url: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80&w=800",
          title: "Elegant Styling",
          description: "Sophisticated and timeless looks"
        },
        {
          url: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&q=80&w=800",
          title: "Creative Design",
          description: "Innovative and artistic approaches"
        },
        {
          url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800",
          title: "Luxury Experience",
          description: "Premium salon services and care"
        }
      ]
    },
    schedule: {
      title: "Schedule Your Visit",
      description: "Book your appointment with our expert stylists and take the first step towards your style transformation.",
      vacations: ["1755553-17852554"],
      minutesPerLine: 20,
      appointmentTypes: [
        {
          "_id": "6787b1f1a7c15f10bc6eb544d",
          "name": "תספורת גברים",
          "price": "60",
          "durationMS": "1800000"
        },
        {
          "_id": "6787b1f1a7c15f10bc6eb533d",
          "name": "תספורת נשים",
          "price": "250",
          "durationMS": "3600000"
        },
        {
          "_id": "6787b1f1a7c15f10bc6eb522d",
          "name": "תספורת ילדים",
          "price": "50",
          "durationMS": "1200000"
        }
      ]
    },
    contact: {
      visible: true,
      title: "Get in Touch",
      description: "Have questions or ready to book? Reach out to us and we'll get back to you shortly."
    },
    footer: {
      visible: true,
      description: "Premium styling services for those who appreciate quality and excellence. Your journey to perfect style begins here."
    },
    introPopup: {
      visible: true,
      value: "לקוחות יקרים בתאריכים הבאים המספרה תהיה סגורה עד 30.8"
    },
    contactButton: {
      visible: true
    }
  }
},
{
  admin_id: "123123123",
  logoImageName: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800",
  workingDays: [
    null,
    "09:00-19:00",
    "09:00-19:00",
    "09:00-19:00",
    "09:00-19:00",
    "09:00-14:00",
    null
  ],
  address: {
    state: "ישראל",
    city: "רמלה",
    street: "חטיבת גולני 6",
    other: "קומה 12"
  },
  contact: {
    phone: "+972537131173",
    mail: "contact@styletime.com"
  },
  social: {
    instagram: "https://www.instagram.com/ariel_edri.3/",
    facebook: "https://www.facebook.com/profile.php?id=100033295129831",
    x: "https://twitter.com/styletime",
    tiktok: "http://tiktoktiktok"
  },
  pallete: {
    dark: {
      primary: '#06B6D4',
      accent: {
        purple: '#A78BFA',
        teal: '#14B8A6',
        violet: '#8B5CF6',
        lime: '#84CC16',
        cyan: '#06B6D4'
      },
      bg: '#111827',
      surface: '#1F2937',
      gray: '#9CA3AF',
      text: '#F9FAFB'
    },
    light: {
      primary: '#8B5CF6',
      accent: {
        purple: '#A78BFA',
        teal: '#14B8A6',
        violet: '#8B5CF6',
        lime: '#84CC16',
        cyan: '#06B6D4'
      },
      bg: '#F9FAFB',
      surface: '#FFFFFF',
      gray: '#E5E7EB',
      text: '#374151'
    }
  },
  components: {
    navbar: {
      visible: true,
      darkMode: true,
      languageSwitcher: true,
      defaultLanguage: "he"
    },
    hero: {
      visible: true,
      title: "Transform Your",
      subtitle: "Style Journey",
      description: "Experience premium styling services tailored just for you. Let our expert stylists enhance your unique beauty and help you discover your perfect look.",
      heroImageSrc: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800"
    },
    about: {
      visible: true,
      title: "About StyleTime Studio",
      description: "Premium styling services for those who appreciate quality and excellence.",
      paragraphs: {
        intro: "Welcome to StyleTime Studio, where beauty meets expertise. Established in 2020, we've quickly become one of the most sought-after styling destinations in Fashion City.",
        mission: "With a team of internationally trained stylists and beauty experts, we pride ourselves on staying ahead of the latest trends while maintaining the highest standards of service and professionalism."
      },
      features: [
        {
          icon: "Star",
          title: "Premium Service",
          description: "Dedicated to providing exceptional styling experiences with attention to detail and personalized care for each client."
        },
        {
          icon: "Award",
          title: "Expert Stylists",
          description: "Our team of certified professionals brings years of experience and expertise, ensuring you receive the highest quality service."
        },
        {
          icon: "Users",
          title: "Happy Clients",
          description: "Thousands of satisfied customers trust us with their style needs, making us one of the most recommended studios in the area."
        }
      ]
    },
    portfolio: {
      visible: true,
      isGrid: false,
      title: "Our Latest Works",
      description: "Explore our collection of stunning transformations and beautiful styles created for our valued clients.",
      items: [
        {
          url: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=800",
          title: "Premium Styling",
          description: "Expert hair styling and coloring services"
        },
        {
          url: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&q=80&w=800",
          title: "Modern Techniques",
          description: "Latest trends and styling methods"
        },
        {
          url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800",
          title: "Personalized Care",
          description: "Tailored solutions for your unique style"
        },
        {
          url: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80&w=800",
          title: "Elegant Styling",
          description: "Sophisticated and timeless looks"
        },
        {
          url: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&q=80&w=800",
          title: "Creative Design",
          description: "Innovative and artistic approaches"
        },
        {
          url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800",
          title: "Luxury Experience",
          description: "Premium salon services and care"
        }
      ]
    },
    schedule: {
      title: "Schedule Your Visit",
      description: "Book your appointment with our expert stylists and take the first step towards your style transformation.",
      vacations: ["1755553-17852554"],
      minutesPerLine: 30,
      appointmentTypes: [
        {
          "_id": "6787b1f1a7c15f10bc6eb544d",
          "name": "תספורת גברים",
          "price": "60",
          "durationMS": "1800000"
        },
        {
          "_id": "6787b1f1a7c15f10bc6eb533d",
          "name": "תספורת נשים",
          "price": "250",
          "durationMS": "3600000"
        },
        {
          "_id": "6787b1f1a7c15f10bc6eb522d",
          "name": "תספורת ילדים",
          "price": "50",
          "durationMS": "1200000"
        }
      ]
    },
    contact: {
      visible: true,
      title: "Get in Touch",
      description: "Have questions or ready to book? Reach out to us and we'll get back to you shortly."
    },
    footer: {
      visible: true,
      logo: {
        text: "StyleTime",
        icon: "Calendar"
      },
      description: "Premium styling services for those who appreciate quality and excellence. Your journey to perfect style begins here.",
      services: [
        "footer.services.hair",
        "footer.services.makeup",
        "footer.services.nail",
        "footer.services.skin"
      ]
    },
    introPopup: {
      visible: true,
      value: "לקוחות יקרים בתאריכים הבאים המספרה תהיה סגורה עד 30.8"
    },
    contactButton: {
      visible: true
    }
  }
}];

function MainContent() {
  const { id } = useParams();
  const { setLanguage } = useLanguage();

  const config = websiteConfig.find(config => config.admin_id === id);
  console.log(id)
  useEffect(() => {
    if (!config) return;
    console.log(config)
    // Set initial language from config
    setLanguage(config.components.navbar.defaultLanguage as 'en' | 'he');
    
    // Load user preference from localStorage first
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      if (savedMode === 'true') {
        document.documentElement.classList.add('dark');
      } 
    } 

    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem('darkMode') === null) {
        if (e.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [config, setLanguage]);

  if (!config) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg transition-colors duration-300">
      {config.components?.introPopup.visible && (
        <ErrorBoundary>
          <IntroPopup />
        </ErrorBoundary>
      )}
      {config.components?.navbar.visible && (
        <ErrorBoundary>
          <Navbar websiteConfig={config} />
        </ErrorBoundary>
      )}
      {config.components?.hero.visible && (
        <ErrorBoundary>
          <Hero config={config.components.hero} />
        </ErrorBoundary>
      )}
      {config.components?.about.visible && (
        <ErrorBoundary>
          <About 
            config={config.components.about}
            websiteConfig={{
              address: config.address,
              contact: config.contact,
              social: config.social,
              workingDays: config.workingDays
            }}
          />
        </ErrorBoundary>
      )}
      {config.components?.portfolio.visible && (
        <ErrorBoundary>
          <Portfolio config={config.components.portfolio} />
        </ErrorBoundary>
      )}
      {config.components?.schedule && (
        <ErrorBoundary>
          <Schedule 
            config={config.components.schedule}
            workingDays={config.workingDays}
          />
        </ErrorBoundary>
      )}
      {config.components?.contact.visible && (
        <ErrorBoundary>
          <Contact 
            config={config.components.contact}
            address={config.address}
            contact={config.contact}
            workingDays={config.workingDays}
          />
        </ErrorBoundary>
      )}
      {config.components?.footer.visible && (
        <ErrorBoundary>
          <Footer 
            config={config.components.footer}
            appointmentsType={config.components.schedule.appointmentTypes}
            social={config.social}
            businessName={config.businessName}
            logoImageName={config.logoImageName}
            websiteConfig={config}
          />
        </ErrorBoundary>
      )}
      {config.components?.contactButton.visible && (
        <ErrorBoundary>
          <ContactButton />
        </ErrorBoundary>
      )}
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/bdfgdfgfgdgd" replace />} />
      <Route path="/:id" element={<MainContent />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;