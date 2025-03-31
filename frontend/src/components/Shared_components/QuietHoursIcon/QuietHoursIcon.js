import React from 'react';
import { MicOff } from 'lucide-react'; // Importing MicOff icon from lucide-react

const QuietHoursIcon = () => {
  return (
    <div className="relative quietHours">
      {/* MicOff Icon (Mute) */}
      <MicOff size={80} strokeWidth={2.5} className="text-white" />
      
      {/* Slash Line */}
      <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
        <svg width="100%" height="100%" viewBox="0 0 80 80" className="absolute">
          <line x1="10" y1="10" x2="70" y2="70" stroke="red" strokeWidth="8" />
        </svg>
      </div>
    </div>
  );
};

export default QuietHoursIcon;
