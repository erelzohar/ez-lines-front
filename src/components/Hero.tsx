import React, { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

interface HeroConfig {
  title: string;
  subtitle: string;
  description: string;
  heroImageSrc: string;
}

interface HeroProps {
  config: HeroConfig;
}

const Hero: React.FC<HeroProps> = ({ config }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const backgroundControls = useAnimation();
  const { t, language } = useLanguage();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const moveX = clientX - window.innerWidth / 2;
      const moveY = clientY - window.innerHeight / 2;
      setMousePosition({ x: moveX, y: moveY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const particles = Array.from({ length: 30 }, (_, i) => {
    const x = 10 + Math.random() * 80;
    const y = 10 + Math.random() * 80;
    return {
      id: i,
      x,
      y,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 15 + 15,
      delay: Math.random() * 2,
    };
  });

  return (
    <section 
      id="home" 
      className="min-h-screen relative overflow-hidden"
      aria-label="Welcome to StyleTime"
    >
      <div 
        className="absolute inset-0 bg-light-bg dark:bg-dark-bg transition-colors duration-300"
        aria-hidden="true"
      />
      
      <div className="absolute inset-0" aria-hidden="true">
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0"
            initial={{ opacity: 0.5 }}
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 0],
              opacity: [0.5, 0.7, 0.5],
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Infinity,
              delay: i * 5,
              ease: "linear",
            }}
            style={{
              background: `radial-gradient(circle at ${50 + i * 25}% ${50 + i * 25}%, rgba(${i === 0 ? '37, 99, 235' : i === 1 ? '20, 184, 166' : '167, 139, 250'}, 0.3) 0%, transparent 50%)`,
            }}
          />
        ))}
      </div>

      <motion.div
        className="absolute inset-0 opacity-70"
        animate={{
          background: [
            'radial-gradient(circle at 0% 0%, rgba(37, 99, 235, 0.6) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(20, 184, 166, 0.6) 0%, transparent 50%)',
            'radial-gradient(circle at 100% 0%, rgba(167, 139, 250, 0.6) 0%, transparent 50%), radial-gradient(circle at 0% 100%, rgba(96, 165, 250, 0.6) 0%, transparent 50%)',
            'radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.6) 0%, transparent 50%), radial-gradient(circle at 0% 0%, rgba(20, 184, 166, 0.6) 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear",
        }}
        aria-hidden="true"
      />

      <motion.div
        className="absolute inset-0 opacity-0 dark:opacity-60 pointer-events-none"
        animate={{
          background: `radial-gradient(circle 600px at ${mousePosition.x + window.innerWidth/2}px ${mousePosition.y + window.innerHeight/2}px, rgba(96, 165, 250, 0.25), transparent 60%)`,
        }}
        transition={{ type: "spring", damping: 15 }}
        aria-hidden="true"
      />

      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-primary/60 dark:bg-primary-light/40 rounded-full"
            initial={{ 
              x: `${particle.x}%`, 
              y: `${particle.y}%`,
              opacity: 0,
            }}
            animate={{
              x: [
                `${particle.x}%`,
                `${particle.x + (Math.random() * 10 - 5)}%`,
                `${particle.x}%`
              ],
              y: [
                `${particle.y}%`,
                `${particle.y + (Math.random() * 10 - 5)}%`,
                `${particle.y}%`
              ],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "linear",
            }}
            style={{ 
              width: particle.size, 
              height: particle.size,
              filter: 'blur(0.5px)',
            }}
          />
        ))}
      </div>

      <motion.div
        className="container mx-auto px-4 pt-16 md:pt-32 pb-20 relative"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12">
          <motion.div className="flex-1 text-center md:text-right" variants={containerVariants}>
            {/* Desktop content */}
            <div className="hidden md:block">
              <motion.h1 
                className="text-5xl md:text-7xl font-bold text-light-text dark:text-dark-text mb-8 leading-tight"
                variants={itemVariants}
              >
                {config.title} 
                <span className="block text-primary dark:text-primary-light">{config.subtitle}</span>
              </motion.h1>

              <motion.p 
                className="text-xl text-light-text/80 dark:text-dark-text/80 mb-12 max-w-2xl md:mr-0 md:ml-auto"
                variants={itemVariants}
              >
                {config.description}
              </motion.p>

              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center md:justify-end" 
                variants={itemVariants}
                role="group"
                aria-label="Call to action"
              >
                <motion.a
                  href="#schedule"
                  className="group relative inline-flex items-center justify-center px-8 py-4 bg-primary dark:bg-primary-light text-white dark:text-dark-surface rounded-full shadow-lg hover:shadow-xl overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  role="button"
                  aria-label="Book an appointment"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary via-accent-violet to-primary dark:from-primary-light dark:via-accent-cyan dark:to-primary-light"
                    animate={{
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    style={{
                      backgroundSize: '200% 100%',
                    }}
                    aria-hidden="true"
                  />
                  
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "loop",
                      ease: "linear",
                      repeatDelay: 3
                    }}
                    aria-hidden="true"
                  />
                  
                  <span className="relative flex items-center justify-center gap-2">
                    <span>{t('hero.book')}</span>
                    <motion.div
                      initial="initial"
                      whileHover="hover"
                      variants={{
                        initial: { x: 0 },
                        hover: { x: language === 'he' ? -5 : 5 }
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20
                      }}
                    >
                      <Calendar 
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </motion.div>
                  </span>
                </motion.a>
                
                <motion.a
                  href="#portfolio"
                  className="inline-flex items-center justify-center px-8 py-4 bg-light-surface dark:bg-dark-surface border-2 border-primary dark:border-primary-light text-primary dark:text-primary-light rounded-full hover:bg-primary/5 dark:hover:bg-primary-light/5 transition-colors shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  role="button"
                  aria-label="View our portfolio"
                >
                  {t('hero.portfolio')}
                </motion.a>
              </motion.div>
            </div>
          </motion.div>

          <motion.div 
            className="flex-1 relative w-full md:w-auto pt-6 md:pt-0"
            variants={itemVariants}
          >
            <div className="max-w-[200px] sm:max-w-[220px] md:max-w-none mx-auto">
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent-teal/20 dark:from-primary-light/10 dark:to-accent-cyan/10 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 90, 0],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "linear",
                }}
                aria-hidden="true"
              />
              
              <motion.div
                className="relative"
                animate={{
                  y: [-8, 8, -8],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
              >
                <motion.img
                  src={config.heroImageSrc}
                  alt="intro"
                  className="relative w-full aspect-square object-cover rounded-full border-4 border-white dark:border-dark-surface shadow-2xl"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
              </motion.div>
            </div>

            {/* Mobile content */}
            <div className="md:hidden mt-6 text-center px-4">
              <motion.div variants={itemVariants} className="space-y-6 mb-8">
                <motion.h1 
                  className="text-4xl font-bold text-light-text dark:text-dark-text leading-tight"
                  variants={itemVariants}
                >
                  {config.title} 
                  <span className="block text-primary dark:text-primary-light">{config.subtitle}</span>
                </motion.h1>

                <motion.p 
                  className="text-lg text-light-text/80 dark:text-dark-text/80 mx-auto"
                  variants={itemVariants}
                >
                  {config.description}
                </motion.p>
              </motion.div>

              <motion.a
                href="#schedule"
                className="group relative inline-flex items-center justify-center w-full px-8 py-4 bg-primary dark:bg-primary-light text-white dark:text-dark-surface rounded-full shadow-lg hover:shadow-xl overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                role="button"
                aria-label="Book an appointment"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary via-accent-violet to-primary dark:from-primary-light dark:via-accent-cyan dark:to-primary-light"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{
                    backgroundSize: '200% 100%',
                  }}
                  aria-hidden="true"
                />
                
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "linear",
                    repeatDelay: 3
                  }}
                  aria-hidden="true"
                />
                
                <span className="relative flex items-center justify-center gap-2">
                  <span>{t('hero.book')}</span>
                  <motion.div
                    initial="initial"
                    whileHover="hover"
                    variants={{
                      initial: { x: 0 },
                      hover: { x: language === 'he' ? -5 : 5 }
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20
                    }}
                  >
                    <Calendar 
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                  </motion.div>
                </span>
              </motion.a>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;