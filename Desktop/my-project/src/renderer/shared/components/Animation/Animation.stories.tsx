import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import PageTransition from './PageTransition';
import Skeleton, { TableSkeleton, CardSkeleton, ListSkeleton } from './Skeleton';
import { useAnimation, usePageTransition } from './useAnimation';

export default {
  title: 'Animation/PageTransition',
  component: PageTransition,
  parameters: {
    layout: 'fullscreen'
  }
} as Meta;

const Template: StoryFn = (args) => (
  <div style={{ height: '400px', border: '1px solid #ccc' }}>
    <PageTransition {...args}>
      <div style={{ padding: '20px', background: '#f0f0f0' }}>
        <h2>페이지 콘텐츠</h2>
        <p>이것은 페이지 전환 애니메이션 테스트입니다.</p>
      </div>
    </PageTransition>
  </div>
);

export const Default = Template.bind({});
Default.args = {
  location: 'test',
  timeout: 300,
  classNames: 'page'
};

export const FadeTransition = Template.bind({});
FadeTransition.args = {
  location: 'fade-test',
  timeout: 200,
  classNames: 'fade'
};

export const SlideUpTransition = Template.bind({});
SlideUpTransition.args = {
  location: 'slide-test',
  timeout: 250,
  classNames: 'slide-up'
};

// 스켈레톤 스토리
export const BasicSkeleton: StoryFn = () => (
  <div style={{ width: '300px' }}>
    <Skeleton width="100%" height="20px" />
    <Skeleton width="80%" height="16px" />
    <Skeleton width="60%" height="16px" />
  </div>
);

export const TableSkeletonStory: StoryFn = () => (
  <div style={{ width: '600px' }}>
    <TableSkeleton rows={5} columns={4} />
  </div>
);

export const CardSkeletonStory: StoryFn = () => (
  <div style={{ width: '300px' }}>
    <CardSkeleton />
  </div>
);

export const ListSkeletonStory: StoryFn = () => (
  <div style={{ width: '400px' }}>
    <ListSkeleton items={4} />
  </div>
);

// 애니메이션 훅 테스트 컴포넌트
const AnimationHookTest: React.FC = () => {
  const { state, enter, exit, toggle } = useAnimation({
    duration: 300,
    onEnter: () => console.log('Entering'),
    onExit: () => console.log('Exiting')
  });

  return (
    <div style={{ padding: '20px' }}>
      <h3>애니메이션 훅 테스트</h3>
      <div style={{ 
        width: '200px', 
        height: '100px', 
        background: state.isVisible ? '#4CAF50' : '#f44336',
        transition: 'all 0.3s ease',
        opacity: state.isVisible ? 1 : 0.5,
        transform: state.isVisible ? 'scale(1)' : 'scale(0.8)'
      }}>
        {state.isVisible ? '보임' : '숨김'}
      </div>
      <button onClick={toggle} style={{ marginTop: '10px' }}>
        {state.isVisible ? '숨기기' : '보이기'}
      </button>
      <p>상태: {JSON.stringify(state)}</p>
    </div>
  );
};

export const AnimationHookStory: StoryFn = () => <AnimationHookTest />; 