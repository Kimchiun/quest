import { Execution } from '../types';
import { executionRepository } from '../repositories/executionRepository';

export const executionService = {
    async createExecution(data: Omit<Execution, 'id' | 'createdAt' | 'updatedAt'>): Promise<Execution> {
        console.log('ExecutionService.createExecution received data:', data);
        
        // 상태 유효성 검사
        if (!['Pass', 'Fail', 'Blocked', 'Untested'].includes(data.status)) {
            throw new Error('Invalid execution status');
        }
        
        // 필요한 필드만 추출하여 전달
        const executionData = {
            testcaseId: data.testcaseId,
            releaseId: data.releaseId,
            status: data.status,
            executedBy: data.executedBy,
            executedAt: data.executedAt,
            comment: data.comment
        };
        
        console.log('ExecutionService.createExecution cleaned data:', executionData);
        
        return executionRepository.insert(executionData);
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