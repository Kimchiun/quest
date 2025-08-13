import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '@/shared/components/Button';

interface TestPlanFormProps {
  onSave?: (data: any) => void;
  onPreview?: () => void;
  onExport?: () => void;
}

const TestPlanForm: React.FC<TestPlanFormProps> = ({ onSave, onPreview, onExport }) => {
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
  };

  return (
    <TestPlanContainer>
      <TestPlanHeader>
        <TestPlanTitle>테스트 계획</TestPlanTitle>
        <TestPlanActions>
          <ActionButton variant="outline" onClick={onPreview}>미리보기</ActionButton>
          <ActionButton variant="outline" onClick={onExport}>내보내기</ActionButton>
          <ActionButton onClick={handleSave}>저장</ActionButton>
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
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>검수 항목 (기능 목록)</FormLabel>
              <FormTextarea 
                value={formData.scope}
                onChange={(e) => setFormData({...formData, scope: e.target.value})}
                placeholder="• 사용자 인증 및 권한 관리&#10;• 테스트 케이스 관리&#10;• 테스트 실행 및 결과 기록&#10;• 결함 관리 및 추적&#10;• 대시보드 및 보고서&#10;• 외부 시스템 연동"
                rows={6}
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
                  />
                  <DateSeparator>~</DateSeparator>
                  <DateInput 
                    type="date" 
                    value={formData.schedule.endDate}
                    onChange={(e) => setFormData({
                      ...formData, 
                      schedule: {...formData.schedule, endDate: e.target.value}
                    })}
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
                    <th>기간</th>
                    <th>작업 내용</th>
                    <th>테스트 방법</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.schedule.phases.map((phase, index) => (
                    <tr key={index}>
                      <td>{phase.name}</td>
                      <td>{phase.startDate} ~ {phase.endDate}</td>
                      <td>{phase.description}</td>
                      <td>{phase.method}</td>
                    </tr>
                  ))}
                </tbody>
              </ScheduleTable>
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
                      <RoleName>{person.name}</RoleName>
                      <RoleEmail>{person.email}</RoleEmail>
                    </RoleItem>
                  ))}
                </RoleList>
              </ResponsibilityCard>
              <ResponsibilityCard>
                <RoleTitle>개발</RoleTitle>
                <RoleList>
                  {formData.responsibilities.development.map((person, index) => (
                    <RoleItem key={index}>
                      <RoleName>{person.name}</RoleName>
                      <RoleEmail>{person.email}</RoleEmail>
                    </RoleItem>
                  ))}
                </RoleList>
              </ResponsibilityCard>
              <ResponsibilityCard>
                <RoleTitle>디자인</RoleTitle>
                <RoleList>
                  {formData.responsibilities.design.map((person, index) => (
                    <RoleItem key={index}>
                      <RoleName>{person.name}</RoleName>
                      <RoleEmail>{person.email}</RoleEmail>
                    </RoleItem>
                  ))}
                </RoleList>
              </ResponsibilityCard>
              <ResponsibilityCard>
                <RoleTitle>퍼블리싱</RoleTitle>
                <RoleList>
                  {formData.responsibilities.publishing.map((person, index) => (
                    <RoleItem key={index}>
                      <RoleName>{person.name}</RoleName>
                      <RoleEmail>{person.email}</RoleEmail>
                    </RoleItem>
                  ))}
                </RoleList>
              </ResponsibilityCard>
              <ResponsibilityCard>
                <RoleTitle>QA</RoleTitle>
                <RoleList>
                  {formData.responsibilities.qa.map((person, index) => (
                    <RoleItem key={index}>
                      <RoleName>{person.name}</RoleName>
                      <RoleEmail>{person.email}</RoleEmail>
                    </RoleItem>
                  ))}
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
                    <LinkInput 
                      value={doc.url}
                      placeholder="https://docs.quest.com/requirements"
                    />
                    <LinkLabel>{doc.label}</LinkLabel>
                  </LinkItem>
                ))}
              </LinkList>
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
                    <DeviceItem key={index}>{browser}</DeviceItem>
                  ))}
                </DeviceList>
              </EnvironmentCard>
              <EnvironmentCard>
                <EnvironmentTitle>모바일 (iOS)</EnvironmentTitle>
                <DeviceList>
                  {formData.environments.ios.map((device, index) => (
                    <DeviceItem key={index}>{device}</DeviceItem>
                  ))}
                </DeviceList>
              </EnvironmentCard>
              <EnvironmentCard>
                <EnvironmentTitle>모바일 (Android)</EnvironmentTitle>
                <DeviceList>
                  {formData.environments.android.map((device, index) => (
                    <DeviceItem key={index}>{device}</DeviceItem>
                  ))}
                </DeviceList>
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
                </tr>
              </thead>
              <tbody>
                {formData.risks.map((risk, index) => (
                  <tr key={index}>
                    <td>{risk.name}</td>
                    <td><RiskLevel impact={risk.impact}>{risk.impact === 'high' ? '높음' : risk.impact === 'medium' ? '보통' : '낮음'}</RiskLevel></td>
                    <td><RiskLevel impact={risk.probability}>{risk.probability === 'high' ? '높음' : risk.probability === 'medium' ? '보통' : '낮음'}</RiskLevel></td>
                    <td>{risk.mitigation}</td>
                  </tr>
                ))}
              </tbody>
            </RiskTable>
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
                  <ApproachTitle>{strategy.name}</ApproachTitle>
                  <ApproachDescription>{strategy.description}</ApproachDescription>
                </ApproachCard>
              ))}
            </ApproachGrid>
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
                <NotesContent>{formData.notes.limitations}</NotesContent>
              </NotesCard>
              <NotesCard>
                <NotesTitle>제외된 영역</NotesTitle>
                <NotesContent>{formData.notes.exclusions}</NotesContent>
              </NotesCard>
              <NotesCard>
                <NotesTitle>가정 (Assumptions)</NotesTitle>
                <NotesContent>{formData.notes.assumptions}</NotesContent>
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
  font-size: ${({ theme }) => theme.typography.heading.fontSize};
  font-weight: ${({ theme }) => theme.typography.heading.fontWeight};
  color: ${({ theme }) => theme.color.text.primary};
  margin: 0;
`;

const TestPlanActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ActionButton = styled(Button)`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.body.fontSize};
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
  background: ${({ theme }) => theme.color.primary.main};
  color: white;
  border-radius: 50%;
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
  font-size: ${({ theme }) => theme.typography.label.fontSize};
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.subheading.fontSize};
  font-weight: ${({ theme }) => theme.typography.subheading.fontWeight};
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
    border-color: ${({ theme }) => theme.color.primary.main};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.color.primary.light};
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
    border-color: ${({ theme }) => theme.color.primary.main};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.color.primary.light};
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
  font-size: ${({ theme }) => theme.typography.subheading.fontSize};
  font-weight: ${({ theme }) => theme.typography.subheading.fontWeight};
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
  font-size: ${({ theme }) => theme.typography.caption.fontSize};
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
  font-size: ${({ theme }) => theme.typography.caption.fontSize};
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
  font-size: ${({ theme }) => theme.typography.subheading.fontSize};
  font-weight: ${({ theme }) => theme.typography.subheading.fontWeight};
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
  font-size: ${({ theme }) => theme.typography.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
  background: ${({ theme, impact }) => 
    impact === 'high' ? theme.color.error.light :
    impact === 'medium' ? theme.color.warning.light :
    theme.color.success.light
  };
  color: ${({ theme, impact }) => 
    impact === 'high' ? theme.color.error.main :
    impact === 'medium' ? theme.color.warning.main :
    theme.color.success.main
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
  font-size: ${({ theme }) => theme.typography.subheading.fontSize};
  font-weight: ${({ theme }) => theme.typography.subheading.fontWeight};
  color: ${({ theme }) => theme.color.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
`;

const ApproachDescription = styled.p`
  color: ${({ theme }) => theme.color.text.secondary};
  font-size: ${({ theme }) => theme.typography.body.fontSize};
  margin: 0;
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
  font-size: ${({ theme }) => theme.typography.subheading.fontSize};
  font-weight: ${({ theme }) => theme.typography.subheading.fontWeight};
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
