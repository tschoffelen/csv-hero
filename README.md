# 🦸‍ CSV Hero

**A simple web app to transform CSV and JSON files.**

CSV Hero helps you to format, filter and convert CSV and JSON files. Need to generate a CSV from a JSON file, but only want to include rows that contain the word 'cow'? CSV Hero can help with that.

**[csvhero.app](https://csvhero.app)**

---

## Continuous Integration

This project uses GitHub Actions for continuous integration. Every push to the main branch and pull requests will trigger a CI workflow that runs Cypress tests to ensure the application works correctly.

### CI Status

[![Cypress Tests](https://github.com/username/csv-hero/actions/workflows/cypress.yml/badge.svg)](https://github.com/username/csv-hero/actions/workflows/cypress.yml)

## Development

To work on this project locally, run the following commands in the project root:

```shell
yarn
yarn start
```

### Running Tests Locally

To run Cypress tests locally:

1. Install dependencies:
   ```
   yarn
   ```

2. Start the application:
   ```
   yarn start
   ```

3. Run the tests in Cypress GUI:
   ```
   yarn cypress:open
   ```

4. Or run the tests headlessly:
   ```
   yarn cypress:run
   ```

## Deployment

This project is automatically deployed when new code is pushed to the `master` branch using Vercel.
