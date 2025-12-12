import { TimeZoneLocation } from '../App';
import { MapPin, Globe } from 'lucide-react';

interface WorldMapProps {
  locations: TimeZoneLocation[];
  currentTime: Date;
}

export function WorldMap({ locations, currentTime }: WorldMapProps) {
  // Simplified world map representation with timezone regions
  const timezoneRegions = [
    { name: 'Americas', utcRange: [-12, -3], color: '#E62B17' },
    { name: 'Europe & Africa', utcRange: [-1, 3], color: '#433B83' },
    { name: 'Middle East', utcRange: [3, 6], color: '#16674E' },
    { name: 'Asia', utcRange: [6, 9], color: '#E62B17' },
    { name: 'East Asia & Oceania', utcRange: [9, 14], color: '#433B83' },
  ];

  const getRegionForLocation = (utcOffset: number) => {
    return timezoneRegions.find(region => 
      utcOffset >= region.utcRange[0] && utcOffset <= region.utcRange[1]
    );
  };

  const getTimeInZone = (location: TimeZoneLocation) => {
    const utc = currentTime.getTime() + (currentTime.getTimezoneOffset() * 60000);
    const zoneTime = new Date(utc + (3600000 * location.utcOffset));
    return zoneTime.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div>
      {/* World Map Visualization */}
      <div 
        className="p-8 rounded-lg mb-8 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #433B83 0%, #16674E 100%)',
          boxShadow: '0 6px 16px rgba(67, 59, 131, 0.4)',
          minHeight: '400px'
        }}
      >
        <div className="text-center mb-8">
          <Globe className="w-16 h-16 text-white mx-auto mb-4 opacity-80" />
          <h2 className="text-white" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
            Global Time Zone Map
          </h2>
          <p className="text-white/80 mt-2">
            Visual representation of your tracked locations across world time zones
          </p>
        </div>

        {/* Timezone Bands */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          {timezoneRegions.map((region, index) => (
            <div
              key={index}
              className="p-4 rounded-lg text-center transition-all duration-300 hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${region.color} 0%, rgba(255,255,255,0.1) 100%)`,
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }}
            >
              <h4 className="text-white mb-2" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                {region.name}
              </h4>
              <p className="text-white/80 text-sm">
                UTC {region.utcRange[0] >= 0 ? '+' : ''}{region.utcRange[0]} to {region.utcRange[1] >= 0 ? '+' : ''}{region.utcRange[1]}
              </p>
            </div>
          ))}
        </div>

        {/* Location Markers on Map */}
        <div className="relative h-48 rounded-lg" style={{ background: 'rgba(0,0,0,0.2)' }}>
          {locations.map((location, index) => {
            const region = getRegionForLocation(location.utcOffset);
            const leftPosition = ((location.utcOffset + 12) / 24) * 100;
            
            return (
              <div
                key={location.id}
                className="absolute transform -translate-x-1/2 animate-pulse"
                style={{
                  left: `${leftPosition}%`,
                  top: `${20 + (index % 3) * 30}%`,
                }}
              >
                <div className="relative group">
                  <MapPin 
                    className="w-8 h-8 cursor-pointer transition-all duration-300 hover:scale-125"
                    style={{ 
                      color: region?.color || '#E62B17',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
                    }} 
                  />
                  <div 
                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap"
                    style={{
                      background: region?.color || '#E62B17',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                    }}
                  >
                    <p className="text-white font-medium">{location.city}</p>
                    <p className="text-white/80 text-sm">{getTimeInZone(location)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Location Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {locations.map((location) => {
          const region = getRegionForLocation(location.utcOffset);
          return (
            <div
              key={location.id}
              className="p-4 rounded-lg transition-all duration-300 hover:translate-y-[-2px]"
              style={{
                background: `linear-gradient(135deg, ${region?.color || '#433B83'} 0%, rgba(0,0,0,0.1) 100%)`,
                boxShadow: '0 4px 12px rgba(67, 59, 131, 0.3)'
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="w-5 h-5 text-white" />
                <h4 className="text-white" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                  {location.city}, {location.country}
                </h4>
              </div>
              <div className="text-white/90">
                <p className="text-sm mb-1">{location.timezone}</p>
                <p className="mb-2">{getTimeInZone(location)}</p>
                <div 
                  className="inline-block px-3 py-1 rounded-full text-white text-sm"
                  style={{ background: 'rgba(0,0,0,0.2)' }}
                >
                  UTC {location.utcOffset >= 0 ? '+' : ''}{location.utcOffset}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
