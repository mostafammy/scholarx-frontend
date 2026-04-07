import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';

/**
 * VelocityChart — Displays registration velocity (momentum) over the last 7 days.
 * Apple-style minimal aesthetic with fluid gradients.
 */
const VelocityChart = ({ registrations }) => {
  const data = useMemo(() => {
    if (!registrations || registrations.length === 0) return [];
    
    // Create a map of the timeline from April 6 to May 16 initialized to 0
    const timelineMap = {};
    const startDate = new Date("2026-04-06T00:00:00");
    const endDate = new Date("2026-05-16T00:00:00");
    
    let curr = new Date(startDate);
    while (curr <= endDate) {
      timelineMap[curr.toLocaleDateString("en-US", { month: "short", day: "numeric" })] = 0;
      curr.setDate(curr.getDate() + 1);
    }

    // Populate data
    registrations.forEach(r => {
      const dateKey = new Date(r.createdAt || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      if (timelineMap[dateKey] !== undefined) {
        timelineMap[dateKey]++;
      }
    });

    return Object.entries(timelineMap).map(([date, count]) => ({ date, count }));
  }, [registrations]);

  if (data.length === 0) {
    return null;
  }

  // Calculate insight based on actual today and yesterday
  const todayKey = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const yestDate = new Date();
  yestDate.setDate(yestDate.getDate() - 1);
  const yesterdayKey = yestDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const todayCount = data.find(d => d.date === todayKey)?.count || 0;
  const yesterdayCount = data.find(d => d.date === yesterdayKey)?.count || 0;
  
  const difference = todayCount - yesterdayCount;
  const percentage = yesterdayCount === 0 
    ? (todayCount > 0 ? 100 : 0) 
    : Math.round((difference / yesterdayCount) * 100);

  const isPositive = difference >= 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", damping: 20, stiffness: 100, delay: 0.2 }}
      className="summit-velocity-container"
      style={{
        background: "rgba(13,21,41,0.6)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "24px",
        padding: "24px",
        marginBottom: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        backdropFilter: "blur(20px)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 600, color: "#fff", display: "flex", alignItems: "center", gap: "8px" }}>
             <span style={{ color: "var(--s-gold-400)" }}>Velocity</span> Timeline
          </h3>
          <p style={{ margin: "4px 0 0 0", color: "rgba(255,255,255,0.5)", fontSize: "0.85rem" }}>
            April 6 to May 16 Registration Trajectory
          </p>
        </div>
        
        {/* Smart Insight Sentence */}
        <div style={{ 
          background: isPositive ? "rgba(105,240,174,0.05)" : "rgba(255,107,107,0.05)",
          border: `1px solid ${isPositive ? "rgba(105,240,174,0.2)" : "rgba(255,107,107,0.2)"}`,
          borderRadius: "100px",
          padding: "6px 16px",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          <span style={{ fontSize: "1.2rem" }}>{isPositive ? "📈" : "📉"}</span>
          <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.85rem" }}>
            Registrations are <strong style={{ color: isPositive ? "#69f0ae" : "#ff8a80" }}>{isPositive ? "up" : "down"} {Math.abs(percentage)}%</strong> compared to yesterday.
          </span>
        </div>
      </div>

      <div style={{ height: "240px", width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f5c518" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#f5c518" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12 }} 
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "rgba(13,21,41,0.9)", 
                border: "1px solid rgba(245,197,24,0.3)", 
                borderRadius: "12px",
                color: "#fff",
                boxShadow: "0 10px 25px rgba(0,0,0,0.5)"
              }} 
              itemStyle={{ color: "#f5c518", fontWeight: 600 }}
              labelStyle={{ color: "rgba(255,255,255,0.5)", marginBottom: "4px" }}
            />
            <Area 
              type="monotone" 
              dataKey="count" 
              stroke="#f5c518" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorCount)" 
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default VelocityChart;
