import DataViewFunctions from '../../functions/DataViewFunctions/DataViewFunctions';
const dataViewFunctions = new DataViewFunctions();

describe('Search and Verify Posts', () => {
  beforeEach(() => {
    cy.visit(Cypress.env('baseUrl'));
  });

  it('should display posts with the keyword in title or description', () => {
    const searchKeyword = 'election';
    dataViewFunctions.search_and_verify_results(searchKeyword);
  });

  it('should display an empty state when searching with special characters', () => {
    const generateSpecialCharacterKeyword = () => {
      const specialChars = '!@#$%^&*()_+-=[]{};\':"\\|,.<>/?`~';
      let keyword = '';
      const length = Math.floor(Math.random() * 10) + 1;
      for (let i = 0; i < length; i++) {
        keyword += specialChars[Math.floor(Math.random() * specialChars.length)];
      }
      return keyword;
    };
    const specialCharKeyword = generateSpecialCharacterKeyword();
    dataViewFunctions.search_and_verify_results_with_special_characters(specialCharKeyword);
  });
});
