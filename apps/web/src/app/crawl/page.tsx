'use client';

import { useEffect, useState } from 'react';

interface Source {
    id: number;
    name: string;
    url: string;
    type: string;
    country: string;
    sector: string | null;
    active: boolean;
}

interface CrawlJob {
    id: number;
    source_id: number;
    status: 'pending' | 'running' | 'done' | 'failed';
    started_at: string | null;
    completed_at: string | null;
    items_crawled: number;
    items_new: number;
    error_message: string | null;
    created_at: string;
}

export default function CrawlDashboard(): JSX.Element {
    const [sources, setSources] = useState<Source[]>([]);
    const [jobs, setJobs] = useState<CrawlJob[]>([]);
    const [loading, setLoading] = useState(true);
    const [newSource, setNewSource] = useState({
        name: '',
        url: '',
        type: 'policy',
        country: 'PH',
        sector: '',
    });
    const [polling, setPolling] = useState<boolean>(false);

    // Fetch sources on mount
    useEffect(() => {
        fetchSources();
        fetchJobs();
    }, []);

    // Poll job status if any are running
    useEffect(() => {
        if (!polling) return;

        const interval = setInterval(() => {
            fetchJobs();
        }, 2000);

        return () => clearInterval(interval);
    }, [polling]);

    // Check if any jobs are running
    useEffect(() => {
        const hasRunning = jobs.some((j) => j.status === 'pending' || j.status === 'running');
        setPolling(hasRunning);
    }, [jobs]);

    async function fetchSources(): Promise<void> {
        try {
            const res = await fetch('http://localhost:3001/api/v1/sources');
            const json = await res.json();
            setSources(json.data);
        } catch (error) {
            console.error('Failed to fetch sources:', error);
        } finally {
            setLoading(false);
        }
    }

    async function fetchJobs(): Promise<void> {
        try {
            const res = await fetch('http://localhost:3001/api/v1/crawl/jobs');
            const json = await res.json();
            setJobs(json.data.sort((a: CrawlJob, b: CrawlJob) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
        } catch (error) {
            console.error('Failed to fetch jobs:', error);
        }
    }

    async function handleAddSource(e: React.FormEvent): Promise<void> {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:3001/api/v1/sources', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSource),
            });
            if (res.ok) {
                setNewSource({ name: '', url: '', type: 'policy', country: 'PH', sector: '' });
                await fetchSources();
            }
        } catch (error) {
            console.error('Failed to add source:', error);
        }
    }

    async function handleStartCrawl(sourceId: number): Promise<void> {
        try {
            const res = await fetch('http://localhost:3001/api/v1/crawl/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sourceId }),
            });
            if (res.ok) {
                await fetchJobs();
            }
        } catch (error) {
            console.error('Failed to start crawl:', error);
        }
    }

    const getStatusColor = (status: string): string => {
        switch (status) {
            case 'done':
                return 'bg-green-100 text-green-800';
            case 'running':
            case 'pending':
                return 'bg-blue-100 text-blue-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return <div className="text-center py-8">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="border-b border-border sticky top-0 z-50 bg-white">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <a href="/" className="text-2xl font-bold text-copy">
                            CSV
                        </a>
                        <span className="text-xs text-secondary font-medium">Crawl Dashboard</span>
                    </div>
                    <a href="/" className="text-sm text-secondary hover:text-copy transition">
                        ← Back
                    </a>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-6 py-12">
                {/* Add Source Form */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-copy mb-6">Add Monitoring Source</h2>
                    <form onSubmit={handleAddSource} className="bg-bg-contrast border border-border rounded-md p-8">
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-semibold text-copy mb-2">Source Name</label>
                                <input
                                    type="text"
                                    value={newSource.name}
                                    onChange={(e) => setNewSource({ ...newSource, name: e.target.value })}
                                    placeholder="e.g., SEC Philippines"
                                    required
                                    className="w-full px-4 py-2 border border-border rounded-md text-copy placeholder-caption focus:outline-none focus:ring-2 focus:ring-copy"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-copy mb-2">URL</label>
                                <input
                                    type="url"
                                    value={newSource.url}
                                    onChange={(e) => setNewSource({ ...newSource, url: e.target.value })}
                                    placeholder="https://example.com"
                                    required
                                    className="w-full px-4 py-2 border border-border rounded-md text-copy placeholder-caption focus:outline-none focus:ring-2 focus:ring-copy"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-copy mb-2">Type</label>
                                <select
                                    value={newSource.type}
                                    onChange={(e) => setNewSource({ ...newSource, type: e.target.value })}
                                    className="w-full px-4 py-2 border border-border rounded-md text-copy focus:outline-none focus:ring-2 focus:ring-copy"
                                >
                                    <option value="policy">Policy</option>
                                    <option value="exchange">Exchange</option>
                                    <option value="gazette">Gazette</option>
                                    <option value="ifi">IFI</option>
                                    <option value="portal">Portal</option>
                                    <option value="news">News</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-copy mb-2">Sector</label>
                                <input
                                    type="text"
                                    value={newSource.sector}
                                    onChange={(e) => setNewSource({ ...newSource, sector: e.target.value })}
                                    placeholder="e.g., finance, energy"
                                    className="w-full px-4 py-2 border border-border rounded-md text-copy placeholder-caption focus:outline-none focus:ring-2 focus:ring-copy"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-copy text-white rounded-md font-medium text-sm hover:bg-opacity-90 transition"
                        >
                            Add Source
                        </button>
                    </form>
                </section>

                {/* Sources List */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-copy mb-6">Active Sources</h2>
                    <div className="grid gap-4">
                        {sources.length === 0 ? (
                            <p className="text-secondary">No sources yet. Add one above!</p>
                        ) : (
                            sources.map((source) => (
                                <div key={source.id} className="bg-white border border-border rounded-md p-6 flex justify-between items-start">
                                    <div className="flex-grow">
                                        <h3 className="font-semibold text-copy mb-1">{source.name}</h3>
                                        <p className="text-sm text-secondary mb-2">{source.url}</p>
                                        <div className="flex gap-3 text-xs text-caption">
                                            <span className="px-2 py-1 bg-bg-contrast rounded">📍 {source.country}</span>
                                            <span className="px-2 py-1 bg-bg-contrast rounded">🏷️ {source.type}</span>
                                            {source.sector && <span className="px-2 py-1 bg-bg-contrast rounded">💼 {source.sector}</span>}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleStartCrawl(source.id)}
                                        disabled={jobs.some((j) => j.source_id === source.id && (j.status === 'pending' || j.status === 'running'))}
                                        className="px-4 py-2 bg-copy text-white rounded-md font-medium text-sm hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Start Crawl
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* Crawl Jobs */}
                <section>
                    <h2 className="text-2xl font-bold text-copy mb-6">Crawl Jobs</h2>
                    <div className="space-y-4">
                        {jobs.length === 0 ? (
                            <p className="text-secondary">No crawl jobs yet.</p>
                        ) : (
                            jobs.map((job) => (
                                <div key={job.id} className="bg-bg-page border border-border rounded-md p-6">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="font-semibold text-copy mb-1">
                                                Crawl Job #{job.id} — Source #{job.source_id}
                                            </h3>
                                            <p className="text-xs text-caption">{new Date(job.created_at).toLocaleString()}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-md text-xs font-medium ${getStatusColor(job.status)}`}>
                                            {job.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <p className="text-caption">Items Crawled</p>
                                            <p className="font-semibold text-copy">{job.items_crawled}</p>
                                        </div>
                                        <div>
                                            <p className="text-caption">New Items</p>
                                            <p className="font-semibold text-copy">{job.items_new}</p>
                                        </div>
                                        <div>
                                            <p className="text-caption">Duration</p>
                                            <p className="font-semibold text-copy">
                                                {job.started_at && job.completed_at
                                                    ? `${Math.round((new Date(job.completed_at).getTime() - new Date(job.started_at).getTime()) / 1000)}s`
                                                    : 'In progress...'}
                                            </p>
                                        </div>
                                    </div>
                                    {job.error_message && (
                                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                                            <p className="text-xs text-red-800">{job.error_message}</p>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}
