import React from "react";
import { render, cleanup, getByPlaceholderText, getByTestId, getByText, queryByText, fireEvent } from "@testing-library/react";
import Form from "../Form";

afterEach(cleanup);

describe("Form", () => {
  const interviewers = [
    {
      id: 1,
      name: "Sylvia Palmer",
      avatar: "https://i.imgur.com/LpaY82x.png"
    }
  ];


  it("renders without student name if not provided", () => {
    const { getByPlaceholderText } = render(
      <Form interviewers={interviewers} />);

    expect(getByPlaceholderText("Enter Student Name")).toHaveValue("");
  });

  it("renders with initial student name", () => {
    const { getByTestId } = render(
      <Form interviewers={interviewers} name="Lydia Miller-Jones" />);

    expect(getByTestId("student-name-input")).toHaveValue("Lydia Miller-Jones");
  });


  it("validates that the student name is not blank", () => {
    const onSave = jest.fn();
    // the student prop should be blank or undefined
    const { getByText } = render(
      <Form interviewers={interviewers} onSave={onSave} />);

    fireEvent.click(getByText("Save"));

    expect(getByText(/student name cannot be blank/i)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });


  it("validates that the interviewer cannot be null", () => {
    const onSave = jest.fn();
    // the interviewer prop should be blank or undefined
    const { getByText } = render(
      <Form interviewers={interviewers} onSave={onSave} name="Lydia Miller-Jones" />);

    fireEvent.click(getByText("Save"));

    expect(getByText(/please select an interviewer/i)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });


  xit("calls onSave function when the name and interviewer is defined", () => {
    const onSave = jest.fn();

    const { queryByText } = render(
      <Form interviewers={interviewers} onSave={onSave}
        name="Lydia Miller-Jones" interviewer={interviewers[0].id} />);

    fireEvent.click(queryByText("Save"));

    // do not show error message afer we click "Save" with valid input
    expect(queryByText(/student name cannot be blank/i)).toBeNull();
    expect(queryByText(/please select an interviewer/i)).toBeNull();
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith("Lydia Miller-Jones", 1);
  });


  xit("submits the name entered by the user", () => {
    const onSave = jest.fn();

    const { getByText, getByPlaceholderText } = render(
      <Form interviewers={interviewers} onSave={onSave}
        interviewer={interviewers[0].id} />);

    const input = getByPlaceholderText("Enter Student Name");

    // trigger onChange event for the input field
    fireEvent.change(input, { target: { value: "Lydia Miller-Jones" } });
    fireEvent.click(getByText("Save"));

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith("Lydia Miller-Jones", 1);
  });


  // covers code that the 2 previous tests do
  it("can successfully save after trying to submit an empty student name", () => {
    const onSave = jest.fn();

    const { getByText, getByPlaceholderText, queryByText } = render(
      <Form interviewers={interviewers} onSave={onSave}
        interviewer={interviewers[0].id} />);

    fireEvent.click(getByText("Save"));

    expect(getByText(/student name cannot be blank/i)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();

    // error message should now be removed
    fireEvent.change(getByPlaceholderText("Enter Student Name"), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByText("Save"));

    expect(queryByText(/student name cannot be blank/i)).toBeNull();
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith("Lydia Miller-Jones", 1);
  });


  it("calls onCancel and resets the input field", () => {
    const onSave = jest.fn();
    const onCancel = jest.fn();

    const { getByText, getByPlaceholderText, queryByText } = render(
      <Form interviewers={interviewers} onSave={onSave} onCancel={onCancel}
        name="Lydia Mill-Jones" />);

    fireEvent.click(getByText("Save"));

    fireEvent.change(getByPlaceholderText("Enter Student Name"), {
      target: { value: "Lydia Miller-Jones" }
    });

    fireEvent.click(getByText("Cancel"));

    expect(queryByText(/student name cannot be blank/i)).toBeNull();
    expect(getByPlaceholderText("Enter Student Name")).toHaveValue("");
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});