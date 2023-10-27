// WelcomeView.test.js
import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import WelcomeView from "../../src/views/WelcomeView";
import { useWelcomePresenter } from "../../src/presenters/WelcomePresenter";

// Mock the WelcomePresenter module
jest.mock("../../src/presenters/WelcomePresenter", () => ({
  useWelcomePresenter: jest.fn(() => ({
    onSignInPress: jest.fn(),
    onSignUpPress: jest.fn(),
  })),
}));

describe("WelcomeView", () => {
  it("renders correctly", () => {
    const { getByText, getByTestId } = render(<WelcomeView />);

    expect(getByText("MMMA")).toBeTruthy();
    expect(getByText("By Leo Jia")).toBeTruthy();
  });

  it("calls onSignInPress and onSignUpPress on button click", () => {
    // Spy functions
    const onSignInPress = jest.fn();
    const onSignUpPress = jest.fn();

    // Replace the mocked functions with spy functions
    useWelcomePresenter.mockReturnValue({ onSignInPress, onSignUpPress });

    const { getByText } = render(<WelcomeView />);

    const signInButton = getByText("Sign In");
    const signUpButton = getByText("Sign Up");

    // Simulate button clicks
    fireEvent.press(signInButton);
    fireEvent.press(signUpButton);

    // Check if onSignInPress and onSignUpPress were called once for each button click
    expect(onSignInPress).toHaveBeenCalledTimes(1);
    expect(onSignUpPress).toHaveBeenCalledTimes(1);
  });
});
