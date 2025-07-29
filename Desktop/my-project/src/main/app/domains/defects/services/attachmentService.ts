import { Attachment } from '../models/Defect';
import { Readable } from 'stream';
import * as fs from 'fs';
import * as path from 'path';

export const getDefectAttachments = async (defectId: number): Promise<Attachment[]> => {
    // 실제 구현에서는 데이터베이스에서 조회
    // 현재는 목업 데이터 반환
    return [
        {
            id: 1,
            defectId,
            name: 'screenshot.png',
            size: 1024000,
            type: 'image/png',
            uploadedBy: 'tester1',
            uploadedAt: new Date(),
            url: `/api/defects/${defectId}/attachments/1`
        },
        {
            id: 2,
            defectId,
            name: 'error_log.txt',
            size: 51200,
            type: 'text/plain',
            uploadedBy: 'developer1',
            uploadedAt: new Date(),
            url: `/api/defects/${defectId}/attachments/2`
        }
    ];
};

export const downloadAttachment = async (
    defectId: number, 
    attachmentId: number
): Promise<{
    fileStream: Readable;
    filename: string;
    contentType: string;
}> => {
    // 실제 구현에서는 데이터베이스에서 파일 정보 조회 후 파일 시스템에서 다운로드
    // 현재는 목업 데이터 반환
    const mockFile = {
        filename: `attachment_${attachmentId}.txt`,
        contentType: 'text/plain',
        content: `This is a mock attachment for defect ${defectId}, attachment ${attachmentId}`
    };

    const stream = new Readable();
    stream.push(mockFile.content);
    stream.push(null);

    return {
        fileStream: stream,
        filename: mockFile.filename,
        contentType: mockFile.contentType
    };
}; 