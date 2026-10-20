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
	<span class="brand-symbol" aria-hidden="true">ᛉ</span>
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
		gap: 0.8rem;
		width: fit-content;
		color: var(--color-text);
		text-decoration: none;
	}
	.brand-mark:hover .brand-symbol {
		border-color: var(--color-accent);
		color: var(--color-accent-hover);
	}
	.brand-mark:focus-visible {
		outline: none;
		box-shadow: var(--focus-ring);
	}
	.brand-symbol {
		display: grid;
		width: 2.25rem;
		height: 2.25rem;
		flex: 0 0 auto;
		place-items: center;
		border: 1px solid var(--color-border-strong);
		border-radius: 2px;
		background: color-mix(in srgb, var(--color-surface) 85%, transparent);
		color: var(--color-accent);
		font: 1.25rem var(--font-display);
		transform: rotate(45deg);
		transition:
			border-color var(--duration-normal) var(--ease-standard),
			color var(--duration-normal) var(--ease-standard),
			box-shadow var(--duration-normal) var(--ease-standard);
	}
	.brand-mark:hover .brand-symbol {
		border-color: var(--color-accent);
		color: var(--color-accent-hover);
		box-shadow: 0 0 12px color-mix(in srgb, var(--color-accent) 25%, transparent);
	}
	.brand-symbol::first-letter {
		display: block;
		transform: rotate(-45deg);
	}
	.brand-copy {
		display: grid;
		gap: 0.1rem;
		line-height: 1.15;
	}
	.brand-copy strong {
		font: 600 1.0625rem var(--font-display);
		letter-spacing: 0.04em;
	}
	.brand-copy span {
		color: var(--color-text-subtle);
		font-family: var(--font-mono);
		font-size: var(--text-xs);
		letter-spacing: 0.02em;
	}
	.brand-mark.compact .brand-symbol {
		width: 2.5rem;
		height: 2.5rem;
	}
</style>
