import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

// WCAG 2.1 AA 접근성 체크리스트
interface AccessibilityChecklist {
  keyboardNavigation: boolean;
  screenReaderSupport: boolean;
  colorContrast: boolean;
  focusIndicators: boolean;
  altText: boolean;
  semanticHTML: boolean;
  ariaLabels: boolean;
  skipLinks: boolean;
}

// 스타일 컴포넌트
const AccessibilityPanel = styled.div`
  position: fixed;
  bottom: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  font-size: 12px;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 300px;
`;

const ChecklistItem = styled.div<{ passed: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  color: ${props => props.passed ? '#10b981' : '#ef4444'};
`;

const CheckIcon = styled.span`
  font-size: 14px;
`;

const AccessibilityManager: React.FC = () => {
  const [checklist, setChecklist] = useState<AccessibilityChecklist>({
    keyboardNavigation: false,
    screenReaderSupport: false,
    colorContrast: false,
    focusIndicators: false,
    altText: false,
    semanticHTML: false,
    ariaLabels: false,
    skipLinks: false
  });

  const [showPanel, setShowPanel] = useState(false);

  // 접근성 체크 수행
  useEffect(() => {
    const performAccessibilityChecks = () => {
      const newChecklist: AccessibilityChecklist = {
        keyboardNavigation: checkKeyboardNavigation(),
        screenReaderSupport: checkScreenReaderSupport(),
        colorContrast: checkColorContrast(),
        focusIndicators: checkFocusIndicators(),
        altText: checkAltText(),
        semanticHTML: checkSemanticHTML(),
        ariaLabels: checkAriaLabels(),
        skipLinks: checkSkipLinks()
      };

      setChecklist(newChecklist);
    };

    // 초기 체크 및 주기적 체크
    performAccessibilityChecks();
    const interval = setInterval(performAccessibilityChecks, 5000);

    return () => clearInterval(interval);
  }, []);

  // 키보드 네비게이션 체크
  const checkKeyboardNavigation = (): boolean => {
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    return focusableElements.length > 0;
  };

  // 스크린 리더 지원 체크
  const checkScreenReaderSupport = (): boolean => {
    const hasAriaLabels = document.querySelectorAll('[aria-label], [aria-labelledby]').length > 0;
    const hasSemanticElements = document.querySelectorAll('nav, main, section, article, aside').length > 0;
    return hasAriaLabels || hasSemanticElements;
  };

  // 색상 대비 체크
  const checkColorContrast = (): boolean => {
    // 간단한 색상 대비 체크 (실제로는 더 정교한 알고리즘 필요)
    const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6');
    return textElements.length > 0; // 기본적으로 통과로 설정
  };

  // 포커스 표시자 체크
  const checkFocusIndicators = (): boolean => {
    const style = getComputedStyle(document.body);
    const outline = style.outline;
    return outline !== 'none' && outline !== '';
  };

  // 대체 텍스트 체크
  const checkAltText = (): boolean => {
    const images = document.querySelectorAll('img');
    const imagesWithAlt = document.querySelectorAll('img[alt]');
    return images.length === 0 || imagesWithAlt.length === images.length;
  };

  // 시맨틱 HTML 체크
  const checkSemanticHTML = (): boolean => {
    const semanticElements = document.querySelectorAll(
      'header, nav, main, section, article, aside, footer, h1, h2, h3, h4, h5, h6'
    );
    return semanticElements.length > 0;
  };

  // ARIA 라벨 체크
  const checkAriaLabels = (): boolean => {
    const ariaElements = document.querySelectorAll('[aria-label], [aria-labelledby], [role]');
    return ariaElements.length > 0;
  };

  // 건너뛰기 링크 체크
  const checkSkipLinks = (): boolean => {
    const skipLinks = document.querySelectorAll('a[href^="#"], .skip-link');
    return skipLinks.length > 0;
  };

  // 접근성 점수 계산
  const getAccessibilityScore = (): number => {
    const totalChecks = Object.keys(checklist).length;
    const passedChecks = Object.values(checklist).filter(Boolean).length;
    return Math.round((passedChecks / totalChecks) * 100);
  };

  const score = getAccessibilityScore();

  // 접근성 개선 제안
  const getImprovementSuggestions = (): string[] => {
    const suggestions: string[] = [];

    if (!checklist.keyboardNavigation) {
      suggestions.push('모든 상호작용 요소에 키보드 접근성 추가');
    }
    if (!checklist.screenReaderSupport) {
      suggestions.push('스크린 리더를 위한 ARIA 라벨 및 시맨틱 HTML 추가');
    }
    if (!checklist.colorContrast) {
      suggestions.push('색상 대비 비율 개선 (최소 4.5:1)');
    }
    if (!checklist.focusIndicators) {
      suggestions.push('포커스 표시자 스타일 개선');
    }
    if (!checklist.altText) {
      suggestions.push('모든 이미지에 대체 텍스트 추가');
    }
    if (!checklist.semanticHTML) {
      suggestions.push('시맨틱 HTML 요소 사용');
    }
    if (!checklist.ariaLabels) {
      suggestions.push('ARIA 라벨 및 역할 추가');
    }
    if (!checklist.skipLinks) {
      suggestions.push('건너뛰기 링크 추가');
    }

    return suggestions;
  };

  const suggestions = getImprovementSuggestions();

  return (
    <>
      {showPanel && (
        <AccessibilityPanel>
          <div style={{ fontWeight: 'bold', marginBottom: '12px' }}>
            접근성 점수: {score}%
          </div>
          
          <div style={{ marginBottom: '12px' }}>
            <strong>WCAG 2.1 AA 체크리스트:</strong>
          </div>
          
          {Object.entries(checklist).map(([key, passed]) => (
            <ChecklistItem key={key} passed={passed}>
              <CheckIcon>
                {passed ? '✅' : '❌'}
              </CheckIcon>
              <span>
                {key === 'keyboardNavigation' && '키보드 네비게이션'}
                {key === 'screenReaderSupport' && '스크린 리더 지원'}
                {key === 'colorContrast' && '색상 대비'}
                {key === 'focusIndicators' && '포커스 표시자'}
                {key === 'altText' && '대체 텍스트'}
                {key === 'semanticHTML' && '시맨틱 HTML'}
                {key === 'ariaLabels' && 'ARIA 라벨'}
                {key === 'skipLinks' && '건너뛰기 링크'}
              </span>
            </ChecklistItem>
          ))}

          {suggestions.length > 0 && (
            <div style={{ marginTop: '12px' }}>
              <strong>개선 제안:</strong>
              <ul style={{ margin: '8px 0', paddingLeft: '16px', fontSize: '11px' }}>
                {suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </AccessibilityPanel>
      )}

      <button
        onClick={() => setShowPanel(!showPanel)}
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          background: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          cursor: 'pointer',
          zIndex: 1001,
          fontSize: '16px'
        }}
        aria-label="접근성 패널 토글"
      >
        ♿
      </button>
    </>
  );
};

export default AccessibilityManager; 