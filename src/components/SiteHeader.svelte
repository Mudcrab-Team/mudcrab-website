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
	let scrolled = $state(false);

	function updateScrollState() {
		scrolled = window.scrollY > 24;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') menuOpen = false;
	}

	$effect(() => {
		updateScrollState();
	});
</script>

<svelte:window onkeydown={handleKeydown} onscroll={updateScrollState} />

<header
	class="z-40 w-full transition-[background-color,border-color,backdrop-filter] duration-200 ease-out {sticky
		? 'sticky top-0'
		: ''} {overlay && !sticky ? 'fixed top-0 right-0 left-0' : ''} {overlay && !scrolled
		? 'border-b border-transparent bg-base-100/20 backdrop-blur-xs'
		: 'border-b border-base-300 bg-base-100/90 backdrop-blur-md'}"
>
	<div class="navbar mx-auto min-h-[4.25rem] max-w-[var(--content-wide)] px-4 sm:px-6 lg:px-8">
		<div class="navbar-start gap-3">
			{@render brand()}
		</div>

		<nav class="navbar-center hidden md:flex" aria-label="Main navigation">
			<ul class="flex items-center gap-1">
				{#each items as item (item.href)}
					<li>
						<a
							href={item.href}
							aria-current={item.active ? 'page' : undefined}
							target={item.external ? '_blank' : undefined}
							rel={item.external ? 'noreferrer' : undefined}
							class="relative inline-flex items-center rounded-md px-3.5 py-2 text-sm font-medium no-underline transition-colors duration-150 ease-out {item.active
								? 'text-base-content after:absolute after:right-3 after:bottom-0.5 after:left-3 after:h-0.5 after:rounded-full after:bg-accent'
								: 'text-base-content/75 hover:bg-base-200/70 hover:text-base-content'}"
						>
							{item.label}
						</a>
					</li>
				{/each}
			</ul>
		</nav>

		<div class="navbar-end gap-2">
			<div class="hidden items-center gap-2 md:flex">
				{#if actions}
					{@render actions()}
				{/if}
			</div>

			<button
				type="button"
				class="btn btn-square border border-base-300/80 bg-base-200/70 btn-ghost md:hidden"
				aria-label={menuOpen ? 'Close menu' : mobileLabel}
				aria-expanded={menuOpen}
				aria-controls="mobile-site-menu"
				onclick={() => (menuOpen = !menuOpen)}
			>
				{#if menuOpen}
					<X size={20} aria-hidden="true" />
				{:else}
					<Menu size={20} aria-hidden="true" />
				{/if}
			</button>
		</div>
	</div>

	{#if menuOpen}
		<div
			id="mobile-site-menu"
			class="max-h-[calc(100dvh-4.25rem)] overflow-y-auto border-t border-base-300 bg-base-100/98 px-4 py-4 backdrop-blur-md md:hidden"
		>
			<nav aria-label="Mobile navigation">
				<ul class="menu w-full gap-1 p-0">
					{#each items as item (item.href)}
						<li>
							<a
								href={item.href}
								aria-current={item.active ? 'page' : undefined}
								target={item.external ? '_blank' : undefined}
								rel={item.external ? 'noreferrer' : undefined}
								class="text-base font-medium {item.active
									? 'bg-primary text-primary-content'
									: 'text-base-content/85'}"
								onclick={() => (menuOpen = false)}
							>
								{item.label}
							</a>
						</li>
					{/each}
				</ul>
			</nav>
			{#if actions}
				<div class="mt-4 flex items-center justify-between border-t border-base-300 pt-4">
					<span class="text-sm text-base-content/75">Appearance</span>
					{@render actions()}
				</div>
			{/if}
		</div>
	{/if}
</header>
