import React from "react";
import axios from "axios";
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


  it("loads data, books an interview and reduces the spots remaining for Monday by 1", async () => {
    /* 1. Render the Application. */
    const { container, debug } = render(<Application />);

    // get state of application before data retreival from API
    // console.log(prettyDOM(container));

    /* 2. Wait until the text "Archie Cohen" is displayed. */
    await waitForElement(() => getByText(container, "Archie Cohen"));
    // console.log(prettyDOM(container));

    const appointments = getAllByTestId(container, "appointment");
    // console.log(prettyDOM(appointments));
    const appointment = appointments[0];
    // console.log(prettyDOM(appointment));

    /* 3. Click the "Add" button on the first empty appointment. */
    // add, change student name input, then save.
    fireEvent.click(getByAltText(appointment, "Add"));
    /* 4. Enter the name "Lydia Miller-Jones" into the input with the placeholder "Enter Student Name". */
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    /* 5. Click the first interviewer in the list. */
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    /* 6. Click the "Save" button on that same appointment. */
    fireEvent.click(getByText(appointment, "Save"));

    /* 7. Check that the element with the text "Saving" is displayed. */
    expect(getByText(appointment, "Saving")).toBeInTheDocument();
    // debug(container);

    /* 8. Wait until the element with the text "Lydia Miller-Jones" is displayed. */
    // When saving operation is complete, show name.
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    /* 9. Check that the DayListItem with the text "Monday" also has the text "no spots remaining". */
    const monday = getAllByTestId(container, "day")
      .find(day => queryByText(day, "Monday"));
    expect(getByText(monday, "no spots remaining")).toBeInTheDocument;
    // console.log(prettyDOM(monday));
  });



  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    /* 1. Render the Application. */
    const { container, debug } = render(<Application />);

    /* 2. Wait until the text "Archie Cohen" is displayed. */
    await waitForElement(() => getByText(container, "Archie Cohen"));

    /* 3. Click the "Delete" button on the booked appointment. */
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
    fireEvent.click(getByAltText(appointment, "Delete"));

    /* 4. Check that the confirmation message is shown. */
    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();
    // debug();

    /* 5. Click the "Confirm" button on the confirmation. */
    fireEvent.click(getByText(appointment, "Confirm"));

    /* 6. Check that the element with the text "Deleting" is displayed. */
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    /* 7. Wait until the element with the "Add" button is displayed. */
    await waitForElement(() => getByAltText(appointment, "Add"));

    /* 8. Check that the DayListItem with the text "Monday" also has the text "2  spots remaining". */
    const monday = getAllByTestId(container, "day")
      .find(day => queryByText(day, "Monday"));
    expect(getByText(monday, "2 spots remaining")).toBeInTheDocument;
  });



  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    /* 1. Render the Application. */
    const { container, debug } = render(<Application />);

    /* 2. Wait until the text "Archie Cohen" is displayed. */
    await waitForElement(() => getByText(container, "Archie Cohen"));

    /* 3. Click the "Edit" button on the booked appointment. */
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
    fireEvent.click(getByAltText(appointment, "Edit"));

    /* 4. Enter the name "Lydia Miller-Jones" into the input with the placeholder "Enter Student Name". */
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    /* 5. Click the first interviewer in the list. */
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    /* 6. Click the "Save" button on that same appointment. */
    fireEvent.click(getByText(appointment, "Save"));

    /* 7. Check that the element with the text "Saving" is displayed. */
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    /* 8. Wait until the element with the text "Lydia Miller-Jones" is displayed. */
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    /* 9. Check that the DayListItem with the text "Monday" also has the text "no spots remaining". */
    const monday = getAllByTestId(container, "day")
      .find(day => queryByText(day, "Monday"));
    expect(getByText(monday, "1 spot remaining")).toBeInTheDocument;

  });

  // use mock library to simulate a save error (with a mock rejected promise)
  // change the put mock
  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();
  });

  it("shows the delete error when failing to delete an existing appointment", () => {
    axios.delete.mockRejectedValueOnce();
  });

});