import { Client } from '@elastic/elasticsearch';

const esClient = new Client({
    node: process.env.ES_NODE || 'http://localhost:9200',
});

export async function testEsConnection() {
    try {
        await esClient.ping();
        return true;
    } catch (err) {
        return false;
    }
}

export default esClient; 