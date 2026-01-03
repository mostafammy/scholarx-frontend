/**
 * CheckList Component
 * Renders a list with checkmark icons
 * Following Single Responsibility and Open/Closed Principles
 */

import React, { memo } from "react";
import PropTypes from "prop-types";
import styles from "./CheckList.module.css";

const CheckList = ({ items, className, itemClassName }) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <ul className={`${styles.list} ${className}`}>
      {items.map((item, index) => (
        <li key={index} className={`${styles.item} ${itemClassName}`}>
          <span className={styles.checkmark} aria-hidden="true">
            ✓
          </span>
          <span className={styles.text}>{item}</span>
        </li>
      ))}
    </ul>
  );
};

CheckList.propTypes = {
  /** Array of items to display */
  items: PropTypes.arrayOf(PropTypes.string),
  /** Additional CSS class for the list */
  className: PropTypes.string,
  /** Additional CSS class for each item */
  itemClassName: PropTypes.string,
};

CheckList.defaultProps = {
  items: [],
  className: "",
  itemClassName: "",
};

export default memo(CheckList);
