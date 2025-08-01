import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

const Panel = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background: white;
`;

const Header = styled.div`
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const Section = styled.div`
  padding: 20px;
  border-bottom: 1px solid #f1f5f9;
  
  &:last-child {
    border-bottom: none;
  }
`;

const SectionTitle = styled.h4`
  margin: 0 0 16px 0;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
`;

const TaskItem = styled.div<{ priority: string }>`
  padding: 12px;
  margin-bottom: 8px;
  background: white;
  border-radius: 6px;
  border-left: 4px solid ${props => {
    switch (props.priority) {
      case 'high': return '#dc2626';
      case 'medium': return '#d97706';
      case 'low': return '#059669';
      default: return '#6b7280';
    }
  }};
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #3b82f6;
    box-shadow: 0 2px 4px rgba(59, 130, 246, 0.1);
  }
`;

const TaskTitle = styled.div`
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 4px;
`;

const TaskMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #64748b;
`;

const PriorityBadge = styled.span<{ priority: string }>`
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;
  background: ${props => {
    switch (props.priority) {
      case 'high': return '#fef2f2';
      case 'medium': return '#fffbeb';
      case 'low': return '#f0fdf4';
      default: return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch (props.priority) {
      case 'high': return '#dc2626';
      case 'medium': return '#d97706';
      case 'low': return '#059669';
      default: return '#6b7280';
    }
  }};
`;

const ContextInfo = styled.div`
  background: #f8fafc;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #e2e8f0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const InfoLabel = styled.span`
  font-size: 12px;
  color: #64748b;
`;

const InfoValue = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #1e293b;
`;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 16px;
`;

const ActionButton = styled.button`
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: white;
  color: #374151;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f8fafc;
    border-color: #3b82f6;
  }
`;

const CollapsedContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 10px;
  height: 100%;
`;

const CollapsedIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #3b82f6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  font-size: 18px;
`;

const RightPanel: React.FC = () => {
  const layout = useSelector((state: RootState) => state.dashboardLayout);
  const isCollapsed = layout.rightPanel.isCollapsed;

  const myTasks = [
    { id: 1, title: '로그인 테스트 케이스 검토', priority: 'high', dueDate: '오늘' },
    { id: 2, title: 'API 테스트 스크립트 작성', priority: 'medium', dueDate: '내일' },
    { id: 3, title: '성능 테스트 결과 분석', priority: 'low', dueDate: '3일 후' },
    { id: 4, title: '버그 리포트 업데이트', priority: 'medium', dueDate: '이번 주' }
  ];

  const contextInfo = [
    { label: '현재 프로젝트', value: 'Quest v2.1' },
    { label: '활성 릴리즈', value: 'v2.1.0' },
    { label: '테스트 환경', value: 'Staging' },
    { label: '마지막 로그인', value: '2시간 전' }
  ];

  const quickActions = [
    { label: '새 테스트', icon: '🧪' },
    { label: '보고서', icon: '📊' },
    { label: '설정', icon: '⚙️' },
    { label: '도움말', icon: '❓' }
  ];

  if (isCollapsed) {
    return (
      <Panel>
        <CollapsedContent>
          {quickActions.map((action, index) => (
            <CollapsedIcon key={index} title={action.label}>
              {action.icon}
            </CollapsedIcon>
          ))}
        </CollapsedContent>
      </Panel>
    );
  }

  return (
    <Panel>
      <Header>
        <Title>개인 작업</Title>
      </Header>
      
      <Content>
        <Section>
          <SectionTitle>내 작업 목록</SectionTitle>
          {myTasks.map((task) => (
            <TaskItem key={task.id} priority={task.priority}>
              <TaskTitle>{task.title}</TaskTitle>
              <TaskMeta>
                <PriorityBadge priority={task.priority}>
                  {task.priority === 'high' && '높음'}
                  {task.priority === 'medium' && '보통'}
                  {task.priority === 'low' && '낮음'}
                </PriorityBadge>
                <span>{task.dueDate}</span>
              </TaskMeta>
            </TaskItem>
          ))}
        </Section>
        
        <Section>
          <SectionTitle>컨텍스트 정보</SectionTitle>
          <ContextInfo>
            {contextInfo.map((info, index) => (
              <InfoItem key={index}>
                <InfoLabel>{info.label}</InfoLabel>
                <InfoValue>{info.value}</InfoValue>
              </InfoItem>
            ))}
          </ContextInfo>
          
          <QuickActions>
            {quickActions.map((action, index) => (
              <ActionButton key={index}>
                {action.icon} {action.label}
              </ActionButton>
            ))}
          </QuickActions>
        </Section>
      </Content>
    </Panel>
  );
};

export default RightPanel; 