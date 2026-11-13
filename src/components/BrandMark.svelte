<script lang="ts">
	let {
		name = 'Mudcrab',
		subtitle,
		compact = false,
		href = '/',
		class: className = ''
	}: {
		name?: string;
		subtitle?: string;
		compact?: boolean;
		href?: string;
		class?: string;
	} = $props();
</script>

<a class="brand-mark {className}" class:compact {href} aria-label={compact ? name : undefined}>
	<span class="brand-emblem" aria-hidden="true">
		<img src="/brand/mudcrab-mark.png" alt="" width="34" height="23" />
	</span>
	{#if !compact}
		<span class="brand-copy">
			<strong>{name}</strong>
			{#if subtitle}<span>{subtitle}</span>{/if}
		</span>
	{/if}
</a>

<style>
	.brand-mark {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		width: fit-content;
		color: var(--color-text);
		text-decoration: none;
	}

	.brand-mark:focus-visible {
		outline: 2px solid var(--color-border-focus);
		outline-offset: 4px;
		border-radius: var(--radius-sm);
	}

	.brand-emblem {
		display: grid;
		place-items: center;
		width: 2.65rem;
		height: 2.35rem;
		flex: 0 0 auto;
		padding: 0.28rem;
		border: 1px solid color-mix(in srgb, var(--color-steel) 55%, transparent);
		border-radius: var(--radius-md);
		background: var(--color-emblem-bg);
		box-shadow: 0 2px 10px rgb(0 0 0 / 0.25);
		transition:
			border-color var(--duration-normal) var(--ease-standard),
			transform var(--duration-normal) var(--ease-standard);
	}

	.brand-emblem img {
		display: block;
		width: 100%;
		height: auto;
		object-fit: contain;
	}

	.brand-mark:hover .brand-emblem {
		border-color: var(--color-accent);
		transform: translateY(-1px);
	}

	.brand-copy {
		display: grid;
		gap: 0.1rem;
		line-height: 1.1;
	}

	.brand-copy strong {
		font-family: var(--font-display);
		font-size: 1.25rem;
		font-weight: 700;
		letter-spacing: 0.03em;
		color: var(--color-text);
	}

	.brand-copy span {
		color: var(--color-text-subtle);
		font-size: var(--text-sm);
		font-weight: 400;
	}

	.brand-mark.compact .brand-emblem {
		width: 2.75rem;
		height: 2.75rem;
	}
</style>
