<script lang="ts">
	import { Palette, X } from '@lucide/svelte';
	import { Dialog } from 'bits-ui';
	import { onMount } from 'svelte';

	const storageKey = 'mudcrab-theme';
	const themeStyles = import.meta.glob('../themes/*.css', {
		eager: true,
		query: '?inline',
		import: 'default'
	}) as Record<string, string>;

	const themeLabels: Record<string, string> = {
		skyui: 'SkyUI'
	};
	const themes = [
		{ value: 'default', label: 'Mudcrab' },
		...Object.keys(themeStyles).map((path) => {
			const value = path.split('/').pop()?.replace(/\.css$/, '') ?? path;
			return {
				value,
				label:
					themeLabels[value] ??
					value.replace(/[-_]+/g, ' ').replace(/\b\w/g, (character) => character.toUpperCase())
			};
		})
	];

	let selectedTheme = $state('default');
	let desktopMenuOpen = $state(false);
	let mobileDialogOpen = $state(false);
	let isMobile = $state(false);
	let switcher: HTMLDivElement;
	let themeStyle: HTMLStyleElement | undefined;
	let loadVersion = 0;

	function selectTheme(theme: string) {
		selectedTheme = theme;
		localStorage.setItem(storageKey, selectedTheme);
		desktopMenuOpen = false;
		mobileDialogOpen = false;
	}

	function openThemePicker() {
		if (isMobile) mobileDialogOpen = true;
		else desktopMenuOpen = !desktopMenuOpen;
	}

	function handleWindowClick(event: MouseEvent) {
		if (event.target instanceof Node && !switcher?.contains(event.target)) desktopMenuOpen = false;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') desktopMenuOpen = false;
	}

	onMount(() => {
		const savedTheme = localStorage.getItem(storageKey);
		if (savedTheme && themes.some((theme) => theme.value === savedTheme)) {
			selectedTheme = savedTheme;
		}

		const mediaQuery = window.matchMedia('(max-width: 700px)');
		const updateViewport = () => {
			isMobile = mediaQuery.matches;
			if (!isMobile) mobileDialogOpen = false;
		};
		updateViewport();
		mediaQuery.addEventListener('change', updateViewport);

		return () => {
			mediaQuery.removeEventListener('change', updateViewport);
			themeStyle?.remove();
		};
	});

	$effect(() => {
		const version = ++loadVersion;
		themeStyle?.remove();
		themeStyle = undefined;

		if (selectedTheme === 'default') return;

		const css = themeStyles[`../themes/${selectedTheme}.css`];
		if (!css || version !== loadVersion) return;

		themeStyle = document.createElement('style');
		themeStyle.dataset.theme = selectedTheme;
		themeStyle.textContent = css;
		document.head.appendChild(themeStyle);
	});
</script>

<svelte:window onclick={handleWindowClick} onkeydown={handleKeydown} />

<div class="theme-switcher" bind:this={switcher}>
	<button
		class="theme-trigger"
		type="button"
		aria-label="Choose theme"
		aria-expanded={isMobile ? mobileDialogOpen : desktopMenuOpen}
		aria-haspopup={isMobile ? 'dialog' : 'listbox'}
		onclick={openThemePicker}
	>
		<Palette size={17} strokeWidth={1.75} aria-hidden="true" />
	</button>

	{#if desktopMenuOpen}
		<div class="theme-menu" role="listbox" aria-label="Theme">
			{#each themes as theme (theme.value)}
				<button
					type="button"
					role="option"
					aria-selected={selectedTheme === theme.value}
					class:selected={selectedTheme === theme.value}
					onclick={() => selectTheme(theme.value)}
				>
					{theme.label}
				</button>
			{/each}
		</div>
	{/if}
</div>

<Dialog.Root bind:open={mobileDialogOpen}>
	<Dialog.Portal>
		<Dialog.Overlay class="theme-dialog-overlay" />
		<Dialog.Content class="theme-dialog-content" aria-describedby={undefined}>
			<div class="theme-dialog-heading">
				<Dialog.Title class="theme-dialog-title">Choose theme</Dialog.Title>
				<Dialog.Close class="theme-dialog-close" aria-label="Close theme picker">
					<X size={20} strokeWidth={1.75} aria-hidden="true" />
				</Dialog.Close>
			</div>
			<div class="theme-dialog-options" role="listbox" aria-label="Theme">
				{#each themes as theme (theme.value)}
					<button
						type="button"
						role="option"
						aria-selected={selectedTheme === theme.value}
						class:selected={selectedTheme === theme.value}
						onclick={() => selectTheme(theme.value)}
					>
						{theme.label}
					</button>
				{/each}
			</div>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>

<style>
	.theme-switcher {
		position: relative;
		display: inline-flex;
		color: var(--color-text-subtle);
	}
	.theme-trigger {
		display: grid;
		width: 2.35rem;
		height: 2.35rem;
		place-items: center;
		padding: 0;
		border: 1px solid transparent;
		border-radius: var(--radius-sm);
		outline: none;
		background: transparent;
		color: var(--color-accent);
		cursor: pointer;
		transition:
			background var(--duration-normal) var(--ease-standard),
			border-color var(--duration-normal) var(--ease-standard),
			transform var(--duration-normal) var(--ease-standard);
	}
	.theme-trigger:hover,
	.theme-trigger[aria-expanded='true'] {
		border-color: var(--color-border);
		background: var(--color-surface-hover);
		transform: translateY(-1px);
	}
	.theme-trigger:active {
		transform: translateY(0);
	}
	.theme-trigger:focus-visible,
	.theme-menu button:focus-visible,
	:global(.theme-dialog-options button:focus-visible),
	:global(.theme-dialog-close:focus-visible) {
		box-shadow: var(--focus-ring);
	}
	.theme-menu {
		position: absolute;
		top: calc(100% + 0.5rem);
		right: 0;
		z-index: var(--z-dropdown);
		display: grid;
		min-width: 10rem;
		padding: 0.35rem;
		border: 1px solid var(--color-border-strong);
		border-radius: var(--radius-md);
		background: var(--color-surface-raised);
		box-shadow: var(--shadow-md);
	}
	.theme-menu button,
	:global(.theme-dialog-options button) {
		padding: 0.6rem 0.7rem;
		border: 0;
		border-radius: var(--radius-sm);
		outline: none;
		background: transparent;
		color: var(--color-text-muted);
		font: 500 var(--text-sm) var(--font-body);
		text-align: left;
		cursor: pointer;
	}
	.theme-menu button:hover,
	.theme-menu button.selected,
	:global(.theme-dialog-options button:hover),
	:global(.theme-dialog-options button.selected) {
		background: var(--color-surface-hover);
		color: var(--color-text);
	}
	:global(.theme-dialog-overlay) {
		position: fixed;
		inset: 0;
		z-index: var(--z-modal);
		background: color-mix(in srgb, var(--color-overlay) 85%, transparent);
		backdrop-filter: blur(4px);
	}
	:global(.theme-dialog-content) {
		position: fixed;
		inset: 0;
		z-index: calc(var(--z-modal) + 1);
		display: grid;
		grid-template-rows: auto minmax(0, 1fr);
		outline: none;
		background: var(--color-surface-raised);
	}
	.theme-dialog-heading {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1.25rem 1.5rem;
		border-bottom: 1px solid var(--color-border);
	}
	:global(.theme-dialog-title) {
		margin: 0;
		color: var(--color-text);
		font: 500 var(--text-xl) var(--font-display);
		letter-spacing: var(--tracking-display);
	}
	:global(.theme-dialog-close) {
		display: grid;
		width: 2.25rem;
		height: 2.25rem;
		place-items: center;
		padding: 0;
		border: 1px solid transparent;
		border-radius: var(--radius-sm);
		outline: none;
		background: transparent;
		color: var(--color-text-subtle);
		cursor: pointer;
	}
	:global(.theme-dialog-close:hover) {
		border-color: var(--color-border);
		background: var(--color-surface-hover);
		color: var(--color-text);
	}
	.theme-dialog-options {
		display: grid;
		align-content: start;
		gap: 0.35rem;
		overflow-y: auto;
		padding: 1rem;
	}
	:global(.theme-dialog-options button) {
		min-height: 2.75rem;
		padding: 0.8rem 0.9rem;
	}
</style>
