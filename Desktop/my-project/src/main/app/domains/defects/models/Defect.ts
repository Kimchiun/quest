export enum DefectStatus {
    OPEN = 'open',
    IN_PROGRESS = 'in_progress',
    RESOLVED = 'resolved',
    CLOSED = 'closed',
    REOPENED = 'reopened'
}

export enum DefectPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    CRITICAL = 'critical'
}

export interface Defect {
    id: number;
    title: string;
    description: string;
    status: DefectStatus;
    priority: DefectPriority;
    assignee?: string;
    reporter: string;
    createdBy: string;
    testCaseId?: number;
    releaseId?: number;
    createdAt: Date;
    updatedAt: Date;
    resolvedAt?: Date;
    closedAt?: Date;
}

export interface DefectDetail extends Defect {
    attachments: Attachment[];
    activityLogs: ActivityLog[];
    relatedTestCases: number[];
    comments: Comment[];
}

export interface Attachment {
    id: number;
    defectId: number;
    name: string;
    size: number;
    type: string;
    uploadedBy: string;
    uploadedAt: Date;
    url: string;
}

export interface ActivityLog {
    id: number;
    defectId: number;
    action: string;
    user: string;
    date: Date;
    details?: string;
    type: 'create' | 'update' | 'delete' | 'comment' | 'status_change';
}

export interface Comment {
    id: number;
    defectId: number;
    content: string;
    author: string;
    createdAt: Date;
    updatedAt: Date;
} 