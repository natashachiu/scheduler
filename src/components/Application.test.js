import React from "react";
import Application from "./Application";
import { render, waitForElement, fireEvent, prettyDOM, queryByText, getByText, getByAltText, getAllByTestId, getByPlaceholderText } from "@testing-library/react";

describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);

    // returns a promise that resolves with a truthy value
    // rejects if it cannot find the specified text in the callback
    await waitForElement(() => getByText("Monday"));
    // argument is a function that returns a DOM node
    fireEvent.click(getByText("Tuesday"));
    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });


  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container, debug } = render(<Application />);

    // get state of application before data retreival from API
    // console.log(prettyDOM(container));

    await waitForElement(() => getByText(container, "Archie Cohen"));
    // console.log(prettyDOM(container));

    const appointments = getAllByTestId(container, "appointment");
    // console.log(prettyDOM(appointments));
    const appointment = appointments[0];
    // console.log(prettyDOM(appointment));

    // add, change student name input, then save.
    fireEvent.click(getByAltText(appointment, "Add"));
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving")).toBeInTheDocument();
    // debug(container);

    // When saving operation is complete, show name.
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    // Monday node should have no spots remaining.
    const monday = getAllByTestId(container, "day")
      .find(day => queryByText(day, "Monday"));
    expect(getByText(monday, "no spots remaining")).toBeInTheDocument;
    console.log(prettyDOM(monday));
  });



});