import { useState } from 'react';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { TimeZoneLocation } from '../App';

interface TimeConverterProps {
  locations: TimeZoneLocation[];
}

export function TimeConverter({ locations }: TimeConverterProps) {
  const [sourceLocation, setSourceLocation] = useState<TimeZoneLocation | null>(locations[0] || null);
  const [targetLocation, setTargetLocation] = useState<TimeZoneLocation | null>(locations[1] || null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState(new Date().toTimeString().slice(0, 5));

  const convertTime = () => {
    if (!sourceLocation || !targetLocation) return null;

    // Create a date from the selected date and time in the source timezone
    const sourceDateTime = new Date(`${selectedDate}T${selectedTime}:00`);
    
    // Calculate the difference in hours between timezones
    const timeDiff = targetLocation.utcOffset - sourceLocation.utcOffset;
    
    // Convert to target timezone
    const targetDateTime = new Date(sourceDateTime.getTime() + timeDiff * 3600000);
    
    return targetDateTime;
  };

  const convertedTime = convertTime();

  const formatDateTime = (date: Date | null) => {
    if (!date) return '';
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
    };
  };

  const sourceFormatted = formatDateTime(new Date(`${selectedDate}T${selectedTime}:00`));
  const targetFormatted = convertedTime ? formatDateTime(convertedTime) : null;

  return (
    <div>
      {/* Converter Card */}
      <div 
        className="p-8 rounded-lg mb-8"
        style={{
          background: 'linear-gradient(135deg, #433B83 0%, #16674E 100%)',
          boxShadow: '0 6px 16px rgba(67, 59, 131, 0.4)'
        }}
      >
        <div className="text-center mb-8">
          <Clock className="w-16 h-16 text-white mx-auto mb-4 opacity-80" />
          <h2 className="text-white" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
            Time Zone Converter
          </h2>
          <p className="text-white/80 mt-2">
            Convert time between different time zones with daylight saving support
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* Source Time Zone */}
          <div 
            className="p-6 rounded-lg"
            style={{
              background: 'linear-gradient(135deg, #E62B17 0%, #433B83 100%)',
              boxShadow: '0 4px 12px rgba(230, 43, 23, 0.3)'
            }}
          >
            <h3 className="text-white mb-4" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
              From
            </h3>
            <select
              value={sourceLocation?.id || ''}
              onChange={(e) => setSourceLocation(locations.find(l => l.id === e.target.value) || null)}
              className="w-full px-4 py-3 rounded-lg mb-3 bg-white/95 focus:outline-none focus:ring-2 focus:ring-white"
            >
              {locations.map(loc => (
                <option key={loc.id} value={loc.id}>
                  {loc.city}, {loc.country}
                </option>
              ))}
            </select>
            
            <div className="space-y-3">
              <div>
                <label className="text-white/80 text-sm mb-1 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/95 focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>
              
              <div>
                <label className="text-white/80 text-sm mb-1 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Time
                </label>
                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/95 focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>
            </div>

            {sourceLocation && (
              <div className="mt-4 pt-4 border-t border-white/20">
                <p className="text-white text-sm">
                  Timezone: {sourceLocation.timezone}
                </p>
                <p className="text-white text-sm">
                  UTC {sourceLocation.utcOffset >= 0 ? '+' : ''}{sourceLocation.utcOffset}
                </p>
              </div>
            )}
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <div 
              className="p-4 rounded-full"
              style={{
                background: '#E62B17',
                boxShadow: '0 4px 12px rgba(230, 43, 23, 0.4)'
              }}
            >
              <ArrowRight className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Target Time Zone */}
          <div 
            className="p-6 rounded-lg"
            style={{
              background: 'linear-gradient(135deg, #16674E 0%, #E62B17 100%)',
              boxShadow: '0 4px 12px rgba(22, 103, 78, 0.3)'
            }}
          >
            <h3 className="text-white mb-4" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
              To
            </h3>
            <select
              value={targetLocation?.id || ''}
              onChange={(e) => setTargetLocation(locations.find(l => l.id === e.target.value) || null)}
              className="w-full px-4 py-3 rounded-lg mb-3 bg-white/95 focus:outline-none focus:ring-2 focus:ring-white"
            >
              {locations.map(loc => (
                <option key={loc.id} value={loc.id}>
                  {loc.city}, {loc.country}
                </option>
              ))}
            </select>

            {targetFormatted && (
              <div 
                className="p-4 rounded-lg mb-3"
                style={{ background: 'rgba(255, 255, 255, 0.1)' }}
              >
                <p className="text-white mb-2">{targetFormatted.date}</p>
                <p className="text-white" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                  {targetFormatted.time}
                </p>
              </div>
            )}

            {targetLocation && (
              <div className="mt-4 pt-4 border-t border-white/20">
                <p className="text-white text-sm">
                  Timezone: {targetLocation.timezone}
                </p>
                <p className="text-white text-sm">
                  UTC {targetLocation.utcOffset >= 0 ? '+' : ''}{targetLocation.utcOffset}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Conversion Summary */}
      {sourceLocation && targetLocation && targetFormatted && (
        <div 
          className="p-6 rounded-lg"
          style={{
            background: 'linear-gradient(135deg, #E62B17 0%, #433B83 100%)',
            boxShadow: '0 4px 12px rgba(230, 43, 23, 0.3)'
          }}
        >
          <h3 className="text-white mb-4" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
            Conversion Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div 
                className="px-4 py-2 rounded-lg inline-block mb-2"
                style={{ background: '#433B83' }}
              >
                <p className="text-white">Source Location</p>
              </div>
              <p className="text-white mb-1">
                <strong>{sourceLocation.city}, {sourceLocation.country}</strong>
              </p>
              <p className="text-white/90">{sourceFormatted.date}</p>
              <p className="text-white">{sourceFormatted.time}</p>
            </div>
            
            <div>
              <div 
                className="px-4 py-2 rounded-lg inline-block mb-2"
                style={{ background: '#16674E' }}
              >
                <p className="text-white">Target Location</p>
              </div>
              <p className="text-white mb-1">
                <strong>{targetLocation.city}, {targetLocation.country}</strong>
              </p>
              <p className="text-white/90">{targetFormatted.date}</p>
              <p className="text-white">{targetFormatted.time}</p>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
            <p className="text-white text-center">
              Time difference: <strong>{Math.abs(targetLocation.utcOffset - sourceLocation.utcOffset)} hours</strong>
              {targetLocation.utcOffset > sourceLocation.utcOffset ? ' ahead' : ' behind'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
