<script lang="ts">
	import Badge from '../../components/Badge.svelte';
	import Button from '../../components/Button.svelte';
	import SectionHeader from '../../components/SectionHeader.svelte';
	import ExternalLink from '@lucide/svelte/icons/external-link';
	import GitPullRequest from '@lucide/svelte/icons/git-pull-request';
	import CircleDot from '@lucide/svelte/icons/circle-dot';
	import Search from '@lucide/svelte/icons/search';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let searchQuery = $state('');
	let selectedType = $state<'all' | 'Issue' | 'PullRequest'>('all');

	// Filter columns and cards dynamically
	const filteredColumns = $derived(
		data.columns.map((col) => {
			const filteredCards = col.cards.filter((card) => {
				const matchesSearch =
					searchQuery.trim() === '' ||
					card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
					card.number.toString().includes(searchQuery.trim());

				const matchesType =
					selectedType === 'all' || card.type === selectedType;

				return matchesSearch && matchesType;
			});

			return {
				...col,
				cards: filteredCards
			};
		})
	);

	function formatRelativeTime(dateString: string): string {
		try {
			const date = new Date(dateString);
			const now = new Date();
			const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

			if (diffSeconds < 60) return 'just now';
			const diffMinutes = Math.floor(diffSeconds / 60);
			if (diffMinutes < 60) return `${diffMinutes}m ago`;
			const diffHours = Math.floor(diffMinutes / 60);
			if (diffHours < 24) return `${diffHours}h ago`;
			const diffDays = Math.floor(diffHours / 24);
			if (diffDays < 30) return `${diffDays}d ago`;
			return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
		} catch {
			return 'recently';
		}
	}
</script>

<svelte:head>
	<title>Roadmap & Project Board · Mudcrab Engine</title>
	<meta
		name="description"
		content="Live development roadmap and task board synchronized directly from the Mudcrab GitHub Project."
	/>
</svelte:head>

{#snippet externalLinkIcon()}
	<ExternalLink size={15} aria-hidden="true" />
{/snippet}

<div class="roadmap-page">
	<header class="roadmap-header">
		<div class="header-content">
			<SectionHeader
				eyebrow="Live Project Board"
				title="Development Roadmap"
				description="Track ongoing engine systems, asset converters, and pull requests in real time. Synchronized with the official GitHub Project."
			/>
			<div class="header-actions">
				<Button
					variant="primary"
					href={data.projectUrl}
					target="_blank"
					trailing={externalLinkIcon}
				>
					View on GitHub
				</Button>
			</div>
		</div>

		<!-- Progress and Stats Summary -->
		<div class="stats-card">
			<div class="stats-grid">
				<div class="stat-item">
					<span class="stat-label">Total Tracked</span>
					<span class="stat-value">{data.stats.total}</span>
				</div>
				<div class="stat-item">
					<span class="stat-label">In Progress</span>
					<span class="stat-value stat-progress">{data.stats.inProgress}</span>
				</div>
				<div class="stat-item">
					<span class="stat-label">Completed</span>
					<span class="stat-value stat-done">{data.stats.done}</span>
				</div>
				<div class="stat-item">
					<span class="stat-label">Progress</span>
					<span class="stat-value">{data.stats.completionRate}%</span>
				</div>
			</div>

			<div class="progress-bar-container" aria-label="Project completion progress">
				<div
					class="progress-bar-fill"
					style="width: {data.stats.completionRate}%"
				></div>
			</div>
		</div>

		<!-- Controls & Search Toolbar -->
		<div class="toolbar">
			<div class="search-box">
				<Search class="search-icon" size={16} aria-hidden="true" />
				<input
					type="search"
					placeholder="Search tasks, issues or PR #..."
					bind:value={searchQuery}
					class="search-input"
					aria-label="Filter tasks"
				/>
			</div>

			<div class="filter-pills" role="radiogroup" aria-label="Filter by type">
				<button
					type="button"
					class="filter-pill"
					class:active={selectedType === 'all'}
					onclick={() => (selectedType = 'all')}
					aria-checked={selectedType === 'all'}
					role="radio"
				>
					All Tasks
				</button>
				<button
					type="button"
					class="filter-pill"
					class:active={selectedType === 'Issue'}
					onclick={() => (selectedType = 'Issue')}
					aria-checked={selectedType === 'Issue'}
					role="radio"
				>
					<CircleDot size={13} aria-hidden="true" />
					Issues
				</button>
				<button
					type="button"
					class="filter-pill"
					class:active={selectedType === 'PullRequest'}
					onclick={() => (selectedType = 'PullRequest')}
					aria-checked={selectedType === 'PullRequest'}
					role="radio"
				>
					<GitPullRequest size={13} aria-hidden="true" />
					Pull Requests
				</button>
			</div>
		</div>
	</header>

	<!-- Interactive Kanban Board -->
	<section class="kanban-container" aria-label="Roadmap Kanban Board">
		<div class="kanban-track">
			{#each filteredColumns as column (column.id)}
				<div class="kanban-column" data-status={column.id}>
					<div class="column-header">
						<div class="column-title-group">
							<span
								class="column-dot"
								style="background-color: {column.color};"
								aria-hidden="true"
							></span>
							<h3>{column.name}</h3>
						</div>
						<Badge tone="neutral" size="sm">{column.cards.length}</Badge>
					</div>

					<div class="column-cards">
						{#if column.cards.length === 0}
							<div class="column-empty">
								<p>No items in this stage</p>
							</div>
						{:else}
							{#each column.cards as card (card.id)}
								<a
									href={card.url}
									target="_blank"
									rel="noopener noreferrer"
									class="kanban-card"
								>
									<div class="card-top">
										<span class="card-meta">
											{#if card.type === 'PullRequest'}
												<GitPullRequest size={13} class="icon-pr" aria-label="Pull Request" />
												<span>PR #{card.number}</span>
											{:else}
												<CircleDot size={13} class="icon-issue" aria-label="Issue" />
												<span>#{card.number}</span>
											{/if}
										</span>
										<ExternalLink size={12} class="card-link-icon" aria-hidden="true" />
									</div>

									<p class="card-title">{card.title}</p>

									<div class="card-footer">
										<span class="card-repo">{card.repository.split('/')[1] || 'mudcrab'}</span>
										<span class="card-time">{formatRelativeTime(card.updatedAt)}</span>
									</div>
								</a>
							{/each}
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</section>
</div>

<style>
	.roadmap-page {
		display: flex;
		flex-direction: column;
		gap: 2.5rem;
		padding: 2.5rem 0 5rem;
	}

	.roadmap-header {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.header-content {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 2rem;
		flex-wrap: wrap;
	}

	.header-actions {
		display: flex;
		align-items: center;
		margin-top: 1rem;
	}

	/* Stats Card */
	.stats-card {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		padding: 1.5rem 1.75rem;
		background-color: var(--surface-1);
		border: 1px solid var(--border-subtle);
		border-radius: 8px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
		gap: 1.5rem;
	}

	.stat-item {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.stat-label {
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--text-muted);
		font-weight: 500;
	}

	.stat-value {
		font-family: var(--font-display);
		font-size: 1.75rem;
		font-weight: 600;
		color: var(--text-base);
	}

	.stat-progress {
		color: #f87171;
	}

	.stat-done {
		color: #a78bfa;
	}

	.progress-bar-container {
		height: 6px;
		width: 100%;
		background-color: var(--surface-2);
		border-radius: 9999px;
		overflow: hidden;
	}

	.progress-bar-fill {
		height: 100%;
		background: linear-gradient(90deg, #38bdf8 0%, #a78bfa 100%);
		border-radius: 9999px;
		transition: width 0.4s ease-out;
	}

	/* Toolbar & Search */
	.toolbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.search-box {
		position: relative;
		flex: 1;
		min-width: 260px;
		max-width: 450px;
	}

	:global(.search-icon) {
		position: absolute;
		left: 0.875rem;
		top: 50%;
		transform: translateY(-50%);
		color: var(--text-muted);
		pointer-events: none;
	}

	.search-input {
		width: 100%;
		padding: 0.625rem 0.875rem 0.625rem 2.5rem;
		font-size: 0.875rem;
		background-color: var(--surface-1);
		border: 1px solid var(--border-subtle);
		border-radius: 6px;
		color: var(--text-base);
		outline: none;
		transition: border-color 0.15s ease;
	}

	.search-input:focus {
		border-color: var(--accent);
		box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.15);
	}

	.filter-pills {
		display: flex;
		gap: 0.5rem;
		background-color: var(--surface-1);
		padding: 0.25rem;
		border: 1px solid var(--border-subtle);
		border-radius: 6px;
	}

	.filter-pill {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.375rem 0.75rem;
		font-size: 0.8125rem;
		color: var(--text-muted);
		background: transparent;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-weight: 500;
		transition: all 0.15s ease;
	}

	.filter-pill:hover {
		color: var(--text-base);
	}

	.filter-pill.active {
		background-color: var(--surface-2);
		color: var(--text-base);
	}

	/* Kanban Board Layout */
	.kanban-container {
		width: 100%;
		overflow-x: auto;
		padding-bottom: 1.5rem;
		-webkit-overflow-scrolling: touch;
	}

	.kanban-track {
		display: grid;
		grid-template-columns: repeat(5, minmax(280px, 1fr));
		gap: 1.25rem;
		min-width: 1300px;
	}

	.kanban-column {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		background-color: rgba(18, 22, 28, 0.6);
		border: 1px solid var(--border-subtle);
		border-radius: 8px;
		padding: 1.125rem 1rem;
		min-height: 520px;
	}

	.column-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 0.75rem;
		border-bottom: 1px solid var(--border-subtle);
	}

	.column-title-group {
		display: flex;
		align-items: center;
		gap: 0.625rem;
	}

	.column-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
	}

	.column-header h3 {
		font-size: 0.875rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--text-base);
	}

	.column-cards {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		overflow-y: auto;
		max-height: 720px;
		padding-right: 0.25rem;
	}

	.column-empty {
		padding: 2.5rem 1rem;
		text-align: center;
		color: var(--text-muted);
		font-size: 0.8125rem;
		font-style: italic;
	}

	/* Kanban Card */
	.kanban-card {
		display: flex;
		flex-direction: column;
		gap: 0.625rem;
		padding: 0.875rem 1rem;
		background-color: var(--surface-1);
		border: 1px solid var(--border-subtle);
		border-radius: 6px;
		text-decoration: none;
		color: inherit;
		transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
	}

	.kanban-card:hover {
		transform: translateY(-2px);
		border-color: var(--accent);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
	}

	.card-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 0.75rem;
		color: var(--text-muted);
	}

	.card-meta {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		font-weight: 500;
	}

	:global(.icon-pr) {
		color: #38bdf8;
	}

	:global(.icon-issue) {
		color: #4ade80;
	}

	:global(.card-link-icon) {
		opacity: 0;
		transition: opacity 0.15s ease;
	}

	.kanban-card:hover :global(.card-link-icon) {
		opacity: 0.8;
	}

	.card-title {
		font-size: 0.875rem;
		line-height: 1.45;
		color: var(--text-base);
		font-weight: 500;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.card-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 0.25rem;
		padding-top: 0.5rem;
		border-top: 1px solid rgba(255, 255, 255, 0.05);
		font-size: 0.6875rem;
		color: var(--text-muted);
	}

	.card-repo {
		background-color: var(--surface-2);
		padding: 0.125rem 0.375rem;
		border-radius: 4px;
		font-family: monospace;
	}

	@media (max-width: 900px) {
		.kanban-track {
			grid-template-columns: repeat(5, 260px);
		}
	}
</style>
