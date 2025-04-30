import React, { useState, useCallback, memo } from 'react';
import { Calendar as CalendarIcon, Clock, CheckCircle, ChevronLeft, ChevronRight, Phone, User, Shield, ArrowRight, Scissors } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

interface AppointmentType {
  _id: string;
  name: string;
  price: string;
  durationMS: string;
}

interface Appointment {
  _id: string;
  type: AppointmentType;
  name: string;
  phone: string;
  timestamp: string;
}

interface BookingFormData {
  name: string;
  phone: string;
  verificationCode: string;
}

interface ScheduleConfig {
  title: string;
  description: string;
  vacations: string[];
  appointmentTypes: AppointmentType[];
  minutesPerLine: number;
}

interface ScheduleProps {
  config: ScheduleConfig;
  workingDays: (string | null)[];
}

const MaterialInput = memo(({ 
  icon: Icon, 
  label, 
  value, 
  onChange, 
  type = "text",
  required = true,
  placeholder = "",
  name,
  id
}) => (
  <div className="relative pt-2">
    <label 
      htmlFor={id}
      className="absolute left-10 -top-0 px-2 text-sm font-medium text-primary dark:text-primary-light bg-light-surface dark:bg-dark-surface"
    >
      {label}
    </label>
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Icon className="h-5 w-5 text-primary dark:text-primary-light" aria-hidden="true" />
    </div>
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      name={name}
      className="w-full pl-10 pr-4 py-3 bg-transparent border-2 border-primary/30 dark:border-primary-light/30 focus:border-primary dark:focus:border-primary-light rounded-lg transition-all outline-none text-light-text dark:text-dark-text placeholder-light-text/50 dark:placeholder-dark-text/50"
      aria-required={required}
      aria-invalid={!value && required}
    />
  </div>
));

MaterialInput.displayName = 'MaterialInput';

const DateButton = memo(({ 
  date, 
  isPast, 
  isSelected, 
  isToday, 
  isAvailable, 
  isNextMonth,
  formatSelectedDate, 
  language, 
  handleDateSelect 
}) => (
  <motion.button
    type="button"
    onClick={() => !isPast(date) && handleDateSelect(date)}
    className={`w-full h-full rounded-lg text-sm font-medium flex items-center justify-center transition-colors ${
      isPast(date)
        ? 'text-light-text/30 dark:text-dark-text/30 cursor-not-allowed'
        : isSelected(date)
        ? 'bg-primary dark:bg-primary-light text-white'
        : isToday(date)
        ? `ring-2 ring-primary dark:ring-primary-light ${
            isAvailable(date)
              ? 'text-primary dark:text-primary-light hover:bg-light-gray dark:hover:bg-dark-gray'
              : 'text-light-text/50 dark:text-dark-text/50'
          }`
        : isNextMonth(date)
        ? isAvailable(date)
          ? 'bg-primary/5 dark:bg-primary-light/5 hover:bg-primary/10 dark:hover:bg-primary-light/10 text-primary dark:text-primary-light ring-1 ring-primary/20 dark:ring-primary-light/20'
          : 'bg-light-gray/30 dark:bg-dark-gray/30 text-light-text/30 dark:text-dark-text/30 cursor-not-allowed'
        : isAvailable(date)
        ? 'hover:bg-light-gray dark:hover:bg-dark-gray text-light-text dark:text-dark-text'
        : 'text-light-text/30 dark:text-dark-text/30 cursor-not-allowed'
    }`}
    whileHover={!isPast(date) && isAvailable(date) && { 
      scale: isNextMonth(date) ? 1.05 : 1.1,
      transition: { 
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }}
    whileTap={!isPast(date) && isAvailable(date) && { scale: 0.9 }}
    disabled={isPast(date) || !isAvailable(date)}
    aria-label={`${formatSelectedDate(date)}${
      isPast(date) 
        ? ' - Past date' 
        : isAvailable(date) 
          ? ' - Available'
          : ' - Not available'
    }`}
    aria-selected={isSelected(date)}
    aria-disabled={isPast(date) || !isAvailable(date)}
  >
    {date.getDate()}
  </motion.button>
));

DateButton.displayName = 'DateButton';

const Schedule: React.FC<ScheduleProps> = ({ config, workingDays }) => {
  const { t, language } = useLanguage();
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedAppointmentType, setSelectedAppointmentType] = useState<AppointmentType | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingStep, setBookingStep] = useState<'date' | 'type' | 'time' | 'details' | 'verification'>('date');
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    phone: '',
    verificationCode: ''
  });
  const [bookedAppointments] = useState<Appointment[]>([]);

  const isTimeSlotBooked = useCallback((date: Date, timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const timestamp = new Date(date);
    timestamp.setHours(hours, minutes, 0, 0);
    const slotTime = timestamp.getTime();

    return bookedAppointments.some(appointment => {
      const appointmentStart = parseInt(appointment.timestamp);
      const appointmentEnd = appointmentStart + parseInt(appointment.type.durationMS);
      return slotTime >= appointmentStart && slotTime < appointmentEnd;
    });
  }, [bookedAppointments]);

  const isTimeInVacation = useCallback((date: Date, timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const timestamp = new Date(date);
    timestamp.setHours(hours, minutes, 0, 0);
    const epochTime = Math.floor(timestamp.getTime() / 1000);

    return config.vacations.some(vacation => {
      const [start, end] = vacation.split('-').map(Number);
      return epochTime >= start && epochTime <= end;
    });
  }, [config.vacations]);

  const generateTimeSlots = useCallback((date: Date) => {
    const dayOfWeek = date.getDay();
    const workingHours = workingDays[dayOfWeek];
    
    if (!workingHours) return [];

    const [start, end] = workingHours.split('-');
    const [startHour, startMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);

    const startTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;
    const slots = [];

    for (let time = startTime; time <= endTime; time += config.minutesPerLine) {
      const hour = Math.floor(time / 60);
      const minute = time % 60;
      const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      
      if (!isTimeInVacation(date, timeStr) && !isTimeSlotBooked(date, timeStr)) {
        slots.push(timeStr);
      }
    }

    return slots;
  }, [workingDays, config.minutesPerLine, isTimeInVacation, isTimeSlotBooked]);

  const isPast = useCallback((date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  }, []);

  const isSelected = useCallback((date: Date) => {
    if (!selectedDate) return false;
    return date.getTime() === selectedDate.getTime();
  }, [selectedDate]);

  const isToday = useCallback((date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }, []);

  const isAvailable = useCallback((date: Date) => {
    const dayIndex = date.getDay();
    if (workingDays[dayIndex] === null) return false;
    return generateTimeSlots(date).length > 0;
  }, [workingDays, generateTimeSlots]);

  const isNextMonth = useCallback((date: Date) => {
    return date.getMonth() > currentMonth.getMonth();
  }, [currentMonth]);

  const isCurrentMonth = useCallback(() => {
    const today = new Date();
    return currentMonth.getMonth() === today.getMonth() && 
           currentMonth.getFullYear() === today.getFullYear();
  }, [currentMonth]);

  const formatSelectedDate = useCallback((date: Date) => {
    return date.toLocaleDateString(language === 'he' ? 'he-IL' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, [language]);

  const handleDateSelect = useCallback((date: Date) => {
    if (!isPast(date) && isAvailable(date)) {
      if (isNextMonth(date)) {
        setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1));
      }
      setSelectedDate(date);
      setBookingStep('type');
    }
  }, [isPast, isAvailable, isNextMonth]);

  const handleAppointmentTypeSelect = useCallback((type: AppointmentType) => {
    setSelectedAppointmentType(type);
    setSelectedTime('');
    setBookingStep('time');
  }, []);

  const handleTimeSelect = useCallback((time: string) => {
    setSelectedTime(time);
    setBookingStep('details');
  }, []);

  const handleDetailsSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setBookingStep('verification');
  }, [formData]);

  const handleVerificationSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.verificationCode || !selectedDate || !selectedTime || !selectedAppointmentType) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
    
    setTimeout(() => {
      setIsSuccess(false);
      setSelectedDate(null);
      setSelectedTime('');
      setSelectedAppointmentType(null);
      setBookingStep('date');
      setFormData({
        name: '',
        phone: '',
        verificationCode: ''
      });
    }, 3000);
  }, [formData, selectedDate, selectedTime, selectedAppointmentType]);

  const handleBack = useCallback(() => {
    switch (bookingStep) {
      case 'type':
        setSelectedDate(null);
        setBookingStep('date');
        break;
      case 'time':
        setSelectedAppointmentType(null);
        setBookingStep('type');
        break;
      case 'details':
        setSelectedTime('');
        setBookingStep('time');
        break;
      case 'verification':
        setBookingStep('details');
        break;
    }
  }, [bookingStep]);

  const getDayNames = useCallback(() => {
    const days = [];
    const firstDayOfWeek = new Date();
    firstDayOfWeek.setDate(firstDayOfWeek.getDate() - firstDayOfWeek.getDay());

    for (let i = 0; i < 7; i++) {
      const date = new Date(firstDayOfWeek);
      date.setDate(firstDayOfWeek.getDate() + i);
      days.push(
        new Intl.DateTimeFormat(language === 'he' ? 'he-IL' : 'en-US', { 
          weekday: 'short' 
        }).format(date)
      );
    }
    return days;
  }, [language]);

  const generateCalendarDays = useCallback(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days = [];
    
    // Add empty slots for days before the first of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square" />);
    }
    
    // Add current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push(
        <div key={`day-${i}`} className="aspect-square">
          <DateButton
            date={date}
            isPast={isPast}
            isSelected={isSelected}
            isToday={isToday}
            isAvailable={isAvailable}
            isNextMonth={isNextMonth}
            formatSelectedDate={formatSelectedDate}
            language={language}
            handleDateSelect={handleDateSelect}
          />
        </div>
      );
    }

    // Add first 3 days of next month if we're in last 5 days
    const today = new Date();
    const isLastFiveDays = today.getMonth() === month && 
                          today.getDate() > daysInMonth - 5;

    if (isLastFiveDays) {
      for (let i = 1; i <= 3; i++) {
        const date = new Date(year, month + 1, i);
        days.push(
          <div key={`next-${i}`} className="aspect-square">
            <DateButton
              date={date}
              isPast={isPast}
              isSelected={isSelected}
              isToday={isToday}
              isAvailable={isAvailable}
              isNextMonth={isNextMonth}
              formatSelectedDate={formatSelectedDate}
              language={language}
              handleDateSelect={handleDateSelect}
            />
          </div>
        );
      }
    }

    return days;
  }, [
    currentMonth,
    language,
    isPast,
    isSelected,
    isToday,
    isAvailable,
    isNextMonth,
    formatSelectedDate,
    handleDateSelect
  ]);

  return (
    <section id="schedule" className="py-32 bg-gradient-to-b from-light-bg to-light-surface dark:from-dark-bg dark:to-dark-surface transition-colors duration-300">
      <motion.div className="container mx-auto px-4">
        <motion.div className="text-center mb-20">
          <h2 className="text-4xl font-bold text-light-text dark:text-dark-text mb-6">
            {config.title}
          </h2>
          <div className="w-24 h-1 bg-primary dark:bg-primary-light mx-auto mb-8"></div>
          <p className="text-xl text-light-text/80 dark:text-dark-text/80 max-w-2xl mx-auto">
            {config.description}
          </p>
        </motion.div>

        <motion.div className="max-w-[700px] mx-auto">
          <motion.div className="bg-light-surface dark:bg-dark-surface rounded-3xl shadow-xl p-6 md:p-8">
            {bookingStep !== 'date' && (
              <motion.button
                type="button"
                onClick={handleBack}
                className="mb-6 text-primary dark:text-primary-light hover:underline flex items-center gap-2"
                whileHover={{ x: -5 }}
              >
                <ChevronLeft className={`h-5 w-5 ${language === 'he' ? 'rotate-180' : ''}`} />
                {language === 'he' ? 'חזור' : 'Back'}
              </motion.button>
            )}

            <div className="flex items-center justify-center gap-2 mb-8">
              {['date', 'type', 'time', 'details', 'verification'].map((step, index) => (
                <div
                  key={step}
                  className={`h-2 rounded-full transition-all ${
                    index === ['date', 'type', 'time', 'details', 'verification'].indexOf(bookingStep)
                      ? 'w-8 bg-primary dark:bg-primary-light'
                      : 'w-2 bg-primary/30 dark:bg-primary-light/30'
                  }`}
                />
              ))}
            </div>

            {bookingStep === 'date' && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <motion.button
                    type="button"
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                    className={`p-2 rounded-lg transition-colors ${
                      isCurrentMonth()
                        ? 'opacity-30 cursor-not-allowed'
                        : 'hover:bg-light-gray dark:hover:bg-dark-gray'
                    }`}
                    whileHover={!isCurrentMonth() ? { scale: 1.1 } : undefined}
                    whileTap={!isCurrentMonth() ? { scale: 0.9 } : undefined}
                    disabled={isCurrentMonth()}
                  >
                    <ChevronLeft className={`h-5 w-5 text-light-text dark:text-dark-text ${language === 'he' ? 'rotate-180' : ''}`} />
                  </motion.button>
                  <h3 className="text-xl font-semibold text-light-text dark:text-dark-text">
                    {currentMonth.toLocaleDateString(language === 'he' ? 'he-IL' : 'en-US', { 
                      month: 'long',
                      year: 'numeric'
                    })}
                  </h3>
                  <motion.button
                    type="button"
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                    className="p-2 hover:bg-light-gray dark:hover:bg-dark-gray rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ChevronRight className={`h-5 w-5 text-light-text dark:text-dark-text ${language === 'he' ? 'rotate-180' : ''}`} />
                  </motion.button>
                </div>

                <div className="grid grid-cols-7 gap-2 mb-2">
                  {getDayNames().map((day, index) => (
                    <div 
                      key={index}
                      className="text-center text-light-text/60 dark:text-dark-text/60 text-sm font-medium"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {generateCalendarDays()}
                </div>
              </>
            )}

            {bookingStep === 'type' && selectedDate && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-semibold text-light-text dark:text-dark-text mb-6">
                  {language === 'he' ? 'בחר סוג תספורת' : 'Select haircut type'}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {config.appointmentTypes.map((type) => (
                    <motion.button
                      key={type._id}
                      type="button"
                      onClick={() => handleAppointmentTypeSelect(type)}
                      className="p-6 rounded-xl bg-light-gray/30 dark:bg-dark-gray/30 hover:bg-primary/10 dark:hover:bg-primary-light/10 transition-colors group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 dark:bg-primary-light/10 flex items-center justify-center group-hover:bg-primary/20 dark:group-hover:bg-primary-light/20">
                          <Scissors className="h-6 w-6 text-primary dark:text-primary-light" />
                        </div>
                        <div className="flex-1 text-right">
                          <h4 className="font-semibold text-light-text dark:text-dark-text mb-1">
                            {type.name}
                          </h4>
                          <p className="text-sm text-light-text/70 dark:text-dark-text/70">
                            {parseInt(type.durationMS) / 60000} {language === 'he' ? 'דקות' : 'minutes'} | ₪{type.price}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {bookingStep === 'time' && selectedDate && selectedAppointmentType && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="p-4 rounded-lg bg-light-gray/30 dark:bg-dark-gray/30">
                  <h4 className="font-semibold text-light-text dark:text-dark-text mb-1">
                    {selectedAppointmentType.name}
                  </h4>
                  <p className="text-sm text-light-text/70 dark:text-dark-text/70">
                    {parseInt(selectedAppointmentType.durationMS) / 60000} {language === 'he' ? 'דקות' : 'minutes'} | ₪{selectedAppointmentType.price}
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
                    {t('schedule.available.times')} {formatSelectedDate(selectedDate)}
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {generateTimeSlots(selectedDate).map((time) => (
                      <motion.button
                        key={time}
                        type="button"
                        onClick={() => handleTimeSelect(time)}
                        className={`relative overflow-hidden p-3 rounded-xl text-sm font-medium ${
                          selectedTime === time
                            ? 'bg-primary dark:bg-primary-light text-white dark:text-dark-surface shadow-lg'
                            : 'bg-primary/10 dark:bg-primary-light/10 text-primary dark:text-primary-light hover:shadow-md'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                          initial={{ x: '-100%' }}
                          whileHover={{ x: '100%' }}
                          transition={{ duration: 0.3 }}
                        />
                        <span className="relative flex items-center justify-center gap-2">
                          <Clock className="h-4 w-4" />
                          {time}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {bookingStep === 'details' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                <form onSubmit={handleDetailsSubmit}>
                  <MaterialInput
                    icon={User}
                    label={t('schedule.form.name')}
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    name="name"
                    id="schedule-name"
                  />

                  <div className="mt-6">
                    <MaterialInput
                      icon={Phone}
                      label={t('schedule.form.phone')}
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      type="tel"
                      name="phone"
                      id="schedule-phone"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    className="w-full mt-8 bg-primary dark:bg-primary-light text-white dark:text-dark-surface py-4 px-6 rounded-xl hover:bg-primary-dark dark:hover:bg-primary-light transition-all relative overflow-hidden shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting || !formData.name || !formData.phone}
                  >
                    <span className="relative">{t('schedule.form.send.code')}</span>
                  </motion.button>
                </form>
              </motion.div>
            )}

            {bookingStep === 'verification' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <form onSubmit={handleVerificationSubmit}>
                  <MaterialInput
                    icon={Shield}
                    label={t('schedule.form.verification')}
                    value={formData.verificationCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, verificationCode: e.target.value }))}
                    name="verificationCode"
                    id="schedule-verification"
                  />

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-light-text/60 dark:text-dark-text/60 text-center mt-4"
                  >
                    {t('schedule.form.verification.message')}
                  </motion.p>

                  <motion.button
                    type="submit"
                    className="w-full mt-8 bg-primary dark:bg-primary-light text-white dark:text-dark-surface py-4 px-6 rounded-xl hover:bg-primary-dark dark:hover:bg-primary-light transition-all relative overflow-hidden shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting || !formData.verificationCode}
                  >
                    <span className="relative">{t('schedule.form.verify')}</span>
                  </motion.button>
                </form>
              </motion.div>
            )}

            <AnimatePresence>
              {isSuccess && (
                <motion.div
                  className="mt-6 text-emerald-500 dark:text-emerald-400 text-center flex items-center justify-center space-x-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <CheckCircle className="h-5 w-5" />
                  <span>{t('schedule.success')}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Schedule;