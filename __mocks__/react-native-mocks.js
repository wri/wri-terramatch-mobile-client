import mockAsyncStorage from "@react-native-community/async-storage/jest/async-storage-mock";

/**
 * No point having alerts in headless tests so just mock the factory function so we can (i) assert it was called, and
 * (ii) invoke the button press callbacks manually
 */
jest.mock("Alert", () => ({
  alert: jest.fn()
}));

jest.mock("@react-native-community/async-storage", () => mockAsyncStorage);
