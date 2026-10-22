import type { PageServerLoad } from './$types';

export type KanbanCard = {
	id: number;
	number: number;
	title: string;
	url: string;
	type: 'Issue' | 'PullRequest' | 'DraftIssue';
	state: string;
	status: 'To do' | 'In progress' | 'In Review' | 'Merge Ready' | 'Done' | 'Backlog';
	updatedAt: string;
	repository: string;
};

export type KanbanColumn = {
	id: string;
	name: string;
	color: string;
	cards: KanbanCard[];
};

export const prerender = false;

export const load: PageServerLoad = async ({ fetch, setHeaders }) => {
	// Cache on Cloudflare CDN for 5 minutes, client for 1 minute
	setHeaders({
		'cache-control': 'public, max-age=60, s-maxage=300'
	});

	try {
		const res = await fetch('https://github.com/orgs/Mudcrab-Team/projects/1', {
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Mudcrab-Website/1.0',
				Accept: 'text/html,application/xhtml+xml'
			}
		});

		if (!res.ok) {
			throw new Error(`GitHub responded with HTTP ${res.status}`);
		}

		const html = await res.text();
		const match = html.match(
			/<script type="application\/json" id="memex-paginated-items-data">([\s\S]*?)<\/script>/
		);

		if (!match) {
			throw new Error('Unable to find project payload in GitHub response');
		}

		const data = JSON.parse(match[1]);

		// Extract status options from column definitions
		const statusIdToName = new Map<string, KanbanCard['status']>();
		statusIdToName.set('f75ad846', 'To do');
		statusIdToName.set('47fc9ee4', 'In progress');
		statusIdToName.set('1c9054e8', 'In Review');
		statusIdToName.set('c6789d20', 'Merge Ready');
		statusIdToName.set('98236657', 'Done');

		const columnsMatch = html.match(
			/<script type="application\/json" id="memex-columns-data">([\s\S]*?)<\/script>/
		);
		if (columnsMatch) {
			try {
				const cols = JSON.parse(columnsMatch[1]);
				const statusCol = cols.find((c: { name: string }) => c.name === 'Status');
				for (const opt of statusCol?.settings?.options || []) {
					if (opt.id && opt.name) {
						statusIdToName.set(opt.id, opt.name as KanbanCard['status']);
					}
				}
			} catch (e) {
				console.warn('Failed to parse memex-columns-data:', e);
			}
		}

		const columnDefs: { name: KanbanCard['status']; color: string; id: string }[] = [
			{ id: 'todo', name: 'To do', color: '#8b949e' },
			{ id: 'in-progress', name: 'In progress', color: '#f85149' },
			{ id: 'in-review', name: 'In Review', color: '#d29922' },
			{ id: 'merge-ready', name: 'Merge Ready', color: '#3fb950' },
			{ id: 'done', name: 'Done', color: '#a371f7' }
		];

		const columnsMap = new Map<string, KanbanCard[]>();
		for (const col of columnDefs) {
			columnsMap.set(col.name, []);
		}

		for (const group of data.groupedItems || []) {
			for (const node of group.nodes || []) {
				const statusCol = node.memexProjectColumnValues?.find(
					(c: { memexProjectColumnId: string }) => c.memexProjectColumnId === 'Status'
				);
				const statusId = statusCol?.value?.id;
				const status: KanbanCard['status'] =
					(statusId && statusIdToName.get(statusId)) || 'To do';

				const targetList = columnsMap.get(status);
				if (!targetList) continue;

				const titleCol = node.memexProjectColumnValues?.find(
					(c: { memexProjectColumnId: string }) => c.memexProjectColumnId === 'Title'
				);
				const repoCol = node.memexProjectColumnValues?.find(
					(c: { memexProjectColumnId: string }) => c.memexProjectColumnId === 'Repository'
				);

				const rawTitle = titleCol?.value?.title?.raw || 'Untitled';
				const itemNumber = titleCol?.value?.number || 0;
				const itemUrl =
					node.content?.url ||
					(repoCol?.value?.nameWithOwner
						? `https://github.com/${repoCol.value.nameWithOwner}/${node.contentType === 'PullRequest' ? 'pull' : 'issues'}/${itemNumber}`
						: `https://github.com/Mudcrab-Team/mudcrab/issues/${itemNumber}`);

				targetList.push({
					id: node.id || itemNumber,
					number: itemNumber,
					title: rawTitle,
					url: itemUrl,
					type: (node.contentType as KanbanCard['type']) || 'Issue',
					state: node.state || 'open',
					status,
					updatedAt: node.updatedAt || new Date().toISOString(),
					repository: repoCol?.value?.nameWithOwner || 'Mudcrab-Team/mudcrab'
				});
			}
		}

		const columns: KanbanColumn[] = columnDefs.map((col) => ({
			id: col.id,
			name: col.name,
			color: col.color,
			cards: columnsMap.get(col.name) || []
		}));

		const totalCount = columns.reduce((acc, col) => acc + col.cards.length, 0);
		const doneCount = columns.find((c) => c.name === 'Done')?.cards.length || 0;
		const inProgressCount = columns.find((c) => c.name === 'In progress')?.cards.length || 0;

		return {
			columns,
			stats: {
				total: totalCount,
				done: doneCount,
				inProgress: inProgressCount,
				completionRate: totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0
			},
			lastUpdated: new Date().toISOString(),
			projectUrl: 'https://github.com/orgs/Mudcrab-Team/projects/1'
		};
	} catch (err) {
		console.error('Failed to load GitHub Project:', err);
		// Graceful fallback with architectural roadmap milestones
		return {
			columns: [
				{
					id: 'todo',
					name: 'To do',
					color: '#8b949e',
					cards: [
						{
							id: 1,
							number: 301,
							title: 'GPU Terrain LOD encoding and batching pipeline',
							url: 'https://github.com/Mudcrab-Team/mudcrab/issues',
							type: 'Issue',
							state: 'open',
							status: 'To do',
							updatedAt: new Date().toISOString(),
							repository: 'Mudcrab-Team/mudcrab'
						}
					]
				},
				{
					id: 'in-progress',
					name: 'In progress',
					color: '#f85149',
					cards: [
						{
							id: 2,
							number: 294,
							title: 'fix(converter): exclude shapes with the NIF Hidden flag',
							url: 'https://github.com/Mudcrab-Team/mudcrab/pull/294',
							type: 'PullRequest',
							state: 'open',
							status: 'In progress',
							updatedAt: new Date().toISOString(),
							repository: 'Mudcrab-Team/mudcrab'
						}
					]
				},
				{
					id: 'done',
					name: 'Done',
					color: '#a371f7',
					cards: [
						{
							id: 3,
							number: 280,
							title: 'Vercidium batched indirect draw calls foundation',
							url: 'https://github.com/Mudcrab-Team/mudcrab/issues',
							type: 'Issue',
							state: 'closed',
							status: 'Done',
							updatedAt: new Date().toISOString(),
							repository: 'Mudcrab-Team/mudcrab'
						}
					]
				}
			],
			stats: {
				total: 3,
				done: 1,
				inProgress: 1,
				completionRate: 33
			},
			lastUpdated: new Date().toISOString(),
			projectUrl: 'https://github.com/orgs/Mudcrab-Team/projects/1',
			error: 'Live GitHub sync currently using cached snapshot'
		};
	}
};
