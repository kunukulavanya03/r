import { useState, useEffect } from 'react';
import { Search, Settings, Globe, MapPin, Clock } from 'lucide-react';
import { TimeZoneLocation } from '../App';
import { ClockCard } from './ClockCard';
import { WorldMap } from './WorldMap';
import { TimeConverter } from './TimeConverter';

interface SearchScreenProps {
  locations: TimeZoneLocation[];
  onNavigateToSettings: () => void;
  onRemoveLocation: (id: string) => void;
}

export function SearchScreen({ locations, onNavigateToSettings, onRemoveLocation }: SearchScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedView, setSelectedView] = useState<'grid' | 'map' | 'converter'>('grid');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredLocations = locations.filter(loc => 
    loc.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.timezone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      {/* Header Banner with Gradient */}
      <div 
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #433B83 0%, #16674E 100%)',
          boxShadow: '0 4px 12px rgba(67, 59, 131, 0.3)'
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Globe className="w-10 h-10 text-white" />
              <h1 className="text-white" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                Python World Clock
              </h1>
            </div>
            <button
              onClick={onNavigateToSettings}
              className="flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 hover:opacity-90"
              style={{ 
                background: '#433B83',
                color: 'white',
                boxShadow: '0 2px 8px rgba(67, 59, 131, 0.4)'
              }}
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search cities, countries, or timezones..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-lg bg-white/95 backdrop-blur-sm border-2 border-white/20 focus:border-white focus:outline-none transition-all"
              style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => setSelectedView('grid')}
            className="px-6 py-2 rounded-full text-white transition-all duration-300 hover:opacity-90"
            style={{ 
              background: selectedView === 'grid' ? '#E62B17' : '#433B83',
              boxShadow: '0 2px 6px rgba(230, 43, 23, 0.3)'
            }}
          >
            <Clock className="w-4 h-4 inline mr-2" />
            Clock Grid
          </button>
          <button
            onClick={() => setSelectedView('map')}
            className="px-6 py-2 rounded-full text-white transition-all duration-300 hover:opacity-90"
            style={{ 
              background: selectedView === 'map' ? '#E62B17' : '#433B83',
              boxShadow: '0 2px 6px rgba(230, 43, 23, 0.3)'
            }}
          >
            <MapPin className="w-4 h-4 inline mr-2" />
            World Map
          </button>
          <button
            onClick={() => setSelectedView('converter')}
            className="px-6 py-2 rounded-full text-white transition-all duration-300 hover:opacity-90"
            style={{ 
              background: selectedView === 'converter' ? '#E62B17' : '#433B83',
              boxShadow: '0 2px 6px rgba(230, 43, 23, 0.3)'
            }}
          >
            <Globe className="w-4 h-4 inline mr-2" />
            Time Converter
          </button>
        </div>
      </div>

      {/* Section Heading */}
      <div className="max-w-7xl mx-auto px-6 mb-6">
        <div 
          className="px-6 py-3 rounded-lg inline-block"
          style={{ 
            background: '#433B83',
            boxShadow: '0 2px 6px rgba(67, 59, 131, 0.3)'
          }}
        >
          <h2 className="text-white">
            {selectedView === 'grid' && 'Live Time Zones'}
            {selectedView === 'map' && 'Global Time Zone Map'}
            {selectedView === 'converter' && 'Time Zone Converter'}
          </h2>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        {selectedView === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLocations.map((location) => (
              <ClockCard 
                key={location.id}
                location={location}
                currentTime={currentTime}
                onRemove={() => onRemoveLocation(location.id)}
              />
            ))}
            {filteredLocations.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-400">
                No locations found. Try adjusting your search.
              </div>
            )}
          </div>
        )}

        {selectedView === 'map' && (
          <WorldMap locations={filteredLocations} currentTime={currentTime} />
        )}

        {selectedView === 'converter' && (
          <TimeConverter locations={locations} />
        )}
      </div>
    </div>
  );
}
