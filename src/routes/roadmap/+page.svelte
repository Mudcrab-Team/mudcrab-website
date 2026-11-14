<script lang="ts">
	import CircleDot from '@lucide/svelte/icons/circle-dot';
	import ExternalLink from '@lucide/svelte/icons/external-link';
	import GitPullRequest from '@lucide/svelte/icons/git-pull-request';
	import Search from '@lucide/svelte/icons/search';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let searchQuery = $state('');
	let selectedType = $state<'all' | 'Issue' | 'PullRequest'>('all');

	const columnAccents: Record<string, string> = {
		todo: '#68a7cc',
		'in-progress': '#d38c26',
		'in-review': '#4a7d9c',
		'merge-ready': '#52a87d',
		done: '#34557a'
	};

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
	<title>Development Roadmap · Mudcrab Engine</title>
	<meta
		name="description"
		content="Live development roadmap and task board synchronized from the Mudcrab GitHub Project."
	/>
</svelte:head>

<main class="space-y-8 py-12 sm:py-16">
	<header class="space-y-6">
		<div class="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
			<div class="max-w-2xl space-y-3">
				<h1 class="font-display text-[clamp(2.25rem,4.5vw,3.5rem)] font-bold text-base-content">
					Development roadmap
				</h1>
				<p class="prose-measure text-base-content/80">
					Track ongoing engine subsystems, asset converters, and pull requests synchronized with the
					GitHub Project board.
				</p>
			</div>

			<a
				href={data.projectUrl}
				target="_blank"
				rel="noreferrer"
				class="btn w-fit gap-2 text-sm font-semibold btn-primary"
			>
				<span>Open GitHub board</span>
				<ExternalLink size={15} aria-hidden="true" />
			</a>
		</div>

		<div class="rounded-box border border-base-300 bg-base-200/60 p-5 sm:p-6">
			<div class="stats w-full stats-vertical bg-transparent sm:stats-horizontal">
				<div class="stat px-2 py-2 sm:px-4">
					<div class="stat-title text-sm text-base-content/70">Total tracked</div>
					<div class="stat-value font-bold text-[var(--text-section)] text-base-content">
						{data.stats.total}
					</div>
				</div>
				<div class="stat px-2 py-2 sm:px-4">
					<div class="stat-title text-sm text-base-content/70">In progress</div>
					<div class="stat-value font-bold text-[var(--text-section)] text-accent">
						{data.stats.inProgress}
					</div>
				</div>
				<div class="stat px-2 py-2 sm:px-4">
					<div class="stat-title text-sm text-base-content/70">Completed</div>
					<div class="stat-value font-bold text-[var(--text-section)] text-success">
						{data.stats.done}
					</div>
				</div>
				<div class="stat px-2 py-2 sm:px-4">
					<div class="stat-title text-sm text-base-content/70">Completion</div>
					<div class="stat-value font-bold text-[var(--text-section)] text-accent">
						{data.stats.completionRate}%
					</div>
				</div>
			</div>
			<progress
				class="progress mt-4 h-2 w-full bg-base-300 progress-accent"
				value={data.stats.completionRate}
				max="100"
				aria-label="Project completion percentage"
			></progress>
		</div>

		<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<label class="input-bordered input flex w-full max-w-md items-center gap-2 bg-base-200">
				<Search size={16} class="text-base-content/60" aria-hidden="true" />
				<input
					type="search"
					placeholder="Search tasks, issues, or PR number..."
					bind:value={searchQuery}
					class="grow text-sm"
					aria-label="Filter roadmap tasks"
				/>
			</label>

			<div role="group" aria-label="Filter by item type" class="tabs-box tabs bg-base-200 p-1">
				<button
					type="button"
					aria-pressed={selectedType === 'all'}
					class="tab text-sm font-medium {selectedType === 'all'
						? 'tab-active bg-secondary text-secondary-content'
						: ''}"
					onclick={() => (selectedType = 'all')}
				>
					All tasks
				</button>
				<button
					type="button"
					aria-pressed={selectedType === 'Issue'}
					class="tab gap-1.5 text-sm font-medium {selectedType === 'Issue'
						? 'tab-active bg-secondary text-secondary-content'
						: ''}"
					onclick={() => (selectedType = 'Issue')}
				>
					<CircleDot size={14} aria-hidden="true" />
					<span>Issues</span>
				</button>
				<button
					type="button"
					aria-pressed={selectedType === 'PullRequest'}
					class="tab gap-1.5 text-sm font-medium {selectedType === 'PullRequest'
						? 'tab-active bg-secondary text-secondary-content'
						: ''}"
					onclick={() => (selectedType = 'PullRequest')}
				>
					<GitPullRequest size={14} aria-hidden="true" />
					<span>Pull requests</span>
				</button>
			</div>
		</div>
	</header>

	<section class="w-full overflow-x-auto pb-4" aria-label="Roadmap Kanban Board">
		<div class="grid min-w-[1260px] grid-cols-5 gap-4">
			{#each filteredColumns as column (column.id)}
				{@const accent = columnAccents[column.id] ?? column.color}
				<div
					class="flex min-h-[500px] flex-col gap-3 rounded-box border border-base-300 bg-base-200/50 p-4"
				>
					<div class="flex items-center justify-between border-b border-base-300 pb-3">
						<div class="flex items-center gap-2.5">
							<span
								class="h-2.5 w-2.5 rounded-full"
								style="background-color: {accent};"
								aria-hidden="true"
							></span>
							<h2 class="font-sans text-sm font-semibold text-base-content">{column.name}</h2>
						</div>
						<span class="text-sm font-semibold text-base-content/70">{column.cards.length}</span>
					</div>

					<div class="flex max-h-[680px] flex-col gap-2.5 overflow-y-auto pr-1">
						{#if column.cards.length === 0}
							<p class="py-10 text-center text-sm text-base-content/60">No items in this stage</p>
						{:else}
							{#each column.cards as card (card.id)}
								<a
									href={card.url}
									target="_blank"
									rel="noopener noreferrer"
									class="group flex flex-col gap-2.5 rounded-box border border-base-300 bg-base-100/90 p-3.5 no-underline transition-[transform,border-color] duration-150 ease-out hover:-translate-y-0.5 hover:border-secondary"
								>
									<div class="flex items-center justify-between text-sm text-base-content/70">
										<span class="inline-flex items-center gap-1.5 font-medium">
											{#if card.type === 'PullRequest'}
												<GitPullRequest size={14} class="text-accent" aria-label="Pull Request" />
												<span>PR #{card.number}</span>
											{:else}
												<CircleDot size={14} class="text-success" aria-label="Issue" />
												<span>#{card.number}</span>
											{/if}
										</span>
										<ExternalLink
											size={13}
											class="opacity-0 transition-opacity duration-150 group-hover:opacity-80"
											aria-hidden="true"
										/>
									</div>

									<p class="line-clamp-3 text-sm leading-snug font-medium text-base-content">
										{card.title}
									</p>

									<div
										class="flex items-center justify-between border-t border-base-300/70 pt-2 text-sm text-base-content/65"
									>
										<span class="font-mono">{card.repository.split('/')[1] || 'mudcrab'}</span>
										<span>{formatRelativeTime(card.updatedAt)}</span>
									</div>
								</a>
							{/each}
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</section>
</main>
