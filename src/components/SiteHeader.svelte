<script lang="ts">
	import Menu from '@lucide/svelte/icons/menu';
	import X from '@lucide/svelte/icons/x';
	import type { Snippet } from 'svelte';
	import { DISCORD_URL, GITHUB_URL } from '$lib/site';
	import DiscordIcon from './icons/DiscordIcon.svelte';
	import GithubIcon from './icons/GithubIcon.svelte';

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
	data-theme={overlay && !scrolled ? 'mudcrab' : undefined}
	class="z-40 w-full transition-[background-color,border-color,backdrop-filter] duration-200 ease-out {sticky
		? 'sticky top-0'
		: ''} {overlay && !sticky ? 'fixed top-0 right-0 left-0' : ''} {overlay && !scrolled
		? 'border-b border-transparent bg-transparent text-base-content'
		: 'border-b border-base-300 bg-base-100/92 text-base-content backdrop-blur-md'}"
>
	<div class="navbar mx-auto min-h-16 max-w-[var(--content-wide)] px-4 sm:px-6 lg:px-8">
		<div class="navbar-start">
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
							class="relative inline-flex items-center rounded-field px-3.5 py-2 text-sm font-medium no-underline transition-colors duration-150 ease-out {item.active
								? 'after:absolute after:right-3 after:bottom-0.5 after:left-3 after:h-0.5 after:bg-primary'
								: 'opacity-80 hover:bg-base-200/50 hover:opacity-100'}"
						>
							{item.label}
						</a>
					</li>
				{/each}
			</ul>
		</nav>

		<div class="navbar-end gap-1.5">
			<a
				id="nav-github"
				href={GITHUB_URL}
				target="_blank"
				rel="noreferrer"
				aria-label="Mudcrab repository on GitHub"
				class="btn hidden gap-2 btn-ghost font-medium btn-sm sm:inline-flex"
			>
				<GithubIcon size={17} />
				<span class="hidden lg:inline">GitHub</span>
			</a>
			<a
				id="nav-discord"
				href={DISCORD_URL}
				target="_blank"
				rel="noreferrer"
				aria-label="Join the Mudcrab Discord"
				class="btn hidden gap-2 btn-ghost font-medium btn-sm sm:inline-flex"
			>
				<DiscordIcon size={17} />
				<span class="hidden lg:inline">Discord</span>
			</a>

			<div class="hidden items-center md:flex">
				{#if actions}
					{@render actions()}
				{/if}
			</div>

			<button
				type="button"
				id="mobile-menu-trigger"
				class="btn btn-square btn-ghost text-current! btn-sm md:hidden"
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
			class="border-t border-base-300 bg-base-100 px-4 py-5 text-base-content shadow-lg md:hidden"
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
									? 'bg-secondary text-secondary-content'
									: ''}"
								onclick={() => (menuOpen = false)}
							>
								{item.label}
							</a>
						</li>
					{/each}
				</ul>
			</nav>

			<div class="mt-4 grid grid-cols-2 gap-2 border-t border-base-300 pt-4">
				<a
					href={GITHUB_URL}
					target="_blank"
					rel="noreferrer"
					class="btn gap-2 border-base-300 btn-outline font-medium btn-sm"
				>
					<GithubIcon size={16} />
					<span>GitHub</span>
				</a>
				<a
					href={DISCORD_URL}
					target="_blank"
					rel="noreferrer"
					class="btn gap-2 border-base-300 btn-outline font-medium btn-sm"
				>
					<DiscordIcon size={16} />
					<span>Discord</span>
				</a>
			</div>

			{#if actions}
				<div class="mt-4 flex items-center justify-between border-t border-base-300 pt-3">
					<span class="text-sm text-base-content/75">Theme</span>
					{@render actions()}
				</div>
			{/if}
		</div>
	{/if}
</header>
