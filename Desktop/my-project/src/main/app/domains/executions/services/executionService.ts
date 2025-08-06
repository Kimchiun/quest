import { Execution } from '../types';
import { executionRepository } from '../repositories/executionRepository';

export const executionService = {
    async createExecution(data: Omit<Execution, 'id' | 'createdAt' | 'updatedAt'>): Promise<Execution> {
        // 상태 유효성 검사
        if (!['Pass', 'Fail', 'Blocked', 'Untested'].includes(data.status)) {
            throw new Error('Invalid execution status');
        }
        // 파일 경로 등 추가 비즈니스 로직 필요시 삽입
        return executionRepository.insert(data);
    },

    async getExecutionById(id: number): Promise<Execution | null> {
        return executionRepository.findById(id);
    },

    async getExecutionsByTestCase(testcaseId: number): Promise<Execution[]> {
        return executionRepository.findByTestCase(testcaseId);
    },

    async updateExecution(id: number, update: Partial<Omit<Execution, 'id' | 'createdAt'>>): Promise<Execution | null> {
        if (update.status && !['Pass', 'Fail', 'Blocked', 'Untested'].includes(update.status)) {
            throw new Error('Invalid execution status');
        }
        return executionRepository.update(id, update);
    },

    async deleteExecution(id: number): Promise<void> {
        await executionRepository.delete(id);
    }
}; 