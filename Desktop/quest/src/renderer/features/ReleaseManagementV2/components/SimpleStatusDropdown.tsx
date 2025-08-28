import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

interface SimpleStatusDropdownProps {
  testCaseId: string;
  currentStatus: string;
  onStatusChange: (testCaseId: string, newStatus: string) => void;
}

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownButton = styled.button<{ status: string }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  min-width: 120px;
  justify-content: space-between;

  &:hover {
    border-color: #cbd5e1;
    background: #f8fafc;
  }

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .status-text {
    color: ${({ status }) => {
      switch (status) {
        case 'Pass': return '#10b981';
        case 'Fail': return '#ef4444';
        case 'Block': return '#f59e0b';
        case 'Skip': return '#8b5cf6';
        default: return '#6b7280';
      }
    }};
  }

  .arrow {
    transition: transform 0.2s;
    color: #6b7280;
  }

  &.open .arrow {
    transform: rotate(180deg);
  }
`;

const DropdownMenuPortal = styled.div<{ position: { top: number; left: number } }>`
  position: fixed;
  top: ${({ position }) => position.top}px;
  left: ${({ position }) => position.left}px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  z-index: 999999;
  margin-top: 4px;
  min-width: 120px;
  animation: dropdownFadeIn 0.2s ease-out;
  
  @keyframes dropdownFadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const DropdownItem = styled.div<{ isSelected: boolean }>`
  padding: 10px 12px;
  cursor: pointer;
  font-size: 14px;
  color: ${({ isSelected }) => (isSelected ? 'white' : '#374151')};
  background: ${({ isSelected }) => (isSelected ? '#3b82f6' : 'transparent')};
  transition: all 0.2s;

  &:hover {
    background: ${({ isSelected }) => (isSelected ? '#3b82f6' : '#f3f4f6')};
  }

  &:first-child {
    border-radius: 6px 6px 0 0;
  }

  &:last-child {
    border-radius: 0 0 6px 6px;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #f3f4f6;
  }
`;

const STATUS_OPTIONS = [
  { value: 'Pass', label: 'Pass', color: '#10b981' },
  { value: 'Fail', label: 'Fail', color: '#ef4444' },
  { value: 'Block', label: 'Block', color: '#f59e0b' },
  { value: 'Skip', label: 'Skip', color: '#8b5cf6' },
];

const SimpleStatusDropdown: React.FC<SimpleStatusDropdownProps> = ({
  testCaseId,
  currentStatus,
  onStatusChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // 버튼이나 메뉴 내부 클릭이 아닌 경우에만 닫기
      if (
        buttonRef.current && 
        !buttonRef.current.contains(target) &&
        menuRef.current && 
        !menuRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleStatusSelect = (newStatus: string) => {
    console.log('=== 간단한 드롭다운 상태 변경 ===');
    console.log('테스트케이스 ID:', testCaseId);
    console.log('현재 상태:', currentStatus);
    console.log('새로운 상태:', newStatus);
    
    // 즉시 드롭다운 닫기
    setIsOpen(false);
    
    // 상태 변경 콜백 호출
    onStatusChange(testCaseId, newStatus);
    
    console.log('=== 상태 변경 완료 ===');
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 4, // 약간의 간격
        left: rect.left
      });
    }
    
    setIsOpen(!isOpen);
  };

  const handleItemClick = (e: React.MouseEvent, newStatus: string) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    handleStatusSelect(newStatus);
  };

  const getStatusDisplay = (status: string) => {
    const option = STATUS_OPTIONS.find(opt => opt.value === status);
    return option || { value: status, label: status, color: '#6b7280' };
  };

  const currentStatusDisplay = getStatusDisplay(currentStatus);

  return (
    <>
      <DropdownContainer>
        <DropdownButton
          ref={buttonRef}
          status={currentStatus}
          className={isOpen ? 'open' : ''}
          onClick={handleButtonClick}
          type="button"
        >
          <span className="status-text">{currentStatusDisplay.label}</span>
          <span className="arrow">▼</span>
        </DropdownButton>
      </DropdownContainer>
      
      {isOpen && createPortal(
        <DropdownMenuPortal 
          ref={menuRef}
          position={position}
        >
          {STATUS_OPTIONS.map((option) => (
            <DropdownItem
              key={option.value}
              isSelected={currentStatus === option.value}
              onClick={(e) => handleItemClick(e, option.value)}
            >
              {option.label}
            </DropdownItem>
          ))}
        </DropdownMenuPortal>,
        document.body
      )}
    </>
  );
};

export default SimpleStatusDropdown;
