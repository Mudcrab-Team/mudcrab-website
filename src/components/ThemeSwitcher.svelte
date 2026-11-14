<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import Moon from '@lucide/svelte/icons/moon';
	import Sun from '@lucide/svelte/icons/sun';
	import { onMount } from 'svelte';

	const storageKey = 'mudcrab-theme';

	const themes = [
		{ value: 'mudcrab', label: 'Mudcrab Slate' },
		{ value: 'nordic-frost', label: 'Nordic Frost' }
	] as const;

	type ThemeId = (typeof themes)[number]['value'];

	const menuId = $props.id();

	let selectedTheme = $state<ThemeId>('mudcrab');
	let open = $state(false);
	let containerEl: HTMLDivElement | undefined = $state();
	let triggerEl: HTMLButtonElement | undefined = $state();

	function applyTheme(theme: ThemeId) {
		selectedTheme = theme;
		open = false;
		document.documentElement.setAttribute('data-theme', theme);
		try {
			localStorage.setItem(storageKey, theme);
		} catch {
			// Ignore storage failures
		}
	}

	function handleWindowClick(event: MouseEvent) {
		if (open && containerEl && !containerEl.contains(event.target as Node)) {
			open = false;
		}
	}

	function handleWindowKeydown(event: KeyboardEvent) {
		if (open && event.key === 'Escape') {
			event.stopPropagation();
			open = false;
			triggerEl?.focus();
		}
	}

	onMount(() => {
		const attr = document.documentElement.getAttribute('data-theme');
		if (attr === 'mudcrab' || attr === 'nordic-frost') {
			selectedTheme = attr;
		}
	});
</script>

<svelte:window onclick={handleWindowClick} onkeydown={handleWindowKeydown} />

<div
	bind:this={containerEl}
	class="dropdown dropdown-end {open ? 'dropdown-open' : 'dropdown-close'}"
>
	<button
		bind:this={triggerEl}
		type="button"
		class="btn gap-2 border border-base-300/70 bg-base-200/70 btn-ghost text-sm font-medium text-base-content btn-sm hover:border-primary/60 hover:bg-base-300"
		aria-label="Switch color theme"
		aria-expanded={open}
		aria-haspopup="menu"
		aria-controls={menuId}
		onclick={() => (open = !open)}
	>
		{#if selectedTheme === 'nordic-frost'}
			<Sun size={16} aria-hidden="true" class="text-accent" />
		{:else}
			<Moon size={16} aria-hidden="true" class="text-accent" />
		{/if}
		<span class="hidden sm:inline">Theme</span>
	</button>
	<ul
		id={menuId}
		role="menu"
		class="dropdown-content menu z-50 mt-2 w-48 rounded-box border border-base-300 bg-base-200 p-1.5 shadow-lg"
		aria-label="Color theme options"
	>
		{#each themes as theme (theme.value)}
			<li role="none">
				<button
					type="button"
					role="menuitemradio"
					aria-checked={selectedTheme === theme.value}
					class="flex items-center justify-between text-sm font-medium {selectedTheme ===
					theme.value
						? 'bg-primary text-primary-content'
						: 'text-base-content/85 hover:bg-base-300'}"
					onclick={() => applyTheme(theme.value)}
				>
					<span>{theme.label}</span>
					{#if selectedTheme === theme.value}
						<Check size={15} aria-hidden="true" />
					{/if}
				</button>
			</li>
		{/each}
	</ul>
</div>
