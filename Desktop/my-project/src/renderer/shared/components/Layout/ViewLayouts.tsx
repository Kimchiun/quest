import React from 'react';
import styled from 'styled-components';
import MainContentLayout, { ViewType, LayoutVariant, MainContentLayoutProps } from './MainContentLayout';
import { Theme } from '../../theme';

// 대시보드 뷰 레이아웃
export interface DashboardLayoutProps extends Omit<MainContentLayoutProps, 'viewType'> {
  variant?: LayoutVariant;
  showFilters?: boolean;
  showWidgets?: boolean;
}

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[4]} 0;
  border-bottom: 1px solid ${({ theme }) => theme.color.border.primary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const DashboardContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[4]};
  height: 100%;
  
  @media (max-width: ${({ theme }) => theme.breakpoint.md}) {
    grid-template-columns: 1fr;
  }
`;

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  variant = 'default',
  showFilters = true,
  showWidgets = true,
  ...props
}) => {
  return (
    <MainContentLayout
      viewType="dashboard"
      variant={variant}
      {...props}
    >
      <DashboardHeader>
        <h1>대시보드</h1>
        {showFilters && (
          <div>
            {/* 필터 컴포넌트 */}
          </div>
        )}
      </DashboardHeader>
      
      <DashboardContent>
        {children}
      </DashboardContent>
    </MainContentLayout>
  );
};

// 목록 뷰 레이아웃
export interface ListLayoutProps extends Omit<MainContentLayoutProps, 'viewType'> {
  variant?: LayoutVariant;
  showSearch?: boolean;
  showFilters?: boolean;
  showActions?: boolean;
}

const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[4]} 0;
  border-bottom: 1px solid ${({ theme }) => theme.color.border.primary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const ListToolbar = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  align-items: center;
  flex-wrap: wrap;
`;

const ListContent = styled.div`
  flex: 1;
  overflow: auto;
`;

export const ListLayout: React.FC<ListLayoutProps> = ({
  children,
  variant = 'default',
  showSearch = true,
  showFilters = true,
  showActions = true,
  ...props
}) => {
  return (
    <MainContentLayout
      viewType="list"
      variant={variant}
      {...props}
    >
      <ListHeader>
        <div>
          <h1>목록</h1>
        </div>
        
        <ListToolbar>
          {showSearch && (
            <div>
              {/* 검색 컴포넌트 */}
            </div>
          )}
          
          {showFilters && (
            <div>
              {/* 필터 컴포넌트 */}
            </div>
          )}
          
          {showActions && (
            <div>
              {/* 액션 버튼들 */}
            </div>
          )}
        </ListToolbar>
      </ListHeader>
      
      <ListContent>
        {children}
      </ListContent>
    </MainContentLayout>
  );
};

// 상세 뷰 레이아웃
export interface DetailLayoutProps extends Omit<MainContentLayoutProps, 'viewType'> {
  variant?: LayoutVariant;
  showActions?: boolean;
  showTabs?: boolean;
}

const DetailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[4]} 0;
  border-bottom: 1px solid ${({ theme }) => theme.color.border.primary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const DetailActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const DetailContent = styled.div`
  flex: 1;
  overflow: auto;
`;

const DetailTabs = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.color.border.primary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

export const DetailLayout: React.FC<DetailLayoutProps> = ({
  children,
  variant = 'default',
  showActions = true,
  showTabs = true,
  ...props
}) => {
  return (
    <MainContentLayout
      viewType="detail"
      variant={variant}
      {...props}
    >
      <DetailHeader>
        <div>
          <h1>상세 정보</h1>
        </div>
        
        {showActions && (
          <DetailActions>
            {/* 액션 버튼들 */}
          </DetailActions>
        )}
      </DetailHeader>
      
      {showTabs && (
        <DetailTabs>
          {/* 탭 컴포넌트 */}
        </DetailTabs>
      )}
      
      <DetailContent>
        {children}
      </DetailContent>
    </MainContentLayout>
  );
};

// 폼 뷰 레이아웃
export interface FormLayoutProps extends Omit<MainContentLayoutProps, 'viewType'> {
  variant?: LayoutVariant;
  showActions?: boolean;
  showValidation?: boolean;
}

const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[4]} 0;
  border-bottom: 1px solid ${({ theme }) => theme.color.border.primary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const FormContent = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[4]} 0;
  border-top: 1px solid ${({ theme }) => theme.color.border.primary};
  margin-top: ${({ theme }) => theme.spacing[4]};
`;

export const FormLayout: React.FC<FormLayoutProps> = ({
  children,
  variant = 'default',
  showActions = true,
  showValidation = true,
  ...props
}) => {
  return (
    <MainContentLayout
      viewType="form"
      variant={variant}
      {...props}
    >
      <FormHeader>
        <h1>폼</h1>
      </FormHeader>
      
      <FormContent>
        {children}
        
        {showActions && (
          <FormActions>
            {/* 액션 버튼들 */}
          </FormActions>
        )}
      </FormContent>
    </MainContentLayout>
  );
}; 