describe('릴리즈 관리 E2E', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.get('input[placeholder="아이디를 입력하세요"]').type('admin');
    cy.get('input[placeholder="비밀번호를 입력하세요"]').type('adminpw');
    cy.contains('로그인').click();
    cy.url().should('include', '/dashboard');
    cy.visit('/releases');
  });

  it('릴리즈 목록 조회/검색/필터/페이징', () => {
    cy.contains('릴리즈/스프린트 선택');
    cy.get('input[placeholder="릴리즈명 검색"]').type('Sprint');
    cy.get('ul').should('contain', 'Sprint');
    cy.get('input[type="date"]').first().type('2024-07-01');
    cy.get('input[type="date"]').last().type('2024-07-10');
    cy.get('ul').should('contain', 'Sprint 1');
  });

  it('릴리즈 생성/수정/삭제', () => {
    cy.contains('신규 생성').click();
    cy.get('input[name="name"]').type('E2E 릴리즈');
    cy.get('form').contains('저장').click();
    cy.get('ul').should('contain', 'E2E 릴리즈');
    cy.contains('E2E 릴리즈').parent().contains('수정').click();
    cy.get('input[name="name"]').clear().type('E2E 릴리즈-수정');
    cy.get('form').contains('저장').click();
    cy.get('ul').should('contain', 'E2E 릴리즈-수정');
    cy.contains('E2E 릴리즈-수정').parent().contains('삭제').click();
    cy.contains('정말 삭제하시겠습니까?');
    cy.contains('삭제').click();
    cy.get('ul').should('not.contain', 'E2E 릴리즈-수정');
  });

  it('권한 없는 사용자는 CRUD 접근 차단', () => {
    cy.visit('/login');
    cy.get('input[placeholder="아이디를 입력하세요"]').clear().type('dev');
    cy.get('input[placeholder="비밀번호를 입력하세요"]').clear().type('devpw');
    cy.contains('로그인').click();
    cy.visit('/releases');
    cy.contains('신규 생성').should('not.exist');
    cy.get('ul li').first().parent().should('not.contain', '수정');
    cy.get('ul li').first().parent().should('not.contain', '삭제');
  });

  it('릴리즈 선택 시 대시보드 진입', () => {
    cy.get('ul li').first().click();
    cy.url().should('include', '/dashboard/');
  });
}); 