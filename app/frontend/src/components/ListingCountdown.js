import React, { useState, useEffect } from 'react';

export const ListingCountdown = ({ expiryDate, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const expiry = new Date(expiryDate);
      const difference = expiry - now;

      if (difference <= 0) {
        if (onExpire) onExpire();
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [expiryDate, onExpire]);

  if (!timeLeft) return null;

  const isLastDay = timeLeft.days === 0;

  if (!isLastDay) {
    const expiryDateObj = new Date(expiryDate);
    const day = String(expiryDateObj.getDate()).padStart(2, '0');
    const month = expiryDateObj.toLocaleString('tr-TR', { month: 'long' });
    const year = expiryDateObj.getFullYear();

    return (
      <div className="flex flex-col items-center">
        <div className="text-[10px] sm:text-lg font-black text-white">
          {day} {month} {year}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className={`text-[10px] sm:text-lg font-black tabular-nums transition-colors duration-300 ${isLastDay ? 'text-red-500' : 'text-white'}`}>
        {String(timeLeft.hours).padStart(2, '0')}:
        {String(timeLeft.minutes).padStart(2, '0')}:
        {String(timeLeft.seconds).padStart(2, '0')}
      </div>
    </div>
  );
};

export default ListingCountdown;
