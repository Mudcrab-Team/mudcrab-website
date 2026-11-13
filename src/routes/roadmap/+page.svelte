<script lang="ts">
	import ExternalLink from '@lucide/svelte/icons/external-link';
	import GitPullRequest from '@lucide/svelte/icons/git-pull-request';
	import CircleDot from '@lucide/svelte/icons/circle-dot';
	import Search from '@lucide/svelte/icons/search';
	import Button from '../../components/Button.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let searchQuery = $state('');
	let selectedType = $state<'all' | 'Issue' | 'PullRequest'>('all');

	const filteredColumns = $derived(
		data.columns.map((col) => {
			const filteredCards = col.cards.filter((card) => {
				const matchesSearch =
					searchQuery.trim() === '' ||
					card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
					card.number.toString().includes(searchQuery.trim());

				const matchesType = selectedType === 'all' || card.type === selectedType;

				return matchesSearch && matchesType;
			});

			return {
				...col,
				cards: filteredCards
			};
		})
	);

	function columnAccent(id: string): string {
		switch (id) {
			case 'in-progress':
				return 'var(--color-accent)';
			case 'in-review':
				return 'var(--color-steel-bright)';
			case 'merge-ready':
			case 'done':
				return 'var(--color-success)';
			default:
				return 'var(--color-text-subtle)';
		}
	}

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
	<title>Roadmap and Project Board · Mudcrab</title>
	<meta
		name="description"
		content="Live development roadmap and task board synchronized from the Mudcrab GitHub Project."
	/>
</svelte:head>

{#snippet externalLinkIcon()}
	<ExternalLink size={15} aria-hidden="true" />
{/snippet}

<div class="roadmap-page">
	<header class="roadmap-header">
		<div class="header-content">
			<div class="header-title">
				<h1>Development roadmap</h1>
				<p>
					Track ongoing engine subsystems, asset converters, and open pull requests synchronized
					from the Mudcrab GitHub Project.
				</p>
			</div>
			<div class="header-actions">
				<Button
					variant="primary"
					href={data.projectUrl}
					target="_blank"
					trailing={externalLinkIcon}
				>
					Open GitHub board
				</Button>
			</div>
		</div>

		<div class="stats-card">
			<div class="stats-grid">
				<div class="stat-item">
					<span class="stat-label">Total tracked</span>
					<span class="stat-value">{data.stats.total}</span>
				</div>
				<div class="stat-item">
					<span class="stat-label">In progress</span>
					<span class="stat-value stat-progress">{data.stats.inProgress}</span>
				</div>
				<div class="stat-item">
					<span class="stat-label">Completed</span>
					<span class="stat-value stat-done">{data.stats.done}</span>
				</div>
				<div class="stat-item">
					<span class="stat-label">Completion</span>
					<span class="stat-value">{data.stats.completionRate}%</span>
				</div>
			</div>

			<div class="progress-bar-container" aria-label="Project completion progress">
				<div class="progress-bar-fill" style="width: {data.stats.completionRate}%"></div>
			</div>
		</div>

		<div class="toolbar">
			<div class="search-box">
				<Search class="search-icon" size={16} aria-hidden="true" />
				<input
					type="search"
					placeholder="Filter by title or #number..."
					bind:value={searchQuery}
					class="search-input"
					aria-label="Filter tasks"
				/>
			</div>

			<div class="filter-tabs" role="tablist" aria-label="Filter by item type">
				<button
					type="button"
					class="filter-tab"
					class:active={selectedType === 'all'}
					onclick={() => (selectedType = 'all')}
					aria-selected={selectedType === 'all'}
					role="tab"
				>
					All items
				</button>
				<button
					type="button"
					class="filter-tab"
					class:active={selectedType === 'Issue'}
					onclick={() => (selectedType = 'Issue')}
					aria-selected={selectedType === 'Issue'}
					role="tab"
				>
					Issues
				</button>
				<button
					type="button"
					class="filter-tab"
					class:active={selectedType === 'PullRequest'}
					onclick={() => (selectedType = 'PullRequest')}
					aria-selected={selectedType === 'PullRequest'}
					role="tab"
				>
					Pull requests
				</button>
			</div>
		</div>
	</header>

	<section class="kanban-container" aria-label="Roadmap Kanban Board">
		<div class="kanban-track">
			{#each filteredColumns as column (column.id)}
				<div class="kanban-column" data-status={column.id}>
					<div class="column-header">
						<div class="column-title-group">
							<span
								class="column-dot"
								style="background-color: {columnAccent(column.id)};"
								aria-hidden="true"
							></span>
							<h3>{column.name}</h3>
						</div>
						<span class="column-count">{column.cards.length}</span>
					</div>

					<div class="column-cards">
						{#if column.cards.length === 0}
							<div class="column-empty">
								<p>No items match the current filter.</p>
							</div>
						{:else}
							{#each column.cards as card (card.id)}
								<a href={card.url} target="_blank" rel="noopener noreferrer" class="kanban-card">
									<div class="card-top">
										<span class="card-meta">
											{#if card.type === 'PullRequest'}
												<GitPullRequest size={14} class="icon-pr" aria-label="Pull request" />
												<span>PR #{card.number}</span>
											{:else}
												<CircleDot size={14} class="icon-issue" aria-label="Issue" />
												<span>#{card.number}</span>
											{/if}
										</span>
										<ExternalLink size={13} class="card-link-icon" aria-hidden="true" />
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
		gap: 2.25rem;
		padding-top: 2.5rem;
	}

	.roadmap-header {
		display: flex;
		flex-direction: column;
		gap: 1.75rem;
	}

	.header-content {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 2rem;
		flex-wrap: wrap;
	}

	.header-title {
		max-width: 44rem;
	}

	.header-title h1 {
		font-size: clamp(2.1rem, 4vw, 3.25rem);
		line-height: 1.04;
		margin-bottom: 0.85rem;
	}

	.header-actions {
		flex: 0 0 auto;
	}

	.stats-card {
		display: flex;
		flex-direction: column;
		gap: 1.15rem;
		padding: 1.5rem 1.75rem;
		background-color: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		box-shadow: var(--shadow-sm);
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(110px, 1fr));
		gap: 1.5rem;
	}

	.stat-item {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.stat-label {
		font-size: var(--text-sm);
		color: var(--color-text-subtle);
		font-weight: 500;
	}

	.stat-value {
		font-family: var(--font-display);
		font-size: var(--text-heading);
		font-weight: 600;
		color: var(--color-text);
		font-variant-numeric: tabular-nums;
	}

	.stat-progress {
		color: var(--color-accent);
	}

	.stat-done {
		color: var(--color-success);
	}

	.progress-bar-container {
		height: 6px;
		width: 100%;
		background-color: var(--color-surface-inset);
		border-radius: var(--radius-pill);
		overflow: hidden;
	}

	.progress-bar-fill {
		height: 100%;
		background: linear-gradient(90deg, var(--color-steel) 0%, var(--color-accent) 100%);
		border-radius: var(--radius-pill);
		transition: width var(--duration-slow) var(--ease-standard);
	}

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
		min-width: 240px;
		max-width: 28rem;
	}

	:global(.search-icon) {
		position: absolute;
		left: 0.875rem;
		top: 50%;
		transform: translateY(-50%);
		color: var(--color-text-subtle);
		pointer-events: none;
	}

	.search-input {
		width: 100%;
		padding: 0.6rem 0.875rem 0.6rem 2.5rem;
		font-size: var(--text-sm);
		background-color: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		color: var(--color-text);
		outline: none;
		transition:
			border-color var(--duration-fast) var(--ease-standard),
			box-shadow var(--duration-fast) var(--ease-standard);
	}

	.search-input::placeholder {
		color: var(--color-text-subtle);
	}

	.search-input:focus {
		border-color: var(--color-border-focus);
		box-shadow: var(--focus-ring);
	}

	.filter-tabs {
		display: inline-flex;
		padding: 0.25rem;
		border: 1px solid var(--color-border-strong);
		border-radius: var(--radius-md);
		background: var(--color-surface);
	}

	.filter-tab {
		padding: 0.45rem 0.9rem;
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		background: transparent;
		border: 0;
		border-radius: var(--radius-sm);
		cursor: pointer;
		font-weight: 600;
		transition:
			background var(--duration-fast) var(--ease-standard),
			color var(--duration-fast) var(--ease-standard);
	}

	.filter-tab:hover {
		color: var(--color-text);
	}

	.filter-tab.active {
		background-color: var(--color-accent);
		color: var(--color-accent-ink);
	}

	.kanban-container {
		width: 100%;
		overflow-x: auto;
		padding-bottom: 1rem;
		-webkit-overflow-scrolling: touch;
	}

	.kanban-track {
		display: grid;
		grid-template-columns: repeat(5, minmax(215px, 1fr));
		gap: 1rem;
		min-width: 1120px;
	}

	.kanban-column {
		display: flex;
		flex-direction: column;
		gap: 0.9rem;
		background-color: var(--color-background-soft);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		padding: 1rem;
		min-height: 460px;
	}

	.column-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 0.75rem;
		border-bottom: 1px solid var(--color-border);
	}

	.column-title-group {
		display: flex;
		align-items: center;
		gap: 0.6rem;
	}

	.column-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
	}

	.column-header h3 {
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-text);
	}

	.column-count {
		color: var(--color-text-subtle);
		font-size: var(--text-sm);
		font-weight: 600;
		font-variant-numeric: tabular-nums;
	}

	.column-cards {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		overflow-y: auto;
		max-height: 680px;
		padding-right: 0.2rem;
	}

	.column-empty {
		padding: 2rem 0.75rem;
		text-align: center;
	}

	.column-empty p {
		color: var(--color-text-subtle);
		font-size: var(--text-sm);
	}

	.kanban-card {
		display: flex;
		flex-direction: column;
		gap: 0.55rem;
		padding: 0.9rem 1rem;
		background-color: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		text-decoration: none;
		color: inherit;
		transition:
			transform var(--duration-fast) var(--ease-standard),
			border-color var(--duration-fast) var(--ease-standard),
			background-color var(--duration-fast) var(--ease-standard);
	}

	.kanban-card:hover {
		transform: translateY(-2px);
		border-color: var(--color-steel-bright);
		background-color: var(--color-surface-raised);
	}

	.card-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: var(--text-sm);
		color: var(--color-text-subtle);
	}

	.card-meta {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		font-weight: 500;
	}

	:global(.icon-pr) {
		color: var(--color-steel-bright);
	}

	:global(.icon-issue) {
		color: var(--color-success);
	}

	:global(.card-link-icon) {
		opacity: 0;
		transition: opacity var(--duration-fast) var(--ease-standard);
	}

	.kanban-card:hover :global(.card-link-icon) {
		opacity: 0.85;
	}

	.card-title {
		margin: 0;
		font-size: var(--text-sm);
		line-height: 1.45;
		color: var(--color-text);
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
		border-top: 1px solid color-mix(in srgb, var(--color-border) 65%, transparent);
		font-size: var(--text-sm);
		color: var(--color-text-subtle);
	}

	.card-repo {
		color: var(--color-steel-bright);
	}

	@media (max-width: 720px) {
		.stats-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>
