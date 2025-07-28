import React, { useState } from 'react';
import Modal from '../../../shared/components/Modal';
import Button from '../../../shared/components/Button';
import Input from '../../../shared/components/Input';
import Typography from '../../../shared/components/Typography';
import Container from '../../../shared/components/Container';

interface FolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description?: string; parentId?: number }) => void;
  mode: 'create' | 'edit' | 'delete';
  folder?: {
    id: number;
    name: string;
    description?: string;
    parentId?: number;
  };
  parentFolders?: Array<{ id: number; name: string }>;
}

const FolderModal: React.FC<FolderModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  mode,
  folder,
  parentFolders = []
}) => {
  const [name, setName] = useState(folder?.name || '');
  const [description, setDescription] = useState(folder?.description || '');
  const [parentId, setParentId] = useState<number | undefined>(folder?.parentId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'delete') {
      onSubmit({ name: '', description: '' });
    } else {
      onSubmit({ name, description, parentId });
    }
    onClose();
  };

  const getTitle = () => {
    switch (mode) {
      case 'create': return '새 폴더 생성';
      case 'edit': return '폴더 수정';
      case 'delete': return '폴더 삭제';
      default: return '';
    }
  };

  const getSubmitText = () => {
    switch (mode) {
      case 'create': return '생성';
      case 'edit': return '수정';
      case 'delete': return '삭제';
      default: return '';
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Container $padding="24px" $background="#ffffff" $radius="8px">
        <Typography $variant="h3" style={{ marginBottom: '24px' }}>
          {getTitle()}
        </Typography>

        {mode === 'delete' ? (
          <div>
            <Typography $variant="body" style={{ marginBottom: '16px' }}>
              정말로 "{folder?.name}" 폴더를 삭제하시겠습니까?
            </Typography>
            <Typography $variant="body" style={{ color: '#dc2626', marginBottom: '24px' }}>
              이 작업은 되돌릴 수 없습니다.
            </Typography>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <Typography $variant="body" style={{ marginBottom: '8px' }}>
                폴더 이름 *
              </Typography>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="폴더 이름을 입력하세요"
                required
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <Typography $variant="body" style={{ marginBottom: '8px' }}>
                설명
              </Typography>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="폴더 설명을 입력하세요"
              />
            </div>

            {parentFolders.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <Typography $variant="body" style={{ marginBottom: '8px' }}>
                  상위 폴더
                </Typography>
                <select
                  value={parentId || ''}
                  onChange={(e) => setParentId(e.target.value ? Number(e.target.value) : undefined)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                >
                  <option value="">루트 폴더</option>
                  {parentFolders.map(folder => (
                    <option key={folder.id} value={folder.id}>
                      {folder.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </form>
        )}

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
          <Button variant="secondary" onClick={onClose}>
            취소
          </Button>
          <Button 
            variant={mode === 'delete' ? 'danger' : 'primary'} 
            onClick={handleSubmit}
            disabled={mode !== 'delete' && !name.trim()}
          >
            {getSubmitText()}
          </Button>
        </div>
      </Container>
    </Modal>
  );
};

export default FolderModal; 