/// <reference types="cypress" />
import 'cypress-axe';

describe('접근성 자동 검사', () => {
  it('메인 화면 접근성 위반 없음', () => {
    cy.visit('/');
    cy.injectAxe();
    cy.checkA11y();
  });
}); 