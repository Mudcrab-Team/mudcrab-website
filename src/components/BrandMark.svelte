<script lang="ts">
	import MudcrabLogo from './MudcrabLogo.svelte';

	let {
		name = 'Mudcrab',
		subtitle,
		compact = false,
		href = '/',
		class: className = ''
	}: {
		name?: string;
		subtitle?: string;
		compact?: boolean;
		href?: string;
		class?: string;
	} = $props();
</script>

<a
	class="group inline-flex w-fit items-center gap-3 text-base-content no-underline {className}"
	{href}
	aria-label={compact ? name : undefined}
>
	<MudcrabLogo
		class="{compact
			? 'h-10 w-10'
			: 'h-9 w-9'} transition-transform duration-200 ease-out group-hover:-translate-y-0.5"
	/>
	{#if !compact}
		<span class="grid leading-tight">
			<strong class="font-display text-lg font-bold tracking-tight text-base-content">
				{name}
			</strong>
			{#if subtitle}
				<span class="text-sm font-medium text-base-content/75">{subtitle}</span>
			{/if}
		</span>
	{/if}
</a>
