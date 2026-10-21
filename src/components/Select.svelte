<script lang="ts">
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import X from '@lucide/svelte/icons/x';
	import { Dialog, Select } from 'bits-ui';
	import { onMount } from 'svelte';

	type SelectItem = {
		label: string;
		value: string;
		disabled?: boolean;
	};

	let {
		id = 'select-input',
		label,
		items,
		value = $bindable<string | undefined>(undefined),
		placeholder = 'Select an option',
		disabled = false,
		error
	}: {
		id?: string;
		label: string;
		items: SelectItem[];
		value?: string;
		placeholder?: string;
		disabled?: boolean;
		error?: string;
	} = $props();

	let errorId = $derived(error ? `${id}-error` : undefined);
	let selectedItem = $derived(items.find((item) => item.value === value));
	let isMobile = $state(false);
	let mobilePickerOpen = $state(false);

	function selectMobileOption(item: SelectItem) {
		if (item.disabled) return;

		value = item.value;
		mobilePickerOpen = false;
	}

	onMount(() => {
		const mediaQuery = window.matchMedia('(max-width: 700px)');
		const updateViewport = () => {
			isMobile = mediaQuery.matches;
			if (!isMobile) mobilePickerOpen = false;
		};

		updateViewport();
		mediaQuery.addEventListener('change', updateViewport);

		return () => mediaQuery.removeEventListener('change', updateViewport);
	});
</script>

<div class="field" class:error-state={error}>
	<label for={id}>{label}</label>
	{#if isMobile}
		<button
			class="trigger mobile-trigger"
			type="button"
			{id}
			{disabled}
			aria-describedby={errorId}
			aria-haspopup="dialog"
			aria-expanded={mobilePickerOpen}
			onclick={() => (mobilePickerOpen = true)}
		>
			<span class:placeholder={!selectedItem}>{selectedItem?.label ?? placeholder}</span>
			<ChevronDown class="chevron" size={16} strokeWidth={1.75} aria-hidden="true" />
		</button>
	{:else}
		<Select.Root type="single" {items} {disabled} bind:value>
			<Select.Trigger
				class="trigger"
				{id}
				{disabled}
				aria-invalid={error ? 'true' : undefined}
				aria-describedby={errorId}
			>
				<Select.Value {placeholder} />
				<ChevronDown class="chevron" size={16} strokeWidth={1.75} aria-hidden="true" />
			</Select.Trigger>
			<Select.Portal>
				<Select.Content class="content" sideOffset={6}>
					<Select.Viewport>
						{#each items as item (item.value)}
							<Select.Item
								class="item"
								value={item.value}
								label={item.label}
								disabled={item.disabled}
							>
								{#snippet children({ selected }: { selected: boolean })}
									<span>{item.label}</span>
									{#if selected}<span class="indicator" aria-hidden="true">✓</span>{/if}
								{/snippet}
							</Select.Item>
						{/each}
					</Select.Viewport>
				</Select.Content>
			</Select.Portal>
		</Select.Root>
	{/if}
	<Dialog.Root bind:open={mobilePickerOpen}>
		<Dialog.Portal>
			<Dialog.Overlay class="mobile-picker-overlay" />
			<Dialog.Content class="mobile-picker-content" aria-describedby={undefined}>
				<div class="mobile-picker-heading">
					<Dialog.Title class="mobile-picker-title">{label}</Dialog.Title>
					<Dialog.Close class="mobile-picker-close" aria-label={`Close ${label} picker`}>
						<X size={20} strokeWidth={1.75} aria-hidden="true" />
					</Dialog.Close>
				</div>
				<div class="mobile-picker-options" role="listbox" aria-label={label}>
					{#each items as item (item.value)}
						<button
							type="button"
							role="option"
							aria-selected={value === item.value}
							disabled={item.disabled}
							onclick={() => selectMobileOption(item)}
						>
							<span>{item.label}</span>
							{#if value === item.value}<span class="mobile-picker-indicator" aria-hidden="true"
									>✓</span
								>{/if}
						</button>
					{/each}
				</div>
			</Dialog.Content>
		</Dialog.Portal>
	</Dialog.Root>
	{#if error}<p class="error" id={errorId}>{error}</p>{/if}
</div>

<style>
	.field {
		position: relative;
		display: grid;
		align-content: start;
		gap: 0.45rem;
		min-width: 0;
	}
	label {
		color: var(--color-text-muted);
		font-size: var(--text-sm);
	}
	:global(.trigger) {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		height: 2.65rem;
		padding: 0.65rem 0.8rem;
		border: 1px solid var(--color-border-strong);
		border-radius: var(--radius-sm);
		outline: none;
		background: var(--color-surface);
		color: var(--color-text);
		font-size: var(--text-sm);
		text-align: left;
		cursor: pointer;
		transition:
			border-color var(--duration-normal) var(--ease-standard),
			box-shadow var(--duration-normal) var(--ease-standard);
	}
	:global(.trigger:hover:not(:disabled)) {
		border-color: var(--color-accent-muted);
	}
	:global(.trigger:focus-visible) {
		border-color: var(--color-border-focus);
		box-shadow: var(--focus-ring);
	}
	:global(.trigger[data-placeholder]) {
		color: var(--color-text-subtle);
	}
	:global(.trigger:disabled) {
		cursor: not-allowed;
		opacity: 0.5;
	}
	:global(.chevron) {
		display: block;
		flex: 0 0 auto;
		color: var(--color-text-subtle);
	}
	:global(.content) {
		z-index: var(--z-dropdown);
		width: var(--bits-select-anchor-width);
		min-width: var(--bits-select-anchor-width);
		max-height: 18rem;
		overflow: hidden;
		padding: 0.35rem;
		border: 1px solid var(--color-border-strong);
		border-radius: var(--radius-md);
		background: var(--color-surface-raised);
		box-shadow: var(--shadow-md);
	}
	:global([data-select-viewport]) {
		max-height: 17rem;
		overflow: auto;
	}
	:global(.item) {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-height: 2.3rem;
		padding: 0.55rem 0.65rem;
		border-radius: var(--radius-sm);
		outline: none;
		color: var(--color-text-muted);
		font-size: var(--text-sm);
		cursor: pointer;
	}
	:global(.item:hover),
	:global(.item[data-highlighted]) {
		background: var(--color-surface-hover);
		color: var(--color-text);
	}
	:global(.item[data-disabled]) {
		cursor: not-allowed;
		opacity: 0.45;
	}
	:global(.indicator) {
		color: var(--color-accent);
	}
	.mobile-trigger .placeholder {
		color: var(--color-text-subtle);
	}
	:global(.mobile-picker-overlay) {
		position: fixed;
		inset: 0;
		z-index: var(--z-modal);
		background: color-mix(in srgb, var(--color-overlay) 85%, transparent);
		backdrop-filter: blur(4px);
	}
	:global(.mobile-picker-content) {
		position: fixed;
		inset: 0;
		z-index: calc(var(--z-modal) + 1);
		display: grid;
		grid-template-rows: auto minmax(0, 1fr);
		outline: none;
		background: var(--color-surface-raised);
	}
	.mobile-picker-heading {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1.25rem 1.5rem;
		border-bottom: 1px solid var(--color-border);
	}
	:global(.mobile-picker-title) {
		margin: 0;
		color: var(--color-text);
		font: 500 var(--text-xl) var(--font-display);
		letter-spacing: var(--tracking-display);
	}
	:global(.mobile-picker-close) {
		display: grid;
		width: 2.25rem;
		height: 2.25rem;
		flex: 0 0 auto;
		place-items: center;
		padding: 0;
		border: 1px solid transparent;
		border-radius: var(--radius-sm);
		outline: none;
		background: transparent;
		color: var(--color-text-subtle);
		cursor: pointer;
	}
	:global(.mobile-picker-close:hover) {
		border-color: var(--color-border);
		background: var(--color-surface-hover);
		color: var(--color-text);
	}
	:global(.mobile-picker-close:focus-visible),
	:global(.mobile-picker-options button:focus-visible) {
		box-shadow: var(--focus-ring);
	}
	.mobile-picker-options {
		display: grid;
		align-content: start;
		gap: 0.35rem;
		overflow-y: auto;
		padding: 1rem;
	}
	:global(.mobile-picker-options button) {
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-height: 3rem;
		padding: 0.8rem 0.9rem;
		border: 0;
		border-radius: var(--radius-sm);
		outline: none;
		background: transparent;
		color: var(--color-text-muted);
		font: 600 var(--text-sm) var(--font-body);
		text-align: left;
		cursor: pointer;
	}
	:global(.mobile-picker-options button:hover:not(:disabled)),
	:global(.mobile-picker-options button[aria-selected='true']) {
		background: var(--color-surface-hover);
		color: var(--color-text);
	}
	:global(.mobile-picker-options button:disabled) {
		cursor: not-allowed;
		opacity: 0.45;
	}
	.mobile-picker-indicator {
		color: var(--color-accent);
	}
	.field p {
		max-width: none;
		font-size: var(--text-xs);
		line-height: 1.45;
	}
	.error {
		color: var(--color-danger);
	}
	.error-state :global(.trigger) {
		border-color: color-mix(in srgb, var(--color-danger), transparent 35%);
	}
</style>
