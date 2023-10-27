// SignInPresenter.test.js
import React from "react";
import { useSignInPresenter } from "../../src/presenters/SignInPresenter";
import { renderHook, act } from "@testing-library/react-native";

// Mock dependencies and functions
jest.mock("../../src/models/AuthModel", () => ({
  signIn: jest.fn(() => Promise.resolve()),
}));
jest.mock("react-native", () => ({
  Alert: {
    alert: jest.fn(),
  },
}));

describe("useSignInPresenter", () => {
  it("should handle sign in and navigation", async () => {
    const navigation = {
      navigate: jest.fn(),
    };

    const { result } = renderHook(() => useSignInPresenter(navigation));

    // Simulate user input
    act(() => {
      result.current.setEmail("test@example.com");
      result.current.setPassword("password123");
    });

    // Simulate sign-in button press
    await act(async () => {
      await result.current.onSignInPressed();
    });

    expect(result.current.signingIn).toBe(false);

    // Ensure signIn function was called with the correct arguments
    expect(require("../../src/models/AuthModel").signIn).toHaveBeenCalledWith(
      "test@example.com",
      "password123"
    );

    // Ensure navigation to "HomeScreen" was called upon successful sign-in
    expect(navigation.navigate).toHaveBeenCalledWith("HomeScreen");
  });

  it("should handle sign-in error", async () => {
    const navigation = {
      navigate: jest.fn(),
    };

    const errorMessage = "Test error message";
    require("../../src/models/AuthModel").signIn.mockRejectedValue(
      new Error(errorMessage)
    );

    const { result } = renderHook(() => useSignInPresenter(navigation));

    // Simulate user input
    act(() => {
      result.current.setEmail("test@example.com");
      result.current.setPassword("password123");
    });

    // Simulate sign-in button press
    await act(async () => {
      await result.current.onSignInPressed();
    });

    expect(result.current.signingIn).toBe(false);

    // Ensure signIn function was called with the correct arguments
    expect(require("../../src/models/AuthModel").signIn).toHaveBeenCalledWith(
      "test@example.com",
      "password123"
    );

    // Ensure Alert.alert was called with the error message
    expect(require("react-native").Alert.alert).toHaveBeenCalledWith(
      "Sign In Failed",
      errorMessage,
      [{ text: "Try Again" }]
    );
  });
});
