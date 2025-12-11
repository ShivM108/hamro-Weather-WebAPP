import React, { useState } from 'react';
import { nepalLocations } from '../data/nepalLocations';
import { Map, ChevronRight, Search } from 'lucide-react';

interface NepalSelectorProps {
  onSelectCity: (city: string) => void;
}

export const NepalSelector: React.FC<NepalSelectorProps> = ({ onSelectCity }) => {
  const [province, setProvince] = useState<string>('');
  const [district, setDistrict] = useState<string>('');
  const [cityFilter, setCityFilter] = useState<string>('');

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProvince(e.target.value);
    setDistrict('');
    setCityFilter('');
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDistrict(e.target.value);
    setCityFilter('');
  };

  const handleCityClick = (city: string) => {
    onSelectCity(`${city}, Nepal`);
  };

  const selectedProvinceData = nepalLocations.find(p => p.province === province);
  const selectedDistrictData = selectedProvinceData?.districts.find(d => d.name === district);

  const filteredCities = selectedDistrictData?.cities.filter(city => 
    city.toLowerCase().includes(cityFilter.toLowerCase())
  );

  return (
    <div className="bg-white/30 dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl p-5 shadow-lg border border-white/20 animate-fade-in">
      <div className="flex items-center space-x-2 mb-4 border-b border-white/10 pb-2">
        <Map className="w-5 h-5 text-red-600 dark:text-red-400" />
        <h3 className="font-bold text-gray-800 dark:text-gray-100">Browse Nepal</h3>
      </div>

      <div className="space-y-3">
        {/* Province Selector */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase">Province</label>
          <select 
            value={province} 
            onChange={handleProvinceChange}
            className="w-full bg-white/50 dark:bg-black/30 border border-white/30 dark:border-slate-600 rounded-lg p-2 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Province</option>
            {nepalLocations.map(p => (
              <option key={p.province} value={p.province}>{p.province}</option>
            ))}
          </select>
        </div>

        {/* District Selector */}
        <div>
           <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase">District</label>
           <select 
            value={district} 
            onChange={handleDistrictChange}
            disabled={!province}
            className="w-full bg-white/50 dark:bg-black/30 border border-white/30 dark:border-slate-600 rounded-lg p-2 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <option value="">Select District</option>
            {selectedProvinceData?.districts.map(d => (
              <option key={d.name} value={d.name}>{d.name}</option>
            ))}
          </select>
        </div>

        {/* Cities List */}
        {selectedDistrictData && (
          <div className="mt-4">
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase">Select Municipality</label>
            
            {/* City Filter Input */}
            <div className="relative mb-3">
              <input 
                type="text"
                placeholder="Filter cities..."
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="w-full bg-white/50 dark:bg-black/30 border border-white/30 dark:border-slate-600 rounded-lg py-2 pl-9 pr-3 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
              />
              <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
              {filteredCities && filteredCities.length > 0 ? (
                filteredCities.map(city => (
                  <button
                    key={city}
                    onClick={() => handleCityClick(city)}
                    className="text-left text-sm px-3 py-2 bg-blue-50/50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-800/40 text-blue-700 dark:text-blue-300 rounded-md transition-colors flex items-center justify-between group"
                  >
                    <span>{city}</span>
                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))
              ) : (
                <div className="col-span-2 text-center py-4 text-sm text-gray-500 dark:text-gray-400 italic">
                  No cities found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};