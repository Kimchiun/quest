describe('DashboardLayout E2E 테스트', () => {
  beforeEach(() => {
    // 로그인 후 대시보드 페이지로 이동
    cy.visit('/');
    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    
    // 대시보드 로드 대기
    cy.url().should('include', '/dashboard');
    cy.get('[data-testid="dashboard-layout"]', { timeout: 10000 }).should('be.visible');
  });

  describe('3분할 레이아웃 기본 동작', () => {
    it('로그인 후 3분할 레이아웃이 정상적으로 표시되어야 함', () => {
      // 좌측 패널 확인
      cy.get('[data-testid="left-panel"]').should('be.visible');
      cy.contains('ITMS').should('be.visible');
      cy.contains('대시보드').should('be.visible');
      cy.contains('테스트 케이스').should('be.visible');

      // 중앙 패널 확인
      cy.get('[data-testid="center-panel"]').should('be.visible');
      cy.contains('프로젝트 현황 및 최근 활동을 확인하세요').should('be.visible');

      // 우측 패널 확인
      cy.get('[data-testid="right-panel"]').should('be.visible');
      cy.contains('개인 작업').should('be.visible');
      cy.contains('내 작업 목록').should('be.visible');
    });

    it('모든 패널이 기본 상태(확장됨)로 표시되어야 함', () => {
      // 좌측 패널 토글 버튼 (축소 상태 표시)
      cy.get('[data-testid="left-toggle-button"]')
        .should('be.visible')
        .and('contain', '←');

      // 우측 패널 토글 버튼 (축소 상태 표시)
      cy.get('[data-testid="right-toggle-button"]')
        .should('be.visible')
        .and('contain', '→');
    });
  });

  describe('패널 토글 기능', () => {
    it('좌측 패널 토글 버튼 클릭 시 패널이 축소되어야 함', () => {
      // 초기 상태 확인
      cy.get('[data-testid="left-panel"]').should('be.visible');
      cy.contains('ITMS').should('be.visible');

      // 토글 버튼 클릭
      cy.get('[data-testid="left-toggle-button"]').click();

      // 축소된 상태 확인
      cy.get('[data-testid="left-panel"]').should('have.class', 'collapsed');
      cy.get('[data-testid="left-toggle-button"]').should('contain', '→');
      
      // 축소된 상태에서는 메뉴 텍스트가 보이지 않아야 함
      cy.contains('대시보드').should('not.be.visible');
    });

    it('우측 패널 토글 버튼 클릭 시 패널이 축소되어야 함', () => {
      // 초기 상태 확인
      cy.get('[data-testid="right-panel"]').should('be.visible');
      cy.contains('개인 작업').should('be.visible');

      // 토글 버튼 클릭
      cy.get('[data-testid="right-toggle-button"]').click();

      // 축소된 상태 확인
      cy.get('[data-testid="right-panel"]').should('have.class', 'collapsed');
      cy.get('[data-testid="right-toggle-button"]').should('contain', '←');
      
      // 축소된 상태에서는 작업 목록이 보이지 않아야 함
      cy.contains('내 작업 목록').should('not.be.visible');
    });

    it('축소된 패널을 다시 토글하면 확장되어야 함', () => {
      // 좌측 패널 축소
      cy.get('[data-testid="left-toggle-button"]').click();
      cy.get('[data-testid="left-panel"]').should('have.class', 'collapsed');

      // 다시 확장
      cy.get('[data-testid="left-toggle-button"]').click();
      cy.get('[data-testid="left-panel"]').should('not.have.class', 'collapsed');
      cy.contains('ITMS').should('be.visible');

      // 우측 패널도 동일하게 테스트
      cy.get('[data-testid="right-toggle-button"]').click();
      cy.get('[data-testid="right-panel"]').should('have.class', 'collapsed');

      cy.get('[data-testid="right-toggle-button"]').click();
      cy.get('[data-testid="right-panel"]').should('not.have.class', 'collapsed');
      cy.contains('개인 작업').should('be.visible');
    });
  });

  describe('반응형 레이아웃', () => {
    it('1280x720 해상도에서 정상 동작해야 함', () => {
      cy.viewport(1280, 720);
      
      // 모든 패널이 정상적으로 표시되는지 확인
      cy.get('[data-testid="left-panel"]').should('be.visible');
      cy.get('[data-testid="center-panel"]').should('be.visible');
      cy.get('[data-testid="right-panel"]').should('be.visible');
      
      // 레이아웃이 깨지지 않았는지 확인
      cy.get('[data-testid="dashboard-layout"]').should('have.css', 'display', 'grid');
    });

    it('1920x1080 해상도에서 정상 동작해야 함', () => {
      cy.viewport(1920, 1080);
      
      // 모든 패널이 정상적으로 표시되는지 확인
      cy.get('[data-testid="left-panel"]').should('be.visible');
      cy.get('[data-testid="center-panel"]').should('be.visible');
      cy.get('[data-testid="right-panel"]').should('be.visible');
      
      // 레이아웃이 깨지지 않았는지 확인
      cy.get('[data-testid="dashboard-layout"]').should('have.css', 'display', 'grid');
    });

    it('모바일 해상도에서도 기본 동작해야 함', () => {
      cy.viewport(375, 667); // iPhone SE
      
      // 최소한 토글 버튼은 보여야 함
      cy.get('[data-testid="left-toggle-button"]').should('be.visible');
      cy.get('[data-testid="right-toggle-button"]').should('be.visible');
    });
  });

  describe('키보드 접근성', () => {
    it('Tab 키로 모든 토글 버튼에 접근할 수 있어야 함', () => {
      // 첫 번째 포커스 가능한 요소로 이동
      cy.get('body').tab();
      
      // 좌측 토글 버튼으로 포커스 이동
      cy.get('[data-testid="left-toggle-button"]').should('be.focused');
      
      // 우측 토글 버튼으로 포커스 이동
      cy.tab();
      cy.get('[data-testid="right-toggle-button"]').should('be.focused');
    });

    it('Enter 키로 토글 버튼을 활성화할 수 있어야 함', () => {
      // 좌측 토글 버튼에 포커스
      cy.get('[data-testid="left-toggle-button"]').focus();
      
      // Enter 키로 토글
      cy.get('[data-testid="left-toggle-button"]').type('{enter}');
      
      // 패널이 축소되었는지 확인
      cy.get('[data-testid="left-panel"]').should('have.class', 'collapsed');
    });

    it('Space 키로도 토글 버튼을 활성화할 수 있어야 함', () => {
      // 우측 토글 버튼에 포커스
      cy.get('[data-testid="right-toggle-button"]').focus();
      
      // Space 키로 토글
      cy.get('[data-testid="right-toggle-button"]').type(' ');
      
      // 패널이 축소되었는지 확인
      cy.get('[data-testid="right-panel"]').should('have.class', 'collapsed');
    });
  });

  describe('성능 테스트', () => {
    it('패널 토글 시 애니메이션이 부드럽게 동작해야 함', () => {
      // 애니메이션 시작 시간 기록
      cy.get('[data-testid="left-toggle-button"]').click();
      
      // 애니메이션 완료 대기 (300ms)
      cy.wait(350);
      
      // 패널이 완전히 축소되었는지 확인
      cy.get('[data-testid="left-panel"]').should('have.class', 'collapsed');
    });

    it('연속적인 토글 동작이 안정적으로 동작해야 함', () => {
      // 빠른 연속 클릭 테스트
      for (let i = 0; i < 5; i++) {
        cy.get('[data-testid="left-toggle-button"]').click();
        cy.wait(100);
        cy.get('[data-testid="left-toggle-button"]').click();
        cy.wait(100);
      }
      
      // 최종 상태가 일관성 있게 유지되어야 함
      cy.get('[data-testid="left-panel"]').should('not.have.class', 'collapsed');
    });
  });

  describe('에러 처리', () => {
    it('네트워크 오류 시에도 레이아웃이 유지되어야 함', () => {
      // 네트워크 오류 시뮬레이션
      cy.intercept('GET', '/api/**', { forceNetworkError: true });
      
      // 페이지 새로고침
      cy.reload();
      
      // 레이아웃이 여전히 표시되어야 함
      cy.get('[data-testid="dashboard-layout"]').should('be.visible');
      cy.get('[data-testid="left-panel"]').should('be.visible');
      cy.get('[data-testid="center-panel"]').should('be.visible');
      cy.get('[data-testid="right-panel"]').should('be.visible');
    });
  });
}); 