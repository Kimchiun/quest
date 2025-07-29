/// <reference types="cypress" />

describe('Layout E2E Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4000');
  });

  describe('Desktop Layout (1024px+)', () => {
    beforeEach(() => {
      cy.viewport(1440, 900);
    });

    it('should display 3-column layout on desktop', () => {
      // 좌측 네비게이션 확인
      cy.get('nav').should('be.visible');
      cy.get('nav').should('have.css', 'grid-area', 'nav');
      
      // 상단 헤더 확인
      cy.get('header').should('be.visible');
      cy.get('header').should('have.css', 'grid-area', 'header');
      
      // 메인 컨텐츠 확인
      cy.get('main').should('be.visible');
      cy.get('main').should('have.css', 'grid-area', 'main');
    });

    it('should have correct navigation items', () => {
      cy.get('nav').within(() => {
        cy.contains('📊 대시보드').should('be.visible');
        cy.contains('🧪 테스트 관리').should('be.visible');
        cy.contains('📋 릴리즈 관리').should('be.visible');
        cy.contains('🐛 결함 관리').should('be.visible');
        cy.contains('📈 리포트').should('be.visible');
        cy.contains('⚙️ 설정').should('be.visible');
      });
    });

    it('should display user information in header', () => {
      cy.get('header').within(() => {
        cy.contains('ITMS').should('be.visible');
        cy.get('[data-testid="user-info"]').should('be.visible');
      });
    });
  });

  describe('Tablet Layout (768px-1024px)', () => {
    beforeEach(() => {
      cy.viewport(1024, 768);
    });

    it('should adapt layout for tablet', () => {
      cy.get('nav').should('be.visible');
      cy.get('header').should('be.visible');
      cy.get('main').should('be.visible');
      
      // 태블릿에서는 네비게이션 너비가 줄어들어야 함
      cy.get('nav').should('have.css', 'width').and('be.less.than', 300);
    });
  });

  describe('Mobile Layout (<768px)', () => {
    beforeEach(() => {
      cy.viewport(375, 667);
    });

    it('should stack layout vertically on mobile', () => {
      // 모바일에서는 세로 배치
      cy.get('header').should('be.visible');
      cy.get('nav').should('be.visible');
      cy.get('main').should('be.visible');
    });

    it('should have touch-friendly navigation', () => {
      cy.get('nav').within(() => {
        cy.get('[role="button"]').should('have.css', 'min-height', '44px');
      });
    });
  });

  describe('Accessibility Tests', () => {
    it('should have proper ARIA labels', () => {
      cy.get('nav').should('have.attr', 'role', 'navigation');
      cy.get('header').should('have.attr', 'role', 'banner');
      cy.get('main').should('have.attr', 'role', 'main');
    });

    it('should support keyboard navigation', () => {
      cy.get('body').tab();
      cy.focused().should('exist');
      
      // 네비게이션 아이템들이 포커스 가능해야 함
      cy.get('nav').find('[role="button"]').first().focus();
      cy.focused().should('be.visible');
    });

    it('should have skip links', () => {
      cy.get('.skip-link').should('be.visible');
      cy.get('.skip-link').should('have.attr', 'href', '#main-content');
    });
  });

  describe('Responsive Behavior', () => {
    it('should adapt to different screen sizes', () => {
      // 데스크톱
      cy.viewport(1920, 1080);
      cy.get('nav').should('be.visible');
      
      // 태블릿
      cy.viewport(1024, 768);
      cy.get('nav').should('be.visible');
      
      // 모바일
      cy.viewport(375, 667);
      cy.get('nav').should('be.visible');
    });

    it('should maintain functionality across screen sizes', () => {
      const viewports = [
        { width: 1920, height: 1080 },
        { width: 1440, height: 900 },
        { width: 1024, height: 768 },
        { width: 768, height: 1024 },
        { width: 375, height: 667 }
      ];

      viewports.forEach(viewport => {
        cy.viewport(viewport.width, viewport.height);
        cy.get('nav').should('be.visible');
        cy.get('header').should('be.visible');
        cy.get('main').should('be.visible');
      });
    });
  });

  describe('Layout Performance', () => {
    it('should load layout quickly', () => {
      cy.visit('http://localhost:4000', {
        onBeforeLoad: (win) => {
          cy.spy(win.console, 'log').as('consoleLog');
        }
      });
      
      cy.get('nav').should('be.visible');
      cy.get('@consoleLog').should('not.be.called');
    });

    it('should not have layout shifts', () => {
      cy.get('body').should('not.have.css', 'overflow', 'hidden');
      cy.get('nav').should('have.css', 'position', 'static');
    });
  });
}); 