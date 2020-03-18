import React from "react";
import { mount, shallow } from "enzyme";
import Login from "./Login";
import moxios from "moxios";

const initialState = {
  username: "",
  password: "",
  isLoading: false,
  error: ""
};

// This should be called in place of the reducer's dispatch function
const mockDispatch = jest.fn();

/**
 * Function to setup the Login component for testing.
 * @param {object} state - State information that will be specific to each test
 * @returns {ReactWrapper}
 */
const setup = (state = {}) => {
  // Resets the jest.fn() to prevent overlaps between tests
  mockDispatch.mockClear();
  const newState = { ...initialState, ...state };

  // Replace the React hook with mock test versions
  const mockUseReducer = jest.fn().mockReturnValue([newState, mockDispatch]);
  React.useReducer = mockUseReducer;

  return mount(<Login />);
};

describe("<Login />", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<Login />);
  });
  test("should render without error", () => {
    const component = wrapper.find(".login-component");
    expect(component.length).toBe(1);
  });

  test("should contain an input for username", () => {
    const userInput = wrapper.find('input[name="username"]');
    expect(userInput.length).toBe(1);
  });
  test("should contain an input for password", () => {
    const passwordInput = wrapper.find('input[name="password"]');
    expect(passwordInput.length).toBe(1);
  });
  test("should contain a submit button", () => {
    const submitBtn = wrapper.find("#login-submit");
    expect(submitBtn.length).toBe(1);
  });
});

describe("input fields", () => {
  let mockSetState = jest.fn();
  let wrapper;

  beforeEach(() => {
    mockSetState.mockClear();
    wrapper = setup();
  });

  test("that username state updates to match input value", () => {
    const usernameInput = wrapper.find('input[name="username"]');
    const mockEvent = { target: { value: "testuser" } };
    usernameInput.simulate("change", mockEvent);

    const testDispatch = {
      type: "change",
      payload: "testuser",
      field: "username"
    };
    expect(mockDispatch).toHaveBeenCalledWith(testDispatch);
  });
  test("that password state updates to match input value", () => {
    const passwordInput = wrapper.find('input[name="password"]');
    const mockEvent = { target: { value: "test123" } };
    passwordInput.simulate("change", mockEvent);

    const testDispatch = {
      type: "change",
      payload: "test123",
      field: "password"
    };
    expect(mockDispatch).toHaveBeenCalledWith(testDispatch);
  });
});

describe("Component States", () => {
  let wrapper;

  // Error State
  test("error message should display when error state is set to true", () => {
    wrapper = setup({ error: "Something went wrong" });
    const errorMsg = wrapper.find(".error-message");

    expect(errorMsg.text()).toBe("Something went wrong");
  });

  // Loading State
  test('Submit button should be disabled and read "Loading..." when loading state is true', () => {
    wrapper = setup({ isLoading: true });
    const loginBtn = wrapper.find("#login-submit");

    expect(loginBtn.props().disabled).toBe(true);
    expect(loginBtn.text()).toBe("Loading...");
  });
});

describe("HTTP requests", () => {
  let wrapper;
  beforeEach(() => {
    moxios.install();
    wrapper = setup();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  test("dispatch called to intialize loading", () => {
    mockDispatch.mockClear();
    const form = wrapper.find(".login-form");
    form.simulate("submit");

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 500,
        response: {}
      });
    });

    expect(mockDispatch).toHaveBeenCalled();
  });
});