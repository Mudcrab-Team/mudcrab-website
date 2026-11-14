<script lang="ts">
	import MudcrabLogo from './MudcrabLogo.svelte';

	let {
		href = '/',
		compact = false,
		class: className = ''
	}: {
		href?: string;
		compact?: boolean;
		class?: string;
	} = $props();
</script>

<a
	{href}
	class="inline-flex items-center gap-2.5 text-base-content no-underline transition-opacity duration-150 ease-out hover:opacity-90 {className}"
>
	<MudcrabLogo class={compact ? 'h-8 w-8' : 'h-9 w-9'} framed={false} />
	{#if !compact}
		<span class="font-display text-xl font-bold tracking-tight">Mudcrab</span>
	{/if}
</a>
