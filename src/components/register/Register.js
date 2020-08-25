import React, { useState, useContext, useEffect } from "react";
import { RegisterContainer } from "./styled";
import { axiosReq as axios } from "../../util/axios/requests";
import { AppContext } from "../../contexts/context";
import { validatePasswordStructure } from "../../util/misc";
import { FAILURE, LOGIN_SUCCESS } from "../../reducer/dispatch-types";

function Register({ history }) {
  const { dispatch } = useContext(AppContext);
  const [inputs, setInputs] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState({});
  const {
    firstName,
    lastName,
    email,
    username,
    password,
    confirmPassword,
  } = inputs;

  useEffect(() => {
    setPasswordMatch(password === confirmPassword);
  }, [password, confirmPassword]);

  useEffect(() => {
    const result = validatePasswordStructure(password);
    setIsValidPassword(result);
  }, [password]);

  const handleChange = (event) => {
    setInputs({ ...inputs, [event.target.name]: event.target.value });
  };

  const PasswordDisplay = () => {
    return (
      <div>
        <p className={assignClass(isValidPassword.all)}>
          Password must be 8 characters long and contain one of the following:
        </p>
        <ul>
          <li className={assignClass(isValidPassword.upperCase)}>Uppercase </li>
          <li className={assignClass(isValidPassword.lowerCase)}>Lowercase </li>
          <li className={assignClass(isValidPassword.number)}>Number </li>
          <li className={assignClass(isValidPassword.special)}>Special</li>
        </ul>
      </div>
    );
  };

  const assignClass = (valid) => {
    return valid ? "valid" : "invalid";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    const blankInputMsg = "Required field.";
    for (const [key, value] of Object.entries(inputs)) {
      if (value === "") {
        setErrors((prevErrors) => {
          return {
            ...prevErrors,
            [key]: prevErrors[key]
              ? [...prevErrors[key], blankInputMsg]
              : [blankInputMsg],
          };
        });
      }
    }
    if (
      Object.keys(errors).length === 0 &&
      isValidPassword.all &&
      passwordMatch
    ) {
      try {
        const user = { ...inputs };
        delete user.confirmPassword;
        const response = await axios("post", "/auth/register", user);
        dispatch({ type: LOGIN_SUCCESS, payload: response.data.newUser });
        localStorage.setItem("jwt", response.data.token);
        history.push("/app");
      } catch (error) {
        console.log(error.response);
        dispatch({ type: FAILURE, payload: error.response.data.message });
      }
    }
  };

  return (
    <RegisterContainer>
      <p>Register</p>
      <form onSubmit={(e) => handleSubmit(e)} data-testid="register-form">
        <label htmlFor="firstName">First Name</label>
        <span>{errors.firstName && errors.firstName.join(" ")}</span>
        <input
          name="firstName"
          value={firstName}
          type="text"
          onChange={(e) => handleChange(e)}
          data-testid="register-form-input"
        />
        {/* {errors.firstName && errors.firstName.join(" ")} */}
        <label htmlFor="lastName">Last Name</label>
        <input
          name="lastName"
          value={lastName}
          type="text"
          onChange={(e) => handleChange(e)}
          data-testid="register-form-input"
        />
        {errors.lastName && errors.lastName.join(" ")}
        <label htmlFor="email">Email</label>
        <input
          name="email"
          value={email}
          type="email"
          onChange={(e) => handleChange(e)}
          data-testid="register-form-input"
        />
        {errors.email && errors.email.join(" ")}
        <label htmlFor="username">Username</label>
        <input
          name="username"
          value={username}
          type="text"
          onChange={(e) => handleChange(e)}
          data-testid="register-form-input"
        />
        {errors.username && errors.username.join(" ")}
        <label htmlFor="password">Password</label>
        <input
          name="password"
          value={password}
          type="password"
          onChange={(e) => handleChange(e)}
          data-testid="register-form-input-password"
        />
        {PasswordDisplay()}
        {errors.password && errors.password.join(" ")}
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          className={
            passwordMatch && confirmPassword !== "" ? "match" : "differ"
          }
          name="confirmPassword"
          value={confirmPassword}
          type="password"
          onChange={(e) => handleChange(e)}
          data-testid="register-form-input-confirm"
        />
        {errors.confirmPassword && errors.confirmPassword.join(" ")}
        <button type="submit">Submit</button>
      </form>
    </RegisterContainer>
  );
}

export default Register;
