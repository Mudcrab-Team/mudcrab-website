<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		title,
		id,
		description,
		align = 'left',
		action
	}: {
		eyebrow?: string;
		title: string;
		id?: string;
		description?: string;
		align?: 'left' | 'center';
		action?: Snippet;
	} = $props();
</script>

<header class="section-header {align}">
	<div class="section-copy">
		<h2 {id}>{title}</h2>
		{#if description}<p class="description">{description}</p>{/if}
	</div>
	{#if action}<div class="section-action">{@render action()}</div>{/if}
</header>

<style>
	.section-header {
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: 2rem;
		margin-bottom: 2.25rem;
	}

	.section-copy {
		max-width: 44rem;
	}

	h2 {
		margin-bottom: 0.85rem;
	}

	.description {
		max-width: 65ch;
	}

	.section-action {
		flex: 0 0 auto;
	}

	.section-header.center {
		display: grid;
		justify-items: center;
		text-align: center;
	}

	.section-header.center .section-copy {
		max-width: 46rem;
	}

	@media (max-width: 600px) {
		.section-header {
			display: grid;
			align-items: start;
			gap: 1.25rem;
		}
	}
</style>
