# Event Registration - Quick Reference

## 🚀 Quick Integration

```jsx
import ServiceCard from './components/ServiceCard/ServiceCard';
import EventRegistrationModal from './components/EventRegistrationModal/EventRegistrationModal';
import { FaCalendarAlt } from 'react-icons/fa';

const [isOpen, setIsOpen] = useState(false);

<ServiceCard
  icon={FaCalendarAlt}
  title="Events"
  description="Register now"
  onRegisterClick={() => setIsOpen(true)}
/>

<EventRegistrationModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onSubmit={async (data) => {
    await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }}
  eventTitle="Workshop"
/>
```

## 📋 Form Fields

| Field       | Type         | Required      | Validation                |
| ----------- | ------------ | ------------- | ------------------------- |
| Full Name   | Text         | Yes           | 2-100 chars, letters only |
| Location    | Text         | Yes           | 2-100 chars               |
| Age         | Number       | Yes           | >16, <120                 |
| Study Level | Select       | Yes           | One of 4 options          |
| University  | Text         | Conditional\* | 2-100 chars               |
| Faculty     | Text         | Conditional\* | 2-100 chars               |
| Email       | Email        | Yes           | Valid email               |
| WhatsApp    | Tel          | Yes           | +[country code][number]   |
| Interests   | Multi-select | Yes           | 1-8 selections            |

\*Required only if Study Level is "Undergraduate" or "Graduated"

## 🎯 Study Level Options

- High School
- Undergraduate (shows University + Faculty)
- Graduated (shows University + Faculty)
- Other

## 📱 Interest Options

- Scholarship Opportunities
- Career Development
- Networking
- Academic Excellence
- Leadership Skills
- Community Service
- Research
- Entrepreneurship

## 🔧 API Endpoint

**POST** `/api/event-registration`

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

## ✅ Validation Examples

```javascript
// Valid
age: 20 ✅
email: "john@example.com" ✅
whatsAppNumber: "+12345678901" ✅

// Invalid
age: 15 ❌ (must be >16)
email: "invalid" ❌ (not valid email)
whatsAppNumber: "1234567890" ❌ (missing +)
```

## 🎨 Colors

```css
Primary: #3399CC
Error: #e74c3c
Success: #4CAF50
```

## ⌨️ Keyboard Shortcuts

- **Tab**: Navigate fields
- **Enter**: Submit form
- **Escape**: Close modal

## 🔒 Security Checklist

- [x] Input validation (Zod)
- [x] Email format check
- [x] Phone format check
- [x] Age range check
- [x] Character limits
- [ ] CAPTCHA (TODO)
- [ ] Rate limiting (TODO)
- [ ] CSRF token (TODO)

## 📝 Common Patterns

### Multiple Events

```jsx
events.map((event) => (
  <ServiceCard
    key={event.id}
    title={event.title}
    onRegisterClick={() => openModal(event)}
  />
));
```

### Custom Submit

```jsx
const handleSubmit = async (data) => {
  const result = await api.register(data);
  if (!result.success) throw new Error(result.error);
};
```

### With Authentication

```jsx
const handleSubmit = async (data) => {
  await fetch("/api/register", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};
```

## 🐛 Troubleshooting

| Issue                  | Solution                  |
| ---------------------- | ------------------------- |
| Modal won't open       | Check `isOpen` state      |
| Form won't submit      | Check all required fields |
| Validation not working | Verify Zod schema import  |
| Fields not conditional | Check `studyLevel` value  |
| Styling issues         | Check CSS import order    |

## 📦 Dependencies

```json
{
  "react-hook-form": "^7.x",
  "zod": "^3.x",
  "@hookform/resolvers": "^3.x",
  "react-icons": "^5.x",
  "sweetalert2": "^11.x"
}
```

## 📚 Documentation

- [README.md](./README.md) - Full documentation
- [USAGE.md](./USAGE.md) - Integration guide
- [IMPLEMENTATION.md](./IMPLEMENTATION.md) - Implementation details
- [EventRegistrationModal.test.jsx](./EventRegistrationModal.test.jsx) - Test examples

---

**Need help?** Check the full documentation above.
