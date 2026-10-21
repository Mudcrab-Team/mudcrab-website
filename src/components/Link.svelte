<script lang="ts">
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import type { Snippet } from 'svelte';

	type Variant = 'default' | 'muted' | 'inline';

	let {
		href,
		variant = 'default',
		external = false,
		arrow = false,
		underline = true,
		children
	}: {
		href: string;
		variant?: Variant;
		external?: boolean;
		arrow?: boolean;
		underline?: boolean;
		children: Snippet;
	} = $props();
</script>

<a
	class="link {variant}"
	class:no-underline={!underline}
	{href}
	target={external ? '_blank' : undefined}
	rel={external ? 'noreferrer' : undefined}
>
	<span>{@render children()}</span>
	{#if external}
		<ArrowUpRight class="link-icon" size={15} strokeWidth={1.75} aria-hidden="true" />
	{:else if arrow}
		<ArrowRight class="link-icon" size={15} strokeWidth={1.75} aria-hidden="true" />
	{/if}
</a>

<style>
	.link {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		width: fit-content;
		color: var(--color-accent);
		font-size: var(--text-sm);
		line-height: 1.4;
		text-underline-offset: 0.25em;
		transition:
			color var(--duration-normal) var(--ease-standard),
			gap var(--duration-normal) var(--ease-standard);
	}

	.link:hover {
		color: var(--color-accent-hover);
	}

	.link:hover :global(.link-icon) {
		transform: translateX(2px);
	}

	.link-icon {
		flex: 0 0 auto;
		transition: transform var(--duration-normal) var(--ease-standard);
	}

	.muted {
		color: var(--color-text-muted);
	}

	.muted:hover {
		color: var(--color-text);
	}

	.inline {
		color: var(--color-text);
		font-weight: 500;
	}

	.inline:hover {
		color: var(--color-accent);
	}

	.no-underline {
		text-decoration: none;
	}

	.no-underline:hover {
		text-decoration: underline;
	}

	@media (prefers-reduced-motion: reduce) {
		.link,
		.link-icon {
			transition: none;
		}
	}
</style>
