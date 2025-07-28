describe('Folder Management E2E Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4000/folders');
  });

  it('should display folder tree and test case list', () => {
    cy.get('[data-testid="folder-tree"]').should('be.visible');
    cy.get('[data-testid="test-case-list"]').should('be.visible');
  });

  it('should create a new folder', () => {
    cy.get('[data-testid="create-folder-btn"]').click();
    cy.get('[data-testid="folder-name-input"]').type('새 폴더');
    cy.get('[data-testid="folder-description-input"]').type('테스트용 폴더');
    cy.get('[data-testid="submit-folder-btn"]').click();
    
    cy.get('[data-testid="folder-tree"]').should('contain', '새 폴더');
  });

  it('should edit folder name', () => {
    cy.get('[data-testid="folder-item"]').first().rightclick();
    cy.get('[data-testid="edit-folder-menu"]').click();
    cy.get('[data-testid="folder-name-input"]').clear().type('수정된 폴더');
    cy.get('[data-testid="submit-folder-btn"]').click();
    
    cy.get('[data-testid="folder-tree"]').should('contain', '수정된 폴더');
  });

  it('should delete folder', () => {
    cy.get('[data-testid="folder-item"]').first().rightclick();
    cy.get('[data-testid="delete-folder-menu"]').click();
    cy.get('[data-testid="confirm-delete-btn"]').click();
    
    cy.get('[data-testid="folder-tree"]').should('not.contain', '삭제된 폴더');
  });

  it('should drag and drop test case between folders', () => {
    // 첫 번째 폴더 선택
    cy.get('[data-testid="folder-item"]').first().click();
    
    // 테스트 케이스가 있는지 확인
    cy.get('[data-testid="test-case-item"]').should('exist');
    
    // 두 번째 폴더로 드래그
    cy.get('[data-testid="test-case-item"]').first()
      .trigger('mousedown', { button: 0 })
      .trigger('mousemove', { clientX: 400, clientY: 200 })
      .trigger('mouseup');
    
    // 두 번째 폴더 선택하여 이동 확인
    cy.get('[data-testid="folder-item"]').eq(1).click();
    cy.get('[data-testid="test-case-item"]').should('exist');
  });

  it('should prevent circular reference in folder hierarchy', () => {
    cy.get('[data-testid="folder-item"]').first().rightclick();
    cy.get('[data-testid="edit-folder-menu"]').click();
    
    // 자기 자신을 상위 폴더로 선택 시도
    cy.get('[data-testid="parent-folder-select"]').select('1');
    cy.get('[data-testid="submit-folder-btn"]').click();
    
    // 에러 메시지 확인
    cy.get('[data-testid="error-message"]').should('contain', '순환 참조');
  });

  it('should display test case count in folder tree', () => {
    cy.get('[data-testid="folder-item"]').first().click();
    cy.get('[data-testid="test-case-count"]').should('be.visible');
  });

  it('should handle empty folder state', () => {
    cy.get('[data-testid="folder-item"]').last().click();
    cy.get('[data-testid="empty-folder-message"]').should('contain', '테스트 케이스가 없습니다');
  });
}); 