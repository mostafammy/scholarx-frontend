# Event Interest Registration - Usage Guide

## Quick Start

### 1. Basic Setup

The feature is already integrated into the Services page. To use it in other pages:

```jsx
import { useState } from "react";
import ServiceCard from "@/pages/Services/components/ServiceCard/ServiceCard";
import EventRegistrationModal from "@/pages/Services/components/EventRegistrationModal/EventRegistrationModal";
import { FaCalendarAlt } from "react-icons/fa";
import Swal from "sweetalert2";

function YourComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (data) => {
    try {
      // Your API integration here
      const response = await fetch("/api/event-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to register");

      await Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Your registration has been received.",
        confirmButtonColor: "#3399CC",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong. Please try again.",
        confirmButtonColor: "#e74c3c",
      });
      throw error;
    }
  };

  return (
    <>
      <ServiceCard
        icon={FaCalendarAlt}
        title="Register for Events"
        description="Join our upcoming workshops and webinars"
        onRegisterClick={() => setIsModalOpen(true)}
      />

      <EventRegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        eventTitle="Tech Workshop 2026"
      />
    </>
  );
}
```

### 2. API Integration

Replace the mock submission in `Services.jsx` with actual API call:

```jsx
import { submitEventRegistration } from "./services/eventRegistrationApi";

const handleEventRegistration = async (data) => {
  try {
    const result = await submitEventRegistration(data);

    if (!result.success) {
      throw new Error(result.error);
    }

    await Swal.fire({
      icon: "success",
      title: "Registration Successful!",
      text: "We will contact you soon.",
      confirmButtonColor: "#3399CC",
    });
  } catch (error) {
    await Swal.fire({
      icon: "error",
      title: "Registration Failed",
      text: error.message,
      confirmButtonColor: "#e74c3c",
    });
    throw error;
  }
};
```

### 3. Environment Variables

Create a `.env` file with your API URL:

```env
VITE_API_BASE_URL=https://api.scholarx.com
```

## Form Data Structure

When the form is submitted, the `onSubmit` handler receives data in this format:

```javascript
{
  fullName: "John Doe",
  location: "New York, USA",
  age: 20,
  studyLevel: "Undergraduate",
  university: "MIT",              // Only if studyLevel is 'Undergraduate' or 'Graduated'
  faculty: "Computer Science",    // Only if studyLevel is 'Undergraduate' or 'Graduated'
  email: "john@example.com",
  whatsAppNumber: "+12345678901",
  interests: ["Scholarship Opportunities", "Career Development"]
}
```

## Customization Examples

### Custom Colors

```jsx
<ServiceCard
  icon={FaRocket}
  title="My Event"
  description="Event description"
  onRegisterClick={handleClick}
  iconColor="#FF6633"
  iconBgColor="#fff2e6"
/>
```

### Multiple Events

```jsx
function ServicesPage() {
  const [activeEvent, setActiveEvent] = useState(null);

  const events = [
    {
      id: 1,
      title: "Web Development Workshop",
      icon: FaCode,
      description: "Learn modern web development",
      color: "#3399CC",
    },
    {
      id: 2,
      title: "Data Science Bootcamp",
      icon: FaChartBar,
      description: "Master data analysis",
      color: "#4CAF50",
    },
  ];

  return (
    <>
      {events.map((event) => (
        <ServiceCard
          key={event.id}
          icon={event.icon}
          title={event.title}
          description={event.description}
          onRegisterClick={() => setActiveEvent(event)}
          iconColor={event.color}
        />
      ))}

      <EventRegistrationModal
        isOpen={!!activeEvent}
        onClose={() => setActiveEvent(null)}
        onSubmit={(data) => handleSubmit({ ...data, eventId: activeEvent?.id })}
        eventTitle={activeEvent?.title || ""}
      />
    </>
  );
}
```

## Backend Integration

### Expected API Endpoint

**POST** `/api/event-registration`

**Request Body:**

```json
{
  "fullName": "John Doe",
  "location": "New York",
  "age": 20,
  "studyLevel": "Undergraduate",
  "university": "MIT",
  "faculty": "CS",
  "email": "john@example.com",
  "whatsAppNumber": "+1234567890",
  "interests": ["Scholarship Opportunities"]
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "registrationId": "reg_123456",
    "confirmationEmail": "sent"
  }
}
```

**Error Response (400/500):**

```json
{
  "success": false,
  "message": "Registration failed",
  "error": "Email already registered"
}
```

### Node.js/Express Example

```javascript
const express = require("express");
const router = express.Router();

router.post("/event-registration", async (req, res) => {
  try {
    const registrationData = req.body;

    // Validate data
    if (!registrationData.email || !registrationData.fullName) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
      });
    }

    // Check if already registered
    const existing = await Registration.findOne({
      email: registrationData.email,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        error: "Email already registered",
      });
    }

    // Save to database
    const registration = new Registration(registrationData);
    await registration.save();

    // Send confirmation email
    await sendConfirmationEmail(registrationData.email);

    res.status(200).json({
      success: true,
      message: "Registration successful",
      data: {
        registrationId: registration._id,
        confirmationEmail: "sent",
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

module.exports = router;
```

## Validation Rules

| Field       | Rule                                       | Error Message                              |
| ----------- | ------------------------------------------ | ------------------------------------------ |
| Full Name   | Min 2 chars, max 100, letters only         | "Full name must be at least 2 characters"  |
| Location    | Min 2 chars, max 100                       | "Location must be at least 2 characters"   |
| Age         | Integer, min 17, max 120                   | "You must be at least 17 years old"        |
| Study Level | Required selection                         | "Please select your study level"           |
| University  | Required if Undergraduate/Graduated, min 2 | "University is required"                   |
| Faculty     | Required if Undergraduate/Graduated, min 2 | "Faculty is required"                      |
| Email       | Valid email format                         | "Please enter a valid email address"       |
| WhatsApp    | Must start with +, 10-15 digits            | "Include country code (e.g., +1234567890)" |
| Interests   | Min 1, max 8 selections                    | "Please select at least one interest"      |

## Testing

Run the test suite:

```bash
npm test EventRegistrationModal.test.jsx
```

### Manual Testing Checklist

- [ ] Open modal by clicking "Register Interest"
- [ ] Try submitting empty form (should show validation errors)
- [ ] Fill all fields correctly and submit
- [ ] Test age validation (try 15, should fail)
- [ ] Select "Undergraduate" - university/faculty should appear
- [ ] Select "High School" - university/faculty should hide
- [ ] Test email format (try "invalid", should fail)
- [ ] Test phone format (try "1234567890", should fail with "include country code")
- [ ] Select multiple interests (try 9, should fail at submission)
- [ ] Test responsive design on mobile
- [ ] Test keyboard navigation (Tab, Enter, Escape)
- [ ] Test modal close (X button, Cancel button, backdrop click)

## Troubleshooting

### Modal doesn't open

```jsx
// Check state management
console.log("Modal state:", isModalOpen); // Should be true
```

### Form doesn't submit

```jsx
// Check onSubmit handler
const handleSubmit = async (data) => {
  console.log("Form data:", data); // Verify data structure
  // Your submit logic
};
```

### Validation not working

```jsx
// Check Zod schema import
import { eventRegistrationSchema } from "./eventRegistrationSchema";
console.log("Schema:", eventRegistrationSchema); // Should be defined
```

### Conditional fields not showing

```jsx
// Check studyLevel value
const studyLevel = watch("studyLevel");
console.log("Study level:", studyLevel); // Should be 'Undergraduate' or 'Graduated'
```

## Best Practices

1. **Always validate on both frontend and backend**
2. **Sanitize user input before storing**
3. **Use HTTPS for API calls in production**
4. **Implement rate limiting to prevent abuse**
5. **Send confirmation emails after registration**
6. **Log registration attempts for analytics**
7. **Implement GDPR-compliant data handling**
8. **Add CAPTCHA for production deployment**

## Support

For issues or questions:

- Check the [README.md](./README.md) for detailed documentation
- Review the test file for usage examples
- Contact the development team

---

**Last Updated:** January 2026
