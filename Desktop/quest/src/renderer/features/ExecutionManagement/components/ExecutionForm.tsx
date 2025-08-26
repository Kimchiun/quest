import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/renderer/store';
import { addExecution, enqueueOfflineExecution, syncOfflineExecutions } from '../store/executionSlice';
import { useNetworkStatus } from '@/renderer/utils/useNetworkStatus';
import { saveOfflineExecution, getOfflineExecutions, clearOfflineExecutions } from '@/renderer/utils/executionIdb';

interface ExecutionFormProps {
    testcaseId: number;
    suiteId?: number;
    releaseId?: number;
    executedBy: string;
    onSaved?: () => void;
}

const statusOptions = ['Pass', 'Fail', 'Blocked', 'Untested'] as const;
type Status = typeof statusOptions[number];

declare global {
    interface Window {
        electron: {
            saveFile: (file: File) => Promise<string>;
        };
    }
}

const ExecutionForm: React.FC<ExecutionFormProps> = ({ testcaseId, suiteId, releaseId, executedBy, onSaved }) => {
    const dispatch = useDispatch<AppDispatch>();
    const isOnline = useNetworkStatus();
    const [status, setStatus] = useState<Status>('Untested');
    const [reproSteps, setReproSteps] = useState('');
    const [comment, setComment] = useState('');
    const [screenshot, setScreenshot] = useState<File | null>(null);
    const [logFile, setLogFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 온라인 복귀 시 오프라인 기록 동기화
    useEffect(() => {
        if (isOnline) {
            (async () => {
                const offlineExecs = await getOfflineExecutions();
                if (offlineExecs.length > 0) {
                    try {
                        await dispatch(syncOfflineExecutions(offlineExecs)).unwrap();
                        await clearOfflineExecutions();
                    } catch (err: any) {
                        // 동기화 실패 시 에러 표시(옵션)
                    }
                }
            })();
        }
    }, [isOnline, dispatch]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (f: File | null) => void) => {
        if (e.target.files && e.target.files[0]) {
            setter(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        let screenshotPath: string | undefined = undefined;
        let logFilePath: string | undefined = undefined;
        try {
            if (screenshot) {
                screenshotPath = await window.electron.saveFile(screenshot);
            }
            if (logFile) {
                logFilePath = await window.electron.saveFile(logFile);
            }
        } catch (err) {
            setError('파일 저장 실패');
            setLoading(false);
            return;
        }
        const execution = {
            testcaseId,
            suiteId,
            releaseId,
            status,
            executedBy,
            executedAt: new Date(),
            reproSteps: status === 'Fail' ? reproSteps : undefined,
            comment,
            screenshotPath,
            logFilePath,
        };
        try {
            if (isOnline) {
                await dispatch(addExecution(execution)).unwrap();
            } else {
                await saveOfflineExecution(execution);
                dispatch(enqueueOfflineExecution(execution));
            }
            if (onSaved) onSaved();
        } catch (err: any) {
            setError(err.message || '저장 실패');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>상태:</label>
                {statusOptions.map(opt => (
                    <label key={opt} style={{ marginRight: 8 }}>
                        <input
                            type="radio"
                            name="status"
                            value={opt}
                            checked={status === opt}
                            onChange={() => setStatus(opt)}
                        />
                        {opt}
                    </label>
                ))}
            </div>
            {status === 'Fail' && (
                <div>
                    <label>재현 절차:</label>
                    <textarea value={reproSteps} onChange={e => setReproSteps(e.target.value)} required />
                </div>
            )}
            <div>
                <label>코멘트:</label>
                <textarea value={comment} onChange={e => setComment(e.target.value)} />
            </div>
            <div>
                <label>스크린샷 첨부:</label>
                <input type="file" accept="image/*" onChange={e => handleFileChange(e, setScreenshot)} />
            </div>
            <div>
                <label>로그파일 첨부:</label>
                <input type="file" accept=".log,.txt" onChange={e => handleFileChange(e, setLogFile)} />
            </div>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <button type="submit" disabled={loading}>{loading ? '저장 중...' : '저장'}</button>
        </form>
    );
};

export default ExecutionForm; 