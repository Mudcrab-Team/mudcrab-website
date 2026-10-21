<script lang="ts">
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';

	let {
		page = $bindable(1),
		totalPages,
		href,
		label = 'Pagination'
	}: {
		page?: number;
		totalPages: number;
		href?: (page: number) => string;
		label?: string;
	} = $props();

	const visiblePages = $derived(
		Array.from({ length: Math.max(0, totalPages) }, (_, index) => index + 1)
	);

	function goTo(nextPage: number) {
		if (nextPage >= 1 && nextPage <= totalPages) page = nextPage;
	}
</script>

{#if totalPages > 0}
	<nav class="pagination" aria-label={label}>
		{#if href}
			<a
				class="pagination-control"
				class:is-disabled={page <= 1}
				href={page > 1 ? href(page - 1) : undefined}
				aria-disabled={page <= 1}
				aria-label="Previous page"
				onclick={() => goTo(page - 1)}
			>
				<ChevronLeft size={16} strokeWidth={1.75} aria-hidden="true" />
				<span class="pagination-label">Previous</span>
			</a>
		{:else}
			<button
				class="pagination-control"
				type="button"
				disabled={page <= 1}
				aria-label="Previous page"
				onclick={() => goTo(page - 1)}
			>
				<ChevronLeft size={16} strokeWidth={1.75} aria-hidden="true" />
				<span class="pagination-label">Previous</span>
			</button>
		{/if}

		<div class="pagination-pages" aria-label="Pages">
			{#each visiblePages as pageNumber}
				{#if href}
					<a
						class="pagination-page"
						class:current={pageNumber === page}
						href={href(pageNumber)}
						aria-current={pageNumber === page ? 'page' : undefined}
						onclick={() => goTo(pageNumber)}>{pageNumber}</a
					>
				{:else}
					<button
						class="pagination-page"
						class:current={pageNumber === page}
						type="button"
						aria-current={pageNumber === page ? 'page' : undefined}
						onclick={() => goTo(pageNumber)}>{pageNumber}</button
					>
				{/if}
			{/each}
		</div>

		{#if href}
			<a
				class="pagination-control"
				class:is-disabled={page >= totalPages}
				href={page < totalPages ? href(page + 1) : undefined}
				aria-disabled={page >= totalPages}
				aria-label="Next page"
				onclick={() => goTo(page + 1)}
			>
				<span class="pagination-label">Next</span>
				<ChevronRight size={16} strokeWidth={1.75} aria-hidden="true" />
			</a>
		{:else}
			<button
				class="pagination-control"
				type="button"
				disabled={page >= totalPages}
				aria-label="Next page"
				onclick={() => goTo(page + 1)}
			>
				<span class="pagination-label">Next</span>
				<ChevronRight size={16} strokeWidth={1.75} aria-hidden="true" />
			</button>
		{/if}
	</nav>
{/if}

<style>
	.pagination {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		width: 100%;
	}
	.pagination-pages {
		display: flex;
		align-items: center;
		gap: 0.35rem;
	}
	.pagination-control,
	.pagination-page {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 2.25rem;
		border: 1px solid var(--color-border-strong);
		border-radius: var(--radius-sm);
		outline: none;
		background: transparent;
		color: var(--color-text-muted);
		font: 600 var(--text-xs) var(--font-body);
		text-decoration: none;
		transition:
			background var(--duration-normal) var(--ease-standard),
			border-color var(--duration-normal) var(--ease-standard),
			color var(--duration-normal) var(--ease-standard);
	}
	.pagination-control {
		gap: 0.35rem;
		padding: 0.5rem 0.7rem;
	}
	.pagination-page {
		width: 2.25rem;
		padding: 0;
	}
	.pagination-control:hover:not(:disabled):not(.is-disabled),
	.pagination-page:hover:not(.current) {
		border-color: var(--color-accent);
		background: var(--color-surface-hover);
		color: var(--color-text);
	}
	.pagination-page.current {
		border-color: var(--color-accent);
		background: var(--color-accent);
		color: var(--color-accent-ink);
	}
	.pagination-control:focus-visible,
	.pagination-page:focus-visible {
		box-shadow: var(--focus-ring);
	}
	.pagination-control:disabled,
	.pagination-control.is-disabled {
		border-color: var(--color-border);
		color: var(--color-text-disabled);
		cursor: not-allowed;
		pointer-events: none;
	}
	@media (max-width: 520px) {
		.pagination-label {
			position: absolute;
			width: 1px;
			height: 1px;
			overflow: hidden;
			clip: rect(0, 0, 0, 0);
			white-space: nowrap;
		}
		.pagination {
			gap: 0.5rem;
		}
		.pagination-pages {
			gap: 0.2rem;
		}
	}
</style>
