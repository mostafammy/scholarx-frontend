/**
 * Test file for EventRegistrationModal Component
 * This file demonstrates how to test the event registration feature
 *
 * To run tests, you'll need to install testing dependencies:
 * npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event vitest
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EventRegistrationModal from "./EventRegistrationModal";

describe("EventRegistrationModal", () => {
  const mockOnClose = vi.fn();
  const mockOnSubmit = vi.fn();

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onSubmit: mockOnSubmit,
    eventTitle: "Test Event",
  };

  beforeEach(() => {
    mockOnClose.mockClear();
    mockOnSubmit.mockClear();
  });

  it("should render the modal when isOpen is true", () => {
    render(<EventRegistrationModal {...defaultProps} />);

    expect(
      screen.getByText(/Register Interest - Test Event/i),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
  });

  it("should not render the modal when isOpen is false", () => {
    render(<EventRegistrationModal {...defaultProps} isOpen={false} />);

    expect(screen.queryByText(/Register Interest/i)).not.toBeInTheDocument();
  });

  it("should display validation errors for required fields", async () => {
    const user = userEvent.setup();
    render(<EventRegistrationModal {...defaultProps} />);

    const submitButton = screen.getByRole("button", {
      name: /Submit Registration/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Full name must be at least 2 characters/i),
      ).toBeInTheDocument();
    });
  });

  it("should validate age is greater than 16", async () => {
    const user = userEvent.setup();
    render(<EventRegistrationModal {...defaultProps} />);

    const ageInput = screen.getByLabelText(/Age/i);
    await user.type(ageInput, "15");

    const submitButton = screen.getByRole("button", {
      name: /Submit Registration/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/You must be at least 17 years old/i),
      ).toBeInTheDocument();
    });
  });

  it("should show university and faculty fields when study level is Undergraduate", async () => {
    const user = userEvent.setup();
    render(<EventRegistrationModal {...defaultProps} />);

    const studyLevelSelect = screen.getByLabelText(/Study Level/i);
    await user.selectOptions(studyLevelSelect, "Undergraduate");

    await waitFor(() => {
      expect(screen.getByLabelText(/University/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Faculty/i)).toBeInTheDocument();
    });
  });

  it("should hide university and faculty fields when study level is High School", async () => {
    const user = userEvent.setup();
    render(<EventRegistrationModal {...defaultProps} />);

    const studyLevelSelect = screen.getByLabelText(/Study Level/i);
    await user.selectOptions(studyLevelSelect, "High School");

    await waitFor(() => {
      expect(screen.queryByLabelText(/University/i)).not.toBeInTheDocument();
      expect(screen.queryByLabelText(/Faculty/i)).not.toBeInTheDocument();
    });
  });

  it("should validate WhatsApp number format", async () => {
    const user = userEvent.setup();
    render(<EventRegistrationModal {...defaultProps} />);

    const whatsappInput = screen.getByLabelText(/WhatsApp Number/i);
    await user.type(whatsappInput, "1234567890"); // Without country code

    const submitButton = screen.getByRole("button", {
      name: /Submit Registration/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(
          /Please enter a valid phone number with country code/i,
        ),
      ).toBeInTheDocument();
    });
  });

  it("should validate email format", async () => {
    const user = userEvent.setup();
    render(<EventRegistrationModal {...defaultProps} />);

    const emailInput = screen.getByLabelText(/Email/i);
    await user.type(emailInput, "invalidemail");

    const submitButton = screen.getByRole("button", {
      name: /Submit Registration/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Please enter a valid email address/i),
      ).toBeInTheDocument();
    });
  });

  it("should require at least one interest to be selected", async () => {
    const user = userEvent.setup();
    render(<EventRegistrationModal {...defaultProps} />);

    // Fill all required fields except interests
    await user.type(screen.getByLabelText(/Full Name/i), "John Doe");
    await user.type(screen.getByLabelText(/Location/i), "New York");
    await user.type(screen.getByLabelText(/Age/i), "20");
    await user.selectOptions(
      screen.getByLabelText(/Study Level/i),
      "High School",
    );
    await user.type(screen.getByLabelText(/Email/i), "john@example.com");
    await user.type(screen.getByLabelText(/WhatsApp Number/i), "+1234567890");

    const submitButton = screen.getByRole("button", {
      name: /Submit Registration/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Please select at least one interest/i),
      ).toBeInTheDocument();
    });
  });

  it("should successfully submit valid form data", async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockResolvedValue(undefined);

    render(<EventRegistrationModal {...defaultProps} />);

    // Fill all required fields
    await user.type(screen.getByLabelText(/Full Name/i), "John Doe");
    await user.type(screen.getByLabelText(/Location/i), "New York");
    await user.type(screen.getByLabelText(/Age/i), "20");
    await user.selectOptions(
      screen.getByLabelText(/Study Level/i),
      "High School",
    );
    await user.type(screen.getByLabelText(/Email/i), "john@example.com");
    await user.type(screen.getByLabelText(/WhatsApp Number/i), "+1234567890");

    // Select at least one interest
    const firstInterest = screen.getByRole("checkbox", {
      name: /Scholarship Opportunities/i,
    });
    await user.click(firstInterest);

    const submitButton = screen.getByRole("button", {
      name: /Submit Registration/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          fullName: "John Doe",
          location: "New York",
          age: 20,
          studyLevel: "High School",
          email: "john@example.com",
          whatsAppNumber: "+1234567890",
          interests: expect.arrayContaining(["Scholarship Opportunities"]),
        }),
      );
    });
  });

  it("should close modal when close button is clicked", async () => {
    const user = userEvent.setup();
    render(<EventRegistrationModal {...defaultProps} />);

    const closeButton = screen.getByRole("button", { name: /Close modal/i });
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("should close modal when cancel button is clicked", async () => {
    const user = userEvent.setup();
    render(<EventRegistrationModal {...defaultProps} />);

    const cancelButton = screen.getByRole("button", { name: /Cancel/i });
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("should close modal when clicking backdrop", async () => {
    const user = userEvent.setup();
    render(<EventRegistrationModal {...defaultProps} />);

    const backdrop = screen.getByRole("dialog").parentElement;
    await user.click(backdrop);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("should disable submit button while submitting", async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000)),
    );

    render(<EventRegistrationModal {...defaultProps} />);

    // Fill valid form data
    await user.type(screen.getByLabelText(/Full Name/i), "John Doe");
    await user.type(screen.getByLabelText(/Location/i), "New York");
    await user.type(screen.getByLabelText(/Age/i), "20");
    await user.selectOptions(
      screen.getByLabelText(/Study Level/i),
      "High School",
    );
    await user.type(screen.getByLabelText(/Email/i), "john@example.com");
    await user.type(screen.getByLabelText(/WhatsApp Number/i), "+1234567890");
    await user.click(
      screen.getByRole("checkbox", { name: /Scholarship Opportunities/i }),
    );

    const submitButton = screen.getByRole("button", {
      name: /Submit Registration/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveTextContent(/Submitting.../i);
    });
  });
});
