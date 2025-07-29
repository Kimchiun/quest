import { Defect, DefectStatus, DefectPriority } from '../models/Defect';
import { defectRepository } from '../repositories/defectRepository';

export interface CreateDefectData {
    title: string;
    description: string;
    status: DefectStatus;
    priority: DefectPriority;
    assignee?: string;
    reporter: string;
    createdBy: string;
    testCaseId?: number;
    releaseId?: number;
}

export interface UpdateDefectData {
    title?: string;
    description?: string;
    status?: DefectStatus;
    priority?: DefectPriority;
    assignee?: string;
    updatedBy: string;
}

export interface DefectListParams {
    page: number;
    size: number;
    status?: string;
    priority?: string;
    assignee?: string;
}

export const createDefect = async (data: CreateDefectData): Promise<Defect> => {
    const defect = await defectRepository.create({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
    });
    return defect;
};

export const updateDefect = async (id: number, data: UpdateDefectData): Promise<Defect | null> => {
    const defect = await defectRepository.update(id, {
        ...data,
        updatedAt: new Date()
    });
    return defect;
};

export const deleteDefect = async (id: number): Promise<boolean> => {
    return await defectRepository.delete(id);
};

export const getDefectById = async (id: number): Promise<Defect | null> => {
    return await defectRepository.findById(id);
};

export const listDefects = async (params: DefectListParams): Promise<{
    defects: Defect[];
    total: number;
    page: number;
    size: number;
}> => {
    const { defects, total } = await defectRepository.findWithPagination(params);
    return {
        defects,
        total,
        page: params.page,
        size: params.size
    };
}; 