<script lang="ts">
	import Menu from '@lucide/svelte/icons/menu';
	import X from '@lucide/svelte/icons/x';
	import type { Snippet } from 'svelte';

	type NavItem = {
		label: string;
		href: string;
		active?: boolean;
		external?: boolean;
	};

	let {
		brand,
		items = [],
		actions,
		sticky = false,
		overlay = false,
		mobileLabel = 'Open menu'
	}: {
		brand: Snippet;
		items?: NavItem[];
		actions?: Snippet;
		sticky?: boolean;
		overlay?: boolean;
		mobileLabel?: string;
	} = $props();

	let menuOpen = $state(false);
	let menuClosing = $state(false);
	let closeTimer: ReturnType<typeof setTimeout> | undefined;

	function openMenu() {
		if (closeTimer) clearTimeout(closeTimer);
		menuClosing = false;
		menuOpen = true;
	}

	function closeMenu() {
		if (!menuOpen) return;

		menuOpen = false;
		menuClosing = true;
		closeTimer = setTimeout(() => {
			menuClosing = false;
		}, 250);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') closeMenu();
	}

	let scrolled = $state(false);

	function updateScrollState() {
		scrolled = window.scrollY > 24;
	}

	$effect(() => {
		overlay;
		updateScrollState();
	});
</script>

<svelte:window onkeydown={handleKeydown} onscroll={updateScrollState} />

<header class="site-header" class:sticky class:overlay class:scrolled>
	<div class="header-inner">
		{@render brand()}
		<button
			class="menu-toggle"
			type="button"
			aria-label={menuOpen ? 'Close menu' : mobileLabel}
			aria-expanded={menuOpen}
			aria-controls="site-navigation"
			onclick={() => (menuOpen ? closeMenu() : openMenu())}
		>
			{#if menuOpen}
				<X size={20} strokeWidth={1.75} aria-hidden="true" />
			{:else}
				<Menu size={20} strokeWidth={1.75} aria-hidden="true" />
			{/if}
		</button>

		{#if menuOpen}
			<button class="menu-backdrop" type="button" aria-label="Close menu" onclick={closeMenu}
			></button>
		{/if}

		<div class="header-content-root" class:closing={menuClosing}>
			<div class="header-content" class:open={menuOpen}>
				<nav id="site-navigation" aria-label="Main navigation">
					<ul>
						{#each items as item}
							<li>
								<a
									class:active={item.active}
									href={item.href}
									aria-current={item.active ? 'page' : undefined}
									target={item.external ? '_blank' : undefined}
									rel={item.external ? 'noreferrer' : undefined}
									onclick={closeMenu}>{item.label}</a
								>
							</li>
						{/each}
					</ul>
				</nav>
				{#if actions}<div class="header-actions">{@render actions()}</div>{/if}
			</div>
		</div>
	</div>
</header>

<style>
	:global(body) {
		&:has(.header-content-root .header-content.open) {
			overflow: hidden;
		}
	}

	.site-header {
		position: relative;
		z-index: var(--z-sticky);
		border-bottom: 1px solid var(--color-border);
		background: color-mix(in srgb, var(--color-background) 92%, transparent);
		backdrop-filter: blur(12px);
		transition:
			background var(--duration-normal) var(--ease-standard),
			border-color var(--duration-normal) var(--ease-standard),
			backdrop-filter var(--duration-normal) var(--ease-standard);
	}

	.site-header.sticky {
		position: sticky;
		top: 0;
		left: 0;
	}

	.site-header.overlay {
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		border-bottom-color: transparent;
		background: transparent;
		backdrop-filter: none;
	}

	.site-header.overlay.scrolled {
		border-bottom-color: var(--color-border);
		background: color-mix(in srgb, var(--color-background) 90%, transparent);
		backdrop-filter: blur(14px);
	}

	.header-inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 2rem;
		width: min(100% - (var(--page-gutter) * 2), var(--content-wide));
		min-height: 4.5rem;
		margin: 0 auto;
	}

	.header-content {
		display: flex;
		align-items: center;
		gap: 1.75rem;
	}

	nav ul {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	nav li + li {
		margin-top: 0;
	}

	nav a {
		position: relative;
		display: inline-flex;
		padding: 0.5rem 0.25rem;
		color: var(--color-text-muted);
		font-size: var(--text-sm);
		font-weight: 500;
		white-space: nowrap;
		text-decoration: none;
		transition: color var(--duration-fast) var(--ease-standard);
	}

	nav a::after {
		position: absolute;
		right: 0.25rem;
		bottom: 0.1rem;
		left: 0.25rem;
		height: 2px;
		background: var(--color-accent);
		content: '';
		transform: scaleX(0);
		transform-origin: right;
		transition: transform var(--duration-normal) var(--ease-standard);
	}

	nav a:hover,
	nav a.active {
		color: var(--color-text);
	}

	nav a:hover::after,
	nav a.active::after {
		transform: scaleX(1);
		transform-origin: left;
	}

	nav a:focus-visible,
	.menu-toggle:focus-visible {
		outline: 2px solid var(--color-border-focus);
		outline-offset: 2px;
		border-radius: var(--radius-sm);
	}

	.header-actions {
		display: flex;
		align-items: center;
		gap: 0.6rem;
	}

	.menu-toggle {
		display: none;
		place-items: center;
		width: 2.5rem;
		height: 2.5rem;
		padding: 0;
		border: 1px solid var(--color-border-strong);
		border-radius: var(--radius-sm);
		background: color-mix(in srgb, var(--color-background) 70%, transparent);
		color: var(--color-text);
		cursor: pointer;
	}

	@media (max-width: 760px) {
		.site-header:has(.header-content-root .header-content.open) {
			backdrop-filter: none;
		}

		.header-inner {
			position: relative;
			min-height: 4rem;
		}

		.menu-toggle {
			position: relative;
			z-index: 3;
			display: grid;
		}

		.menu-backdrop {
			position: fixed;
			inset: 0;
			z-index: 1;
			padding: 0;
			border: 0;
			background: transparent;
			cursor: default;
		}

		.header-content-root:not(:has(.header-content.open)):not(.closing) {
			display: none;
		}

		.header-content-root {
			position: fixed;
			top: 0;
			left: 0;
			z-index: 2;
			width: 100svw;
			height: 100svh;
			pointer-events: none;
			transition: background var(--duration-fast) var(--ease-standard);
		}

		.header-content-root:has(.header-content.open) {
			background: color-mix(in srgb, var(--color-background) 64%, transparent);
			backdrop-filter: blur(4px);
		}

		.header-content {
			position: fixed;
			top: 0;
			right: 0;
			bottom: 0;
			display: grid;
			width: min(85vw, 24rem);
			height: 100svh;
			align-content: start;
			gap: 1.25rem;
			padding: 5.5rem 1.5rem 1.5rem;
			border-left: 1px solid var(--color-border-strong);
			background: var(--color-surface-raised);
			box-shadow: var(--shadow-lg);
			visibility: hidden;
			pointer-events: none;
			transform: translateX(100%);
			transition:
				transform var(--duration-normal) var(--ease-standard),
				visibility 0s linear var(--duration-normal);
		}

		.header-content.open {
			visibility: visible;
			pointer-events: auto;
			transform: translateX(0);
			transition-delay: 0s;
		}

		nav ul {
			display: grid;
			gap: 0.25rem;
		}

		nav a {
			width: 100%;
			padding: 0.75rem 0.5rem;
			font-size: var(--text-body);
		}

		.header-actions {
			padding-top: 1rem;
			border-top: 1px solid var(--color-border);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		nav a::after,
		.header-content,
		.site-header {
			transition: none;
		}
	}
</style>
