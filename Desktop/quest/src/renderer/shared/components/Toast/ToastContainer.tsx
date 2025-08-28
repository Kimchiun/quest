import React from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';
import { removeNotification } from '../../../store/notificationSlice';
import Toast from './Toast';
import { Z_INDEX } from '../../theme';

const ToastWrapper = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: ${Z_INDEX.NOTIFICATION};
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  pointer-events: none;
`;

const ToastContainer: React.FC = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state: RootState) => state.notifications.notifications);

  const handleClose = (id: string) => {
    dispatch(removeNotification(id));
  };

  return (
    <ToastWrapper>
      {Array.isArray(notifications) && notifications.map((notification) => (
        <div key={notification.id} style={{ pointerEvents: 'auto' }}>
          <Toast
            notification={notification}
            onClose={handleClose}
          />
        </div>
      ))}
    </ToastWrapper>
  );
};

export default ToastContainer; 