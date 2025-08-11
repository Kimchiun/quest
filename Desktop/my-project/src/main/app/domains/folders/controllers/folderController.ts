import { Request, Response } from 'express';
import * as folderService from '../services/folderService';
import { FolderCreateRequest, FolderUpdateRequest, FolderMoveRequest } from '../models/Folder';

export async function createFolder(req: Request, res: Response) {
    try {
        const data: FolderCreateRequest = req.body;
        const createdBy = 'system';
        
        const folder = await folderService.createFolder(data, createdBy);
        res.status(201).json(folder);
    } catch (error: any) {
        res.status(400).json({ 
            error: error.message,
            code: 'FOLDER_CREATE_ERROR'
        });
    }
}

export async function getFolderById(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id);
        const folder = await folderService.getFolderById(id);
        
        if (!folder) {
            return res.status(404).json({ 
                error: '폴더를 찾을 수 없습니다.',
                code: 'FOLDER_NOT_FOUND'
            });
        }
        
        res.json(folder);
    } catch (error: any) {
        res.status(500).json({ 
            error: error.message,
            code: 'FOLDER_GET_ERROR'
        });
    }
}

export async function updateFolder(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id);
        const data: FolderUpdateRequest = req.body;
        const updatedBy = 'system';
        
        const folder = await folderService.updateFolder(id, data, updatedBy);
        
        if (!folder) {
            return res.status(404).json({ 
                error: '폴더를 찾을 수 없습니다.',
                code: 'FOLDER_NOT_FOUND'
            });
        }
        
        res.json(folder);
    } catch (error: any) {
        res.status(400).json({ 
            error: error.message,
            code: 'FOLDER_UPDATE_ERROR'
        });
    }
}

export async function moveFolder(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id);
        const data: FolderMoveRequest = req.body;
        const movedBy = 'system';
        
        const folder = await folderService.moveFolder(id, data, movedBy);
        
        if (!folder) {
            return res.status(404).json({ 
                error: '폴더를 찾을 수 없습니다.',
                code: 'FOLDER_NOT_FOUND'
            });
        }
        
        res.json(folder);
    } catch (error: any) {
        res.status(400).json({ 
            error: error.message,
            code: 'FOLDER_MOVE_ERROR'
        });
    }
}

export async function deleteFolder(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id);
        const mode = (req.query.mode as 'soft' | 'hard') || 'soft';
        const deletedBy = 'system';
        
        const success = await folderService.deleteFolder(id, mode, deletedBy);
        
        if (!success) {
            return res.status(404).json({ 
                error: '폴더를 찾을 수 없습니다.',
                code: 'FOLDER_NOT_FOUND'
            });
        }
        
        res.json({ success: true });
    } catch (error: any) {
        res.status(400).json({ 
            error: error.message,
            code: 'FOLDER_DELETE_ERROR'
        });
    }
}

export async function getFolderTree(req: Request, res: Response) {
    try {
        const projectId = parseInt(req.query.projectId as string) || 1;
        const depth = req.query.depth ? parseInt(req.query.depth as string) : undefined;
        
        const tree = await folderService.getFolderTree(projectId, depth);
        res.json(tree);
    } catch (error: any) {
        res.status(500).json({ 
            error: error.message,
            code: 'FOLDER_TREE_ERROR'
        });
    }
}

export async function listFoldersByProject(req: Request, res: Response) {
    try {
        const projectId = parseInt(req.params.projectId);
        const folders = await folderService.listFoldersByProject(projectId);
        res.json(folders);
    } catch (error: any) {
        res.status(500).json({ 
            error: error.message,
            code: 'FOLDER_LIST_ERROR'
        });
    }
} 

export async function moveFolderBatch(req: Request, res: Response) {
    try {
        const { items, idempotencyKey, clientVersion } = req.body;
        
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ 
                error: '이동할 항목이 필요합니다.',
                code: 'INVALID_MOVE_ITEMS'
            });
        }

        const results = {
            success: [] as Array<{ id: string; folder: any }>,
            failed: [] as Array<{ id: string; error: string; reason: string }>
        };

        // 배치 이동 처리
        for (const item of items) {
            try {
                const folder = await folderService.moveFolder(
                    parseInt(item.id), 
                    {
                        targetParentId: item.targetParentId,
                        dropType: item.dropType,
                        relativeToId: item.relativeToId,
                        orderIndex: item.orderIndex
                    }, 
                    'system'
                );
                
                if (folder) {
                    results.success.push({ id: item.id, folder });
                } else {
                    results.failed.push({ 
                        id: item.id, 
                        error: '폴더를 찾을 수 없습니다.',
                        reason: 'FOLDER_NOT_FOUND'
                    });
                }
            } catch (error: any) {
                let reason = 'UNKNOWN_ERROR';
                if (error.message.includes('순환')) reason = 'CYCLIC_MOVE';
                else if (error.message.includes('권한')) reason = 'PERMISSION_DENIED';
                else if (error.message.includes('이름')) reason = 'NAME_CONFLICT';
                else if (error.message.includes('잠금')) reason = 'LOCKED';
                else if (error.message.includes('아카이브')) reason = 'ARCHIVED';
                
                results.failed.push({ 
                    id: item.id, 
                    error: error.message,
                    reason
                });
            }
        }

        // 응답 헤더에 idempotency key 추가
        if (idempotencyKey) {
            res.setHeader('X-Idempotency-Key', idempotencyKey);
        }

        res.json({
            success: results.success,
            failed: results.failed,
            totalProcessed: items.length,
            successCount: results.success.length,
            failureCount: results.failed.length
        });
    } catch (error: any) {
        res.status(500).json({ 
            error: error.message,
            code: 'FOLDER_BATCH_MOVE_ERROR'
        });
    }
} 