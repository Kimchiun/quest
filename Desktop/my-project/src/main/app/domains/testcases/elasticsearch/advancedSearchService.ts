import esClient from '../../../infrastructure/elasticsearch/esClient';
import { TestCase } from '../models/TestCase';

const INDEX = 'testcases';

export interface AdvancedSearchFilter {
  folders?: string[];
  tags?: string[];
  status?: ('Active' | 'Archived')[];
  createdBy?: string[];
  priority?: ('High' | 'Medium' | 'Low')[];
  dateRange?: {
    from: string;
    to: string;
  };
  keyword?: string;
}

export interface SearchPreset {
  id: string;
  name: string;
  filters: AdvancedSearchFilter;
  createdBy: string;
  createdAt: string;
}

export interface SearchResult {
  testCases: TestCase[];
  total: number;
  highlights: Record<string, string[]>;
}

/**
 * 복합 조건을 Elasticsearch 쿼리로 변환
 */
export function buildAdvancedQuery(filters: AdvancedSearchFilter, page: number = 0, size: number = 20) {
  const must: any[] = [];
  const should: any[] = [];
  const filter: any[] = [];

  // 키워드 검색 (제목, 설명, 스텝에서 검색)
  if (filters.keyword) {
    should.push(
      { match: { title: { query: filters.keyword, boost: 3 } } },
      { match: { prereq: { query: filters.keyword, boost: 2 } } },
      { match: { steps: { query: filters.keyword, boost: 1 } } },
      { match: { expected: { query: filters.keyword, boost: 1 } } }
    );
  }

  // 폴더 필터
  if (filters.folders && filters.folders.length > 0) {
    filter.push({ terms: { folder: filters.folders } });
  }

  // 태그 필터
  if (filters.tags && filters.tags.length > 0) {
    filter.push({ terms: { tags: filters.tags } });
  }

  // 상태 필터
  if (filters.status && filters.status.length > 0) {
    filter.push({ terms: { status: filters.status } });
  }

  // 작성자 필터
  if (filters.createdBy && filters.createdBy.length > 0) {
    filter.push({ terms: { createdBy: filters.createdBy } });
  }

  // 우선순위 필터
  if (filters.priority && filters.priority.length > 0) {
    filter.push({ terms: { priority: filters.priority } });
  }

  // 날짜 범위 필터
  if (filters.dateRange) {
    const range: any = {};
    if (filters.dateRange.from) range.gte = filters.dateRange.from;
    if (filters.dateRange.to) range.lte = filters.dateRange.to;
    if (Object.keys(range).length > 0) {
      filter.push({ range: { createdAt: range } });
    }
  }

  const query: any = {
    bool: {
      must,
      should,
      filter,
      minimum_should_match: filters.keyword ? 1 : 0
    }
  };

  return {
    query,
    highlight: {
      fields: {
        title: {},
        prereq: {},
        steps: {},
        expected: {}
      },
      pre_tags: ['<mark>'],
      post_tags: ['</mark>']
    },
    from: page * size,
    size,
    sort: [
      '_score:desc',
      'createdAt:desc'
    ]
  };
}

/**
 * 고급 검색 실행
 */
export async function advancedSearch(
  filters: AdvancedSearchFilter,
  page: number = 0,
  size: number = 20
): Promise<SearchResult> {
  const query = buildAdvancedQuery(filters, page, size);
  
  const result = await esClient.search({
    index: INDEX,
    body: query
  });

  const testCases = result.hits.hits.map((hit: any) => hit._source as TestCase);
  const highlights: Record<string, string[]> = {};
  
  result.hits.hits.forEach((hit: any) => {
    if (hit.highlight) {
      highlights[hit._id] = Object.values(hit.highlight).flat() as string[];
    }
  });

  return {
    testCases,
    total: typeof result.hits.total === 'number' ? result.hits.total : result.hits.total?.value || 0,
    highlights
  };
}

/**
 * 검색 프리셋 저장
 */
export async function saveSearchPreset(preset: Omit<SearchPreset, 'id' | 'createdAt'>): Promise<SearchPreset> {
  const id = `preset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const newPreset: SearchPreset = {
    ...preset,
    id,
    createdAt: new Date().toISOString()
  };

  await esClient.index({
    index: 'search_presets',
    id,
    document: newPreset
  });

  return newPreset;
}

/**
 * 검색 프리셋 목록 조회
 */
export async function getSearchPresets(createdBy?: string): Promise<SearchPreset[]> {
  const query: any = {
    query: {
      match_all: {}
    },
    sort: [{ createdAt: { order: 'desc' } }]
  };

  if (createdBy) {
    query.query = { term: { createdBy } };
  }

  const result = await esClient.search({
    index: 'search_presets',
    body: query
  });

  return result.hits.hits.map((hit: any) => hit._source as SearchPreset);
}

/**
 * 검색 프리셋 삭제
 */
export async function deleteSearchPreset(id: string): Promise<boolean> {
  try {
    await esClient.delete({
      index: 'search_presets',
      id
    });
    return true;
  } catch (error) {
    console.error('Failed to delete search preset:', error);
    return false;
  }
} 