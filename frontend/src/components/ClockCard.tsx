import { Clock, Trash2, Sun, Moon } from 'lucide-react';
import { TimeZoneLocation } from '../App';

interface ClockCardProps {
  location: TimeZoneLocation;
  currentTime: Date;
  onRemove: () => void;
}

export function ClockCard({ location, currentTime, onRemove }: ClockCardProps) {
  // Calculate time for the timezone
  const getTimeInZone = () => {
    const utc = currentTime.getTime() + (currentTime.getTimezoneOffset() * 60000);
    const zoneTime = new Date(utc + (3600000 * location.utcOffset));
    return zoneTime;
  };

  const zoneTime = getTimeInZone();
  const hours = zoneTime.getHours();
  const minutes = zoneTime.getMinutes();
  const seconds = zoneTime.getSeconds();
  const isDaytime = hours >= 6 && hours < 18;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div 
      className="p-6 rounded-lg transition-all duration-300 hover:translate-y-[-4px] relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #16674E 0%, #E62B17 100%)',
        boxShadow: '0 6px 16px rgba(67, 59, 131, 0.4)'
      }}
    >
      {/* Background Icon */}
      <div className="absolute top-4 right-4 opacity-10">
        {isDaytime ? <Sun className="w-24 h-24 text-white" /> : <Moon className="w-24 h-24 text-white" />}
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div>
          <h3 className="text-white mb-1" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
            {location.city}
          </h3>
          <p className="text-white/80">{location.country}</p>
        </div>
        <button
          onClick={onRemove}
          className="p-2 rounded-lg text-white transition-all duration-300 hover:opacity-90"
          style={{ 
            background: '#E62B17',
            boxShadow: '0 2px 6px rgba(230, 43, 23, 0.3)'
          }}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Digital Clock Display */}
      <div className="mb-4 relative z-10">
        <div 
          className="text-white text-center py-6 rounded-lg"
          style={{ 
            background: 'rgba(0, 0, 0, 0.2)',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
          }}
        >
          {formatTime(zoneTime)}
        </div>
      </div>

      {/* Date and Info */}
      <div className="space-y-2 relative z-10">
        <div className="flex items-center justify-between text-white/90 text-sm">
          <span>{formatDate(zoneTime)}</span>
          <div className="flex items-center gap-1">
            {isDaytime ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span>{isDaytime ? 'Day' : 'Night'}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-white/80 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{location.timezone}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div 
            className="px-3 py-1 rounded-full text-white text-sm"
            style={{ background: '#433B83' }}
          >
            UTC {location.utcOffset >= 0 ? '+' : ''}{location.utcOffset}
          </div>
          {location.isDST && (
            <div 
              className="px-3 py-1 rounded-full text-white text-sm"
              style={{ background: '#E62B17' }}
            >
              DST
            </div>
          )}
        </div>
      </div>

      {/* Analog Clock Representation */}
      <div className="mt-4 flex justify-center relative z-10">
        <div 
          className="relative rounded-full p-2"
          style={{ 
            width: '100px', 
            height: '100px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '3px solid rgba(255, 255, 255, 0.3)'
          }}
        >
          {/* Clock markers */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full"
              style={{
                width: '4px',
                height: '4px',
                top: '50%',
                left: '50%',
                transform: `rotate(${i * 30}deg) translateY(-40px)`,
                transformOrigin: 'center'
              }}
            />
          ))}
          
          {/* Hour hand */}
          <div
            className="absolute bg-white rounded-full"
            style={{
              width: '4px',
              height: '25px',
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -100%) rotate(${(hours % 12) * 30 + minutes * 0.5}deg)`,
              transformOrigin: 'bottom center'
            }}
          />
          
          {/* Minute hand */}
          <div
            className="absolute bg-white rounded-full"
            style={{
              width: '3px',
              height: '35px',
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -100%) rotate(${minutes * 6}deg)`,
              transformOrigin: 'bottom center'
            }}
          />
          
          {/* Center dot */}
          <div
            className="absolute bg-white rounded-full"
            style={{
              width: '8px',
              height: '8px',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          />
        </div>
      </div>
    </div>
  );
}
