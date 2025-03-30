describe("CSV Hero File Operations", () => {
  beforeEach(() => {
    Cypress.automation("remote:debugger:protocol", {
      command: "Browser.grantPermissions",
      params: {
        permissions: ["clipboardReadWrite", "clipboardSanitizedWrite"],
        origin: window.location.origin,
      },
    });

    cy.visit("/");
  });

  it("should load a CSV file", () => {
    cy.fixture("sample.csv", "binary")
      .then(Cypress.Blob.binaryStringToBlob)
      .then((fileContent) => {
        cy.get('input[type="file"]').attachFile({
          fileContent,
          fileName: "sample.csv",
          mimeType: "text/csv",
        });
      });

    // Verify the file was loaded by checking for data in the table
    cy.get("table").should("exist");
    cy.get("tbody tr").should("have.length.greaterThan", 0);
  });

  it("should export data in different formats", () => {
    // First load some data
    cy.fixture("sample.csv", "binary")
      .then(Cypress.Blob.binaryStringToBlob)
      .then((fileContent) => {
        cy.get('input[type="file"]').attachFile({
          fileContent,
          fileName: "sample.csv",
          mimeType: "text/csv",
        });
      });

    // Test CSV export
    cy.get('[data-testid="export-format-select"]').select("csv");
    cy.contains("button", "Export").click();

    // Test JSON export
    cy.get('[data-testid="export-format-select"]').select("json");
    cy.contains("button", "Export").click();

    // Test copying to clipboard
    cy.get('[data-testid="export-format-select"]').select("csv");
    cy.get('[data-testid="copy-button"]').click(); // Click the copy button
    cy.contains("Copied to clipboard").should("be.visible");
  });
});
