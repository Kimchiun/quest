import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Typography from '../../../shared/components/Typography';
import Container from '../../../shared/components/Container';
import Grid from '../../../shared/components/Grid';
import Button from '../../../shared/components/Button';
import Input from '../../../shared/components/Input';

const PageContainer = styled.div`
  padding: 24px;
  background: #f8fafc;
  min-height: 100vh;
`;

const ReleaseCard = styled.div`
  padding: 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  margin-bottom: 16px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
`;

const ReleaseTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
`;

const ReleaseInfo = styled.div`
  font-size: 14px;
  color: #64748b;
`;

const ReleaseSelection: React.FC = () => {
  const [releases, setReleases] = useState<any[]>([]);
  const [selectedRelease, setSelectedRelease] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReleases();
  }, []);

  const fetchReleases = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/releases');
      if (response.ok) {
        const data = await response.json();
        setReleases(data);
      }
    } catch (error) {
      console.error('릴리즈 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReleaseSelect = (release: any) => {
    setSelectedRelease(release);
  };

  const handleCreateRelease = async (formData: any) => {
    try {
      const response = await fetch('http://localhost:3000/api/releases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        await fetchReleases();
      }
    } catch (error) {
      console.error('릴리즈 생성 실패:', error);
    }
  };

  return (
    <PageContainer>
      <Container
        $maxWidth="1200px"
        $padding="24px"
        $background="white"
        $radius="8px"
        style={{ margin: '0 auto', boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}
      >
        <Grid
          $columns={1}
          $gap="16px"
        >
          <Typography $variant="h2" style={{ marginBottom: '24px' }}>
            릴리즈 계획
          </Typography>

          {loading ? (
            <Typography $variant="body">로딩 중...</Typography>
          ) : (
            <Grid
              $columns={2}
              $gap="16px"
            >
              <div>
                <Typography $variant="h4" style={{ marginBottom: '16px' }}>
                  릴리즈 목록
                </Typography>
                {releases.map((release) => (
                  <ReleaseCard
                    key={release.id}
                    onClick={() => handleReleaseSelect(release)}
                    style={{
                      borderColor: selectedRelease?.id === release.id ? '#2563eb' : '#e2e8f0'
                    }}
                  >
                    <ReleaseTitle>{release.name}</ReleaseTitle>
                    <ReleaseInfo>
                      시작일: {release.startDate} | 종료일: {release.endDate}
                    </ReleaseInfo>
                  </ReleaseCard>
                ))}
              </div>

              <div>
                <Typography $variant="h4" style={{ marginBottom: '16px' }}>
                  선택된 릴리즈
                </Typography>
                {selectedRelease ? (
                  <ReleaseCard>
                    <ReleaseTitle>{selectedRelease.name}</ReleaseTitle>
                    <ReleaseInfo>
                      <div>시작일: {selectedRelease.startDate}</div>
                      <div>종료일: {selectedRelease.endDate}</div>
                      <div>상태: {selectedRelease.status}</div>
                    </ReleaseInfo>
                  </ReleaseCard>
                ) : (
                  <Typography $variant="body" style={{ color: '#64748b' }}>
                    릴리즈를 선택해주세요
                  </Typography>
                )}
              </div>
            </Grid>
          )}
        </Grid>
      </Container>
    </PageContainer>
  );
};

export default ReleaseSelection; 