/// <reference types="cypress" />

describe('Animation E2E Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4000');
  });

  describe('Page Transition Animations', () => {
    it('should have smooth page transitions', () => {
      // 페이지 전환 애니메이션 확인
      cy.get('[data-testid="dashboard-layout"]').should('be.visible');
      
      // 애니메이션 CSS 클래스 확인
      cy.get('[data-testid="dashboard-layout"]').should('have.class', 'fade-enter-active');
    });

    it('should complete page transitions within expected time', () => {
      const startTime = Date.now();
      
      cy.get('[data-testid="dashboard-layout"]').should('be.visible');
      
      // 페이지 전환 완료 대기
      cy.get('[data-testid="dashboard-layout"]', { timeout: 1000 }).should('not.have.class', 'fade-enter-active');
      
      const endTime = Date.now();
      const transitionTime = endTime - startTime;
      
      // 전환 시간이 500ms 이내인지 확인
      expect(transitionTime).to.be.lessThan(500);
    });
  });

  describe('Loading Animations', () => {
    it('should show skeleton loading states', () => {
      // 스켈레톤 로딩 상태 확인
      cy.get('[data-testid="center-panel"]').within(() => {
        // 스켈레톤 요소들이 있는지 확인
        cy.get('.skeleton').should('exist');
      });
    });

    it('should hide skeleton after content loads', () => {
      // 로딩 완료 후 스켈레톤이 사라지는지 확인
      cy.get('[data-testid="center-panel"]').within(() => {
        cy.get('.skeleton', { timeout: 3000 }).should('not.exist');
      });
    });
  });

  describe('Panel Toggle Animations', () => {
    it('should animate panel collapse/expand', () => {
      // 좌측 패널 토글 애니메이션
      cy.get('[data-testid="left-toggle-button"]').click();
      
      // 애니메이션 중 상태 확인
      cy.get('[data-testid="left-panel"]').should('have.class', 'collapsed');
      
      // 다시 토글
      cy.get('[data-testid="left-toggle-button"]').click();
      cy.get('[data-testid="left-panel"]').should('not.have.class', 'collapsed');
    });

    it('should maintain smooth transitions during panel operations', () => {
      // 패널 조작 중 부드러운 전환 확인
      cy.get('[data-testid="left-toggle-button"]').click();
      cy.get('[data-testid="left-panel"]').should('have.css', 'transition');
      
      cy.get('[data-testid="right-toggle-button"]').click();
      cy.get('[data-testid="right-panel"]').should('have.css', 'transition');
    });
  });

  describe('Performance Metrics', () => {
    it('should maintain 60fps during animations', () => {
      // 성능 측정을 위한 커스텀 명령어 (실제 구현 필요)
      cy.window().then((win) => {
        const startTime = performance.now();
        let frameCount = 0;
        
        const measureFPS = () => {
          frameCount++;
          if (frameCount < 60) {
            win.requestAnimationFrame(measureFPS);
          } else {
            const endTime = performance.now();
            const fps = (frameCount * 1000) / (endTime - startTime);
            expect(fps).to.be.greaterThan(55); // 60fps 근처
          }
        };
        
        win.requestAnimationFrame(measureFPS);
      });
    });

    it('should not cause memory leaks during repeated animations', () => {
      // 메모리 누수 테스트
      cy.window().then((win) => {
        const initialMemory = (win.performance as any).memory?.usedJSHeapSize || 0;
        
        // 여러 번 애니메이션 실행
        for (let i = 0; i < 10; i++) {
          cy.get('[data-testid="left-toggle-button"]').click();
          cy.wait(100);
          cy.get('[data-testid="left-toggle-button"]').click();
          cy.wait(100);
        }
        
        const finalMemory = (win.performance as any).memory?.usedJSHeapSize || 0;
        const memoryIncrease = finalMemory - initialMemory;
        
        // 메모리 증가가 10MB 이내인지 확인
        expect(memoryIncrease).to.be.lessThan(10 * 1024 * 1024);
      });
    });
  });

  describe('Accessibility During Animations', () => {
    it('should maintain focus management during transitions', () => {
      // 애니메이션 중 포커스 관리 확인
      cy.get('[data-testid="left-toggle-button"]').focus();
      cy.get('[data-testid="left-toggle-button"]').click();
      
      // 포커스가 유지되는지 확인
      cy.get('[data-testid="left-toggle-button"]').should('be.focused');
    });

    it('should provide screen reader announcements for animations', () => {
      // 스크린 리더 알림 확인
      cy.get('[data-testid="left-toggle-button"]').click();
      
      // ARIA 라벨 확인
      cy.get('[data-testid="left-toggle-button"]').should('have.attr', 'aria-label');
    });
  });

  describe('Animation Preferences', () => {
    it('should respect reduced motion preferences', () => {
      // 사용자 애니메이션 설정 확인
      cy.window().then((win) => {
        const prefersReducedMotion = win.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion) {
          // 애니메이션이 비활성화되어야 함
          cy.get('[data-testid="dashboard-layout"]').should('not.have.class', 'fade-enter-active');
        } else {
          // 애니메이션이 활성화되어야 함
          cy.get('[data-testid="dashboard-layout"]').should('have.class', 'fade-enter-active');
        }
      });
    });
  });
}); 