import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const RegistrantDrawer = ({ registrant, isOpen, onClose }) => {
  if (!isOpen || !registrant) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(4px)',
              zIndex: 999
            }}
          />
          
          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%', boxShadow: '0 0 0 rgba(0,0,0,0)' }}
            animate={{ x: 0, boxShadow: '-10px 0 30px rgba(0,0,0,0.5)' }}
            exit={{ x: '100%', boxShadow: '0 0 0 rgba(0,0,0,0)' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="summit-glass-card"
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              maxWidth: '400px',
              zIndex: 1000,
              borderRight: 'none',
              borderRadius: '24px 0 0 24px',
              padding: '32px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              backgroundColor: 'rgba(13,21,41,0.95)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontFamily: 'var(--s-font-display)', margin: 0, fontSize: '1.5rem', color: '#fff' }}>
                Profile Detail
              </h2>
              <button 
                onClick={onClose}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--s-gold-400)', fontFamily: 'var(--s-font-display)' }}>
                {registrant.fullName}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--s-text-300)' }}>
                <span>{registrant.email}</span>
                <a href={`mailto:${registrant.email}`} style={{ color: 'var(--s-blue-400)', textDecoration: 'none' }}>[Email]</a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--s-text-300)' }}>
                <span>{registrant.phone || 'No phone'}</span>
                {registrant.phone && (
                  <a href={`https://wa.me/${registrant.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" style={{ color: '#25D366', textDecoration: 'none' }}>[WhatsApp]</a>
                )}
              </div>
            </div>

            <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)' }} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--s-text-400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Governorate</div>
                <div style={{ color: '#fff', fontWeight: 500, textTransform: 'capitalize' }}>{registrant.governorate?.replace(/-/g, ' ') || '—'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--s-text-400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</div>
                <div style={{ color: '#fff', fontWeight: 500, textTransform: 'capitalize' }}>{registrant.status?.replace(/-/g, ' ') || '—'}</div>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--s-text-400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>University</div>
                <div style={{ color: '#fff', fontWeight: 500 }}>{registrant.university || '—'}</div>
              </div>
            </div>

            <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)' }} />

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--s-text-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Selected Tracks</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {registrant.tracks?.map(t => (
                  <span key={t} style={{ background: 'rgba(245,197,24,0.1)', border: '1px solid rgba(245,197,24,0.3)', color: 'var(--s-gold-400)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem' }}>
                    {t.replace(/-/g, ' ')}
                  </span>
                )) || <span style={{ color: 'var(--s-text-400)' }}>None selected</span>}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--s-text-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Source</div>
              <div style={{ color: '#fff', fontSize: '0.9rem', lineHeight: 1.5 }}>
                {registrant.referralSources?.join(', ') || '—'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--s-text-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Registered At</div>
              <div style={{ color: '#fff', fontSize: '0.9rem' }}>
                {new Date(registrant.createdAt || Date.now()).toLocaleString('en-EG')}
              </div>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default RegistrantDrawer;
