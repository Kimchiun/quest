import esClient from '../../../infrastructure/elasticsearch/esClient';
import { TestCase } from '../models/TestCase';

const INDEX = 'testcases';

export async function indexTestCase(tc: TestCase) {
    await esClient.index({
        index: INDEX,
        id: tc.id.toString(),
        document: tc,
    });
}

export async function removeTestCaseFromIndex(id: number) {
    await esClient.delete({
        index: INDEX,
        id: id.toString(),
    });
}

export async function searchTestCases(query: any) {
    const result = await esClient.search({
        index: INDEX,
        body: query,
    });
    // elasticsearch 8.x: result.hits.hits
    return result.hits.hits.map((hit: any) => hit._source);
} 