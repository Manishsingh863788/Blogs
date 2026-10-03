import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ 
  searchTerm, 
  setSearchTerm, 
  activeTab
}) {
  const getPlaceholderText = () => {
    if (activeTab === 'country') return "Search country laws (e.g., India, USA, UAE, UK, Australia)...";
    if (activeTab === 'state') return "Search state laws & sub-blogs (e.g., Maharashtra, Haryana, California, Texas)...";
    if (activeTab === 'city') return "Type city name (e.g., Rishikesh, Hyderabad, Kanpur, Ghaziabad, NYC, London)...";
    return "Search by country, state, city, RERA act, stamp duty, or keyword...";
  };

  return (
    <div style={{ marginBottom: '2rem' }}>
      
      {/* Input Field */}
      <div style={{ position: 'relative', maxWidth: '720px', margin: '0 auto' }}>
        <Search 
          size={20} 
          color="var(--text-muted)" 
          style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} 
        />

        <input 
          type="text" 
          className="search-input"
          placeholder={getPlaceholderText()}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {searchTerm && (
          <button 
            onClick={() => setSearchTerm('')}
            style={{
              position: 'absolute',
              right: '1.2rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
            title="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>

    </div>
  );
}
