import React, { useState, useMemo } from 'react';
import { nepalLocations } from '../data/nepalLocations';
import { Map, ChevronRight, Search, X } from 'lucide-react';

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

  const selectedProvinceData = useMemo(() => 
    nepalLocations.find(p => p.province === province),
    [province]
  );
  
  const selectedDistrictData = useMemo(() => 
    selectedProvinceData?.districts.find(d => d.name === district),
    [selectedProvinceData, district]
  );

  const filteredCities = useMemo(() => 
    selectedDistrictData?.cities.filter(city => 
      city.toLowerCase().includes(cityFilter.toLowerCase())
    ) || [],
    [selectedDistrictData, cityFilter]
  );

  return (
    <div className="bg-white/30 dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl p-5 shadow-lg border border-white/20 animate-fade-in">
      <div className="flex items-center space-x-2 mb-4 border-b border-white/10 pb-2">
        <Map className="w-5 h-5 text-red-600 dark:text-red-400" />
        <h3 className="font-bold text-gray-800 dark:text-gray-100">Browse Nepal</h3>
      </div>

      <div className="space-y-4">
        {/* Province Selector */}
        <div>
          <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Province</label>
          <select 
            value={province} 
            onChange={handleProvinceChange}
            className="w-full bg-white/50 dark:bg-black/30 border border-white/30 dark:border-slate-600 rounded-lg p-2.5 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none cursor-pointer"
          >
            <option value="">Select Province</option>
            {nepalLocations.map(p => (
              <option key={p.province} value={p.province}>{p.province}</option>
            ))}
          </select>
        </div>

        {/* District Selector */}
        <div>
           <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">District</label>
           <select 
            value={district} 
            onChange={handleDistrictChange}
            disabled={!province}
            className="w-full bg-white/50 dark:bg-black/30 border border-white/30 dark:border-slate-600 rounded-lg p-2.5 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 transition-all appearance-none cursor-pointer"
          >
            <option value="">Select District</option>
            {selectedProvinceData?.districts.map(d => (
              <option key={d.name} value={d.name}>{d.name}</option>
            ))}
          </select>
        </div>

        {/* Cities Section */}
        {selectedDistrictData && (
          <div className="mt-4 pt-4 border-t border-white/10 animate-slide-up">
            <div className="flex justify-between items-end mb-2">
              <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Municipalities
              </label>
              {selectedDistrictData.cities.length > 0 && (
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">
                  {filteredCities.length} of {selectedDistrictData.cities.length}
                </span>
              )}
            </div>
            
            {/* Enhanced City Filter Input */}
            <div className="relative mb-3 group">
              <input 
                type="text"
                placeholder={`Search in ${district}...`}
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="w-full bg-white/60 dark:bg-black/40 border border-white/40 dark:border-slate-600 rounded-lg py-2.5 pl-10 pr-10 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder-gray-500 transition-all"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 group-focus-within:text-blue-500 transition-colors" />
              
              {cityFilter && (
                <button 
                  onClick={() => setCityFilter('')}
                  className="absolute right-3 top-2.5 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-white/20 transition-all"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
              {filteredCities.length > 0 ? (
                filteredCities.map(city => (
                  <button
                    key={city}
                    onClick={() => handleCityClick(city)}
                    className="text-left text-sm px-4 py-3 bg-white/40 dark:bg-white/5 hover:bg-blue-500 dark:hover:bg-blue-600 text-gray-700 dark:text-gray-200 hover:text-white rounded-xl transition-all flex items-center justify-between group/item border border-white/20"
                  >
                    <span className="font-medium">{city}</span>
                    <ChevronRight size={14} className="opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all" />
                  </button>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center bg-black/5 dark:bg-black/20 rounded-xl">
                  <Search size={24} className="text-gray-400 mb-2 opacity-30" />
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic px-4">
                    No municipality matches "{cityFilter}"
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};