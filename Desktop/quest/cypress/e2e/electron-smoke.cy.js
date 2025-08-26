describe('Electron App Smoke Test', () => {
  it('로그인 화면이 정상적으로 보인다', () => {
    cy.visit('http://localhost:4000');
    cy.contains('로그인').should('exist');
    cy.get('input[type="text"], input[type="email"]').should('exist');
    cy.get('input[type="password"]').should('exist');
  });

  it('로그인 후 대시보드가 보인다', () => {
    cy.visit('http://localhost:4000');
    cy.get('input[type="text"], input[type="email"]').type('zkz258@naver.com');
    cy.get('input[type="password"]').type('qwer124!!');
    cy.get('button[type="submit"]').click();
    cy.contains('대시보드').should('exist');
    cy.contains('테스트 진행률').should('exist');
  });

  it('폴더 트리 컴포넌트가 보인다', () => {
    cy.visit('http://localhost:4000');
    cy.get('input[type="text"], input[type="email"]').type('zkz258@naver.com');
    cy.get('input[type="password"]').type('qwer124!!');
    cy.get('button[type="submit"]').click();
    cy.contains('폴더 구조').should('exist');
    cy.get('.rc-tree').should('exist');
  });
}); 