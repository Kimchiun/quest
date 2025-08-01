import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { testBackendConnection, ConnectionStatus } from '../../utils/connectionTest';

const StatusContainer = styled.div<{ $isConnected: boolean }>`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 16px;
  border-radius: 8px;
  background: ${({ $isConnected, theme }) => 
    $isConnected ? theme.color.success.primary : theme.color.danger.primary};
  color: white;
  font-size: 14px;
  font-weight: 500;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  opacity: ${({ $isConnected }) => $isConnected ? 0.8 : 1};
  
  &:hover {
    opacity: 1;
  }
`;

const StatusIcon = styled.span`
  margin-right: 8px;
  font-size: 16px;
`;

const StatusText = styled.span`
  font-size: 14px;
`;

const ConnectionStatusIndicator: React.FC = () => {
  const [status, setStatus] = useState<ConnectionStatus>({
    backend: false,
    database: false,
    elasticsearch: false,
    message: '연결 확인 중...'
  });
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const connectionStatus = await testBackendConnection();
        setStatus(connectionStatus);
        
        // 연결이 성공하면 5초 후 숨김
        if (connectionStatus.backend) {
          setTimeout(() => setIsVisible(false), 5000);
        }
      } catch (error) {
        console.error('연결 상태 확인 실패:', error);
        setStatus({
          backend: false,
          database: false,
          elasticsearch: false,
          message: '연결 확인 실패'
        });
      }
    };

    // 초기 연결 테스트
    checkConnection();

    // 30초마다 연결 상태 확인
    const interval = setInterval(checkConnection, 30000);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible && status.backend) {
    return null;
  }

  return (
    <StatusContainer $isConnected={status.backend}>
      <StatusIcon>
        {status.backend ? '🟢' : '🔴'}
      </StatusIcon>
      <StatusText>
        {status.backend ? '백엔드 연결됨' : '백엔드 연결 안됨'}
      </StatusText>
    </StatusContainer>
  );
};

export default ConnectionStatusIndicator; 