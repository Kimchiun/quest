import { buildAdvancedQuery, advancedSearch, saveSearchPreset, getSearchPresets, deleteSearchPreset } from '../src/main/app/domains/testcases/elasticsearch/advancedSearchService';
import { AdvancedSearchFilter } from '../src/main/app/domains/testcases/elasticsearch/advancedSearchService';

// Mock Elasticsearch client
jest.mock('../src/main/app/infrastructure/elasticsearch/esClient', () => ({
  search: jest.fn(),
  index: jest.fn(),
  delete: jest.fn(),
}));

describe('Advanced Search Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('buildAdvancedQuery', () => {
    it('should build basic query without filters', () => {
      const filters: AdvancedSearchFilter = {};
      const query = buildAdvancedQuery(filters);

      expect(query.query.bool.must).toEqual([]);
      expect(query.query.bool.should).toEqual([]);
      expect(query.query.bool.filter).toEqual([]);
      expect(query.query.bool.minimum_should_match).toBe(0);
    });

    it('should build query with keyword search', () => {
      const filters: AdvancedSearchFilter = {
        keyword: 'login test'
      };
      const query = buildAdvancedQuery(filters);

      expect(query.query.bool.should).toHaveLength(4);
      expect(query.query.bool.should[0]).toEqual({
        match: { title: { query: 'login test', boost: 3 } }
      });
      expect(query.query.bool.minimum_should_match).toBe(1);
    });

    it('should build query with multiple filters', () => {
      const filters: AdvancedSearchFilter = {
        keyword: 'test',
        folders: ['Smoke Tests'],
        tags: ['critical'],
        status: ['Active'],
        priority: ['High'],
        createdBy: ['tester1'],
        dateRange: {
          from: '2024-01-01',
          to: '2024-12-31'
        }
      };
      const query = buildAdvancedQuery(filters);

      // 키워드 검색
      expect(query.query.bool.should).toHaveLength(4);
      expect(query.query.bool.minimum_should_match).toBe(1);

      // 필터 조건들 (날짜 범위 포함)
      expect(query.query.bool.filter).toHaveLength(6);
      expect(query.query.bool.filter).toContainEqual({
        terms: { folder: ['Smoke Tests'] }
      });
      expect(query.query.bool.filter).toContainEqual({
        terms: { tags: ['critical'] }
      });
      expect(query.query.bool.filter).toContainEqual({
        terms: { status: ['Active'] }
      });
      expect(query.query.bool.filter).toContainEqual({
        terms: { priority: ['High'] }
      });
      expect(query.query.bool.filter).toContainEqual({
        terms: { createdBy: ['tester1'] }
      });
      expect(query.query.bool.filter).toContainEqual({
        range: { createdAt: { gte: '2024-01-01', lte: '2024-12-31' } }
      });
    });

    it('should build query with date range filters', () => {
      const filters: AdvancedSearchFilter = {
        dateRange: {
          from: '2024-01-01',
          to: '2024-12-31'
        }
      };
      const query = buildAdvancedQuery(filters);

      expect(query.query.bool.filter).toContainEqual({
        range: { createdAt: { gte: '2024-01-01', lte: '2024-12-31' } }
      });
    });

    it('should build query with only from date', () => {
      const filters: AdvancedSearchFilter = {
        dateRange: {
          from: '2024-01-01',
          to: ''
        }
      };
      const query = buildAdvancedQuery(filters);

      expect(query.query.bool.filter).toContainEqual({
        range: { createdAt: { gte: '2024-01-01' } }
      });
    });

    it('should build query with only to date', () => {
      const filters: AdvancedSearchFilter = {
        dateRange: {
          from: '',
          to: '2024-12-31'
        }
      };
      const query = buildAdvancedQuery(filters);

      expect(query.query.bool.filter).toContainEqual({
        range: { createdAt: { lte: '2024-12-31' } }
      });
    });
  });

  describe('advancedSearch', () => {
    it('should execute advanced search and return results', async () => {
      const mockSearchResult = {
        hits: {
          hits: [
            {
              _id: '1',
              _source: {
                id: 1,
                title: 'Login Test',
                priority: 'High',
                status: 'Active',
                createdBy: 'tester1',
                createdAt: '2024-01-15T00:00:00Z'
              },
              highlight: {
                title: ['<mark>Login</mark> Test']
              }
            }
          ],
          total: { value: 1 }
        }
      };

      const esClient = require('../src/main/app/infrastructure/elasticsearch/esClient');
      esClient.search.mockResolvedValue(mockSearchResult);

      const filters: AdvancedSearchFilter = {
        keyword: 'login',
        status: ['Active']
      };

      const result = await advancedSearch(filters, 0, 20);

      expect(result.testCases).toHaveLength(1);
      expect(result.testCases[0].title).toBe('Login Test');
      expect(result.total).toBe(1);
      expect(result.highlights['1']).toEqual(['<mark>Login</mark> Test']);
    });

    it('should handle search errors gracefully', async () => {
      const esClient = require('../src/main/app/infrastructure/elasticsearch/esClient');
      esClient.search.mockRejectedValue(new Error('Search failed'));

      const filters: AdvancedSearchFilter = {
        keyword: 'test'
      };

      await expect(advancedSearch(filters)).rejects.toThrow('Search failed');
    });
  });

  describe('Search Presets', () => {
    it('should save search preset', async () => {
      const mockPreset = {
        id: 'preset_123',
        name: 'Critical Tests',
        filters: {
          priority: ['High'],
          tags: ['critical']
        },
        createdBy: 'tester1',
        createdAt: '2024-01-15T00:00:00Z'
      };

      const esClient = require('../src/main/app/infrastructure/elasticsearch/esClient');
      esClient.index.mockResolvedValue({});

      const presetData = {
        name: 'Critical Tests',
        filters: {
          priority: ['High' as const],
          tags: ['critical']
        },
        createdBy: 'tester1'
      };

      const result = await saveSearchPreset(presetData);

      expect(result.name).toBe('Critical Tests');
      expect(result.filters).toEqual(presetData.filters);
      expect(result.createdBy).toBe('tester1');
      expect(result.id).toMatch(/^preset_\d+_/);
      expect(result.createdAt).toBeDefined();
    });

    it('should get search presets', async () => {
      const mockPresets = [
        {
          _id: 'preset_1',
          _source: {
            id: 'preset_1',
            name: 'Critical Tests',
            filters: { priority: ['High'] },
            createdBy: 'tester1',
            createdAt: '2024-01-15T00:00:00Z'
          }
        }
      ];

      const esClient = require('../src/main/app/infrastructure/elasticsearch/esClient');
      esClient.search.mockResolvedValue({
        hits: { hits: mockPresets }
      });

      const presets = await getSearchPresets('tester1');

      expect(presets).toHaveLength(1);
      expect(presets[0].name).toBe('Critical Tests');
      expect(presets[0].createdBy).toBe('tester1');
    });

    it('should delete search preset', async () => {
      const esClient = require('../src/main/app/infrastructure/elasticsearch/esClient');
      esClient.delete.mockResolvedValue({});

      const result = await deleteSearchPreset('preset_123');

      expect(result).toBe(true);
      expect(esClient.delete).toHaveBeenCalledWith({
        index: 'search_presets',
        id: 'preset_123'
      });
    });

    it('should handle delete preset errors', async () => {
      const esClient = require('../src/main/app/infrastructure/elasticsearch/esClient');
      esClient.delete.mockRejectedValue(new Error('Delete failed'));

      const result = await deleteSearchPreset('preset_123');

      expect(result).toBe(false);
    });
  });
}); 