import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ReleaseListView from './components/ReleaseListView';
import ReleaseCreateModal from './components/ReleaseCreateModal';
import ReleaseEditModal from './components/ReleaseEditModal';
import ReleaseDetailPage from './components/ReleaseDetailPage';


interface Release {
  id: string;
  name: string;
  version: string;
  status: 'draft' | 'in-progress' | 'testing' | 'ready' | 'released';
  startDate: string;
  endDate: string;
  progress: number;
  passRate: number;
  blockers: number;
  assignee: string;
  folder: string;
  updatedAt: string;
}

// 프론트엔드 상태를 백엔드 상태로 매핑하는 함수
const mapStatusToBackend = (frontendStatus: string): string => {
  const statusMap: { [key: string]: string } = {
    'draft': 'PLANNING',
    'in-progress': 'IN_PROGRESS',
    'testing': 'TESTING',
    'ready': 'READY',
    'released': 'DEPLOYED'
  };
  return statusMap[frontendStatus] || 'PLANNING';
};

// 백엔드 상태를 프론트엔드 상태로 매핑하는 함수
const mapBackendStatusToFrontend = (backendStatus: string): 'draft' | 'in-progress' | 'testing' | 'ready' | 'released' => {
  const statusMap: { [key: string]: 'draft' | 'in-progress' | 'testing' | 'ready' | 'released' } = {
    'PLANNING': 'draft',
    'IN_PROGRESS': 'in-progress',
    'TESTING': 'testing',
    'READY': 'ready',
    'DEPLOYED': 'released',
    'COMPLETED': 'released',
    'CANCELLED': 'draft'
  };
  return statusMap[backendStatus] || 'draft';
};



const PageWrapper = styled.div`
  width: 100%;
  height: 100vh;
  background: #f8fafc;
  position: relative;
`;

// 간단한 토스트 컴포넌트
const Toast = styled.div<{ show: boolean }>`
  position: fixed;
  top: 20px;
  right: 20px;
  background: #10b981;
  color: white;
  padding: 12px 20px;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  transform: translateX(${props => props.show ? '0' : '120%'});
  opacity: ${props => props.show ? '1' : '0'};
  transition: all 0.3s ease-in-out;
  font-size: 14px;
  font-weight: 500;
  pointer-events: ${props => props.show ? 'auto' : 'none'};
`;

const ReleaseManagementV2Page: React.FC = () => {
  const [releases, setReleases] = useState<Release[]>([]);
  
  // 각 릴리즈의 실행 통계를 가져오는 함수
  const fetchExecutionStats = async (releaseId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/releases/${releaseId}/execution-stats`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          const stats = data.data;
          return {
            progress: stats.planned > 0 ? Math.round((stats.executed / stats.planned) * 100) : 0,
            passRate: stats.executed > 0 ? Math.round((stats.passed / stats.executed) * 100) : 0,
            blockers: stats.blocked || 0
          };
        }
      }
    } catch (error) {
      console.error(`릴리즈 ${releaseId} 실행 통계 가져오기 실패:`, error);
    }
    return { progress: 0, passRate: 0, blockers: 0 };
  };

  // 실제 API에서 릴리즈 데이터 가져오기
  useEffect(() => {
    const fetchReleases = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/releases');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            // API 응답을 컴포넌트에서 사용하는 형식으로 변환
            const transformedReleases = await Promise.all(
              data.data.map(async (release: any) => {
                // 각 릴리즈의 실행 통계 가져오기
                const stats = await fetchExecutionStats(release.id);
                
                return {
                  id: release.id,
                  name: release.name,
                  version: release.version,
                  status: release.status.toLowerCase().replace('_', '-') as any,
                  startDate: release.startAt ? release.startAt.split('T')[0] : '',
                  endDate: release.endAt ? release.endAt.split('T')[0] : '',
                  progress: stats.progress, // 실시간 진행률
                  passRate: stats.passRate, // 실시간 통과율
                  blockers: stats.blockers, // 실시간 차단 수
                  assignee: release.assignee_name || release.owners?.[0] || 'admin',
                  folder: '/프로젝트/Quest',
                  updatedAt: release.updatedAt
                };
              })
            );
            setReleases(transformedReleases);
          }
        }
      } catch (error) {
        console.error('릴리즈 데이터 가져오기 실패:', error);
      }
    };
    
    fetchReleases();
    
    // 5초마다 진행률 업데이트
    const interval = setInterval(() => {
      fetchReleases();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  const [selectedReleases, setSelectedReleases] = useState<string[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'list' | 'detail'>('list');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRelease, setEditingRelease] = useState<Release | null>(null);  const [selectedRelease, setSelectedRelease] = useState<Release | null>(null);
  const [currentTab, setCurrentTab] = useState('overview');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // 릴리즈 선택 핸들러
  const handleReleaseSelect = (releaseId: string) => {
    setSelectedReleases(prev => 
      prev.includes(releaseId) 
        ? prev.filter(id => id !== releaseId)
        : [...prev, releaseId]
    );
  };

  // 전체 선택/해제 핸들러
  const handleSelectAll = () => {
    if (selectedReleases.length === releases.length) {
      setSelectedReleases([]);
    } else {
      setSelectedReleases(releases.map(r => r.id));
    }
  };

  // 릴리즈 보기 핸들러
  const handleViewRelease = (releaseId: string) => {
    const release = releases.find(r => r.id === releaseId);
    if (release) {
      setSelectedRelease(release);
      setCurrentView('detail');
    }
  };

  // 목록으로 돌아가기 핸들러
  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedRelease(null);
  };

  // 릴리즈 수정 핸들러
  const handleEditRelease = (releaseId: string) => {
    console.log('handleEditRelease 호출됨:', releaseId);
    const release = releases.find(r => r.id === releaseId);
    console.log('찾은 릴리즈:', release);
    if (release) {
      console.log('수정 모달 열기');
      setEditingRelease(release);
      setIsEditModalOpen(true);
    }
  };

  // 릴리즈 삭제 핸들러
  const handleDeleteRelease = async (releaseId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/releases/${releaseId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('릴리즈 삭제에 실패했습니다.');
      }

      // 로컬 상태에서도 제거
      setReleases(prev => prev.filter(r => r.id !== releaseId));
      setSelectedReleases(prev => prev.filter(id => id !== releaseId));
      
      // 토스트 알림 표시
      setToastMessage('릴리즈가 성공적으로 삭제되었습니다.');
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        setTimeout(() => setToastMessage(''), 300); // 애니메이션 완료 후 메시지 초기화
      }, 3000);
    } catch (error) {
      console.error('릴리즈 삭제 오류:', error);
      setToastMessage('릴리즈 삭제에 실패했습니다. 다시 시도해 주세요.');
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        setTimeout(() => setToastMessage(''), 300); // 애니메이션 완료 후 메시지 초기화
      }, 3000);
    }
  };

  // 릴리즈 생성 핸들러
  const handleCreateRelease = () => {
    setIsCreateModalOpen(true);
  };

  // 릴리즈 생성 제출 핸들러
  const handleCreateReleaseSubmit = async (releaseData: any) => {
    try {
      // API 호출하여 릴리즈 생성
      const response = await fetch('http://localhost:3001/api/releases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: releaseData.name,
          version: releaseData.version,
          description: releaseData.description,
          startAt: releaseData.startDate ? new Date(releaseData.startDate).toISOString() : null,
          endAt: releaseData.endDate ? new Date(releaseData.endDate).toISOString() : null,
          assignee: releaseData.assignee,
          status: mapStatusToBackend(releaseData.status)
        }),
      });

      if (!response.ok) {
        throw new Error('릴리즈 생성에 실패했습니다.');
      }

      const newRelease = await response.json();
      
      // 로컬 상태에 새 릴리즈 추가
      const createdRelease: Release = {
        id: newRelease.data.id,
        name: newRelease.data.name,
        version: newRelease.data.version,
        status: mapBackendStatusToFrontend(newRelease.data.status),
        startDate: newRelease.data.startAt ? newRelease.data.startAt.split('T')[0] : '',
        endDate: newRelease.data.endAt ? newRelease.data.endAt.split('T')[0] : '',
        progress: 0,
        passRate: 0,
        blockers: 0,
        assignee: newRelease.data.assignee_name || newRelease.data.owners?.[0] || 'admin',
        folder: '/프로젝트/Quest',
        updatedAt: new Date().toISOString()
      };
      
      setReleases(prev => [...prev, createdRelease]);
      
      // 모달 닫기
      setIsCreateModalOpen(false);
      
      // 성공 메시지
      setToastMessage('릴리즈가 성공적으로 생성되었습니다.');
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        setTimeout(() => setToastMessage(''), 300); // 애니메이션 완료 후 메시지 초기화
      }, 3000);
    } catch (error) {
      console.error('릴리즈 생성 오류:', error);
      setToastMessage('릴리즈 생성에 실패했습니다. 다시 시도해 주세요.');
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        setTimeout(() => setToastMessage(''), 300); // 애니메이션 완료 후 메시지 초기화
      }, 3000);
      throw error;
    }
  };


  // 릴리즈 수정 제출 핸들러
  const handleEditReleaseSubmit = async (releaseData: any) => {
    try {
      if (!editingRelease) return;

      console.log("수정 데이터 제출:", releaseData);

      // API 호출하여 릴리즈 수정
      const response = await fetch(`http://localhost:3001/api/releases/${editingRelease.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: releaseData.name,
          version: releaseData.version,
          description: releaseData.description,
          startAt: releaseData.startDate ? new Date(releaseData.startDate).toISOString() : null,
          endAt: releaseData.endDate ? new Date(releaseData.endDate).toISOString() : null,
          assignee: releaseData.assignee,
          status: mapStatusToBackend(releaseData.status)
        }),
      });

      if (!response.ok) {
        throw new Error("릴리즈 수정에 실패했습니다.");
      }

      const updatedRelease = await response.json();
      
      // 로컬 상태에 수정된 릴리즈 업데이트
      const modifiedRelease: Release = {
        ...editingRelease,
        name: updatedRelease.data.name,
        version: updatedRelease.data.version,
        status: mapBackendStatusToFrontend(updatedRelease.data.status),
        startDate: updatedRelease.data.startAt ? updatedRelease.data.startAt.split("T")[0] : "",
        endDate: updatedRelease.data.endAt ? updatedRelease.data.endAt.split("T")[0] : "",
        assignee: updatedRelease.data.assignee_name || updatedRelease.data.owners?.[0] || "admin",
        updatedAt: new Date().toISOString()
      };
      
      setReleases(prev => prev.map(r => r.id === editingRelease.id ? modifiedRelease : r));
      
      // 모달 닫기
      setIsEditModalOpen(false);
      setEditingRelease(null);
      
      // 성공 메시지
      setToastMessage("릴리즈가 성공적으로 수정되었습니다.");
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        setTimeout(() => setToastMessage(""), 300);
      }, 3000);
    } catch (error) {
      console.error("릴리즈 수정 실패:", error);
      setToastMessage("릴리즈 수정에 실패했습니다.");
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        setTimeout(() => setToastMessage(""), 300);
      }, 3000);
    }
  };  // 다중 삭제 핸들러
  const handleBulkDelete = async (releaseIds: string[]) => {
    try {
      // 각 릴리즈를 순차적으로 삭제
      for (const releaseId of releaseIds) {
        const response = await fetch(`http://localhost:3001/api/releases/${releaseId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error(`릴리즈 ID ${releaseId} 삭제에 실패했습니다.`);
        }
      }

      // 로컬 상태에서도 제거
      setReleases(prev => prev.filter(r => !releaseIds.includes(r.id)));
      setSelectedReleases([]);
      
      // 성공 메시지
      setToastMessage(`${releaseIds.length}개의 릴리즈가 성공적으로 삭제되었습니다.`);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        setTimeout(() => setToastMessage(''), 300); // 애니메이션 완료 후 메시지 초기화
      }, 3000);
    } catch (error) {
      console.error('다중 삭제 오류:', error);
      setToastMessage('릴리즈 삭제 중 오류가 발생했습니다. 다시 시도해 주세요.');
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        setTimeout(() => setToastMessage(''), 300); // 애니메이션 완료 후 메시지 초기화
      }, 3000);
    }
  };

  return (
    <PageWrapper>
      {currentView === 'list' ? (
        <ReleaseListView
          releases={releases}
          selectedReleases={selectedReleases}
          onSelectRelease={handleReleaseSelect}
          onSelectAll={handleSelectAll}
          onViewRelease={handleViewRelease}
          onEditRelease={handleEditRelease}
          onDeleteRelease={handleDeleteRelease}
          onCreateRelease={handleCreateRelease}
          onBulkDelete={handleBulkDelete}
        />
      ) : (
        selectedRelease && (
          <ReleaseDetailPage
            release={selectedRelease}
            currentTab={currentTab}
            onBackToList={handleBackToList}
          />
        )
      )}
      
      <ReleaseCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateReleaseSubmit}
      />
      
      <ReleaseEditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          console.log("수정 모달 닫기");
          setIsEditModalOpen(false);
          setEditingRelease(null);
        }}
        onSubmit={handleEditReleaseSubmit}
        release={editingRelease}
      />      
      {/* 토스트 알림 */}
      <Toast show={showToast}>
        {toastMessage}
      </Toast>
    </PageWrapper>
  );
};

export default ReleaseManagementV2Page;