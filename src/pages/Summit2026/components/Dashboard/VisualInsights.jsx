import React, { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar
} from 'recharts';
import { motion } from 'framer-motion';

const COLORS = ['#f5c518', '#3d7bff', '#ff9f1c', '#69f0ae', '#ff6b6b', '#a55eea', '#45aaf2'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(13,21,41,0.9)',
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        padding: '12px',
        borderRadius: '8px',
        color: '#fff',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
      }}>
        <p style={{ margin: '0 0 4px', fontWeight: 'bold' }}>{label}</p>
        <p style={{ margin: 0, color: payload[0].color }}>
          {payload[0].name}: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

const VisualInsights = ({ stats, registrations = [] }) => {
  // Aggregate daily registrations from the in-memory array (or backend stats if properly grouped)
  const timeSeriesData = useMemo(() => {
    // If stats API doesn't provide daily breakdown, we approximate it from current page `registrations`
    // However, for a real dashboard, the backend should send this.
    // For now, we'll build a synthetic pulse if `registrations` is small, or use a sample curve.
    if (!registrations || registrations.length === 0) return [];
    
    const groups = {};
    registrations.forEach(r => {
      const d = new Date(r.createdAt || Date.now()).toLocaleDateString();
      groups[d] = (groups[d] || 0) + 1;
    });

    return Object.entries(groups)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [registrations]);

  const trackData = useMemo(() => {
    if (!stats?.byTrack) return [];
    return Object.entries(stats.byTrack).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
  }, [stats]);

  const govData = useMemo(() => {
    if (!stats?.byGovernorate) return [];
    return Object.entries(stats.byGovernorate).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value).slice(0, 5); // Top 5
  }, [stats]);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '24px',
      marginBottom: '32px'
    }}>
      {/* Registration Pulse */}
      <motion.div 
        className="summit-glass-card" 
        style={{ padding: '24px', minHeight: '300px' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--s-font-display)', margin: '0 0 16px' }}>Registration Pulse</h3>
        {timeSeriesData.length > 0 ? (
          <div style={{ height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeSeriesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f5c518" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f5c518" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="count" name="Registrations" stroke="#f5c518" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div style={{ height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)' }}>
            Not enough data yet
          </div>
        )}
      </motion.div>

      {/* Track Popularity */}
      <motion.div 
        className="summit-glass-card" 
        style={{ padding: '24px', minHeight: '300px' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--s-font-display)', margin: '0 0 16px' }}>Track Popularity</h3>
        {trackData.length > 0 ? (
          <div style={{ height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={trackData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {trackData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px', color: '#fff' }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div style={{ height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)' }}>
            No track data
          </div>
        )}
      </motion.div>
      {/* Governorate Demographics */}
      <motion.div 
        className="summit-glass-card" 
        style={{ padding: '24px', minHeight: '300px' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--s-font-display)', margin: '0 0 16px' }}>Top Governorates</h3>
        {govData.length > 0 ? (
          <div style={{ height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={govData} margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.8)" fontSize={12} tickLine={false} axisLine={false} width={80} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Attendees" fill="#3d7bff" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div style={{ height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)' }}>
            No data yet
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default React.memo(VisualInsights);
