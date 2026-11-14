<script lang="ts">
	import Moon from '@lucide/svelte/icons/moon';
	import Sun from '@lucide/svelte/icons/sun';
	import { onMount } from 'svelte';

	const storageKey = 'mudcrab-theme';
	type ThemeId = 'mudcrab' | 'frost';

	let theme = $state<ThemeId>('mudcrab');

	function apply(next: ThemeId) {
		theme = next;
		document.documentElement.setAttribute('data-theme', next);
		try {
			localStorage.setItem(storageKey, next);
		} catch {
			// Ignore storage failures
		}
	}

	function toggle() {
		apply(theme === 'mudcrab' ? 'frost' : 'mudcrab');
	}

	onMount(() => {
		const attr = document.documentElement.getAttribute('data-theme');
		if (attr === 'frost') theme = 'frost';
	});
</script>

<button
	type="button"
	id="theme-toggle"
	class="btn btn-square btn-ghost text-current btn-sm"
	aria-label={theme === 'mudcrab' ? 'Switch to Frost light theme' : 'Switch to Mudcrab dark theme'}
	title={theme === 'mudcrab' ? 'Switch to light theme' : 'Switch to dark theme'}
	onclick={toggle}
>
	<span class="swap swap-rotate {theme === 'frost' ? 'swap-active' : ''}">
		<Sun size={18} class="swap-on text-primary" aria-hidden="true" />
		<Moon size={18} class="swap-off text-primary" aria-hidden="true" />
	</span>
</button>
