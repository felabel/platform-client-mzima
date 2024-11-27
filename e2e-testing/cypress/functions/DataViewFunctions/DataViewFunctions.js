import DataViewLocators from '../../locators/DataViewLocators';
import LoginFunctions from '../LoginFunctions';

const loginFunctions = new LoginFunctions();

class DataViewFunctions {
  click_data_view_btn() {
    cy.get(DataViewLocators.dataViewBtn).should('be.visible').click({ force: true });
    cy.url().should('include', '/feed');
  }

  verify_post_appears_for_user() {
    this.click_data_view_btn();
    //check post appears for admin user
    cy.get(DataViewLocators.postPreview)
      .children(DataViewLocators.postItem)
      .contains('Automated Title Response')
      .click();
    cy.get(DataViewLocators.postMenuDots).eq(0).click();
    cy.get(DataViewLocators.publishPostBtn).click();
    loginFunctions.logout();
    //check post appears for non logged in user
    this.click_data_view_btn();
    cy.get(DataViewLocators.postPreview)
      .children(DataViewLocators.postItem)
      .contains('Automated Title Response');
  }
  search_and_verify_results(keyword) {
    this.click_data_view_btn();
    cy.get(DataViewLocators.searchInput).clear({ force: true }).type(keyword, { force: true });

    // Wait for the API request to fetch results
    cy.intercept('GET', '**/api/v5/posts/stats*').as('searchResults');
    cy.wait('@searchResults');

    // Verify that results contain the keyword in the title or description
    cy.get(DataViewLocators.postPreview).within(() => {
      cy.get(DataViewLocators.postItem).each(($post) => {
        cy.wrap($post)
          .invoke('text')
          .then((text) => {
            expect(text.toLowerCase()).to.include(keyword.toLowerCase());
          });
      });
    });
  }
  search_and_verify_results_with_special_characters(keyword) {
    const specialCharacterRegex = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]+$/;
    // remove
    if (!specialCharacterRegex.test(keyword)) {
      throw new Error('Provided keyword does not contain only special characters');
    }
    this.click_data_view_btn();
    cy.get(DataViewLocators.searchInput).clear({ force: true }).type(keyword, { force: true });
    cy.get(DataViewLocators.postsEmptyMessage)
      .should('be.visible')
      .and('contain.text', 'No posts match your keyword search');
  }
}

export default DataViewFunctions;
