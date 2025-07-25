/// <reference types="cypress" />

describe('키보드 네비게이션 E2E', () => {
  it('Tab 키로 스킵 네비게이션 및 주요 인터페이스 접근', () => {
    cy.visit('/');
    // 첫 Tab: skip-link(본문 바로가기)로 포커스
    cy.realPress('Tab');
    cy.focused().should('have.class', 'skip-link');
    // Enter로 main-content로 이동
    cy.realPress('Enter');
    cy.focused().should('have.attr', 'id', 'main-content');
    // 이후 Tab으로 주요 버튼/폼 필드 접근
    cy.realPress('Tab');
    // 예: Dashboard 버튼, 로그인 폼 등
    // 실제 프로젝트 구조에 맞게 아래를 확장
  });
}); 