import React, { useState } from "react";
import ServiceCard from "../ServiceCard/ServiceCard";
import EventRegistrationModal from "../EventRegistrationModal/EventRegistrationModal";
import { FaCalendarAlt, FaRocket, FaGraduationCap } from "react-icons/fa";
import Swal from "sweetalert2";
import "./DemoPage.css";

/**
 * Demo Page for Event Registration Feature
 * This page demonstrates the Event Registration feature with multiple examples
 * Path: /services/demo (for development/testing only)
 */
const DemoPage = () => {
  const [activeModal, setActiveModal] = useState(null);

  const events = [
    {
      id: "workshop-2026",
      title: "Web Development Workshop",
      description:
        "Learn modern web development with React, Node.js, and MongoDB. Build real-world projects.",
      icon: FaRocket,
      iconColor: "#3399CC",
      iconBgColor: "#e6f7ff",
    },
    {
      id: "bootcamp-data",
      title: "Data Science Bootcamp",
      description:
        "Master data analysis, machine learning, and visualization with Python and R.",
      icon: FaGraduationCap,
      iconColor: "#4CAF50",
      iconBgColor: "#e6ffed",
    },
    {
      id: "networking-event",
      title: "Networking & Career Fair",
      description:
        "Connect with industry professionals, explore career opportunities, and build your network.",
      icon: FaCalendarAlt,
      iconColor: "#FF6633",
      iconBgColor: "#fff2e6",
    },
  ];

  const handleSubmit = async (data) => {
    try {
      console.log("Registration Data:", data);
      console.log("Event ID:", activeModal);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Show success message
      await Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        html: `
          <p><strong>Thank you for registering!</strong></p>
          <p>We've received your interest for this event.</p>
          <p>You will receive a confirmation email at <strong>${data.email}</strong></p>
          <p>We'll contact you via WhatsApp at <strong>${data.whatsAppNumber}</strong></p>
        `,
        confirmButtonColor: "#3399CC",
        confirmButtonText: "Great!",
      });

      return true;
    } catch (error) {
      console.error("Registration error:", error);

      await Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: "Something went wrong. Please try again later.",
        confirmButtonColor: "#e74c3c",
        confirmButtonText: "OK",
      });

      throw error;
    }
  };

  const showInfo = () => {
    Swal.fire({
      title: "Event Registration Demo",
      html: `
        <div style="text-align: left;">
          <h4>Features Demonstrated:</h4>
          <ul>
            <li>✅ Reusable ServiceCard component</li>
            <li>✅ React Hook Form + Zod validation</li>
            <li>✅ Conditional fields (University/Faculty)</li>
            <li>✅ Real-time validation feedback</li>
            <li>✅ Multi-select interests</li>
            <li>✅ WhatsApp with country code</li>
            <li>✅ Age validation (must be >16)</li>
            <li>✅ Responsive design</li>
            <li>✅ Keyboard navigation</li>
            <li>✅ Success/error notifications</li>
          </ul>
          <h4>Try It:</h4>
          <ol>
            <li>Click "Register Interest" on any card</li>
            <li>Fill the form (try different study levels)</li>
            <li>Watch conditional fields appear/disappear</li>
            <li>Test validation (try age 15, invalid email)</li>
            <li>Submit and see success message</li>
          </ol>
        </div>
      `,
      icon: "info",
      confirmButtonColor: "#3399CC",
      width: "600px",
    });
  };

  return (
    <div className="demo-page">
      <div className="demo-header">
        <h1>Event Registration Demo</h1>
        <p>
          Explore the Event Interest Registration feature with multiple examples
        </p>
        <button className="info-btn" onClick={showInfo}>
          ℹ️ View Feature Info
        </button>
      </div>

      <div className="demo-section">
        <h2>Available Events</h2>
        <p className="section-subtitle">
          Click "Register Interest" on any event to open the registration form
        </p>

        <div className="events-grid">
          {events.map((event) => (
            <ServiceCard
              key={event.id}
              icon={event.icon}
              title={event.title}
              description={event.description}
              onRegisterClick={() => setActiveModal(event.id)}
              iconColor={event.iconColor}
              iconBgColor={event.iconBgColor}
            />
          ))}
        </div>
      </div>

      <div className="demo-section">
        <h2>Technical Details</h2>
        <div className="tech-cards">
          <div className="tech-card">
            <h3>🎯 Form Validation</h3>
            <ul>
              <li>Zod schema validation</li>
              <li>Real-time error feedback</li>
              <li>Conditional field logic</li>
              <li>Custom error messages</li>
            </ul>
          </div>

          <div className="tech-card">
            <h3>♿ Accessibility</h3>
            <ul>
              <li>ARIA labels</li>
              <li>Keyboard navigation</li>
              <li>Focus management</li>
              <li>Screen reader support</li>
            </ul>
          </div>

          <div className="tech-card">
            <h3>📱 Responsive</h3>
            <ul>
              <li>Mobile-first design</li>
              <li>Flexible layouts</li>
              <li>Touch-friendly inputs</li>
              <li>Adaptive grids</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <h2>Integration Example</h2>
        <div className="code-example">
          <pre>
            {`import ServiceCard from './components/ServiceCard/ServiceCard';
import EventRegistrationModal from './components/EventRegistrationModal/EventRegistrationModal';
import { FaCalendarAlt } from 'react-icons/fa';

const [isOpen, setIsOpen] = useState(false);

<ServiceCard
  icon={FaCalendarAlt}
  title="Your Event"
  description="Event description"
  onRegisterClick={() => setIsOpen(true)}
/>

<EventRegistrationModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onSubmit={handleSubmit}
  eventTitle="Your Event"
/>`}
          </pre>
        </div>
      </div>

      {/* Registration Modals */}
      {events.map((event) => (
        <EventRegistrationModal
          key={event.id}
          isOpen={activeModal === event.id}
          onClose={() => setActiveModal(null)}
          onSubmit={handleSubmit}
          eventTitle={event.title}
        />
      ))}
    </div>
  );
};

export default DemoPage;
