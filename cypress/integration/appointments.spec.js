describe("Appointments", () => {

  beforeEach(() => {
    cy.request("GET", "/api/debug/reset");
    cy.visit("/");
    cy.contains("[data-testid=day]", "Monday");
  });

  it("should book an interview", () => {
    // click Add
    cy.get("[alt=Add]").first().click();
    // type in student name
    cy.get("[data-testid=student-name-input]").type("Lydia Miller-Jones");
    // select interviewer
    cy.get("[alt='Sylvia Palmer']").click();
    // Save
    cy.contains("Save").click();
    // verify name and interviewer with class
    cy.contains(".appointment__card--show", "Lydia Miller-Jones");
    cy.contains(".appointment__card--show", "Sylvia Palmer");

  });

  it("should edit an interview", () => {
    // click Edit
    cy.get("[alt=Edit]").first().click({ force: true });
    // change interviewer
    cy.get("[alt='Tori Malcolm']").click();
    // clear then change student name
    cy.get("[data-testid=student-name-input]").clear().type("Lydia Miller-Jones");
    // Save
    cy.contains("Save").click();
    // verify name and interviewer with class
    cy.contains(".appointment__card--show", "Lydia Miller-Jones");
    cy.contains(".appointment__card--show", "Tori Malcolm");
  });

  it.only("should cancel an interview", () => {
    cy.get("[alt=Delete]").first().click({ force: true });
    cy.contains("Confirm").click();
    cy.contains("Deleting").should("exist");
    cy.contains("Deleting").should("not.exist");
    cy.contains(".appointment__card--show", "Archie Cohen").should("not.exist");

  });

});