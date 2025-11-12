// Domain types for CSV Policy & Data Crawler

export interface Source {
    id: string;
    name: string;
    url: string;
    country: 'PH' | 'SG' | 'MY' | 'ID' | 'TH';
    sector: 'power' | 'finance' | 're' | 'other';
    frequency: 'daily' | 'weekly' | 'monthly' | 'ad-hoc';
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export enum DocumentClassification {
    POLICY = 'policy',
    REGULATION = 'regulation',
    NEWS = 'news',
    DATA = 'data',
    OTHER = 'other',
}

export interface Document {
    id: string;
    sourceId: string;
    title: string;
    url: string;
    content: string;
    contentHash: string;
    classification: DocumentClassification;
    country: string;
    sector: string;
    themes: string[];
    extractedData: Record<string, unknown>;
    confidence: number;
    verified: boolean;
    publishedAt: Date;
    crawledAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface DataPoint {
    id: string;
    documentId: string;
    key: string;
    value: string | number;
    unit?: string;
    effectiveDate?: Date;
    source: string;
    confidence: number;
    provenance: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Digest {
    id: string;
    title: string;
    topics: string[];
    countries: string[];
    content: string;
    markdownContent?: string;
    pdfUrl?: string;
    scheduledAt: Date;
    sentAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface ApiResponse<T> {
    data?: T;
    error?: string;
    message?: string;
}

export interface ApiListResponse<T> {
    data: T[];
    total: number;
    limit: number;
    offset: number;
}
