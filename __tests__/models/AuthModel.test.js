// AuthModel.test.js
import {
  signIn,
  signUp,
  confirmSignUp,
  resendCode,
  createUserInDatabase,
  signOut,
} from "../../src/models/AuthModel";
import { Auth, API } from "aws-amplify";

// Mock the aws-amplify module
jest.mock("aws-amplify", () => ({
  Auth: {
    signIn: jest.fn(),
    signUp: jest.fn(),
    confirmSignUp: jest.fn(),
    resendSignUp: jest.fn(),
    signOut: jest.fn(),
  },
  API: {
    graphql: jest.fn(),
  },
}));

describe("AuthModel", () => {
  beforeEach(() => {
    // Clear the mock function calls before each test
    jest.clearAllMocks();
  });

  it("should call Auth.signIn with the provided email and password", async () => {
    const email = "test@example.com";
    const password = "password";

    await signIn(email, password);

    expect(Auth.signIn).toHaveBeenCalledWith(email, password);
  });

  it("should call Auth.signUp with the provided first name, email, and password", async () => {
    const firstName = "John";
    const email = "test@example.com";
    const password = "password";

    await signUp(firstName, email, password);

    expect(Auth.signUp).toHaveBeenCalledWith({
      username: email,
      password,
      attributes: {
        given_name: firstName,
      },
      autoSignIn: {
        enabled: true,
      },
    });
  });

  it("should call Auth.confirmSignUp with the provided email and code", async () => {
    const email = "test@example.com";
    const code = "123456";

    await confirmSignUp(email, code);

    expect(Auth.confirmSignUp).toHaveBeenCalledWith(email, code);
  });

  it("should call Auth.resendSignUp with the provided email", async () => {
    const email = "test@example.com";

    await resendCode(email);

    expect(Auth.resendSignUp).toHaveBeenCalledWith(email);
  });

  it("should call API.graphql with the createUser mutation", async () => {
    const userSub = "123";
    const firstName = "John";
    const email = "test@example.com";

    await createUserInDatabase(userSub, firstName, email);

    expect(API.graphql).toHaveBeenCalledWith(
      expect.objectContaining({
        query: expect.stringContaining("mutation createUser"),
        variables: {
          input: {
            id: userSub,
            name: firstName,
            email,
          },
        },
      })
    );
  });

  it("should call Auth.signOut to sign the user out", async () => {
    await signOut();

    expect(Auth.signOut).toHaveBeenCalled();
  });
});
