/**
 * TableOfContents Component
 * Sticky sidebar navigation for quick access to policy sections
 * Following Interface Segregation - receives only data it needs
 */

import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import styles from "./TableOfContents.module.css";

const TableOfContents = ({ items, offsetTop = 100 }) => {
  const [activeId, setActiveId] = useState(items[0]?.id || "");
  const [isExpanded, setIsExpanded] = useState(false);

  // Handle scroll to update active section
  const handleScroll = useCallback(() => {
    const sections = items
      .map((item) => ({
        id: item.id,
        element: document.getElementById(item.id),
      }))
      .filter((s) => s.element !== null);

    if (sections.length === 0) return;

    const scrollPosition = window.scrollY + 200; // Increased offset for better detection

    // Find the active section
    let activeSection = sections[0].id;

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      if (section.element.offsetTop <= scrollPosition) {
        activeSection = section.id;
      }
    }

    setActiveId(activeSection);
  }, [items]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run initial check after a small delay to ensure DOM is ready
    setTimeout(handleScroll, 100);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Helper to find the scrollable parent
  const getScrollParent = (node) => {
    if (node == null) {
      return window;
    }

    if (node.scrollHeight > node.clientHeight) {
      const overflowY = window.getComputedStyle(node).overflowY;
      const isScrollable = overflowY !== "visible" && overflowY !== "hidden";

      if (isScrollable) {
        return node;
      }
    }

    return getScrollParent(node.parentNode);
  };

  // Smooth scroll to section
  const scrollToSection = useCallback((id) => {
    const element = document.getElementById(id);

    if (!element) {
      console.error("Element not found for ID:", id);
      return;
    }

    // Find the scrollable container
    const scrollContainer = getScrollParent(element);
    const isWindow = scrollContainer === window;

    // Calculate relative position
    // If window: use offsetTop (absolute)
    // If container: use offsetTop relative to container + container.scrollTop
    const navbarHeight = 70;
    const padding = 20;

    let targetScrollTop;

    if (isWindow) {
      targetScrollTop = element.offsetTop - navbarHeight - padding;
    } else {
      // For element containers, we need to calculate relative position
      const containerRect = scrollContainer.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      const relativeTop = elementRect.top - containerRect.top;
      targetScrollTop =
        scrollContainer.scrollTop + relativeTop - navbarHeight - padding;
    }

    console.log("Scrolling container:", isWindow ? "window" : "element");
    console.log("Target scroll top:", targetScrollTop);

    scrollContainer.scrollTo({
      top: targetScrollTop,
      behavior: "smooth",
    });

    setActiveId(id);
    setIsExpanded(false); // Close mobile menu after click
  }, []);

  const handleKeyDown = useCallback(
    (e, id) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        scrollToSection(id);
      }
    },
    [scrollToSection],
  );

  return (
    <nav
      className={styles.toc}
      aria-label="Table of contents"
      role="navigation"
    >
      {/* Mobile Toggle Button */}
      <button
        className={styles.mobileToggle}
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-controls="toc-list"
      >
        <span className={styles.toggleIcon}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </span>
        <span>Contents</span>
        <svg
          className={`${styles.chevron} ${isExpanded ? styles.chevronUp : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Table of Contents List */}
      <div
        id="toc-list"
        className={`${styles.listWrapper} ${isExpanded ? styles.expanded : ""}`}
      >
        <h2 className={styles.title}>On This Page</h2>
        <ul className={styles.list}>
          {items.map((item, index) => (
            <li key={item.id} className={styles.item}>
              <button
                className={`${styles.link} ${activeId === item.id ? styles.active : ""}`}
                onClick={() => scrollToSection(item.id)}
                onKeyDown={(e) => handleKeyDown(e, item.id)}
                aria-current={activeId === item.id ? "location" : undefined}
                style={{ "--index": index }}
              >
                <span className={styles.indicator}></span>
                <span className={styles.label}>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

TableOfContents.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
  offsetTop: PropTypes.number,
};

export default React.memo(TableOfContents);
