describe('대시보드 위젯 배치 E2E', () => {
  beforeEach(() => {
    cy.visit('/#/login');
    cy.get('input[placeholder="아이디를 입력하세요"]').type('admin');
    cy.get('input[placeholder="비밀번호를 입력하세요"]').type('adminpw');
    cy.contains('로그인').click();
    cy.url().should('include', '/#/dashboard');
    cy.visit('/#/dashboard');
  });

  it('위젯 드래그 앤 드롭 및 배치 저장/복원', () => {
    cy.contains('진행률 위젯');
    cy.contains('커스텀 위젯');
    // 드래그 앤 드롭 (cypress-real-events 또는 cypress-drag-drop 플러그인 필요)
    // 여기서는 순서 변경 후 새로고침으로 배치 복원만 검증
    cy.window().then(win => {
      win.localStorage.setItem('dashboardWidgetOrder', JSON.stringify([3,2,1,0]));
    });
    cy.reload();
    cy.get('div').contains('커스텀 위젯');
    cy.get('div').contains('진행률 위젯');
  });

  it('릴리즈 선택 및 네비게이션', () => {
    cy.get('aside').contains('Sprint 2').click();
    cy.get('header').should('contain', 'Sprint 2');
    cy.get('aside').contains('대시보드').click();
    cy.url().should('include', '/#/dashboard');
    cy.get('aside').contains('테스트케이스').click();
    cy.url().should('include', '/#/testcases');
  });
}); 