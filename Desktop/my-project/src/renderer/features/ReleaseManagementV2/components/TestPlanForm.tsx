import React, { useState } from 'react';
import styled from 'styled-components';

interface TestPlanFormProps {
  onSave?: (data: any) => void;
  onPreview?: () => void;
  onExport?: () => void;
}

// Modern TestPlanPro Design Components
const TestPlanContainer = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 0 40px;
  min-height: 100vh;
  font-family: 'Inter', 'Noto Sans', sans-serif;
`;

const TestPlanHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 12px;
  padding: 16px;
  margin-bottom: 24px;
`;

const TestPlanTitle = styled.h1`
  color: #0d141c;
  font-size: 32px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.015em;
  margin: 0;
  min-width: 288px;
`;

const PreviewButton = styled.button`
  display: flex;
  min-width: 84px;
  max-width: 480px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 8px;
  height: 32px;
  padding: 0 16px;
  background: #e7edf4;
  color: #0d141c;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  border: none;
  transition: all 0.2s ease;
  
  &:hover {
    background: #d1d9e6;
  }
`;

const SectionHeader = styled.h3`
  color: #0d141c;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.015em;
  padding: 0 16px 8px 16px;
  margin: 16px 0 0 0;
`;

const SectionContent = styled.div`
  padding: 16px;
`;

const HeroSection = styled.div`
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 100%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuAEHj8MkVSAfLPD-uhyUZickG_0RzNi2ogxaJAVEXK8r3quC1HAho47hTdS0UDx8RJ92GBi6_bapjFbBFlN486BpKvs-50sGbY-aW_SBWhMpKNkojtpZx54y2esqxBsOTIK8QpsObb9LdmqZMrzyoUlxWOry8MpGFgR9DP07pPXQGt-c5nOAlwpaePv9wK5KvGu3KzDvhWNzPknEt-ww51_GVmVOa9H9cl2qvR5je-UcmhXrfgliLKZqFqUh4B6Er_0ZkswTiLlBmo');
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: end;
  border-radius: 8px;
  padding-top: 132px;
  margin-bottom: 24px;
`;

const HeroContent = styled.div`
  display: flex;
  width: 100%;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
  padding: 16px;
`;

const HeroText = styled.p`
  color: white;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.015em;
  flex: 1;
  margin: 0;
`;

const ModernTable = styled.div`
  display: flex;
  overflow: hidden;
  border-radius: 8px;
  border: 1px solid #cedbe8;
  background: #f8fafc;
  margin-bottom: 24px;
`;

const Table = styled.table`
  flex: 1;
  border-collapse: collapse;
  
  th {
    padding: 12px 16px;
    text-align: left;
    color: #0d141c;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.4;
    background: #f8fafc;
    width: 400px;
  }
  
  td {
    padding: 8px 16px;
    text-align: left;
    color: #49739c;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.4;
    height: 72px;
    border-top: 1px solid #cedbe8;
    width: 400px;
  }
  
  tr:first-child td {
    border-top: none;
  }
`;

const GridSection = styled.div`
  display: grid;
  grid-template-columns: 20% 1fr;
  gap: 24px;
  padding: 16px;
  margin-bottom: 24px;
`;

const GridRow = styled.div`
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: subgrid;
  border-top: 1px solid #cedbe8;
  padding: 20px 0;
  
  &:first-child {
    border-top: none;
  }
`;

const GridLabel = styled.p`
  color: #49739c;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.4;
  margin: 0;
`;

const GridValue = styled.p`
  color: #0d141c;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.4;
  margin: 0;
`;

const TextAreaContainer = styled.div`
  display: flex;
  max-width: 480px;
  flex-wrap: wrap;
  align-items: end;
  gap: 16px;
  padding: 0 16px 12px 16px;
  margin-bottom: 24px;
`;

const ModernTextarea = styled.textarea`
  display: flex;
  width: 100%;
  min-width: 0;
  flex: 1;
  resize: none;
  overflow: hidden;
  border-radius: 8px;
  color: #0d141c;
  outline: none;
  border: 1px solid #cedbe8;
  background: #f8fafc;
  min-height: 144px;
  padding: 15px;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.4;
  font-family: inherit;
  
  &:focus {
    border-color: #cedbe8;
  }
  
  &::placeholder {
    color: #49739c;
  }
`;

const SubSectionHeader = styled.h4`
  color: #49739c;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.4;
  letter-spacing: 0.015em;
  padding: 0 16px 8px 16px;
  margin: 16px 0 0 0;
  text-align: left;
`;

const TestPlanForm: React.FC<TestPlanFormProps> = ({ onSave, onPreview, onExport }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    projectOverview: '프로젝트 피닉스는 기업이 고객 관계를 관리하는 방식을 혁신하는 것을 목표로 합니다. 이 새로운 CRM 플랫폼은 판매, 마케팅, 고객 서비스 기능을 하나의 통합된 시스템으로 통합할 것입니다.',
    testObjective: '이 테스트 단계의 주요 목표는 프로젝트 피닉스가 지정된 모든 기능적 및 비기능적 요구사항을 충족하는지 확인하는 것입니다. 여기에는 플랫폼의 사용성, 성능, 보안 및 다양한 브라우저와 기기 간의 호환성 검증이 포함됩니다.',
    testingApproach: '',
    exceptionHandling: '',
    testScopeLimitations: '',
    excludedAreas: '',
    assumptions: '',
    schedule: [
      { phase: '1단계: 단위 테스트', startDate: '2024-07-15', endDate: '2024-07-22', tasks: 'CRM 플랫폼의 개별 컴포넌트에 대한 단위 테스트를 개발하고 실행합니다.', method: 'JUnit을 사용한 자동화 테스트' },
      { phase: '2단계: 통합 테스트', startDate: '2024-07-23', endDate: '2024-07-30', tasks: '개별 컴포넌트를 통합하고 통합 테스트를 수행하여 올바르게 작동하는지 확인합니다.', method: '자동화 및 수동 테스트' },
      { phase: '3단계: 시스템 테스트', startDate: '2024-07-31', endDate: '2024-08-15', tasks: '전체 CRM 플랫폼이 지정된 요구사항을 충족하는지 확인하기 위한 시스템 수준 테스트를 수행합니다.', method: '성능 및 보안 테스트를 포함한 수동 및 자동화 테스트' },
      { phase: '4단계: 승인 테스트', startDate: '2024-08-16', endDate: '2024-08-30', tasks: 'CRM 플랫폼이 이해관계자의 요구사항과 기대를 충족하는지 확인하기 위한 승인 테스트를 수행합니다.', method: '사용자 승인 테스트 (UAT)' }
    ],
    responsibleParties: [
      { role: '기획', person: '소피아 리 (sl@example.com)' },
      { role: '개발', person: '리암 첸 (lc@example.com)' },
      { role: '디자인', person: '아바 파텔 (ap@example.com)' },
      { role: '퍼블리싱', person: '노아 김 (nk@example.com)' },
      { role: 'QA', person: '이사벨라 로시 (ir@example.com)' }
    ],
    riskFactors: [
      { name: '결함 해결 지연', impact: '높음', probability: '보통', mitigation: '테스트 및 개발 팀 간의 긴밀한 협업, 중요한 결함 우선순위 지정.' },
      { name: '테스트 커버리지 부족', impact: '보통', probability: '낮음', mitigation: '중요한 테스트 케이스 우선순위 지정, 유연한 테스트 일정 유지.' },
      { name: '호환성 문제', impact: '높음', probability: '낮음', mitigation: '타사 통합에 대한 철저한 테스트, 다양한 환경을 위한 가상화 사용.' }
    ],
    referenceDocuments: [
      { name: '요구사항 문서', url: 'https://example.com/requirements.pdf', filename: '요구사항.pdf' },
      { name: '테스트 계획 문서', url: 'https://example.com/testplan.pdf', filename: '테스트계획.pdf' },
      { name: '사용자 매뉴얼', url: 'https://example.com/usermanual.pdf', filename: '사용자매뉴얼.pdf' }
    ],
    issueReports: [
      { name: '이슈 리포트 1', path: '/reports/issue1.pdf', filename: '이슈1.pdf' },
      { name: '이슈 리포트 2', path: '/reports/issue2.pdf', filename: '이슈2.pdf' },
      { name: '이슈 리포트 3', path: '/reports/issue3.pdf', filename: '이슈3.pdf' }
    ],
    testEnvironments: [
      { category: '웹 브라우저', details: 'Chrome (버전 92+), Firefox (버전 90+), Safari (버전 14+), Edge (버전 92+)' },
      { category: '모바일 iOS', details: 'iPhone 12 (iOS 14), iPad Pro (iOS 15)' },
      { category: '모바일 Android', details: 'Samsung Galaxy S21 (Android 11), Google Pixel 5 (Android 12)' }
    ],
    testStrategies: [
      { name: '탐색적 테스트', description: '예상치 못한 문제를 발견하고 사용성을 개선하기 위한 비구조화된 테스트.' },
      { name: '회귀 테스트', description: '새로운 변경사항이 기존 기능에 부정적인 영향을 미치지 않는지 확인하는 자동화된 테스트.' }
    ]
  });

  const handleSave = () => {
    console.log('저장된 데이터:', formData);
    onSave?.(formData);
    setIsEditMode(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSave();
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleCancel = () => {
    setIsEditMode(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDeleteSchedule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      schedule: prev.schedule.filter((_, i) => i !== index)
    }));
  };

  const handleAddSchedule = () => {
    setFormData(prev => ({
      ...prev,
      schedule: [...prev.schedule, {
        phase: '새 단계',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        tasks: '작업 내용',
        method: '테스트 방법'
      }]
    }));
  };

  const handleDeleteResponsibleParty = (index: number) => {
    setFormData(prev => ({
      ...prev,
      responsibleParties: prev.responsibleParties.filter((_, i) => i !== index)
    }));
  };

  const handleAddResponsibleParty = () => {
    setFormData(prev => ({
      ...prev,
      responsibleParties: [...prev.responsibleParties, {
        role: '새 역할',
        person: '담당자 정보'
      }]
    }));
  };

  const handleDeleteRiskFactor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      riskFactors: prev.riskFactors.filter((_, i) => i !== index)
    }));
  };

  const handleAddRiskFactor = () => {
    setFormData(prev => ({
      ...prev,
      riskFactors: [...prev.riskFactors, {
        name: '새 위험 요소',
        impact: '보통',
        probability: '보통',
        mitigation: '대응 방안'
      }]
    }));
  };

  const handleAddReferenceDocument = () => {
    setFormData(prev => ({
      ...prev,
      referenceDocuments: [...prev.referenceDocuments, {
        name: '새 문서',
        url: 'https://example.com/document.pdf',
        filename: '문서.pdf'
      }]
    }));
  };

  const handleDeleteReferenceDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      referenceDocuments: prev.referenceDocuments.filter((_, i) => i !== index)
    }));
  };

  const handleAddIssueReport = () => {
    setFormData(prev => ({
      ...prev,
      issueReports: [...prev.issueReports, {
        name: '새 이슈 리포트',
        path: '/reports/issue.pdf',
        filename: '이슈.pdf'
      }]
    }));
  };

  const handleDeleteIssueReport = (index: number) => {
    setFormData(prev => ({
      ...prev,
      issueReports: prev.issueReports.filter((_, i) => i !== index)
    }));
  };

  const handleAddTestEnvironment = () => {
    setFormData(prev => ({
      ...prev,
      testEnvironments: [...prev.testEnvironments, {
        category: '새 환경',
        details: '환경 상세 정보'
      }]
    }));
  };

  const handleDeleteTestEnvironment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      testEnvironments: prev.testEnvironments.filter((_, i) => i !== index)
    }));
  };

  const handleAddTestStrategy = () => {
    setFormData(prev => ({
      ...prev,
      testStrategies: [...prev.testStrategies, {
        name: '새 전략',
        description: '전략 설명'
      }]
    }));
  };

  const handleDeleteTestStrategy = (index: number) => {
    setFormData(prev => ({
      ...prev,
      testStrategies: prev.testStrategies.filter((_, i) => i !== index)
    }));
  };

  return (
    <TestPlanContainer>
      <TestPlanHeader>
        <TestPlanTitle>테스트 계획: 프로젝트 피닉스</TestPlanTitle>
        <div style={{ display: 'flex', gap: '8px' }}>
          {!isEditMode ? (
            <PreviewButton onClick={handleEdit}>
              <span>수정</span>
            </PreviewButton>
          ) : (
            <>
              <PreviewButton onClick={handleCancel} style={{ background: '#6c757d' }}>
                <span>취소</span>
              </PreviewButton>
              <PreviewButton onClick={handleSave} style={{ background: '#28a745' }}>
                <span>저장</span>
              </PreviewButton>
            </>
          )}
        </div>
      </TestPlanHeader>

      <form onSubmit={handleSubmit}>
        {/* 1. 프로젝트 개요 / 범위 */}
        <SectionHeader>프로젝트 개요 / 범위</SectionHeader>
        <SectionContent>
          <HeroSection>
            <HeroContent>
              <HeroText>
                {isEditMode ? (
                  <ModernTextarea
                    value={formData.projectOverview}
                    onChange={(e) => handleInputChange('projectOverview', e.target.value)}
                    style={{ width: '100%', minHeight: '80px' }}
                  />
                ) : (
                  formData.projectOverview
                )}
              </HeroText>
            </HeroContent>
          </HeroSection>
        </SectionContent>

                  {/* 2. 일정 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <SectionHeader>일정</SectionHeader>
            {isEditMode && (
              <button
                type="button"
                onClick={handleAddSchedule}
                style={{
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                + 일정 추가
              </button>
            )}
          </div>
          <SectionContent>
          <ModernTable>
            <Table>
              <thead>
                <tr>
                  <th>단계</th>
                  <th>시작일</th>
                  <th>종료일</th>
                  <th>작업</th>
                  <th>테스트 방법</th>
                  {isEditMode && <th>작업</th>}
                </tr>
              </thead>
              <tbody>
                {formData.schedule.map((item, index) => (
                  <tr key={index}>
                    <td>
                      {isEditMode ? (
                        <input
                          type="text"
                          value={item.phase}
                          onChange={(e) => {
                            const newSchedule = [...formData.schedule];
                            newSchedule[index].phase = e.target.value;
                            setFormData(prev => ({ ...prev, schedule: newSchedule }));
                          }}
                          style={{ width: '100%', padding: '4px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                      ) : (
                        item.phase
                      )}
                    </td>
                    <td>
                      {isEditMode ? (
                        <input
                          type="date"
                          value={item.startDate}
                          onChange={(e) => {
                            const newSchedule = [...formData.schedule];
                            newSchedule[index].startDate = e.target.value;
                            setFormData(prev => ({ ...prev, schedule: newSchedule }));
                          }}
                          style={{ width: '100%', padding: '4px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                      ) : (
                        item.startDate
                      )}
                    </td>
                    <td>
                      {isEditMode ? (
                        <input
                          type="date"
                          value={item.endDate}
                          onChange={(e) => {
                            const newSchedule = [...formData.schedule];
                            newSchedule[index].endDate = e.target.value;
                            setFormData(prev => ({ ...prev, schedule: newSchedule }));
                          }}
                          style={{ width: '100%', padding: '4px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                      ) : (
                        item.endDate
                      )}
                    </td>
                    <td>
                      {isEditMode ? (
                        <textarea
                          value={item.tasks}
                          onChange={(e) => {
                            const newSchedule = [...formData.schedule];
                            newSchedule[index].tasks = e.target.value;
                            setFormData(prev => ({ ...prev, schedule: newSchedule }));
                          }}
                          style={{ width: '100%', padding: '4px', border: '1px solid #ddd', borderRadius: '4px', minHeight: '60px' }}
                        />
                      ) : (
                        item.tasks
                      )}
                    </td>
                    <td>
                      {isEditMode ? (
                        <input
                          type="text"
                          value={item.method}
                          onChange={(e) => {
                            const newSchedule = [...formData.schedule];
                            newSchedule[index].method = e.target.value;
                            setFormData(prev => ({ ...prev, schedule: newSchedule }));
                          }}
                          style={{ width: '100%', padding: '4px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                      ) : (
                        item.method
                      )}
                    </td>
                    {isEditMode && (
                      <td>
                        <button
                          type="button"
                          onClick={() => handleDeleteSchedule(index)}
                          style={{
                            background: '#dc3545',
                            color: 'white',
                            border: 'none',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          삭제
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          </ModernTable>
        </SectionContent>

        {/* 3. 담당자 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <SectionHeader>담당자</SectionHeader>
          {isEditMode && (
            <button
              type="button"
              onClick={handleAddResponsibleParty}
              style={{
                background: '#007bff',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              + 담당자 추가
            </button>
          )}
        </div>
        <GridSection>
          {formData.responsibleParties.map((item, index) => (
            <GridRow key={index}>
              <GridLabel>
                {isEditMode ? (
                  <input
                    type="text"
                    value={item.role}
                    onChange={(e) => {
                      const newParties = [...formData.responsibleParties];
                      newParties[index].role = e.target.value;
                      setFormData(prev => ({ ...prev, responsibleParties: newParties }));
                    }}
                    style={{ width: '100%', padding: '4px', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                ) : (
                  item.role
                )}
              </GridLabel>
              <GridValue>
                {isEditMode ? (
                  <input
                    type="text"
                    value={item.person}
                    onChange={(e) => {
                      const newParties = [...formData.responsibleParties];
                      newParties[index].person = e.target.value;
                      setFormData(prev => ({ ...prev, responsibleParties: newParties }));
                    }}
                    style={{ width: '100%', padding: '4px', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                ) : (
                  item.person
                )}
              </GridValue>
              {isEditMode && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => handleDeleteResponsibleParty(index)}
                    style={{
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    삭제
                  </button>
                </div>
              )}
            </GridRow>
          ))}
        </GridSection>

        {/* 4. 테스트 정보 */}
        <SectionHeader>테스트 정보</SectionHeader>
        <SectionContent>
          <HeroSection style={{
            backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 100%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuA5Y3uUczYCqEoAUzVDlh3r5EbOMywsT8PxgUGIIQLG_5XP7Pw99Xvrvat-lXrDvvuRbcb2UdxYyyT4_oKPL69E5_2ooBjhPsS9Exgv15LBiBG5I84hMbfIYpK76wZkROVS2sl_RBYL39fKQTHylQWfRUCb_7p_bqqK1MNlaWImboJhuRCNsRwFDnqq4serZPcJBzryJDTqMs8Bkhq9BVkuH4B52al6ExIsB8jY6o4JRxEnFF2PnbuCppqnRbaltV9eB-Hc-3A29v8')`
          }}>
            <HeroContent>
              <HeroText>
                {isEditMode ? (
                  <ModernTextarea
                    value={formData.testObjective}
                    onChange={(e) => handleInputChange('testObjective', e.target.value)}
                    style={{ width: '100%', minHeight: '80px' }}
                  />
                ) : (
                  formData.testObjective
                )}
              </HeroText>
            </HeroContent>
          </HeroSection>
        </SectionContent>

        {/* 5. 참고 문서 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <SectionHeader>참고 문서</SectionHeader>
          {isEditMode && (
            <button
              type="button"
              onClick={handleAddReferenceDocument}
              style={{
                background: '#007bff',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              + 참고 문서 추가
            </button>
          )}
        </div>
        <GridSection>
          {formData.referenceDocuments.map((item, index) => (
            <GridRow key={index}>
              <GridLabel>
                {isEditMode ? (
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => {
                      const newDocs = [...formData.referenceDocuments];
                      newDocs[index].name = e.target.value;
                      setFormData(prev => ({ ...prev, referenceDocuments: newDocs }));
                    }}
                    style={{ width: '100%', padding: '4px', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                ) : (
                  item.name
                )}
              </GridLabel>
              <GridValue>
                {isEditMode ? (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="text"
                      value={item.url}
                      onChange={(e) => {
                        const newDocs = [...formData.referenceDocuments];
                        newDocs[index].url = e.target.value;
                        setFormData(prev => ({ ...prev, referenceDocuments: newDocs }));
                      }}
                      style={{ flex: 1, padding: '4px', border: '1px solid #ddd', borderRadius: '4px' }}
                      placeholder="URL"
                    />
                    <input
                      type="text"
                      value={item.filename}
                      onChange={(e) => {
                        const newDocs = [...formData.referenceDocuments];
                        newDocs[index].filename = e.target.value;
                        setFormData(prev => ({ ...prev, referenceDocuments: newDocs }));
                      }}
                      style={{ width: '120px', padding: '4px', border: '1px solid #ddd', borderRadius: '4px' }}
                      placeholder="파일명"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteReferenceDocument(index)}
                      style={{
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      삭제
                    </button>
                  </div>
                ) : (
                  `${item.url} (${item.filename})`
                )}
              </GridValue>
            </GridRow>
          ))}
        </GridSection>

        {/* 6. 이슈 리포트 경로 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <SectionHeader>이슈 리포트 경로</SectionHeader>
          {isEditMode && (
            <button
              type="button"
              onClick={handleAddIssueReport}
              style={{
                background: '#007bff',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              + 이슈 리포트 추가
            </button>
          )}
        </div>
        <GridSection>
          {formData.issueReports.map((item, index) => (
            <GridRow key={index}>
              <GridLabel>
                {isEditMode ? (
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => {
                      const newReports = [...formData.issueReports];
                      newReports[index].name = e.target.value;
                      setFormData(prev => ({ ...prev, issueReports: newReports }));
                    }}
                    style={{ width: '100%', padding: '4px', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                ) : (
                  item.name
                )}
              </GridLabel>
              <GridValue>
                {isEditMode ? (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="text"
                      value={item.path}
                      onChange={(e) => {
                        const newReports = [...formData.issueReports];
                        newReports[index].path = e.target.value;
                        setFormData(prev => ({ ...prev, issueReports: newReports }));
                      }}
                      style={{ flex: 1, padding: '4px', border: '1px solid #ddd', borderRadius: '4px' }}
                      placeholder="경로"
                    />
                    <input
                      type="text"
                      value={item.filename}
                      onChange={(e) => {
                        const newReports = [...formData.issueReports];
                        newReports[index].filename = e.target.value;
                        setFormData(prev => ({ ...prev, issueReports: newReports }));
                      }}
                      style={{ width: '120px', padding: '4px', border: '1px solid #ddd', borderRadius: '4px' }}
                      placeholder="파일명"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteIssueReport(index)}
                      style={{
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      삭제
                    </button>
                  </div>
                ) : (
                  `${item.path} (${item.filename})`
                )}
              </GridValue>
            </GridRow>
          ))}
        </GridSection>

        {/* 7. 테스트 환경/디바이스 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <SectionHeader>테스트 환경/디바이스</SectionHeader>
          {isEditMode && (
            <button
              type="button"
              onClick={handleAddTestEnvironment}
              style={{
                background: '#007bff',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              + 테스트 환경 추가
            </button>
          )}
        </div>
        <GridSection>
          {formData.testEnvironments.map((item, index) => (
            <GridRow key={index}>
              <GridLabel>
                {isEditMode ? (
                  <input
                    type="text"
                    value={item.category}
                    onChange={(e) => {
                      const newEnvs = [...formData.testEnvironments];
                      newEnvs[index].category = e.target.value;
                      setFormData(prev => ({ ...prev, testEnvironments: newEnvs }));
                    }}
                    style={{ width: '100%', padding: '4px', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                ) : (
                  item.category
                )}
              </GridLabel>
              <GridValue>
                {isEditMode ? (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="text"
                      value={item.details}
                      onChange={(e) => {
                        const newEnvs = [...formData.testEnvironments];
                        newEnvs[index].details = e.target.value;
                        setFormData(prev => ({ ...prev, testEnvironments: newEnvs }));
                      }}
                      style={{ flex: 1, padding: '4px', border: '1px solid #ddd', borderRadius: '4px' }}
                      placeholder="상세 정보"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteTestEnvironment(index)}
                      style={{
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      삭제
                    </button>
                  </div>
                ) : (
                  item.details
                )}
              </GridValue>
            </GridRow>
          ))}
        </GridSection>

                  {/* 8. 위험 요소 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <SectionHeader>위험 요소</SectionHeader>
            {isEditMode && (
              <button
                type="button"
                onClick={handleAddRiskFactor}
                style={{
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                + 위험 요소 추가
              </button>
            )}
          </div>
          <SectionContent>
          <ModernTable>
            <Table>
              <thead>
                <tr>
                  <th>위험명</th>
                  <th>영향도</th>
                  <th>발생 확률</th>
                  <th>대응 방안</th>
                  {isEditMode && <th>작업</th>}
                </tr>
              </thead>
              <tbody>
                {formData.riskFactors.map((item, index) => (
                  <tr key={index}>
                    <td>
                      {isEditMode ? (
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => {
                            const newRisks = [...formData.riskFactors];
                            newRisks[index].name = e.target.value;
                            setFormData(prev => ({ ...prev, riskFactors: newRisks }));
                          }}
                          style={{ width: '100%', padding: '4px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                      ) : (
                        item.name
                      )}
                    </td>
                    <td>
                      {isEditMode ? (
                        <select
                          value={item.impact}
                          onChange={(e) => {
                            const newRisks = [...formData.riskFactors];
                            newRisks[index].impact = e.target.value;
                            setFormData(prev => ({ ...prev, riskFactors: newRisks }));
                          }}
                          style={{ width: '100%', padding: '4px', border: '1px solid #ddd', borderRadius: '4px' }}
                        >
                          <option value="높음">높음</option>
                          <option value="보통">보통</option>
                          <option value="낮음">낮음</option>
                        </select>
                      ) : (
                        item.impact
                      )}
                    </td>
                    <td>
                      {isEditMode ? (
                        <select
                          value={item.probability}
                          onChange={(e) => {
                            const newRisks = [...formData.riskFactors];
                            newRisks[index].probability = e.target.value;
                            setFormData(prev => ({ ...prev, riskFactors: newRisks }));
                          }}
                          style={{ width: '100%', padding: '4px', border: '1px solid #ddd', borderRadius: '4px' }}
                        >
                          <option value="높음">높음</option>
                          <option value="보통">보통</option>
                          <option value="낮음">낮음</option>
                        </select>
                      ) : (
                        item.probability
                      )}
                    </td>
                    <td>
                      {isEditMode ? (
                        <textarea
                          value={item.mitigation}
                          onChange={(e) => {
                            const newRisks = [...formData.riskFactors];
                            newRisks[index].mitigation = e.target.value;
                            setFormData(prev => ({ ...prev, riskFactors: newRisks }));
                          }}
                          style={{ width: '100%', padding: '4px', border: '1px solid #ddd', borderRadius: '4px', minHeight: '60px' }}
                        />
                      ) : (
                        item.mitigation
                      )}
                    </td>
                    {isEditMode && (
                      <td>
                        <button
                          type="button"
                          onClick={() => handleDeleteRiskFactor(index)}
                          style={{
                            background: '#dc3545',
                            color: 'white',
                            border: 'none',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          삭제
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          </ModernTable>
        </SectionContent>

        {/* 9. 테스트 접근법 */}
        <SectionHeader>테스트 접근법</SectionHeader>
        <TextAreaContainer>
          <ModernTextarea
            value={formData.testingApproach}
            onChange={(e) => handleInputChange('testingApproach', e.target.value)}
            placeholder="전체적인 테스트 접근법과 방법론을 설명하세요..."
            disabled={!isEditMode}
          />
        </TextAreaContainer>

                  {/* 10. 테스트 전략 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <SectionHeader>테스트 전략</SectionHeader>
            {isEditMode && (
              <button
                type="button"
                onClick={handleAddTestStrategy}
                style={{
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                + 테스트 전략 추가
              </button>
            )}
          </div>
          <SectionContent>
          <ModernTable>
            <Table>
              <thead>
                <tr>
                  <th>전략명</th>
                  <th>설명</th>
                  {isEditMode && <th>작업</th>}
                </tr>
              </thead>
              <tbody>
                {formData.testStrategies.map((item, index) => (
                  <tr key={index}>
                    <td>
                      {isEditMode ? (
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => {
                            const newStrategies = [...formData.testStrategies];
                            newStrategies[index].name = e.target.value;
                            setFormData(prev => ({ ...prev, testStrategies: newStrategies }));
                          }}
                          style={{ width: '100%', padding: '4px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                      ) : (
                        item.name
                      )}
                    </td>
                    <td>
                      {isEditMode ? (
                        <textarea
                          value={item.description}
                          onChange={(e) => {
                            const newStrategies = [...formData.testStrategies];
                            newStrategies[index].description = e.target.value;
                            setFormData(prev => ({ ...prev, testStrategies: newStrategies }));
                          }}
                          style={{ width: '100%', padding: '4px', border: '1px solid #ddd', borderRadius: '4px', minHeight: '60px' }}
                        />
                      ) : (
                        item.description
                      )}
                    </td>
                    {isEditMode && (
                      <td>
                        <button
                          type="button"
                          onClick={() => handleDeleteTestStrategy(index)}
                          style={{
                            background: '#dc3545',
                            color: 'white',
                            border: 'none',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          삭제
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          </ModernTable>
        </SectionContent>

        {/* 11. 예외 처리 */}
        <SectionHeader>예외 처리</SectionHeader>
        <TextAreaContainer>
          <ModernTextarea
            value={formData.exceptionHandling}
            onChange={(e) => handleInputChange('exceptionHandling', e.target.value)}
            placeholder="예외 처리 절차를 설명하세요..."
            disabled={!isEditMode}
          />
        </TextAreaContainer>

        {/* 12. 참고 사항 */}
        <SectionHeader>참고 사항</SectionHeader>
        <SubSectionHeader>테스트 범위 제한사항</SubSectionHeader>
        <TextAreaContainer>
          <ModernTextarea
            value={formData.testScopeLimitations}
            onChange={(e) => handleInputChange('testScopeLimitations', e.target.value)}
            placeholder="이 테스트 단계에 포함되지 않는 특정 모듈이나 기능과 같은 테스트 범위의 제한사항을 지정하세요."
            disabled={!isEditMode}
          />
        </TextAreaContainer>
        <SubSectionHeader>제외 영역</SubSectionHeader>
        <TextAreaContainer>
          <ModernTextarea
            value={formData.excludedAreas}
            onChange={(e) => handleInputChange('excludedAreas', e.target.value)}
            placeholder="테스트에서 명시적으로 제외되는 영역이나 기능을 나열하세요."
            disabled={!isEditMode}
          />
        </TextAreaContainer>
        <SubSectionHeader>가정사항</SubSectionHeader>
        <TextAreaContainer>
          <ModernTextarea
            value={formData.assumptions}
            onChange={(e) => handleInputChange('assumptions', e.target.value)}
            placeholder="테스트 환경이나 데이터의 가용성과 같은 이 테스트 계획 작성 중에 이루어진 가정사항을 문서화하세요."
            disabled={!isEditMode}
          />
        </TextAreaContainer>
      </form>
    </TestPlanContainer>
  );
};

export default TestPlanForm;
