import React, { useState } from 'react';
import styled from 'styled-components';

interface TestPlanFormProps {
  onSave?: (data: any) => void;
  onPreview?: () => void;
  onExport?: () => void;
}

const TestPlanForm: React.FC<TestPlanFormProps> = ({ onSave, onPreview, onExport }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    projectName: 'Quest - 지능형 테스트 관리 시스템',
    scope: '',
    schedule: {
      startDate: '2024-08-01',
      endDate: '2024-08-31',
      phases: [
        { name: 'QA Setup', startDate: '2024-08-01', endDate: '2024-08-03', description: '테스트 환경 구성, 계획 수립', method: '환경 검증, 계획 리뷰' },
        { name: '1차 QA', startDate: '2024-08-05', endDate: '2024-08-12', description: '기능 테스트, 결함 발견', method: '기능별 테스트, 시나리오 테스트' },
        { name: '2차 QA', startDate: '2024-08-15', endDate: '2024-08-22', description: '결함 수정 검증, 회귀 테스트', method: '결함 재테스트, 전체 회귀' },
        { name: '오픈 모니터링', startDate: '2024-08-25', endDate: '2024-08-31', description: '실제 환경 모니터링', method: '성능 모니터링, 사용자 피드백' }
      ]
    },
    responsibilities: {
      planning: [{ name: '김기획', email: 'planning@quest.com' }],
      development: [
        { name: '박개발', email: 'dev@quest.com' },
        { name: '이개발', email: 'dev2@quest.com' }
      ],
      design: [{ name: '최디자인', email: 'design@quest.com' }],
      publishing: [{ name: '정퍼블', email: 'publish@quest.com' }],
      qa: [
        { name: '한테스터', email: 'qa@quest.com' },
        { name: '윤테스터', email: 'qa2@quest.com' }
      ]
    },
    references: {
      documents: [
        { url: 'https://docs.quest.com/requirements', label: '요구사항 문서' },
        { url: 'https://design.quest.com/wireframes', label: '와이어프레임' },
        { url: 'https://api.quest.com/docs', label: 'API 문서' }
      ],
      issueTracker: 'https://jira.quest.com/projects/QUEST/issues'
    },
    environments: {
      browsers: ['Chrome 120+', 'Firefox 115+', 'Safari 16+', 'Edge 120+'],
      ios: ['iPhone 15 Pro (iOS 17)', 'iPhone 14 (iOS 16)', 'iPad Pro (iPadOS 17)'],
      android: ['Samsung Galaxy S24 (Android 14)', 'Google Pixel 8 (Android 14)', 'OnePlus 11 (Android 13)']
    },
    risks: [
      { name: '성능 이슈', impact: 'high', probability: 'medium', mitigation: '성능 테스트 강화, 최적화 작업' },
      { name: '데이터 동기화 문제', impact: 'high', probability: 'low', mitigation: '동기화 테스트 케이스 추가' },
      { name: '브라우저 호환성', impact: 'medium', probability: 'medium', mitigation: '크로스 브라우저 테스트 확대' }
    ],
    approach: {
      strategies: [
        { name: '기능 기반 테스트', description: '각 기능별로 요구사항을 검증하는 테스트 방식' },
        { name: '시나리오 기반 테스트', description: '실제 사용자 시나리오를 기반으로 한 테스트' },
        { name: '상태 기반 테스트', description: '시스템 상태 변화에 따른 테스트' }
      ],
      exceptions: ''
    },
    notes: {
      limitations: '• 보안 테스트는 별도 전문팀에서 진행\n• 성능 테스트는 스테이징 환경에서만 진행\n• 접근성 테스트는 WCAG 2.1 AA 기준 적용',
      exclusions: '• 백엔드 API 단위 테스트\n• 데이터베이스 마이그레이션\n• 외부 시스템 연동 (별도 계획)',
      assumptions: '• 개발팀이 테스트 환경을 사전에 구성\n• 테스트 데이터는 별도로 제공\n• 결함 수정은 2일 이내 완료'
    }
  });

  const handleSave = () => {
    onSave?.(formData);
    setIsEditMode(false); // 저장 후 수정 모드 종료
  };

  return (
    <TestPlanContainer>
      <TestPlanHeader>
        <TestPlanTitle>테스트 계획</TestPlanTitle>
        <TestPlanActions>
          {!isEditMode ? (
            <ActionButton onClick={() => setIsEditMode(true)}>수정</ActionButton>
          ) : (
            <>
              <ActionButton onClick={() => setIsEditMode(false)}>취소</ActionButton>
              <ActionButton onClick={handleSave}>저장</ActionButton>
            </>
          )}
          <ActionButton onClick={onPreview}>미리보기</ActionButton>
          <ActionButton onClick={onExport}>내보내기</ActionButton>
        </TestPlanActions>
      </TestPlanHeader>

      <TestPlanFormContainer>
        {/* 1. 프로젝트 개요 / 범위 */}
        <TestPlanSection>
          <SectionHeader>
            <SectionNumber>1</SectionNumber>
            <SectionTitle>프로젝트 개요 / 범위 (Scope)</SectionTitle>
          </SectionHeader>
          <SectionContent>
            <FormGroup>
              <FormLabel>제품/서비스명</FormLabel>
              <FormInput 
                value={formData.projectName}
                onChange={(e) => setFormData({...formData, projectName: e.target.value})}
                placeholder="테스트 대상 제품 또는 서비스명을 입력하세요"
                disabled={!isEditMode}
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>검수 항목 (기능 목록)</FormLabel>
              <FormTextarea 
                value={formData.scope}
                onChange={(e) => setFormData({...formData, scope: e.target.value})}
                placeholder="• 사용자 인증 및 권한 관리&#10;• 테스트 케이스 관리&#10;• 테스트 실행 및 결과 기록&#10;• 결함 관리 및 추적&#10;• 대시보드 및 보고서&#10;• 외부 시스템 연동"
                rows={6}
                disabled={!isEditMode}
              />
            </FormGroup>
          </SectionContent>
        </TestPlanSection>

        {/* 2. 일정 */}
        <TestPlanSection>
          <SectionHeader>
            <SectionNumber>2</SectionNumber>
            <SectionTitle>일정 (Schedule)</SectionTitle>
          </SectionHeader>
          <SectionContent>
            <FormRow>
              <FormGroup>
                <FormLabel>전체 QA 기간</FormLabel>
                <DateRangeContainer>
                  <DateInput 
                    type="date" 
                    value={formData.schedule.startDate}
                    onChange={(e) => setFormData({
                      ...formData, 
                      schedule: {...formData.schedule, startDate: e.target.value}
                    })}
                    disabled={!isEditMode}
                  />
                  <DateSeparator>~</DateSeparator>
                  <DateInput 
                    type="date" 
                    value={formData.schedule.endDate}
                    onChange={(e) => setFormData({
                      ...formData, 
                      schedule: {...formData.schedule, endDate: e.target.value}
                    })}
                    disabled={!isEditMode}
                  />
                </DateRangeContainer>
              </FormGroup>
            </FormRow>
            <FormGroup>
              <FormLabel>단계별 작업 일정</FormLabel>
              <ScheduleTable>
                <thead>
                  <tr>
                    <th>단계</th>
                    <th style={{ width: '200px' }}>기간</th>
                    <th>작업 내용</th>
                    <th>테스트 방법</th>
                    <th style={{ width: '60px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {formData.schedule.phases.map((phase, index) => (
                    <tr key={index}>
                      <td>
                        <FormInput 
                          value={phase.name}
                          onChange={(e) => {
                            const newPhases = [...formData.schedule.phases];
                            newPhases[index] = { ...phase, name: e.target.value };
                            setFormData({
                              ...formData,
                              schedule: { ...formData.schedule, phases: newPhases }
                            });
                          }}
                          disabled={!isEditMode}
                        />
                      </td>
                      <td style={{ width: '200px' }}>
                        <DateRangeContainer>
                          <DateInput 
                            type="date" 
                            value={phase.startDate}
                            onChange={(e) => {
                              const newPhases = [...formData.schedule.phases];
                              newPhases[index] = { ...phase, startDate: e.target.value };
                              setFormData({
                                ...formData,
                                schedule: { ...formData.schedule, phases: newPhases }
                              });
                            }}
                            disabled={!isEditMode}
                          />
                          <DateSeparator>~</DateSeparator>
                          <DateInput 
                            type="date" 
                            value={phase.endDate}
                            onChange={(e) => {
                              const newPhases = [...formData.schedule.phases];
                              newPhases[index] = { ...phase, endDate: e.target.value };
                              setFormData({
                                ...formData,
                                schedule: { ...formData.schedule, phases: newPhases }
                              });
                            }}
                            disabled={!isEditMode}
                          />
                        </DateRangeContainer>
                      </td>
                      <td>
                        <FormTextarea 
                          value={phase.description}
                          onChange={(e) => {
                            const newPhases = [...formData.schedule.phases];
                            newPhases[index] = { ...phase, description: e.target.value };
                            setFormData({
                              ...formData,
                              schedule: { ...formData.schedule, phases: newPhases }
                            });
                          }}
                          rows={3}
                          disabled={!isEditMode}
                        />
                      </td>
                      <td>
                        <FormTextarea 
                          value={phase.method}
                          onChange={(e) => {
                            const newPhases = [...formData.schedule.phases];
                            newPhases[index] = { ...phase, method: e.target.value };
                            setFormData({
                              ...formData,
                              schedule: { ...formData.schedule, phases: newPhases }
                            });
                          }}
                          rows={3}
                          disabled={!isEditMode}
                        />
                      </td>
                      <td style={{ width: '60px', textAlign: 'center' }}>
                        {isEditMode && (
                          <DeleteButton 
                            onClick={() => {
                              const newPhases = formData.schedule.phases.filter((_, i) => i !== index);
                              setFormData({
                                ...formData,
                                schedule: { ...formData.schedule, phases: newPhases }
                              });
                            }}
                            title="삭제"
                          >
                            ×
                          </DeleteButton>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </ScheduleTable>
              {isEditMode && (
                <AddButton 
                  onClick={() => {
                    const newPhase = {
                      name: '새 단계',
                      startDate: '2024-08-01',
                      endDate: '2024-08-03',
                      description: '작업 내용을 입력하세요',
                      method: '테스트 방법을 입력하세요'
                    };
                    setFormData({
                      ...formData,
                      schedule: {
                        ...formData.schedule,
                        phases: [...formData.schedule.phases, newPhase]
                      }
                    });
                  }}
                >
                  + 단계 추가
                </AddButton>
              )}
            </FormGroup>
          </SectionContent>
        </TestPlanSection>

        {/* 3. 담당자 */}
        <TestPlanSection>
          <SectionHeader>
            <SectionNumber>3</SectionNumber>
            <SectionTitle>담당자 (Responsibility / Role Assignment)</SectionTitle>
          </SectionHeader>
          <SectionContent>
            <ResponsibilityGrid>
              <ResponsibilityCard>
                <RoleTitle>기획</RoleTitle>
                <RoleList>
                  {formData.responsibilities.planning.map((person, index) => (
                    <RoleItem key={index}>
                      <FormInput 
                        value={person.name}
                        onChange={(e) => {
                          const newPlanning = [...formData.responsibilities.planning];
                          newPlanning[index] = { ...person, name: e.target.value };
                          setFormData({
                            ...formData,
                            responsibilities: {
                              ...formData.responsibilities,
                              planning: newPlanning
                            }
                          });
                        }}
                        placeholder="이름"
                        disabled={!isEditMode}
                      />
                      <FormInput 
                        value={person.email}
                        onChange={(e) => {
                          const newPlanning = [...formData.responsibilities.planning];
                          newPlanning[index] = { ...person, email: e.target.value };
                          setFormData({
                            ...formData,
                            responsibilities: {
                              ...formData.responsibilities,
                              planning: newPlanning
                            }
                          });
                        }}
                        placeholder="이메일"
                        disabled={!isEditMode}
                      />
                      {isEditMode && (
                        <DeleteButton 
                          onClick={() => {
                            const newPlanning = formData.responsibilities.planning.filter((_, i) => i !== index);
                            setFormData({
                              ...formData,
                              responsibilities: {
                                ...formData.responsibilities,
                                planning: newPlanning
                              }
                            });
                          }}
                          title="삭제"
                        >
                          ×
                        </DeleteButton>
                      )}
                    </RoleItem>
                  ))}
                  {isEditMode && (
                    <AddButton 
                      onClick={() => {
                        const newPerson = { name: '', email: '' };
                        setFormData({
                          ...formData,
                          responsibilities: {
                            ...formData.responsibilities,
                            planning: [...formData.responsibilities.planning, newPerson]
                          }
                        });
                      }}
                    >
                      + 기획 담당자 추가
                    </AddButton>
                  )}
                </RoleList>
              </ResponsibilityCard>
              <ResponsibilityCard>
                <RoleTitle>개발</RoleTitle>
                <RoleList>
                  {formData.responsibilities.development.map((person, index) => (
                    <RoleItem key={index}>
                      <FormInput 
                        value={person.name}
                        onChange={(e) => {
                          const newDevelopment = [...formData.responsibilities.development];
                          newDevelopment[index] = { ...person, name: e.target.value };
                          setFormData({
                            ...formData,
                            responsibilities: {
                              ...formData.responsibilities,
                              development: newDevelopment
                            }
                          });
                        }}
                        placeholder="이름"
                        disabled={!isEditMode}
                      />
                      <FormInput 
                        value={person.email}
                        onChange={(e) => {
                          const newDevelopment = [...formData.responsibilities.development];
                          newDevelopment[index] = { ...person, email: e.target.value };
                          setFormData({
                            ...formData,
                            responsibilities: {
                              ...formData.responsibilities,
                              development: newDevelopment
                            }
                          });
                        }}
                        placeholder="이메일"
                        disabled={!isEditMode}
                      />
                      {isEditMode && (
                        <DeleteButton 
                          onClick={() => {
                            const newDevelopment = formData.responsibilities.development.filter((_, i) => i !== index);
                            setFormData({
                              ...formData,
                              responsibilities: {
                                ...formData.responsibilities,
                                development: newDevelopment
                              }
                            });
                          }}
                          title="삭제"
                        >
                          ×
                        </DeleteButton>
                      )}
                    </RoleItem>
                  ))}
                  {isEditMode && (
                    <AddButton 
                      onClick={() => {
                        const newPerson = { name: '', email: '' };
                        setFormData({
                          ...formData,
                          responsibilities: {
                            ...formData.responsibilities,
                            development: [...formData.responsibilities.development, newPerson]
                          }
                        });
                      }}
                    >
                      + 개발 담당자 추가
                    </AddButton>
                  )}
                </RoleList>
              </ResponsibilityCard>
              <ResponsibilityCard>
                <RoleTitle>디자인</RoleTitle>
                <RoleList>
                  {formData.responsibilities.design.map((person, index) => (
                    <RoleItem key={index}>
                      <FormInput 
                        value={person.name}
                        onChange={(e) => {
                          const newDesign = [...formData.responsibilities.design];
                          newDesign[index] = { ...person, name: e.target.value };
                          setFormData({
                            ...formData,
                            responsibilities: {
                              ...formData.responsibilities,
                              design: newDesign
                            }
                          });
                        }}
                        placeholder="이름"
                        disabled={!isEditMode}
                      />
                      <FormInput 
                        value={person.email}
                        onChange={(e) => {
                          const newDesign = [...formData.responsibilities.design];
                          newDesign[index] = { ...person, email: e.target.value };
                          setFormData({
                            ...formData,
                            responsibilities: {
                              ...formData.responsibilities,
                              design: newDesign
                            }
                          });
                        }}
                        placeholder="이메일"
                        disabled={!isEditMode}
                      />
                      {isEditMode && (
                        <DeleteButton 
                          onClick={() => {
                            const newDesign = formData.responsibilities.design.filter((_, i) => i !== index);
                            setFormData({
                              ...formData,
                              responsibilities: {
                                ...formData.responsibilities,
                                design: newDesign
                              }
                            });
                          }}
                          title="삭제"
                        >
                          ×
                        </DeleteButton>
                      )}
                    </RoleItem>
                  ))}
                  {isEditMode && (
                    <AddButton 
                      onClick={() => {
                        const newPerson = { name: '', email: '' };
                        setFormData({
                          ...formData,
                          responsibilities: {
                            ...formData.responsibilities,
                            design: [...formData.responsibilities.design, newPerson]
                          }
                        });
                      }}
                    >
                      + 디자인 담당자 추가
                    </AddButton>
                  )}
                </RoleList>
              </ResponsibilityCard>
              <ResponsibilityCard>
                <RoleTitle>퍼블리싱</RoleTitle>
                <RoleList>
                  {formData.responsibilities.publishing.map((person, index) => (
                    <RoleItem key={index}>
                      <FormInput 
                        value={person.name}
                        onChange={(e) => {
                          const newPublishing = [...formData.responsibilities.publishing];
                          newPublishing[index] = { ...person, name: e.target.value };
                          setFormData({
                            ...formData,
                            responsibilities: {
                              ...formData.responsibilities,
                              publishing: newPublishing
                            }
                          });
                        }}
                        placeholder="이름"
                        disabled={!isEditMode}
                      />
                      <FormInput 
                        value={person.email}
                        onChange={(e) => {
                          const newPublishing = [...formData.responsibilities.publishing];
                          newPublishing[index] = { ...person, email: e.target.value };
                          setFormData({
                            ...formData,
                            responsibilities: {
                              ...formData.responsibilities,
                              publishing: newPublishing
                            }
                          });
                        }}
                        placeholder="이메일"
                        disabled={!isEditMode}
                      />
                      {isEditMode && (
                        <DeleteButton 
                          onClick={() => {
                            const newPublishing = formData.responsibilities.publishing.filter((_, i) => i !== index);
                            setFormData({
                              ...formData,
                              responsibilities: {
                                ...formData.responsibilities,
                                publishing: newPublishing
                              }
                            });
                          }}
                          title="삭제"
                        >
                          ×
                        </DeleteButton>
                      )}
                    </RoleItem>
                  ))}
                  {isEditMode && (
                    <AddButton 
                      onClick={() => {
                        const newPerson = { name: '', email: '' };
                        setFormData({
                          ...formData,
                          responsibilities: {
                            ...formData.responsibilities,
                            publishing: [...formData.responsibilities.publishing, newPerson]
                          }
                        });
                      }}
                    >
                      + 퍼블리싱 담당자 추가
                    </AddButton>
                  )}
                </RoleList>
              </ResponsibilityCard>
              <ResponsibilityCard>
                <RoleTitle>QA</RoleTitle>
                <RoleList>
                  {formData.responsibilities.qa.map((person, index) => (
                    <RoleItem key={index}>
                      <FormInput 
                        value={person.name}
                        onChange={(e) => {
                          const newQA = [...formData.responsibilities.qa];
                          newQA[index] = { ...person, name: e.target.value };
                          setFormData({
                            ...formData,
                            responsibilities: {
                              ...formData.responsibilities,
                              qa: newQA
                            }
                          });
                        }}
                        placeholder="이름"
                        disabled={!isEditMode}
                      />
                      <FormInput 
                        value={person.email}
                        onChange={(e) => {
                          const newQA = [...formData.responsibilities.qa];
                          newQA[index] = { ...person, email: e.target.value };
                          setFormData({
                            ...formData,
                            responsibilities: {
                              ...formData.responsibilities,
                              qa: newQA
                            }
                          });
                        }}
                        placeholder="이메일"
                        disabled={!isEditMode}
                      />
                      {isEditMode && (
                        <DeleteButton 
                          onClick={() => {
                            const newQA = formData.responsibilities.qa.filter((_, i) => i !== index);
                            setFormData({
                              ...formData,
                              responsibilities: {
                                ...formData.responsibilities,
                                qa: newQA
                              }
                            });
                          }}
                          title="삭제"
                        >
                          ×
                        </DeleteButton>
                      )}
                    </RoleItem>
                  ))}
                  {isEditMode && (
                    <AddButton 
                      onClick={() => {
                        const newPerson = { name: '', email: '' };
                        setFormData({
                          ...formData,
                          responsibilities: {
                            ...formData.responsibilities,
                            qa: [...formData.responsibilities.qa, newPerson]
                          }
                        });
                      }}
                    >
                      + QA 담당자 추가
                    </AddButton>
                  )}
                </RoleList>
              </ResponsibilityCard>
            </ResponsibilityGrid>
          </SectionContent>
        </TestPlanSection>

        {/* 4. 테스트 정보 */}
        <TestPlanSection>
          <SectionHeader>
            <SectionNumber>4</SectionNumber>
            <SectionTitle>테스트 정보 (Test References)</SectionTitle>
          </SectionHeader>
          <SectionContent>
            <FormGroup>
              <FormLabel>참고 문서 링크</FormLabel>
              <LinkList>
                {formData.references.documents.map((doc, index) => (
                  <LinkItem key={index}>
                    <FormInput 
                      value={doc.url}
                      onChange={(e) => {
                        const newDocuments = [...formData.references.documents];
                        newDocuments[index] = { ...doc, url: e.target.value };
                        setFormData({
                          ...formData,
                          references: {
                            ...formData.references,
                            documents: newDocuments
                          }
                        });
                      }}
                      placeholder="https://docs.quest.com/requirements"
                      disabled={!isEditMode}
                    />
                    <FormInput 
                      value={doc.label}
                      onChange={(e) => {
                        const newDocuments = [...formData.references.documents];
                        newDocuments[index] = { ...doc, label: e.target.value };
                        setFormData({
                          ...formData,
                          references: {
                            ...formData.references,
                            documents: newDocuments
                          }
                        });
                      }}
                      placeholder="문서명"
                      disabled={!isEditMode}
                    />
                    {isEditMode && (
                      <DeleteButton 
                        onClick={() => {
                          const newDocuments = formData.references.documents.filter((_, i) => i !== index);
                          setFormData({
                            ...formData,
                            references: {
                              ...formData.references,
                              documents: newDocuments
                            }
                          });
                        }}
                        title="삭제"
                      >
                        ×
                      </DeleteButton>
                    )}
                  </LinkItem>
                ))}
              </LinkList>
              {isEditMode && (
                <AddButton 
                  onClick={() => {
                    const newDoc = { url: '', label: '' };
                  setFormData({
                    ...formData,
                    references: {
                      ...formData.references,
                      documents: [...formData.references.documents, newDoc]
                    }
                  });
                }}
              >
                + 문서 링크 추가
              </AddButton>
              )}
            </FormGroup>
            <FormGroup>
              <FormLabel>이슈 리포트 경로</FormLabel>
              <FormInput 
                value={formData.references.issueTracker}
                onChange={(e) => setFormData({
                  ...formData,
                  references: {...formData.references, issueTracker: e.target.value}
                })}
                placeholder="https://jira.quest.com/projects/QUEST/issues"
              />
            </FormGroup>
          </SectionContent>
        </TestPlanSection>

        {/* 5. 테스트 환경 / 디바이스 */}
        <TestPlanSection>
          <SectionHeader>
            <SectionNumber>5</SectionNumber>
            <SectionTitle>테스트 환경 / 디바이스 (Test Environment & Devices)</SectionTitle>
          </SectionHeader>
          <SectionContent>
            <EnvironmentGrid>
              <EnvironmentCard>
                <EnvironmentTitle>웹 브라우저</EnvironmentTitle>
                <DeviceList>
                  {formData.environments.browsers.map((browser, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <FormInput 
                        value={browser}
                        onChange={(e) => {
                          const newBrowsers = [...formData.environments.browsers];
                          newBrowsers[index] = e.target.value;
                          setFormData({
                            ...formData,
                            environments: {
                              ...formData.environments,
                              browsers: newBrowsers
                            }
                          });
                        }}
                        placeholder="Chrome 120+"
                        disabled={!isEditMode}
                      />
                      {isEditMode && (
                        <DeleteButton 
                          onClick={() => {
                            const newBrowsers = formData.environments.browsers.filter((_, i) => i !== index);
                            setFormData({
                              ...formData,
                              environments: {
                                ...formData.environments,
                                browsers: newBrowsers
                              }
                            });
                          }}
                          title="삭제"
                        >
                          ×
                        </DeleteButton>
                      )}
                    </div>
                  ))}
                </DeviceList>
                {isEditMode && (
                  <AddButton 
                    onClick={() => {
                      setFormData({
                        ...formData,
                        environments: {
                          ...formData.environments,
                          browsers: [...formData.environments.browsers, '']
                        }
                      });
                    }}
                  >
                    + 브라우저 추가
                  </AddButton>
                )}
              </EnvironmentCard>
              <EnvironmentCard>
                <EnvironmentTitle>모바일 (iOS)</EnvironmentTitle>
                <DeviceList>
                  {formData.environments.ios.map((device, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <FormInput 
                        value={device}
                        onChange={(e) => {
                          const newIOS = [...formData.environments.ios];
                          newIOS[index] = e.target.value;
                          setFormData({
                            ...formData,
                            environments: {
                              ...formData.environments,
                              ios: newIOS
                            }
                          });
                        }}
                        placeholder="iPhone 15 Pro (iOS 17)"
                        disabled={!isEditMode}
                      />
                      {isEditMode && (
                        <DeleteButton 
                          onClick={() => {
                            const newIOS = formData.environments.ios.filter((_, i) => i !== index);
                            setFormData({
                              ...formData,
                              environments: {
                                ...formData.environments,
                                ios: newIOS
                              }
                            });
                          }}
                          title="삭제"
                        >
                          ×
                        </DeleteButton>
                      )}
                    </div>
                  ))}
                </DeviceList>
                {isEditMode && (
                  <AddButton 
                    onClick={() => {
                      setFormData({
                        ...formData,
                        environments: {
                          ...formData.environments,
                          ios: [...formData.environments.ios, '']
                        }
                      });
                    }}
                  >
                    + iOS 디바이스 추가
                  </AddButton>
                )}
              </EnvironmentCard>
              <EnvironmentCard>
                <EnvironmentTitle>모바일 (Android)</EnvironmentTitle>
                <DeviceList>
                  {formData.environments.android.map((device, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <FormInput 
                        value={device}
                        onChange={(e) => {
                          const newAndroid = [...formData.environments.android];
                          newAndroid[index] = e.target.value;
                          setFormData({
                            ...formData,
                            environments: {
                              ...formData.environments,
                              android: newAndroid
                            }
                          });
                        }}
                        placeholder="Samsung Galaxy S24 (Android 14)"
                        disabled={!isEditMode}
                      />
                      {isEditMode && (
                        <DeleteButton 
                          onClick={() => {
                            const newAndroid = formData.environments.android.filter((_, i) => i !== index);
                            setFormData({
                              ...formData,
                              environments: {
                                ...formData.environments,
                                android: newAndroid
                              }
                            });
                          }}
                          title="삭제"
                        >
                          ×
                        </DeleteButton>
                      )}
                    </div>
                  ))}
                </DeviceList>
                {isEditMode && (
                  <AddButton 
                    onClick={() => {
                      setFormData({
                        ...formData,
                        environments: {
                          ...formData.environments,
                          android: [...formData.environments.android, '']
                        }
                      });
                    }}
                  >
                    + Android 디바이스 추가
                  </AddButton>
                )}
              </EnvironmentCard>
            </EnvironmentGrid>
          </SectionContent>
        </TestPlanSection>

        {/* 6. 리스크 요소 */}
        <TestPlanSection>
          <SectionHeader>
            <SectionNumber>6</SectionNumber>
            <SectionTitle>리스크 요소 (Risks)</SectionTitle>
          </SectionHeader>
          <SectionContent>
            <RiskTable>
              <thead>
                <tr>
                  <th>리스크</th>
                  <th>영향도</th>
                  <th>발생 확률</th>
                  <th>대응 방안</th>
                  {isEditMode && <th style={{ width: '60px' }}></th>}
                </tr>
              </thead>
              <tbody>
                {formData.risks.map((risk, index) => (
                  <tr key={index}>
                    <td>
                      <FormInput 
                        value={risk.name}
                        onChange={(e) => {
                          const newRisks = [...formData.risks];
                          newRisks[index] = { ...risk, name: e.target.value };
                          setFormData({
                            ...formData,
                            risks: newRisks
                          });
                        }}
                        placeholder="리스크명"
                        disabled={!isEditMode}
                      />
                    </td>
                    <td>
                      <select 
                        value={risk.impact}
                        onChange={(e) => {
                          const newRisks = [...formData.risks];
                          newRisks[index] = { ...risk, impact: e.target.value };
                          setFormData({
                            ...formData,
                            risks: newRisks
                          });
                        }}
                        style={{
                          padding: '8px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          width: '100%'
                        }}
                        disabled={!isEditMode}
                      >
                        <option value="high">높음</option>
                        <option value="medium">보통</option>
                        <option value="low">낮음</option>
                      </select>
                    </td>
                    <td>
                      <select 
                        value={risk.probability}
                        onChange={(e) => {
                          const newRisks = [...formData.risks];
                          newRisks[index] = { ...risk, probability: e.target.value };
                          setFormData({
                            ...formData,
                            risks: newRisks
                          });
                        }}
                        style={{
                          padding: '8px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          width: '100%'
                        }}
                        disabled={!isEditMode}
                      >
                        <option value="high">높음</option>
                        <option value="medium">보통</option>
                        <option value="low">낮음</option>
                      </select>
                    </td>
                    <td>
                      <FormTextarea 
                        value={risk.mitigation}
                        onChange={(e) => {
                          const newRisks = [...formData.risks];
                          newRisks[index] = { ...risk, mitigation: e.target.value };
                          setFormData({
                            ...formData,
                            risks: newRisks
                          });
                        }}
                        placeholder="대응 방안"
                        rows={2}
                        disabled={!isEditMode}
                      />
                    </td>
                    {isEditMode && (
                      <td style={{ textAlign: 'center' }}>
                        <DeleteButton 
                          onClick={() => {
                            const newRisks = formData.risks.filter((_, i) => i !== index);
                            setFormData({
                              ...formData,
                              risks: newRisks
                            });
                          }}
                          title="삭제"
                        >
                          ×
                        </DeleteButton>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </RiskTable>
            {isEditMode && (
              <AddButton 
                onClick={() => {
                  const newRisk = {
                    name: '',
                    impact: 'medium',
                    probability: 'medium',
                    mitigation: ''
                  };
                  setFormData({
                    ...formData,
                    risks: [...formData.risks, newRisk]
                  });
                }}
              >
                + 리스크 추가
              </AddButton>
            )}
          </SectionContent>
        </TestPlanSection>

        {/* 7. 테스트 접근법 */}
        <TestPlanSection>
          <SectionHeader>
            <SectionNumber>7</SectionNumber>
            <SectionTitle>테스트 접근법 (Test Approach)</SectionTitle>
          </SectionHeader>
          <SectionContent>
            <ApproachGrid>
              {formData.approach.strategies.map((strategy, index) => (
                <ApproachCard key={index}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <FormInput 
                      value={strategy.name}
                      onChange={(e) => {
                        const newStrategies = [...formData.approach.strategies];
                        newStrategies[index] = { ...strategy, name: e.target.value };
                        setFormData({
                          ...formData,
                          approach: {
                            ...formData.approach,
                            strategies: newStrategies
                          }
                        });
                      }}
                      placeholder="전략명"
                      disabled={!isEditMode}
                    />
                    {isEditMode && (
                      <DeleteButton 
                        onClick={() => {
                          const newStrategies = formData.approach.strategies.filter((_, i) => i !== index);
                          setFormData({
                            ...formData,
                            approach: {
                              ...formData.approach,
                              strategies: newStrategies
                            }
                          });
                        }}
                        title="삭제"
                      >
                        ×
                      </DeleteButton>
                    )}
                  </div>
                  <FormTextarea 
                    value={strategy.description}
                    onChange={(e) => {
                      const newStrategies = [...formData.approach.strategies];
                      newStrategies[index] = { ...strategy, description: e.target.value };
                      setFormData({
                        ...formData,
                        approach: {
                          ...formData.approach,
                          strategies: newStrategies
                        }
                      });
                    }}
                    placeholder="전략 설명"
                    rows={3}
                    disabled={!isEditMode}
                  />
                </ApproachCard>
              ))}
            </ApproachGrid>
            {isEditMode && (
              <AddButton 
                onClick={() => {
                  const newStrategy = {
                    name: '',
                    description: ''
                  };
                  setFormData({
                    ...formData,
                    approach: {
                      ...formData.approach,
                      strategies: [...formData.approach.strategies, newStrategy]
                    }
                  });
                }}
              >
                + 테스트 전략 추가
              </AddButton>
            )}
            <FormGroup>
              <FormLabel>예외 사항 처리 방식</FormLabel>
              <FormTextarea 
                value={formData.approach.exceptions}
                onChange={(e) => setFormData({
                  ...formData,
                  approach: {...formData.approach, exceptions: e.target.value}
                })}
                placeholder="• 네트워크 오류 시 자동 재시도&#10;• 데이터베이스 연결 실패 시 폴백 처리&#10;• 권한 없는 사용자 접근 시 차단&#10;• 잘못된 입력 데이터 검증"
                rows={4}
                disabled={!isEditMode}
              />
            </FormGroup>
          </SectionContent>
        </TestPlanSection>

        {/* 8. 참고 사항 */}
        <TestPlanSection>
          <SectionHeader>
            <SectionNumber>8</SectionNumber>
            <SectionTitle>참고 사항 (Notes)</SectionTitle>
          </SectionHeader>
          <SectionContent>
            <NotesGrid>
              <NotesCard>
                <NotesTitle>테스트 범위 제한</NotesTitle>
                <FormTextarea 
                  value={formData.notes.limitations}
                  onChange={(e) => setFormData({
                    ...formData,
                    notes: {...formData.notes, limitations: e.target.value}
                  })}
                  placeholder="• 보안 테스트는 별도 전문팀에서 진행&#10;• 성능 테스트는 스테이징 환경에서만 진행&#10;• 접근성 테스트는 WCAG 2.1 AA 기준 적용"
                  rows={4}
                />
              </NotesCard>
              <NotesCard>
                <NotesTitle>제외된 영역</NotesTitle>
                <FormTextarea 
                  value={formData.notes.exclusions}
                  onChange={(e) => setFormData({
                    ...formData,
                    notes: {...formData.notes, exclusions: e.target.value}
                  })}
                  placeholder="• 백엔드 API 단위 테스트&#10;• 데이터베이스 마이그레이션&#10;• 외부 시스템 연동 (별도 계획)"
                  rows={4}
                />
              </NotesCard>
              <NotesCard>
                <NotesTitle>가정 (Assumptions)</NotesTitle>
                <FormTextarea 
                  value={formData.notes.assumptions}
                  onChange={(e) => setFormData({
                    ...formData,
                    notes: {...formData.notes, assumptions: e.target.value}
                  })}
                  placeholder="• 개발팀이 테스트 환경을 사전에 구성&#10;• 테스트 데이터는 별도로 제공&#10;• 결함 수정은 2일 이내 완료"
                  rows={4}
                />
              </NotesCard>
            </NotesGrid>
          </SectionContent>
        </TestPlanSection>
      </TestPlanFormContainer>
    </TestPlanContainer>
  );
};

// Styled Components
const TestPlanContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const TestPlanHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding-bottom: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.color.border.primary};
`;

const TestPlanTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.h2.fontSize};
  font-weight: ${({ theme }) => theme.typography.h2.fontWeight};
  color: ${({ theme }) => theme.color.text.primary};
  margin: 0;
`;

const TestPlanActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ActionButton = styled.button`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.body.fontSize};
  background: ${({ theme }) => theme.color.primary[600]};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  cursor: pointer;
  
  &:hover {
    background: ${({ theme }) => theme.color.primary[700]};
  }
`;

const TestPlanFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const TestPlanSection = styled.div`
  background: ${({ theme }) => theme.color.surface.primary};
  border: 1px solid ${({ theme }) => theme.color.border.primary};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.color.surface.secondary};
  border-bottom: 1px solid ${({ theme }) => theme.color.border.primary};
`;

const SectionNumber = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: ${({ theme }) => theme.color.primary[600]};
  color: white;
  border-radius: 50%;
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
  font-size: ${({ theme }) => theme.typography.label.fontSize};
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.h3.fontSize};
  font-weight: ${({ theme }) => theme.typography.h3.fontWeight};
  color: ${({ theme }) => theme.color.text.primary};
  margin: 0;
`;

const SectionContent = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.md};
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const FormLabel = styled.label`
  display: block;
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
  color: ${({ theme }) => theme.color.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const FormInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.color.border.primary};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: ${({ theme }) => theme.typography.body.fontSize};
  background: ${({ theme }) => theme.color.surface.primary};
  color: ${({ theme }) => theme.color.text.primary};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.color.primary[600]};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.color.primary[100]};
  }
  
  &:disabled {
    background: ${({ theme }) => theme.color.surface.secondary};
    color: ${({ theme }) => theme.color.text.secondary};
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.color.border.primary};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: ${({ theme }) => theme.typography.body.fontSize};
  background: ${({ theme }) => theme.color.surface.primary};
  color: ${({ theme }) => theme.color.text.primary};
  resize: vertical;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.color.primary[600]};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.color.primary[100]};
  }
  
  &:disabled {
    background: ${({ theme }) => theme.color.surface.secondary};
    color: ${({ theme }) => theme.color.text.secondary};
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const DateRangeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const DateInput = styled(FormInput)`
  width: auto;
  min-width: 140px;
`;

const DateSeparator = styled.span`
  color: ${({ theme }) => theme.color.text.secondary};
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
`;

const ScheduleTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: ${({ theme }) => theme.spacing.md};
  
  th, td {
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    text-align: left;
    border-bottom: 1px solid ${({ theme }) => theme.color.border.primary};
  }
  
  th {
    background: ${({ theme }) => theme.color.surface.secondary};
    font-weight: ${({ theme }) => theme.typography.label.fontWeight};
    color: ${({ theme }) => theme.color.text.primary};
  }
  
  td {
    color: ${({ theme }) => theme.color.text.secondary};
  }
`;

const ResponsibilityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const ResponsibilityCard = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.color.border.primary};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.color.surface.secondary};
`;

const RoleTitle = styled.h4`
  font-size: ${({ theme }) => theme.typography.h3.fontSize};
  font-weight: ${({ theme }) => theme.typography.h3.fontWeight};
  color: ${({ theme }) => theme.color.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
`;

const RoleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const RoleItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const RoleName = styled.span`
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
  color: ${({ theme }) => theme.color.text.primary};
`;

const RoleEmail = styled.span`
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  color: ${({ theme }) => theme.color.text.secondary};
`;

const LinkList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const LinkItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const LinkInput = styled(FormInput)`
  margin-bottom: 0;
`;

const LinkLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  color: ${({ theme }) => theme.color.text.secondary};
`;

const EnvironmentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const EnvironmentCard = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.color.border.primary};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.color.surface.secondary};
`;

const EnvironmentTitle = styled.h4`
  font-size: ${({ theme }) => theme.typography.h3.fontSize};
  font-weight: ${({ theme }) => theme.typography.h3.fontWeight};
  color: ${({ theme }) => theme.color.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
`;

const DeviceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const DeviceItem = styled.span`
  color: ${({ theme }) => theme.color.text.secondary};
  font-size: ${({ theme }) => theme.typography.body.fontSize};
`;

const TesterDeviceTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: ${({ theme }) => theme.spacing.md};
  
  th, td {
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    text-align: left;
    border-bottom: 1px solid ${({ theme }) => theme.color.border.primary};
  }
  
  th {
    background: ${({ theme }) => theme.color.surface.secondary};
    font-weight: ${({ theme }) => theme.typography.label.fontWeight};
    color: ${({ theme }) => theme.color.text.primary};
  }
  
  td {
    color: ${({ theme }) => theme.color.text.secondary};
  }
`;

const RiskTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: ${({ theme }) => theme.spacing.md};
  
  th, td {
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    text-align: left;
    border-bottom: 1px solid ${({ theme }) => theme.color.border.primary};
  }
  
  th {
    background: ${({ theme }) => theme.color.surface.secondary};
    font-weight: ${({ theme }) => theme.typography.label.fontWeight};
    color: ${({ theme }) => theme.color.text.primary};
  }
  
  td {
    color: ${({ theme }) => theme.color.text.secondary};
  }
`;

const RiskLevel = styled.span<{ impact: string }>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
  background: ${({ theme, impact }) => 
    impact === 'high' ? theme.color.danger[100] :
    impact === 'medium' ? theme.color.warning[100] :
    theme.color.success[100]
  };
  color: ${({ theme, impact }) => 
    impact === 'high' ? theme.color.danger[600] :
    impact === 'medium' ? theme.color.warning[600] :
    theme.color.success[600]
  };
`;

const ApproachGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ApproachCard = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.color.border.primary};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.color.surface.secondary};
`;

const ApproachTitle = styled.h4`
  font-size: ${({ theme }) => theme.typography.h3.fontSize};
  font-weight: ${({ theme }) => theme.typography.h3.fontWeight};
  color: ${({ theme }) => theme.color.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
`;

const ApproachDescription = styled.p`
  color: ${({ theme }) => theme.color.text.secondary};
  font-size: ${({ theme }) => theme.typography.body.fontSize};
  margin: 0;
`;

const AddButton = styled.button`
  background: ${({ theme }) => theme.color.primary[600]};
  color: white;
  border: none;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.md};
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
  cursor: pointer;
  margin-top: ${({ theme }) => theme.spacing.md};
  
  &:hover {
    background: ${({ theme }) => theme.color.primary[700]};
  }
`;

const DeleteButton = styled.button`
  background: ${({ theme }) => theme.color.danger[600]};
  color: white;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: ${({ theme }) => theme.color.danger[700]};
  }
`;

const NotesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const NotesCard = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.color.border.primary};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.color.surface.secondary};
`;

const NotesTitle = styled.h4`
  font-size: ${({ theme }) => theme.typography.h3.fontSize};
  font-weight: ${({ theme }) => theme.typography.h3.fontWeight};
  color: ${({ theme }) => theme.color.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
`;

const NotesContent = styled.div`
  color: ${({ theme }) => theme.color.text.secondary};
  font-size: ${({ theme }) => theme.typography.body.fontSize};
  line-height: 1.6;
  white-space: pre-line;
`;

export default TestPlanForm;
