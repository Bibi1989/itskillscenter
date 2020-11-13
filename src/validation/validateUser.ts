import { UserInterface, LoginInterface } from "../interfaces/userInterface";

const validateEmail = (email: string) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export const validateUserRegister = (value: UserInterface) => {
  const { username, email, password } = value;
  const error: UserInterface | any = {};
  if (!username) {
    error.username = "First nane field is empty";
  }
  if (!email) {
    error.email = "Email field is empty";
    const isEmailValid = validateEmail(email)
    if(!isEmailValid) {
      error.email = "This is not a valid mail";
    }
  }
  if (!password) {
    error.password = "Password field is empty";
  }

  return { value, error };
};

export const validateUserLogin = (value: LoginInterface) => {
  const { email, password } = value;
  const error: UserInterface | any = {};
  if (!email) {
    error.email = "Email field is empty";
  }
  if (!password) {
    error.password = "Password field is empty";
  }

  return { value, error };
};
