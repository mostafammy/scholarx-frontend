/**
 * @fileoverview VisualInsights — World-class, Apple-caliber analytics panels.
 * Principal Engineer pattern: custom animated primitives, not off-the-shelf charts.
 * Uses Framer Motion for 60fps entrance animations + Recharts for data.
 */

import React, { useMemo, useState, useEffect, useRef } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { motion, AnimatePresence, useInView, useSpring, useMotionValue, useTransform } from 'framer-motion';

// ─────────────────────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────────────────────
const PALETTE = ['#f5c518', '#3d7bff', '#ff9f1c', '#69f0ae', '#ff6b6b', '#a55eea', '#45aaf2'];

const cardVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, delay: i * 0.14, ease: [0.16, 1, 0.3, 1] },
  }),
};

// ─────────────────────────────────────────────────────────────
// ANIMATED NUMBER COUNTER
// ─────────────────────────────────────────────────────────────
const AnimatedNumber = ({ value, suffix = '' }) => {
  const springVal = useSpring(0, { stiffness: 100, damping: 20, mass: 0.5 });
  const displayVal = useTransform(springVal, (v) => `${Math.round(v).toLocaleString()}${suffix}`);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) springVal.set(value);
  }, [isInView, value, springVal]);

  return (
    <motion.span ref={ref} style={{ display: 'inline-block' }}>
      {displayVal}
    </motion.span>
  );
};

// ─────────────────────────────────────────────────────────────
// PREMIUM TOOLTIP
// ─────────────────────────────────────────────────────────────
const PremiumTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      style={{
        background: 'rgba(5, 9, 17, 0.92)',
        border: '1px solid rgba(255,255,255,0.12)',
        backdropFilter: 'blur(20px)',
        padding: '14px 18px',
        borderRadius: '14px',
        color: '#fff',
        boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
        fontFamily: 'var(--s-font-display, Inter)',
        minWidth: '140px',
      }}
    >
      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.color || p.stroke, display: 'inline-block', flexShrink: 0 }} />
          <span style={{ fontWeight: 700, fontSize: '1.1rem', color: p.color || p.stroke }}>
            {p.value?.toLocaleString()}
          </span>
          <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>{p.name}</span>
        </div>
      ))}
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────
// EMPTY STATE
// ─────────────────────────────────────────────────────────────
const EmptyState = ({ icon = '📊', message = 'Awaiting data...' }) => (
  <div style={{ height: '260px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
    <motion.div
      animate={{ opacity: [0.4, 0.8, 0.4] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      style={{ fontSize: '2.8rem' }}
    >
      {icon}
    </motion.div>
    <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.875rem', margin: 0 }}>{message}</p>
  </div>
);

// ─────────────────────────────────────────────────────────────
// CUSTOM ANIMATED BAR (for Governorate Chart)
// ─────────────────────────────────────────────────────────────
const AnimatedBar = ({ name, value, max, color, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const pct = max > 0 ? (value / max) * 100 : 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -16 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
    >
      <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', width: '90px', flexShrink: 0, textAlign: 'right', textTransform: 'capitalize' }}>
        {name.replace(/-/g, ' ')}
      </span>

      <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '100px', overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${pct}%` } : {}}
          transition={{ duration: 0.9, delay: index * 0.1 + 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            height: '100%',
            borderRadius: '100px',
            background: `linear-gradient(90deg, ${color}aa, ${color})`,
            boxShadow: `0 0 12px ${color}66`,
          }}
        />
      </div>

      <span style={{ fontSize: '0.85rem', fontWeight: 700, color, width: '32px', textAlign: 'right' }}>
        {value}
      </span>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────
// CUSTOM ANIMATED DONUT (Track Popularity)
// ─────────────────────────────────────────────────────────────
const DonutSegment = ({ slice, index, total, isHovered, onHover }) => {
  const [isDash, setIsDash] = useState(false);
  const circumference = 2 * Math.PI * 54;
  const pct = total > 0 ? slice.value / total : 0;
  const dashArray = pct * circumference;
  const dashOffset = circumference * PALETTE.slice(0, index).reduce((acc, _, i) => acc + (i < index ? 0 : 0), 0);

  useEffect(() => {
    const timer = setTimeout(() => setIsDash(true), 100 + index * 80);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <motion.circle
      cx="64"
      cy="64"
      r="54"
      fill="none"
      stroke={PALETTE[index % PALETTE.length]}
      strokeWidth={isHovered ? 10 : 8}
      strokeLinecap="round"
      strokeDasharray={`${dashArray} ${circumference}`}
      strokeDashoffset={dashOffset}
      style={{
        transformOrigin: '64px 64px',
        rotate: '-90deg',
        cursor: 'pointer',
        filter: isHovered ? `drop-shadow(0 0 8px ${PALETTE[index % PALETTE.length]}99)` : 'none',
        transition: 'stroke-width 0.25s ease, filter 0.25s ease',
      }}
      initial={{ strokeDasharray: `0 ${circumference}` }}
      animate={isDash ? { strokeDasharray: `${dashArray} ${circumference}` } : {}}
      transition={{ duration: 1.2, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
    />
  );
};

const AnimatedDonut = ({ data }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const total = data.reduce((acc, d) => acc + d.value, 0);
  const hovered = hoveredIndex !== null ? data[hoveredIndex] : null;

  let offset = 0;
  const circumference = 2 * Math.PI * 54;

  const segments = data.map((slice, i) => {
    const pct = total > 0 ? slice.value / total : 0;
    const dash = pct * circumference;
    const seg = { ...slice, dash, offset, color: PALETTE[i % PALETTE.length] };
    offset += dash;
    return seg;
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', height: '200px' }}>
      {/* SVG Donut */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <svg viewBox="0 0 128 128" width="160" height="160">
          {/* Background track */}
          <circle cx="64" cy="64" r="54" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
          {segments.map((seg, i) => (
            <motion.circle
              key={i}
              cx="64"
              cy="64"
              r="54"
              fill="none"
              stroke={seg.color}
              strokeWidth={hoveredIndex === i ? 10 : 8}
              strokeLinecap="round"
              strokeDasharray={`${seg.dash} ${circumference}`}
              strokeDashoffset={-seg.offset}
              style={{
                transformOrigin: '64px 64px',
                rotate: '-90deg',
                cursor: 'pointer',
                filter: hoveredIndex === i ? `drop-shadow(0 0 8px ${seg.color}99)` : 'none',
                transition: 'stroke-width 0.25s ease, filter 0.25s ease',
              }}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1, strokeDasharray: `${seg.dash} ${circumference}` }}
              transition={{ duration: 1.1, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          ))}
        </svg>

        {/* Center Label */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <AnimatePresence mode="wait">
            {hovered ? (
              <motion.div key={hovered.name} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.2 }} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--s-font-display)', color: PALETTE[hoveredIndex % PALETTE.length] }}>
                  {hovered.value}
                </div>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', textTransform: 'capitalize', maxWidth: '60px', lineHeight: 1.2 }}>
                  {hovered.name.replace(/-/g, ' ')}
                </div>
              </motion.div>
            ) : (
              <motion.div key="total" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--s-font-display)', color: '#fff' }}>
                  <AnimatedNumber value={total} />
                </div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)' }}>Total</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Legend */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', maxHeight: '180px' }}>
        {segments.map((seg, i) => (
          <motion.div
            key={seg.name}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 + 0.3 }}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '8px',
              background: hoveredIndex === i ? `${seg.color}14` : 'transparent',
              transition: 'background 0.2s ease',
            }}
          >
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: seg.color, flexShrink: 0 }} />
            <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', textTransform: 'capitalize', flex: 1 }}>{seg.name.replace(/-/g, ' ')}</span>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: seg.color }}>{Math.round((seg.value / total) * 100)}%</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// CARD WRAPPER
// ─────────────────────────────────────────────────────────────
const InsightCard = ({ title, subtitle, icon, children, index }) => (
  <motion.div
    className="summit-glass-card"
    custom={index}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.2 }}
    variants={cardVariants}
    style={{ padding: '28px', position: 'relative', overflow: 'hidden' }}
  >
    {/* Ambient glow top-left */}
    <div style={{
      position: 'absolute', top: -40, left: -40,
      width: '200px', height: '200px',
      borderRadius: '50%',
      background: `radial-gradient(circle, ${PALETTE[index % PALETTE.length]}12, transparent 70%)`,
      pointerEvents: 'none',
    }} />

    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
      <div>
        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
          {subtitle}
        </div>
        <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--s-font-display)', margin: 0, color: '#fff', fontWeight: 700 }}>
          {title}
        </h3>
      </div>
      <div style={{
        width: '40px', height: '40px', borderRadius: '12px',
        background: `${PALETTE[index % PALETTE.length]}18`,
        border: `1px solid ${PALETTE[index % PALETTE.length]}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.2rem', flexShrink: 0,
      }}>
        {icon}
      </div>
    </div>

    {children}
  </motion.div>
);

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
const VisualInsights = ({ stats, registrations = [] }) => {
  const timeSeriesData = useMemo(() => {
    if (!registrations?.length) return [];
    const groups = {};
    registrations.forEach(r => {
      const d = new Date(r.createdAt || Date.now()).toLocaleDateString('en-EG', { month: 'short', day: 'numeric' });
      groups[d] = (groups[d] || 0) + 1;
    });
    return Object.entries(groups).map(([date, count]) => ({ date, count })).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [registrations]);

  const trackData = useMemo(() => {
    if (!stats?.byTrack) return [];
    return Object.entries(stats.byTrack).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [stats]);

  const govData = useMemo(() => {
    if (!stats?.byGovernorate) return [];
    return Object.entries(stats.byGovernorate).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 6);
  }, [stats]);

  const maxGov = govData[0]?.value || 1;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px', marginBottom: '28px' }}>

      {/* ── Registration Pulse ── */}
      <InsightCard title="Registration Pulse" subtitle="Over Time" icon="📈" index={0}>
        {timeSeriesData.length > 0 ? (
          <div style={{ height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeSeriesData} margin={{ top: 8, right: 8, left: -28, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaGold" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"  stopColor="#f5c518" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#f5c518" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="transparent"
                  tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="transparent"
                  tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<PremiumTooltip />} cursor={{ stroke: 'rgba(245,197,24,0.15)', strokeWidth: 1 }} />
                <Area
                  type="monotone"
                  dataKey="count"
                  name="Registrations"
                  stroke="#f5c518"
                  strokeWidth={3}
                  dot={{ fill: '#f5c518', r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 7, fill: '#f5c518', stroke: '#fff', strokeWidth: 2 }}
                  fill="url(#areaGold)"
                  animationDuration={1800}
                  animationEasing="ease-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyState icon="📈" message="Registrations will appear here as data comes in" />
        )}
      </InsightCard>

      {/* ── Track Popularity ── */}
      <InsightCard title="Track Popularity" subtitle="Interests" icon="🎯" index={1}>
        {trackData.length > 0 ? (
          <AnimatedDonut data={trackData} />
        ) : (
          <EmptyState icon="🎯" message="Track selections will appear here" />
        )}
      </InsightCard>

      {/* ── Governorate Leaders ── */}
      <InsightCard title="Governorate Leaders" subtitle="Geographic Reach" icon="📍" index={2}>
        {govData.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '4px' }}>
            {govData.map((g, i) => (
              <AnimatedBar
                key={g.name}
                name={g.name}
                value={g.value}
                max={maxGov}
                color={PALETTE[(i + 2) % PALETTE.length]}
                index={i}
              />
            ))}
          </div>
        ) : (
          <EmptyState icon="📍" message="Geographic data will populate here" />
        )}
      </InsightCard>

    </div>
  );
};

export default React.memo(VisualInsights);
