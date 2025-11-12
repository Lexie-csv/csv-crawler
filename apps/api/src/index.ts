import express from 'express';
import type { Request, Response } from 'express';
import { getAllSources, createSource, startCrawlJob, getCrawlJobStatus, getAllCrawlJobs } from './crawler.service';

const app = express();
const port = process.env.PORT ?? 3001;

// Middleware
app.use(express.json());

// Health check
app.get('/health', (_req: Request, res: Response): void => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// GET all sources
app.get('/api/v1/sources', async (_req: Request, res: Response): Promise<void> => {
    const sources = await getAllSources();
    res.json({ data: sources, message: 'Sources fetched successfully' });
});

// POST new source
app.post('/api/v1/sources', async (req: Request, res: Response): Promise<void> => {
    const source = await createSource(req.body);
    res.status(201).json({ data: source, message: 'Source created' });
});

// GET all crawl jobs
app.get('/api/v1/crawl/jobs', async (_req: Request, res: Response): Promise<void> => {
    const jobs = await getAllCrawlJobs();
    res.json({ data: jobs, message: 'Crawl jobs fetched' });
});

// POST start crawl for a source
app.post('/api/v1/crawl/start', async (req: Request, res: Response): Promise<void> => {
    const { sourceId } = req.body;
    if (!sourceId) {
        res.status(400).json({ error: 'sourceId required' });
        return;
    }
    const job = await startCrawlJob(sourceId);
    res.status(201).json({ data: job, message: 'Crawl job started' });
});

// GET crawl job status
app.get('/api/v1/crawl/status/:jobId', async (req: Request, res: Response): Promise<void> => {
    const job = await getCrawlJobStatus(parseInt(req.params.jobId));
    if (!job) {
        res.status(404).json({ error: 'Job not found' });
        return;
    }
    res.json({ data: job, message: 'Crawl job status' });
});

app.get('/api/v1/documents', (_req: Request, res: Response): void => {
    res.json({ data: [], message: 'Documents endpoint' });
});

app.post('/api/v1/documents', (req: Request, res: Response): void => {
    res.status(201).json({ data: req.body, message: 'Document created' });
});

// 404 handler
app.use((_req: Request, res: Response): void => {
    res.status(404).json({ error: 'Not Found' });
});

// Error handler
app.use((err: Error, _req: Request, res: Response, _next: unknown): void => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
    console.log(`✓ API server listening on port ${port}`);
    console.log(`  Health check: http://localhost:${port}/health`);
});
