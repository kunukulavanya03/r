import { useState } from 'react';
import { SearchScreen } from './components/SearchScreen';
import { SettingsScreen } from './components/SettingsScreen';

export interface TimeZoneLocation {
  id: string;
  city: string;
  country: string;
  timezone: string;
  utcOffset: number;
  isDST?: boolean;
}

export type Screen = 'search' | 'settings';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('search');
  const [savedLocations, setSavedLocations] = useState<TimeZoneLocation[]>([
    { id: '1', city: 'New York', country: 'USA', timezone: 'America/New_York', utcOffset: -5, isDST: false },
    { id: '2', city: 'London', country: 'UK', timezone: 'Europe/London', utcOffset: 0, isDST: false },
    { id: '3', city: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo', utcOffset: 9, isDST: false },
    { id: '4', city: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney', utcOffset: 11, isDST: true },
    { id: '5', city: 'Dubai', country: 'UAE', timezone: 'Asia/Dubai', utcOffset: 4, isDST: false },
    { id: '6', city: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore', utcOffset: 8, isDST: false },
  ]);

  const addLocation = (location: TimeZoneLocation) => {
    setSavedLocations([...savedLocations, location]);
  };

  const removeLocation = (id: string) => {
    setSavedLocations(savedLocations.filter(loc => loc.id !== id));
  };

  const updateLocation = (id: string, updates: Partial<TimeZoneLocation>) => {
    setSavedLocations(savedLocations.map(loc => 
      loc.id === id ? { ...loc, ...updates } : loc
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentScreen === 'search' ? (
        <SearchScreen 
          locations={savedLocations}
          onNavigateToSettings={() => setCurrentScreen('settings')}
          onRemoveLocation={removeLocation}
        />
      ) : (
        <SettingsScreen 
          locations={savedLocations}
          onNavigateToSearch={() => setCurrentScreen('search')}
          onAddLocation={addLocation}
          onRemoveLocation={removeLocation}
          onUpdateLocation={updateLocation}
        />
      )}
    </div>
  );
}

export default App;
