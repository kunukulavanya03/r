import { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Download, Upload, Save, Globe } from 'lucide-react';
import { TimeZoneLocation } from '../App';

interface SettingsScreenProps {
  locations: TimeZoneLocation[];
  onNavigateToSearch: () => void;
  onAddLocation: (location: TimeZoneLocation) => void;
  onRemoveLocation: (id: string) => void;
  onUpdateLocation: (id: string, updates: Partial<TimeZoneLocation>) => void;
}

export function SettingsScreen({ 
  locations, 
  onNavigateToSearch, 
  onAddLocation, 
  onRemoveLocation,
  onUpdateLocation 
}: SettingsScreenProps) {
  const [newCity, setNewCity] = useState('');
  const [newCountry, setNewCountry] = useState('');
  const [newTimezone, setNewTimezone] = useState('');
  const [newUtcOffset, setNewUtcOffset] = useState(0);
  const [isDST, setIsDST] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddLocation = () => {
    if (newCity && newCountry && newTimezone) {
      const newLocation: TimeZoneLocation = {
        id: Date.now().toString(),
        city: newCity,
        country: newCountry,
        timezone: newTimezone,
        utcOffset: newUtcOffset,
        isDST: isDST
      };
      onAddLocation(newLocation);
      setNewCity('');
      setNewCountry('');
      setNewTimezone('');
      setNewUtcOffset(0);
      setIsDST(false);
      setShowAddForm(false);
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(locations, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `world-clock-config-${Date.now()}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string);
          imported.forEach((loc: TimeZoneLocation) => onAddLocation(loc));
        } catch (error) {
          alert('Error importing file. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

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
                Settings & Configuration
              </h1>
            </div>
            <button
              onClick={onNavigateToSearch}
              className="flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 hover:opacity-90"
              style={{ 
                background: '#433B83',
                color: 'white',
                boxShadow: '0 2px 8px rgba(67, 59, 131, 0.4)'
              }}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Clock</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Action Buttons Section */}
        <div 
          className="p-6 rounded-lg mb-8"
          style={{
            background: 'linear-gradient(135deg, #E62B17 0%, #433B83 100%)',
            boxShadow: '0 4px 12px rgba(230, 43, 23, 0.3)'
          }}
        >
          <h2 className="text-white mb-4" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
            Configuration Management
          </h2>
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 px-6 py-3 rounded-lg text-white transition-all duration-300 hover:opacity-90"
              style={{ 
                background: '#433B83',
                boxShadow: '0 2px 6px rgba(67, 59, 131, 0.3)'
              }}
            >
              <Plus className="w-5 h-5" />
              Add Location
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-6 py-3 rounded-lg text-white transition-all duration-300 hover:opacity-90"
              style={{ 
                background: '#433B83',
                boxShadow: '0 2px 6px rgba(67, 59, 131, 0.3)'
              }}
            >
              <Download className="w-5 h-5" />
              Export Config
            </button>
            <label className="flex items-center gap-2 px-6 py-3 rounded-lg text-white transition-all duration-300 hover:opacity-90 cursor-pointer"
              style={{ 
                background: '#433B83',
                boxShadow: '0 2px 6px rgba(67, 59, 131, 0.3)'
              }}
            >
              <Upload className="w-5 h-5" />
              Import Config
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
          </div>
        </div>

        {/* Add Location Form */}
        {showAddForm && (
          <div 
            className="p-6 rounded-lg mb-8"
            style={{
              background: 'linear-gradient(135deg, #16674E 0%, #E62B17 100%)',
              boxShadow: '0 4px 12px rgba(22, 103, 78, 0.3)'
            }}
          >
            <h3 className="text-white mb-4" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
              Add New Location
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="City (e.g., Paris)"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                className="px-4 py-3 rounded-lg border-2 border-white/20 bg-white/95 focus:outline-none focus:border-white transition-all"
              />
              <input
                type="text"
                placeholder="Country (e.g., France)"
                value={newCountry}
                onChange={(e) => setNewCountry(e.target.value)}
                className="px-4 py-3 rounded-lg border-2 border-white/20 bg-white/95 focus:outline-none focus:border-white transition-all"
              />
              <input
                type="text"
                placeholder="Timezone (e.g., Europe/Paris)"
                value={newTimezone}
                onChange={(e) => setNewTimezone(e.target.value)}
                className="px-4 py-3 rounded-lg border-2 border-white/20 bg-white/95 focus:outline-none focus:border-white transition-all"
              />
              <input
                type="number"
                placeholder="UTC Offset (e.g., +1)"
                value={newUtcOffset}
                onChange={(e) => setNewUtcOffset(Number(e.target.value))}
                className="px-4 py-3 rounded-lg border-2 border-white/20 bg-white/95 focus:outline-none focus:border-white transition-all"
              />
            </div>
            <div className="flex items-center gap-3 mb-4">
              <input
                type="checkbox"
                id="dst"
                checked={isDST}
                onChange={(e) => setIsDST(e.target.checked)}
                className="w-5 h-5 rounded"
              />
              <label htmlFor="dst" className="text-white">Daylight Saving Time Active</label>
            </div>
            <button
              onClick={handleAddLocation}
              className="flex items-center gap-2 px-6 py-3 rounded-lg text-white transition-all duration-300 hover:opacity-90"
              style={{ 
                background: '#433B83',
                boxShadow: '0 2px 6px rgba(67, 59, 131, 0.3)'
              }}
            >
              <Save className="w-5 h-5" />
              Save Location
            </button>
          </div>
        )}

        {/* Section Heading */}
        <div 
          className="px-6 py-3 rounded-lg inline-block mb-6"
          style={{ 
            background: '#433B83',
            boxShadow: '0 2px 6px rgba(67, 59, 131, 0.3)'
          }}
        >
          <h2 className="text-white">Saved Locations ({locations.length})</h2>
        </div>

        {/* Locations List */}
        <div className="grid gap-4">
          {locations.map((location) => (
            <div
              key={location.id}
              className="p-6 rounded-lg transition-all duration-300 hover:translate-y-[-2px]"
              style={{
                background: 'linear-gradient(135deg, #16674E 0%, #E62B17 100%)',
                boxShadow: '0 4px 12px rgba(67, 59, 131, 0.3)'
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-white mb-2" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                    {location.city}, {location.country}
                  </h3>
                  <div className="flex gap-6 text-white/90">
                    <div>
                      <span className="opacity-80">Timezone:</span> {location.timezone}
                    </div>
                    <div>
                      <span className="opacity-80">UTC:</span> {location.utcOffset >= 0 ? '+' : ''}{location.utcOffset}
                    </div>
                    {location.isDST && (
                      <div className="px-3 py-1 rounded-full text-white" style={{ background: '#E62B17' }}>
                        DST Active
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => onRemoveLocation(location.id)}
                  className="p-3 rounded-lg text-white transition-all duration-300 hover:opacity-90"
                  style={{ 
                    background: '#E62B17',
                    boxShadow: '0 2px 6px rgba(230, 43, 23, 0.3)'
                  }}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
