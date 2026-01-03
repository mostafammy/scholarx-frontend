/**
 * CoursePrice Component
 * Displays course price with optional old price
 * Following Single Responsibility Principle
 */

import React, { memo } from "react";
import PropTypes from "prop-types";
import styles from "./CoursePrice.module.css";

const CoursePrice = ({ price, oldPrice, currency, className }) => {
  const isFree = price === 0;
  const hasDiscount = oldPrice > 0 && oldPrice > price;

  return (
    <div className={`${styles.container} ${className}`}>
      {isFree ? (
        <span className={styles.free}>Free</span>
      ) : (
        <>
          <span className={styles.currentPrice}>
            {price} {currency}
          </span>
          {hasDiscount && (
            <span className={styles.oldPrice}>
              {oldPrice} {currency}
            </span>
          )}
        </>
      )}
    </div>
  );
};

CoursePrice.propTypes = {
  /** Current price */
  price: PropTypes.number,
  /** Old/original price */
  oldPrice: PropTypes.number,
  /** Currency symbol */
  currency: PropTypes.string,
  /** Additional CSS class */
  className: PropTypes.string,
};

CoursePrice.defaultProps = {
  price: 0,
  oldPrice: 0,
  currency: "EGP",
  className: "",
};

export default memo(CoursePrice);
