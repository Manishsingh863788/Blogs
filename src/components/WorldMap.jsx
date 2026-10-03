import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ExternalLink, MapPin } from 'lucide-react';

// Component to ensure Leaflet calculates dimensions properly
function MapResizer() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 200);
  }, [map]);
  return null;
}

// Fix Leaflet marker default icon issue in Vite bundler
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom colored pin icons
const createCustomIcon = (level) => {
  let color = '#3b82f6';
  if (level === 'state') color = '#8b5cf6';
  if (level === 'city') color = '#ec4899';

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid #ffffff;
        box-shadow: 0 0 12px ${color};
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 10px;
      "></div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

export default function WorldMap({ blogs, onSelectBlog }) {
  // Center world view
  const defaultCenter = [24.0, 45.0];
  const defaultZoom = 3;

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      
      {/* Map Control Overlay Header */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        right: 'auto',
        maxWidth: 'calc(100% - 24px)',
        zIndex: 400,
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(8px)',
        border: '1px solid var(--border-color)',
        padding: '0.5rem 0.85rem',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '0.65rem',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <MapPin size={18} color="var(--accent-primary)" style={{ flexShrink: 0 }} />
        <div style={{ textAlign: 'left' }}>
          <span style={{ fontSize: 'clamp(0.75rem, 2.5vw, 0.85rem)', fontWeight: 700, color: 'var(--text-main)', display: 'block', lineHeight: 1.2 }}>
            Interactive GeoJSON & Pin Boundary Mode: World
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', lineHeight: 1.2 }}>
            Click pins to inspect statutory land acts across countries, states & cities
          </span>
        </div>
      </div>

      {/* Map Legend */}
      <div style={{
        position: 'absolute',
        bottom: '12px',
        right: '12px',
        zIndex: 400,
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(8px)',
        border: '1px solid var(--border-color)',
        padding: '0.4rem 0.7rem',
        borderRadius: '8px',
        display: 'flex',
        gap: '0.6rem',
        fontSize: '0.72rem',
        fontWeight: 600,
        boxShadow: 'var(--card-shadow)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#3b82f6' }}></span> Country
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#8b5cf6' }}></span> State
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#ec4899' }}></span> City
        </div>
      </div>

      <MapContainer 
        center={defaultCenter} 
        zoom={defaultZoom} 
        minZoom={2}
        maxZoom={18}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '520px', borderRadius: '16px', background: '#cad2d3' }}
      >
        <MapResizer />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {blogs.map((blog) => {
          if (!blog.coordinates) return null;
          return (
            <Marker 
              key={blog.id} 
              position={blog.coordinates}
              icon={createCustomIcon(blog.level)}
            >
              <Popup>
                <div style={{ minWidth: '200px', maxWidth: '260px', padding: '4px' }}>
                  <span className={`badge badge-${blog.level}`} style={{ marginBottom: '6px' }}>
                    {blog.level} • {blog.country}
                  </span>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '6px 0 4px 0', color: '#0f172a' }}>
                    {blog.title}
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: '#475569', margin: '0 0 10px 0', lineHeight: 1.4 }}>
                    {blog.summary.slice(0, 85)}...
                  </p>
                  <button 
                    onClick={() => onSelectBlog(blog)}
                    style={{
                      width: '100%',
                      background: '#3b82f6',
                      color: '#ffffff',
                      border: 'none',
                      padding: '0.4rem 0.6rem',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    Read Legal Blog <ExternalLink size={14} />
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
