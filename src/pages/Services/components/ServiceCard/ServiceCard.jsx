import React from "react";
import PropTypes from "prop-types";
import "./ServiceCard.css";
import useEventInterest from "../../hooks/useEventInterest";

/**
 * ServiceCard Component
 * Displays a summary card for event services with registration capability
 */
const ServiceCard = ({
  icon: Icon,
  title,
  description,
  onRegisterClick,
  eventId,
  isCheckingStatus = false,
  isRegistered = false,
  iconColor = "#3399CC",
  iconBgColor = "#e6f7ff",
}) => {
  // Always call hook (hooks must be called unconditionally). Use hook values only when parent didn't provide them.
  const hook = useEventInterest(eventId);
  const localIsChecking =
    typeof isCheckingStatus === "undefined"
      ? hook.isCheckingStatus
      : isCheckingStatus;
  const localIsRegistered =
    typeof isRegistered === "undefined" ? hook.isRegistered : isRegistered;

  return (
    <div className="service-card">
      <div
        className="service-card__icon"
        style={{
          backgroundColor: iconBgColor,
          color: iconColor,
        }}
      >
        {Icon && <Icon />}
      </div>

      <h3 className="service-card__title">{title}</h3>

      <p className="service-card__description">{description}</p>

      <button
        className="service-card__btn"
        onClick={onRegisterClick}
        aria-label={`Register interest for ${title}`}
        disabled={localIsChecking || localIsRegistered}
      >
        {localIsChecking
          ? "Loading..."
          : localIsRegistered
            ? "✅ Registered"
            : "Register Interest"}
      </button>
    </div>
  );
};

ServiceCard.propTypes = {
  icon: PropTypes.elementType,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  onRegisterClick: PropTypes.func.isRequired,
  eventId: PropTypes.string,
  isCheckingStatus: PropTypes.bool,
  isRegistered: PropTypes.bool,
  iconColor: PropTypes.string,
  iconBgColor: PropTypes.string,
};

export default ServiceCard;
