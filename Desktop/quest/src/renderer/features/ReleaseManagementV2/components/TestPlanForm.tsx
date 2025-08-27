import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface TestPlanFormProps {
  onSave?: (data: any) => void;
  onPreview?: () => void;
  onExport?: () => void;
}

// Modern Container
const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 60px;
  background: white;
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  line-height: 1.6;
`;

// Header Section
const Header = styled.div`
  background: white;
  padding: 0 0 40px 0;
  margin-bottom: 40px;
  border-bottom: 2px solid #e9ecef;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 12px 0;
  letter-spacing: -0.02em;
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: 18px;
  color: #7f8c8d;
  margin: 0 0 32px 0;
  line-height: 1.5;
  text-align: center;
`;

const TitleInput = styled.input`
  width: 100%;
  font-size: 24px;
  font-weight: 600;
  padding: 16px 0;
  border: none;
  border-bottom: 2px solid #e9ecef;
  background: white;
  color: #2c3e50;
  text-align: center;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-bottom-color: #3498db;
  }
  
  &::placeholder {
    color: #bdc3c7;
    font-weight: 400;
  }
`;

// Content Section
const ContentGrid = styled.div`
  display: grid;
  gap: 40px;
  grid-template-columns: 1fr;
`;

const Card = styled.div`
  background: white;
  padding: 0;
  margin-bottom: 32px;
`;

const SectionTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 20px 0;
  padding-bottom: 12px;
  border-bottom: 1px solid #ecf0f1;
`;

const SectionIcon = styled.div`
  display: none;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 150px;
  padding: 20px 0;
  border: none;
  border-bottom: 1px solid #ecf0f1;
  background: white;
  color: #2c3e50;
  font-size: 16px;
  line-height: 1.7;
  resize: vertical;
  font-family: inherit;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-bottom-color: #3498db;
  }
  
  &::placeholder {
    color: #bdc3c7;
    font-style: italic;
  }
`;

// Table Styles
const TableCard = styled(Card)`
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
`;
  
const TableHeader = styled.th`
  background: #f8f9fa;
  padding: 16px 20px;
    text-align: left;
  font-weight: 600;
    font-size: 14px;
  color: #1a1a1a;
  border-bottom: 2px solid #e9ecef;
  
  &:first-child {
    border-radius: 8px 0 0 0;
  }
  
  &:last-child {
    border-radius: 0 8px 0 0;
  }
`;

const TableCell = styled.td`
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  vertical-align: top;
`;

const TableInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  background: white;
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #0066ff;
    box-shadow: 0 0 0 2px rgba(0, 102, 255, 0.1);
  }
`;

const TableTextArea = styled.textarea`
  width: 100%;
  min-height: 60px;
  padding: 8px 12px;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  background: white;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #0066ff;
    box-shadow: 0 0 0 2px rgba(0, 102, 255, 0.1);
  }
`;

const AddButton = styled.button`
  margin-top: 16px;
  padding: 12px 24px;
  background: #0066ff;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #0052cc;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const RemoveButton = styled.button`
  padding: 6px 12px;
  background: #ff4757;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #ff3742;
  }
`;

// Action Buttons
const ActionBar = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 60px;
  padding: 40px 0;
  border-top: 2px solid #ecf0f1;
`;

const SaveButton = styled.button`
  padding: 14px 28px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
  
  &:hover {
    background: #2980b9;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const PreviewButton = styled.button`
  padding: 14px 28px;
  background: white;
  color: #7f8c8d;
  border: 2px solid #bdc3c7;
  border-radius: 6px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
  
  &:hover {
    background: #ecf0f1;
    color: #2c3e50;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const EditButton = styled.button`
  padding: 14px 28px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
  
  &:hover {
    background: #2980b9;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const CancelButton = styled.button`
  padding: 14px 28px;
  background: #95a5a6;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
  
  &:hover {
    background: #7f8c8d;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

// 읽기 모드용 컴포넌트들
const ReadOnlyText = styled.div`
  padding: 20px 0;
  background: white;
  border-bottom: 1px solid #ecf0f1;
  color: #2c3e50;
  font-size: 16px;
  line-height: 1.7;
  white-space: pre-wrap;
  min-height: 150px;
`;

const ReadOnlyTitle = styled.div`
  font-size: 24px;
  font-weight: 600;
  padding: 16px 0;
  background: white;
  border-bottom: 2px solid #e9ecef;
  color: #2c3e50;
  text-align: center;
`;

const ReadOnlyTable = styled.div`
  margin-top: 16px;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  overflow: hidden;
`;

const ReadOnlyTableHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  background: #f8f9fa;
  border-bottom: 2px solid #e9ecef;
`;

const ReadOnlyTableHeaderCell = styled.div`
  padding: 16px 20px;
  font-weight: 600;
  font-size: 14px;
  color: #1a1a1a;
  border-right: 1px solid #e9ecef;
  
  &:last-child {
    border-right: none;
  }
`;

const ReadOnlyTableRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ReadOnlyTableCell = styled.div`
  padding: 16px 20px;
  border-right: 1px solid #f0f0f0;
  font-size: 14px;
  color: #1a1a1a;
  white-space: pre-wrap;
  
  &:last-child {
    border-right: none;
  }
`;

const TestPlanForm: React.FC<TestPlanFormProps> = ({ onSave, onPreview, onExport }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  
  // 컴포넌트 마운트 시 localStorage 클리어
  useEffect(() => {
    localStorage.removeItem('testPlanData');
  }, []);
  
  const [formData, setFormData] = useState(() => {
    return {
      title: '',
      projectOverview: '이 프로젝트의 개요와 목적을 간단히 설명해주세요.\n\n예시: 이 프로젝트는 사용자 경험을 개선하고 새로운 기능을 추가하는 것을 목표로 합니다.',
      testObjective: '이 테스트의 주요 목표와 달성하고자 하는 결과를 설명해주세요.\n\n예시: 새로운 기능이 요구사항에 맞게 동작하는지 확인하고, 기존 기능에 영향을 주지 않는지 검증합니다.',
      testingApproach: '전체적인 테스트 접근법과 방법론을 설명해주세요.\n\n예시: 단계별 테스트 진행, 자동화 및 수동 테스트 병행, 위험 기반 테스트 우선순위 적용',
      exceptionHandling: '예외 상황 발생 시 처리 절차를 설명해주세요.\n\n예시: 중요 결함 발견 시 즉시 개발팀에 보고, 테스트 차단 상황 시 대체 방안 수립',
      testScopeLimitations: '이 테스트 단계에 포함되지 않는 특정 모듈이나 기능과 같은 테스트 범위의 제한사항을 지정하세요.\n\n예시: 타사 API 연동 부분은 모킹으로 대체, 성능 테스트는 별도 단계에서 진행',
      excludedAreas: '테스트에서 명시적으로 제외되는 영역이나 기능을 나열하세요.\n\n예시: 레거시 모듈, 외부 결제 시스템, 관리자 전용 기능',
      assumptions: '테스트 환경이나 데이터의 가용성과 같은 이 테스트 계획 작성 중에 이루어진 가정사항을 문서화하세요.\n\n예시: 테스트 환경이 운영 환경과 동일하게 설정됨, 테스트 데이터는 충분히 제공됨',
      schedule: [
        {
          phase: '1단계: 테스트 준비',
          startDate: '',
          endDate: '',
          tasks: '테스트 케이스 작성, 테스트 환경 구성',
          testMethod: '테스트 계획 검토 및 승인'
        }
      ],
      responsibleParties: [
        {
          role: '테스트 매니저',
          name: '',
          email: '',
          responsibilities: '전체 테스트 진행 관리 및 품질 보증'
        }
      ],
      riskFactors: [
        {
          riskName: '일정 지연',
          impact: '보통',
          probability: '보통',
          mitigation: '버퍼 시간 확보 및 우선순위 조정'
        }
      ],
      referenceDocuments: [
        {
          title: '요구사항 문서',
          url: '',
          description: '프로젝트 요구사항 상세 문서'
        }
      ],
      issueReports: [
        {
          title: '이슈 리포트 템플릿',
          path: '',
          description: '발견된 결함 및 이슈 보고서'
        }
      ],
      testEnvironments: [
        {
          category: '웹 브라우저',
          details: 'Chrome (최신 버전), Firefox (최신 버전), Safari (최신 버전)'
        }
      ],
      testStrategies: [
        {
          strategyName: '기능 테스트',
          description: '각 기능이 요구사항에 맞게 동작하는지 확인하는 테스트'
        }
      ]
    };
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayItemChange = (arrayName: string, index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item: any, i: number) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addArrayItem = (arrayName: string, template: any) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], template]
    }));
  };

  const removeArrayItem = (arrayName: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_: any, i: number) => i !== index)
    }));
  };

  const handleSave = () => {
    console.log('저장된 데이터:', formData);
    onSave?.(formData);
    setIsEditMode(false);
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleCancel = () => {
    setIsEditMode(false);
    // 필요시 원래 데이터로 복원 로직 추가
  };

  return (
    <Container>
            <Header>
        <Title>테스트 계획</Title>
        <Subtitle>프로젝트의 테스트 계획을 체계적으로 작성하고 관리하세요</Subtitle>
          {isEditMode ? (
          <TitleInput
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="테스트 계획 제목을 입력해주세요"
            />
          ) : (
          <ReadOnlyTitle>
            {formData.title || '제목을 입력해주세요'}
          </ReadOnlyTitle>
        )}
      </Header>

      <ContentGrid>
                {/* 프로젝트 개요 */}
        <Card>
          <SectionTitle>
            <SectionIcon />
            프로젝트 개요 / 범위
          </SectionTitle>
                {isEditMode ? (
            <TextArea
                    value={formData.projectOverview}
                    onChange={(e) => handleInputChange('projectOverview', e.target.value)}
              placeholder="프로젝트의 개요와 목적을 간단히 설명해주세요..."
                  />
                ) : (
            <ReadOnlyText>
              {formData.projectOverview || '내용이 없습니다.'}
            </ReadOnlyText>
          )}
        </Card>

        {/* 테스트 목표 */}
        <Card>
          <SectionTitle>
            <SectionIcon />
            테스트 목표
          </SectionTitle>
          {isEditMode ? (
            <TextArea
              value={formData.testObjective}
              onChange={(e) => handleInputChange('testObjective', e.target.value)}
              placeholder="이 테스트의 주요 목표와 달성하고자 하는 결과를 설명해주세요..."
            />
          ) : (
            <ReadOnlyText>
              {formData.testObjective || '내용이 없습니다.'}
            </ReadOnlyText>
          )}
        </Card>

        {/* 일정 */}
        <TableCard>
          <SectionTitle>
            <SectionIcon />
            일정
          </SectionTitle>
            <Table>
              <thead>
                <tr>
                <TableHeader>단계</TableHeader>
                <TableHeader>시작일</TableHeader>
                <TableHeader>종료일</TableHeader>
                <TableHeader>작업</TableHeader>
                <TableHeader>테스트 방법</TableHeader>
                <TableHeader>작업</TableHeader>
                </tr>
              </thead>
              <tbody>
              {formData.schedule.map((item: any, index: number) => (
                  <tr key={index}>
                  <TableCell>
                    <TableInput
                          value={item.phase}
                      onChange={(e) => handleArrayItemChange('schedule', index, 'phase', e.target.value)}
                      placeholder="단계명"
                    />
                  </TableCell>
                  <TableCell>
                    <TableInput
                          type="date"
                          value={item.startDate}
                      onChange={(e) => handleArrayItemChange('schedule', index, 'startDate', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <TableInput
                          type="date"
                          value={item.endDate}
                      onChange={(e) => handleArrayItemChange('schedule', index, 'endDate', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <TableTextArea
                          value={item.tasks}
                      onChange={(e) => handleArrayItemChange('schedule', index, 'tasks', e.target.value)}
                      placeholder="작업 내용"
                    />
                  </TableCell>
                  <TableCell>
                    <TableTextArea
                      value={item.testMethod}
                      onChange={(e) => handleArrayItemChange('schedule', index, 'testMethod', e.target.value)}
                      placeholder="테스트 방법"
                    />
                  </TableCell>
                  <TableCell>
                    {isEditMode && formData.schedule.length > 1 && (
                      <RemoveButton onClick={() => removeArrayItem('schedule', index)}>
                        삭제
                      </RemoveButton>
                    )}
                  </TableCell>
                  </tr>
                ))}
              </tbody>
            </Table>
          {isEditMode && (
            <AddButton onClick={() => addArrayItem('schedule', {
              phase: '',
              startDate: '',
              endDate: '',
              tasks: '',
              testMethod: ''
            })}>
              일정 추가
            </AddButton>
          )}
        </TableCard>

        {/* 담당자 */}
        <TableCard>
          <SectionTitle>
            <SectionIcon />
            담당자
          </SectionTitle>
            <Table>
              <thead>
                <tr>
                <TableHeader>역할</TableHeader>
                <TableHeader>이름</TableHeader>
                <TableHeader>이메일</TableHeader>
                <TableHeader>책임사항</TableHeader>
                <TableHeader>작업</TableHeader>
                </tr>
              </thead>
              <tbody>
              {formData.responsibleParties.map((item: any, index: number) => (
                  <tr key={index}>
                  <TableCell>
                    <TableInput
                    value={item.role}
                      onChange={(e) => handleArrayItemChange('responsibleParties', index, 'role', e.target.value)}
                      placeholder="역할"
                    />
                  </TableCell>
                  <TableCell>
                    <TableInput
                    value={item.name}
                      onChange={(e) => handleArrayItemChange('responsibleParties', index, 'name', e.target.value)}
                      placeholder="이름"
                    />
                  </TableCell>
                  <TableCell>
                    <TableInput
                      type="email"
                      value={item.email}
                      onChange={(e) => handleArrayItemChange('responsibleParties', index, 'email', e.target.value)}
                      placeholder="이메일"
                    />
                  </TableCell>
                  <TableCell>
                    <TableTextArea
                      value={item.responsibilities}
                      onChange={(e) => handleArrayItemChange('responsibleParties', index, 'responsibilities', e.target.value)}
                      placeholder="책임사항"
                    />
                  </TableCell>
                  <TableCell>
                    {formData.responsibleParties.length > 1 && (
                      <RemoveButton onClick={() => removeArrayItem('responsibleParties', index)}>
                        삭제
                      </RemoveButton>
                    )}
                  </TableCell>
                  </tr>
                ))}
              </tbody>
            </Table>
          <AddButton onClick={() => addArrayItem('responsibleParties', {
            role: '',
            name: '',
            email: '',
            responsibilities: ''
          })}>
            담당자 추가
          </AddButton>
        </TableCard>

        {/* 위험 요소 */}
        <TableCard>
          <SectionTitle>
            <SectionIcon />
            위험 요소
          </SectionTitle>
            <Table>
              <thead>
                <tr>
                <TableHeader>위험명</TableHeader>
                <TableHeader>영향도</TableHeader>
                <TableHeader>발생 확률</TableHeader>
                <TableHeader>대응 방안</TableHeader>
                <TableHeader>작업</TableHeader>
                </tr>
              </thead>
              <tbody>
              {formData.riskFactors.map((item: any, index: number) => (
                  <tr key={index}>
                  <TableCell>
                    <TableInput
                      value={item.riskName}
                      onChange={(e) => handleArrayItemChange('riskFactors', index, 'riskName', e.target.value)}
                      placeholder="위험명"
                    />
                  </TableCell>
                  <TableCell>
                    <TableInput
                          value={item.impact}
                      onChange={(e) => handleArrayItemChange('riskFactors', index, 'impact', e.target.value)}
                      placeholder="영향도"
                    />
                  </TableCell>
                  <TableCell>
                    <TableInput
                          value={item.probability}
                      onChange={(e) => handleArrayItemChange('riskFactors', index, 'probability', e.target.value)}
                      placeholder="발생 확률"
                    />
                  </TableCell>
                  <TableCell>
                    <TableTextArea
                          value={item.mitigation}
                      onChange={(e) => handleArrayItemChange('riskFactors', index, 'mitigation', e.target.value)}
                      placeholder="대응 방안"
                    />
                  </TableCell>
                  <TableCell>
                    {formData.riskFactors.length > 1 && (
                      <RemoveButton onClick={() => removeArrayItem('riskFactors', index)}>
                        삭제
                      </RemoveButton>
                    )}
                  </TableCell>
                  </tr>
                ))}
              </tbody>
            </Table>
          <AddButton onClick={() => addArrayItem('riskFactors', {
            riskName: '',
            impact: '',
            probability: '',
            mitigation: ''
          })}>
            위험 요소 추가
          </AddButton>
        </TableCard>

        {/* 테스트 접근법 */}
        <Card>
          <SectionTitle>
            <SectionIcon />
            테스트 접근법
          </SectionTitle>
          {isEditMode ? (
            <TextArea
            value={formData.testingApproach}
            onChange={(e) => handleInputChange('testingApproach', e.target.value)}
              placeholder="전체적인 테스트 접근법과 방법론을 설명해주세요..."
                        />
                      ) : (
            <ReadOnlyText>
              {formData.testingApproach || '내용이 없습니다.'}
            </ReadOnlyText>
          )}
        </Card>

        {/* 예외 처리 */}
        <Card>
          <SectionTitle>
            <SectionIcon />
            예외 처리
          </SectionTitle>
                      {isEditMode ? (
            <TextArea
              value={formData.exceptionHandling}
              onChange={(e) => handleInputChange('exceptionHandling', e.target.value)}
              placeholder="예외 상황 발생 시 처리 절차를 설명해주세요..."
                        />
                      ) : (
            <ReadOnlyText>
              {formData.exceptionHandling || '내용이 없습니다.'}
            </ReadOnlyText>
          )}
        </Card>

        {/* 테스트 범위 제한사항 */}
        <Card>
          <SectionTitle>
            <SectionIcon />
            테스트 범위 제한사항
          </SectionTitle>
          {isEditMode ? (
            <TextArea
            value={formData.testScopeLimitations}
            onChange={(e) => handleInputChange('testScopeLimitations', e.target.value)}
              placeholder="테스트 범위의 제한사항을 지정하세요..."
            />
          ) : (
            <ReadOnlyText>
              {formData.testScopeLimitations || '내용이 없습니다.'}
            </ReadOnlyText>
          )}
        </Card>

        {/* 제외 영역 */}
        <Card>
          <SectionTitle>
            <SectionIcon />
            제외 영역
          </SectionTitle>
          {isEditMode ? (
            <TextArea
            value={formData.excludedAreas}
            onChange={(e) => handleInputChange('excludedAreas', e.target.value)}
              placeholder="테스트에서 제외되는 영역이나 기능을 나열하세요..."
            />
          ) : (
            <ReadOnlyText>
              {formData.excludedAreas || '내용이 없습니다.'}
            </ReadOnlyText>
          )}
        </Card>

        {/* 가정사항 */}
        <Card>
          <SectionTitle>
            <SectionIcon />
            가정사항
          </SectionTitle>
          {isEditMode ? (
            <TextArea
            value={formData.assumptions}
            onChange={(e) => handleInputChange('assumptions', e.target.value)}
              placeholder="테스트 계획 작성 중에 이루어진 가정사항을 문서화하세요..."
            />
          ) : (
            <ReadOnlyText>
              {formData.assumptions || '내용이 없습니다.'}
            </ReadOnlyText>
          )}
        </Card>
      </ContentGrid>

      <ActionBar>
        {isEditMode ? (
          <>
            <CancelButton onClick={handleCancel}>
              취소
            </CancelButton>
            <SaveButton onClick={handleSave}>
              저장
            </SaveButton>
          </>
        ) : (
          <>
            <PreviewButton onClick={onPreview}>
              미리보기
            </PreviewButton>
            <EditButton onClick={handleEdit}>
              수정
            </EditButton>
          </>
        )}
      </ActionBar>
    </Container>
  );
};

export default TestPlanForm;