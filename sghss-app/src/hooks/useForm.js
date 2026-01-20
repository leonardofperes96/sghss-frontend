import { useState } from "react";

export const useForm = (validation) => {
  const [enteredValue, setEnteredValue] = useState("");
  const [isTouched, setIsTouched] = useState(false);

  const isValueValid = validation(enteredValue);
  const hasError = !isValueValid && isTouched;

  const enteredValueChangeHandler = (e) => {
    setEnteredValue(e.target.value);
  };

  const enteredValueBlurHandler = (e) => {
    setIsTouched(true);
  };

  const reset = () => {
    setEnteredValue("");
    setIsTouched(false);
  };

  return {
    enteredValueChangeHandler,
    enteredValueBlurHandler,
    reset,
    enteredValue,
    hasError,
    isValueValid,
  };
};
