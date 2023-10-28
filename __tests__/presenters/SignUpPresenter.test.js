// SignUpPresenter.test.js
import React from "react";
import { useSignUpPresenter } from "../../src/presenters/SignUpPresenter";
import { renderHook, act } from "@testing-library/react-native";

// Mock dependencies and functions
jest.mock("../../src/models/AuthModel", () => ({
  signUp: jest.fn(() => Promise.resolve({ userSub: "mockedUserSub" })),
}));
jest.mock("react-native", () => ({
  Alert: {
    alert: jest.fn(),
  },
}));

describe("useSignUpPresenter", () => {
  beforeEach(() => {
    // Reset mock functions before each test
    jest.clearAllMocks();
  });
  it("should handle successful sign-up", async () => {
    const navigation = {
      navigate: jest.fn(),
    };

    const { result } = renderHook(() => useSignUpPresenter(navigation));

    // Simulate user input
    act(() => {
      result.current.setFirstName("John");
      result.current.setEmail("test@example.com");
      result.current.setPassword("password123");
      result.current.setPasswordRepeat("password123");
    });

    // Simulate sign-up button press
    await act(async () => {
      await result.current.onSignUpPressed();
    });

    expect(result.current.signingUp).toBe(false);

    // Ensure signUp function was called with the correct arguments
    expect(require("../../src/models/AuthModel").signUp).toHaveBeenCalledWith(
      "John",
      "test@example.com",
      "password123"
    );

    // Ensure navigation to "ConfirmEmailScreen" was called upon successful sign-up
    expect(navigation.navigate).toHaveBeenCalledWith("ConfirmEmailScreen", {
      email: "test@example.com",
      firstName: "John",
      userSub: "mockedUserSub",
      password: "password123",
    });
  });

  it("should handle sign-up error with validation/conform error", async () => {
    const navigation = {
      navigate: jest.fn(),
    };

    const errorMessage = "Password validation error";
    require("../../src/models/AuthModel").signUp.mockRejectedValue(
      new Error(errorMessage)
    );

    const { result } = renderHook(() => useSignUpPresenter(navigation));

    // Simulate user input
    act(() => {
      result.current.setFirstName("John");
      result.current.setEmail("test@example.com");
      result.current.setPassword("weakpassword");
      result.current.setPasswordRepeat("weakpassword");
    });

    // Simulate sign-up button press
    await act(async () => {
      await result.current.onSignUpPressed();
    });

    expect(result.current.signingUp).toBe(false);

    // Ensure Alert.alert was called with the validation error message
    expect(require("react-native").Alert.alert).toHaveBeenCalledWith(
      "Sign Up Failed",
      "Passwords must contain 8 or more characters, contain uppercase letters, lowercase letters, numerals, and symbols (such as !, $, %)",
      [{ text: "Try Again" }]
    );
  });

  it("should handle other sign-up errors", async () => {
    const navigation = {
      navigate: jest.fn(),
    };

    const errorMessage = "Another error message";
    require("../../src/models/AuthModel").signUp.mockRejectedValue(
      new Error(errorMessage)
    );

    const { result } = renderHook(() => useSignUpPresenter(navigation));

    // Simulate user input
    act(() => {
      result.current.setFirstName("John");
      result.current.setEmail("test@example.com");
      result.current.setPassword("password123");
      result.current.setPasswordRepeat("password123");
    });

    // Simulate sign-up button press
    await act(async () => {
      await result.current.onSignUpPressed();
    });

    expect(result.current.signingUp).toBe(false);

    // Ensure Alert.alert was called with the error message
    expect(require("react-native").Alert.alert).toHaveBeenCalledWith(
      "Sign Up Failed",
      errorMessage.replace("Username", "Email"),
      [{ text: "Try Again" }]
    );
  });

  it("should handle missing fields", async () => {
    const navigation = {
      navigate: jest.fn(),
    };

    const { result } = renderHook(() => useSignUpPresenter(navigation));

    // Simulate user input with missing fields
    act(() => {
      result.current.setFirstName("John");
      result.current.setEmail("");
      result.current.setPassword("password123");
      result.current.setPasswordRepeat("password123");
    });

    // Simulate sign-up button press
    await act(async () => {
      await result.current.onSignUpPressed();
    });

    // Ensure Alert.alert was called for missing fields
    expect(require("react-native").Alert.alert).toHaveBeenCalledWith(
      "Sign Up Failed",
      "Please fill in all fields",
      [{ text: "Try Again" }]
    );
  });

  it("should handle password mismatch", async () => {
    const navigation = {
      navigate: jest.fn(),
    };

    const { result } = renderHook(() => useSignUpPresenter(navigation));

    // Simulate user input with password mismatch
    act(() => {
      result.current.setFirstName("John");
      result.current.setEmail("test@example.com");
      result.current.setPassword("password123");
      result.current.setPasswordRepeat("password456");
    });

    // Simulate sign-up button press
    await act(async () => {
      await result.current.onSignUpPressed();
    });

    // Ensure signUp function is not called and no navigation occurs
    expect(require("../../src/models/AuthModel").signUp).not.toHaveBeenCalled();
    expect(navigation.navigate).not.toHaveBeenCalled();
  });
});
