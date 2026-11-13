<script lang="ts">
	import type { Snippet } from 'svelte';

	type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'button';
	type Size = 'sm' | 'md' | 'lg';

	let {
		variant = 'secondary',
		size = 'md',
		type = 'button',
		href,
		target,
		disabled = false,
		loading = false,
		label,
		children,
		leading,
		trailing
	}: {
		variant?: Variant;
		size?: Size;
		type?: 'button' | 'submit' | 'reset';
		href?: string;
		target?: string;
		disabled?: boolean;
		loading?: boolean;
		label?: string;
		children?: Snippet;
		leading?: Snippet;
		trailing?: Snippet;
	} = $props();
</script>

{#snippet content()}
	{#if loading}
		<span class="spinner" aria-hidden="true"></span>
	{:else if leading}
		<span class="icon" aria-hidden="true">{@render leading()}</span>
	{/if}
	{#if children}{@render children()}{/if}
	{#if !loading && trailing}
		<span class="icon" aria-hidden="true">{@render trailing()}</span>
	{/if}
{/snippet}

{#if href}
	<a
		class="button {variant} {size}"
		class:icon-only={variant === 'button'}
		{href}
		{target}
		rel={target === '_blank' ? 'noreferrer' : undefined}
		aria-label={variant === 'button' ? label : undefined}
		aria-busy={loading}
	>
		{@render content()}
	</a>
{:else}
	<button
		class="button {variant} {size}"
		class:icon-only={variant === 'button'}
		{type}
		disabled={disabled || loading}
		aria-label={variant === 'button' ? label : undefined}
		aria-busy={loading}
	>
		{@render content()}
	</button>
{/if}

<style>
	.button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.55rem;
		min-height: 2.625rem;
		padding: 0.65rem 1.15rem;
		border: 1px solid var(--color-border-strong);
		border-radius: var(--radius-sm);
		background: color-mix(in srgb, var(--color-surface) 80%, transparent);
		color: var(--color-text);
		font-size: var(--text-sm);
		font-weight: 600;
		letter-spacing: 0.01em;
		line-height: 1.1;
		text-decoration: none;
		white-space: nowrap;
		cursor: pointer;
		transition:
			background var(--duration-normal) var(--ease-standard),
			border-color var(--duration-normal) var(--ease-standard),
			color var(--duration-normal) var(--ease-standard),
			transform var(--duration-normal) var(--ease-standard);
	}

	.button:hover:not(:disabled) {
		border-color: var(--color-steel-bright);
		background: var(--color-surface-hover);
		color: var(--color-text);
		transform: translateY(-1px);
	}

	.button:active:not(:disabled) {
		transform: translateY(0);
	}

	.primary {
		border-color: var(--color-accent);
		background: var(--color-accent);
		color: var(--color-accent-ink);
	}

	.primary:hover:not(:disabled) {
		border-color: var(--color-accent-hover);
		background: var(--color-accent-hover);
		color: var(--color-accent-ink);
	}

	.ghost {
		border-color: transparent;
		background: transparent;
		color: var(--color-steel-bright);
	}

	.ghost:hover:not(:disabled) {
		border-color: var(--color-border);
		background: var(--color-surface);
	}

	.danger {
		border-color: color-mix(in srgb, var(--color-danger), transparent 40%);
		color: var(--color-danger);
	}

	.danger:hover:not(:disabled) {
		background: var(--color-danger-surface);
	}

	.icon-only {
		width: 2.5rem;
		min-width: 2.5rem;
		padding: 0;
		border-radius: var(--radius-md);
	}

	.sm {
		min-height: 2.125rem;
		padding: 0.5rem 0.85rem;
	}

	.lg {
		min-height: 3rem;
		padding: 0.85rem 1.4rem;
		font-size: var(--text-body);
	}

	.icon-only.sm {
		width: 2rem;
		min-width: 2rem;
	}

	.icon-only.lg {
		width: 3rem;
		min-width: 3rem;
	}

	.icon,
	.spinner {
		display: inline-flex;
		flex: 0 0 auto;
		align-items: center;
		justify-content: center;
	}

	.icon :global(svg),
	.icon :global(img) {
		width: 1rem;
		height: 1rem;
	}

	.icon :global(img) {
		display: block;
	}

	.icon-only :global(svg) {
		width: 1.1rem;
		height: 1.1rem;
	}

	.spinner {
		width: 0.9rem;
		height: 0.9rem;
		border: 2px solid currentColor;
		border-right-color: transparent;
		border-radius: 50%;
		animation: spin 0.7s linear infinite;
	}

	:disabled {
		opacity: 0.45;
		cursor: not-allowed;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.spinner {
			animation: none;
			border-right-color: currentColor;
			opacity: 0.7;
		}
	}
</style>
