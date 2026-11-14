<script lang="ts" module>
	type ThemeId = 'mudcrab' | 'frost';
	let sharedTheme = $state<ThemeId>('mudcrab');
</script>

<script lang="ts">
	import Moon from '@lucide/svelte/icons/moon';
	import Sun from '@lucide/svelte/icons/sun';
	import { onMount } from 'svelte';

	const storageKey = 'mudcrab-theme';

	function readDocumentTheme(): ThemeId {
		return document.documentElement.getAttribute('data-theme') === 'frost' ? 'frost' : 'mudcrab';
	}

	function apply(next: ThemeId) {
		sharedTheme = next;
		document.documentElement.setAttribute('data-theme', next);
		try {
			localStorage.setItem(storageKey, next);
		} catch {
			// Ignore storage failures
		}
	}

	function toggle() {
		const current = readDocumentTheme();
		apply(current === 'mudcrab' ? 'frost' : 'mudcrab');
	}

	onMount(() => {
		sharedTheme = readDocumentTheme();
	});
</script>

<button
	type="button"
	class="btn btn-square btn-ghost text-current btn-sm"
	aria-label={sharedTheme === 'mudcrab'
		? 'Switch to Frost light theme'
		: 'Switch to Mudcrab dark theme'}
	title={sharedTheme === 'mudcrab' ? 'Switch to light theme' : 'Switch to dark theme'}
	onclick={toggle}
>
	<span class="swap swap-rotate {sharedTheme === 'frost' ? 'swap-active' : ''}">
		<Sun size={18} class="swap-on text-primary" aria-hidden="true" />
		<Moon size={18} class="swap-off text-primary" aria-hidden="true" />
	</span>
</button>
