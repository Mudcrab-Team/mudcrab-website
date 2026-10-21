<script lang="ts">
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import { Accordion } from 'bits-ui';

	type AccordionItem = {
		value: string;
		title: string;
		content: string;
		disabled?: boolean;
	};

	let {
		items,
		type = 'single',
		collapsible = true,
		defaultValue
	}: {
		items: AccordionItem[];
		type?: 'single' | 'multiple';
		collapsible?: boolean;
		defaultValue?: string | string[];
	} = $props();

	let singleValue = $state<string | undefined>();
	let multipleValue = $state<string[]>([]);

	$effect(() => {
		if (type === 'single') {
			singleValue = typeof defaultValue === 'string' ? defaultValue : undefined;
		} else {
			multipleValue = Array.isArray(defaultValue) ? defaultValue : [];
		}
	});
</script>

{#snippet itemsMarkup()}
	{#each items as item (item.value)}
		<Accordion.Item value={item.value} disabled={item.disabled} class="accordion-item">
			<Accordion.Header class="accordion-header">
				<Accordion.Trigger class="accordion-trigger">
					<span>{item.title}</span>
					<ChevronDown class="accordion-chevron" size={17} strokeWidth={1.75} aria-hidden="true" />
				</Accordion.Trigger>
			</Accordion.Header>
			<Accordion.Content class="accordion-content">{item.content}</Accordion.Content>
		</Accordion.Item>
	{/each}
{/snippet}

{#if type === 'single'}
	<Accordion.Root
		type="single"
		bind:value={singleValue}
		onValueChange={(nextValue) => {
			if (collapsible || nextValue !== undefined) singleValue = nextValue;
		}}
		class="accordion"
	>
		{@render itemsMarkup()}
	</Accordion.Root>
{:else}
	<Accordion.Root
		type="multiple"
		bind:value={multipleValue}
		onValueChange={(nextValue) => {
			if (collapsible || nextValue.length > 0) multipleValue = nextValue;
		}}
		class="accordion"
	>
		{@render itemsMarkup()}
	</Accordion.Root>
{/if}

<style>
	:global(.accordion) {
		display: grid;
		border-top: 1px solid var(--color-border);
	}
	:global(.accordion-item) {
		border-bottom: 1px solid var(--color-border);
	}
	:global(.accordion-trigger) {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		gap: 1rem;
		padding: 1rem 0;
		border: 0;
		outline: none;
		background: transparent;
		color: var(--color-text-muted);
		font: 600 var(--text-sm) var(--font-body);
		text-align: left;
		cursor: pointer;
		transition: color var(--duration-normal) var(--ease-standard);
	}
	:global(.accordion-trigger:hover:not(:disabled)) {
		color: var(--color-text);
	}
	:global(.accordion-trigger:focus-visible) {
		color: var(--color-accent);
		box-shadow: var(--focus-ring);
	}
	:global(.accordion-trigger:disabled) {
		cursor: not-allowed;
		opacity: 0.45;
	}
	:global(.accordion-chevron) {
		flex: 0 0 auto;
		color: var(--color-text-subtle);
		transition: transform var(--duration-normal) var(--ease-standard);
	}
	:global(.accordion-trigger[data-state='open'] .accordion-chevron) {
		transform: rotate(180deg);
		color: var(--color-accent);
	}
	:global(.accordion-content) {
		max-width: 42rem;
		overflow: hidden;
		padding: 0 2rem 1rem 0;
		color: var(--color-text-muted);
		font-size: var(--text-sm);
		line-height: 1.6;
	}
</style>
