import React, { memo } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import {
  FiInbox,
  FiPhoneCall,
  FiCheckCircle,
  FiXCircle,
  FiPieChart,
} from "react-icons/fi";
import styles from "./StatsCards.module.css";

const CARDS = [
  {
    key: "new",
    label: "New",
    icon: <FiInbox />,
    color: "#3b82f6",
    colorLight: "#93c5fd",
    bg: "rgba(59, 130, 246, 0.1)",
  },
  {
    key: "contacted",
    label: "Contacted",
    icon: <FiPhoneCall />,
    color: "#f59e0b",
    colorLight: "#fcd34d",
    bg: "rgba(245, 158, 11, 0.1)",
  },
  {
    key: "converted",
    label: "Converted",
    icon: <FiCheckCircle />,
    color: "#10b981",
    colorLight: "#6ee7b7",
    bg: "rgba(16, 185, 129, 0.1)",
  },
  {
    key: "lost",
    label: "Lost",
    icon: <FiXCircle />,
    color: "#ef4444",
    colorLight: "#fca5a5",
    bg: "rgba(239, 68, 68, 0.1)",
  },
  {
    key: "total",
    label: "Total",
    icon: <FiPieChart />,
    color: "#6366f1",
    colorLight: "#a5b4fc",
    bg: "rgba(99, 102, 241, 0.1)",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

/**
 * StatsCards
 * Renders a row of summary cards for the sales dashboard.
 * Stat keys: new, contacted, converted, lost, total
 */
const StatsCards = ({ stats, isLoading }) => (
  <motion.div
    className={styles.grid}
    role="region"
    aria-label="Inquiry statistics"
    variants={containerVariants}
    initial="hidden"
    animate="show"
  >
    {CARDS.map(({ key, label, icon, color, colorLight, bg }) => (
      <motion.div
        key={key}
        variants={cardVariants}
        className={styles.card}
        style={{
          "--card-color": color,
          "--card-color-light": colorLight,
          "--card-bg": bg,
        }}
        aria-label={`${label}: ${stats?.[key] ?? "—"}`}
      >
        <div className={styles.header}>
          <span className={styles.label}>{label}</span>
          <div className={styles.iconWrap} aria-hidden="true">
            {icon}
          </div>
        </div>

        {isLoading ? (
          <div className={styles.countLoading} aria-hidden="true" />
        ) : (
          <motion.span
            className={styles.count}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            {stats?.[key] ?? 0}
          </motion.span>
        )}
      </motion.div>
    ))}
  </motion.div>
);

StatsCards.propTypes = {
  stats: PropTypes.shape({
    new: PropTypes.number,
    contacted: PropTypes.number,
    converted: PropTypes.number,
    lost: PropTypes.number,
    total: PropTypes.number,
  }),
  isLoading: PropTypes.bool,
};

StatsCards.defaultProps = {
  stats: null,
  isLoading: false,
};

export default memo(StatsCards);
