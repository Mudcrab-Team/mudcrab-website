<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import Search from '@lucide/svelte/icons/search';
	import X from '@lucide/svelte/icons/x';
	import { Combobox, Dialog } from 'bits-ui';
	import { onMount } from 'svelte';

	type ComboboxItem = {
		label: string;
		value: string;
		disabled?: boolean;
	};

	let {
		id = 'combobox-input',
		label,
		items,
		value = $bindable<string | string[] | undefined>(undefined),
		multiple = false,
		placeholder = 'Search options...',
		description,
		error,
		disabled = false,
		required = false
	}: {
		id?: string;
		label: string;
		items: ComboboxItem[];
		value?: string | string[];
		multiple?: boolean;
		placeholder?: string;
		description?: string;
		error?: string;
		disabled?: boolean;
		required?: boolean;
	} = $props();

	let searchValue = $state('');
	let open = $state(false);
	let mobileDialogOpen = $state(false);
	let isMobile = $state(false);
	let descriptionId = $derived(description ? `${id}-description` : undefined);
	let errorId = $derived(error ? `${id}-error` : undefined);
	let describedBy = $derived([descriptionId, errorId].filter(Boolean).join(' ') || undefined);
	let filteredItems = $derived(
		searchValue === ''
			? items
			: items.filter((item) => item.label.toLowerCase().includes(searchValue.toLowerCase()))
	);
	let selectedLabels = $derived(
		Array.isArray(value)
			? value
					.map((selectedValue) => items.find((item) => item.value === selectedValue)?.label)
					.filter((item): item is string => Boolean(item))
					.join(', ')
			: ''
	);
	let selectedLabel = $derived(
		typeof value === 'string' ? items.find((item) => item.value === value)?.label : undefined
	);
	let mobileSummary = $derived(multiple ? selectedLabels : selectedLabel);

	function handleInput(event: Event & { currentTarget: HTMLInputElement }) {
		searchValue = event.currentTarget.value;
	}

	function handleOpenChange(isOpen: boolean) {
		if (!isOpen) searchValue = '';
	}

	function handleValueChange() {
		if (!multiple) {
			open = false;
			searchValue = '';
		}
	}

	function isMobileSelected(itemValue: string) {
		return Array.isArray(value) ? value.includes(itemValue) : value === itemValue;
	}

	function selectMobileItem(itemValue: string) {
		if (multiple) {
			const selectedValues = Array.isArray(value) ? value : [];
			value = selectedValues.includes(itemValue)
				? selectedValues.filter((selectedValue) => selectedValue !== itemValue)
				: [...selectedValues, itemValue];
			return;
		}

		value = itemValue;
		mobileDialogOpen = false;
		searchValue = '';
	}

	function handleMobileDialogOpenChange(isOpen: boolean) {
		mobileDialogOpen = isOpen;
		if (!isOpen) searchValue = '';
	}

	onMount(() => {
		const mediaQuery = window.matchMedia('(max-width: 700px)');
		const updateViewport = () => {
			isMobile = mediaQuery.matches;
			if (!isMobile) mobileDialogOpen = false;
		};

		updateViewport();
		mediaQuery.addEventListener('change', updateViewport);
		return () => mediaQuery.removeEventListener('change', updateViewport);
	});
</script>

<div
	class="field"
	class:error-state={error}
	class:has-selection={multiple && Boolean(selectedLabels)}
>
	<label for={id}
		>{label}{#if required}<span class="required" aria-hidden="true">*</span>{/if}</label
	>
	{#if isMobile}
		<button
			{id}
			class="mobile-combobox-trigger"
			type="button"
			{disabled}
			aria-describedby={describedBy}
			aria-haspopup="dialog"
			aria-expanded={mobileDialogOpen}
			onclick={() => (mobileDialogOpen = true)}
		>
			<Search size={16} strokeWidth={1.75} aria-hidden="true" />
			<span class:mobile-placeholder={!mobileSummary}>{mobileSummary || placeholder}</span>
			<ChevronDown size={16} strokeWidth={1.75} aria-hidden="true" />
		</button>
	{:else}
		<Combobox.Root
			type={multiple ? 'multiple' : 'single'}
			{items}
			bind:value={value as never}
			bind:open
			{disabled}
			{required}
			onOpenChange={handleOpenChange}
			onValueChange={handleValueChange}
		>
			<div class="control">
				<Search class="combobox-search" size={16} strokeWidth={1.75} aria-hidden="true" />
				{#if multiple && !open && selectedLabels}
					<span class="selected-values" aria-hidden="true">{selectedLabels}</span>
				{/if}
				<Combobox.Input
					{id}
					class="combobox-input"
					{placeholder}
					{disabled}
					aria-invalid={error ? 'true' : undefined}
					aria-describedby={describedBy}
					oninput={handleInput}
				/>
				<Combobox.Trigger class="combobox-trigger" {disabled} aria-label={`Show ${label} options`}>
					<ChevronDown size={16} strokeWidth={1.75} aria-hidden="true" />
				</Combobox.Trigger>
			</div>
			<Combobox.Portal>
				<Combobox.Content class="combobox-content" sideOffset={6}>
					<Combobox.Viewport class="combobox-viewport">
						{#each filteredItems as item (item.value)}
							<Combobox.Item
								class="combobox-item"
								value={item.value}
								label={item.label}
								disabled={item.disabled}
							>
								{#snippet children({ selected }: { selected: boolean })}
									<span>{item.label}</span>
									{#if selected}<Check
											class="combobox-indicator"
											size={15}
											strokeWidth={2}
											aria-hidden="true"
										/>{/if}
								{/snippet}
							</Combobox.Item>
						{:else}
							<p class="empty">No matching options.</p>
						{/each}
					</Combobox.Viewport>
				</Combobox.Content>
			</Combobox.Portal>
		</Combobox.Root>
	{/if}
	{#if description && !error}<p id={descriptionId}>{description}</p>{/if}
	{#if error}<p class="error" id={errorId}>{error}</p>{/if}
</div>

<Dialog.Root bind:open={mobileDialogOpen} onOpenChange={handleMobileDialogOpenChange}>
	<Dialog.Portal>
		<Dialog.Overlay class="mobile-combobox-overlay" />
		<Dialog.Content class="mobile-combobox-dialog" aria-describedby={undefined}>
			<div class="mobile-combobox-heading">
				<Dialog.Title class="mobile-combobox-title">{label}</Dialog.Title>
				<Dialog.Close class="mobile-combobox-close" aria-label={`Close ${label} picker`}>
					<X size={20} strokeWidth={1.75} aria-hidden="true" />
				</Dialog.Close>
			</div>
			<div class="mobile-combobox-body">
				<div class="mobile-combobox-search-wrap">
					<Search size={16} strokeWidth={1.75} aria-hidden="true" />
					<input
						class="mobile-combobox-search"
						type="search"
						{placeholder}
						value={searchValue}
						oninput={handleInput}
					/>
				</div>
				<div
					class="mobile-combobox-options"
					role="listbox"
					aria-label={label}
					aria-multiselectable={multiple}
				>
					{#each filteredItems as item (item.value)}
						<button
							type="button"
							role="option"
							class="mobile-combobox-item"
							class:selected={isMobileSelected(item.value)}
							aria-selected={isMobileSelected(item.value)}
							disabled={item.disabled}
							onclick={() => selectMobileItem(item.value)}
						>
							<span>{item.label}</span>
							{#if isMobileSelected(item.value)}
								<Check size={18} strokeWidth={2} aria-hidden="true" />
							{/if}
						</button>
					{:else}
						<p class="empty">No matching options.</p>
					{/each}
				</div>
			</div>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>

<style>
	.field {
		display: grid;
		align-content: start;
		gap: 0.45rem;
		min-width: 0;
	}
	label {
		color: var(--color-text-muted);
		font-size: var(--text-sm);
	}
	.required {
		margin-left: 0.2rem;
		color: var(--color-danger);
	}
	.control {
		position: relative;
	}
	:global(.combobox-input) {
		width: 100%;
		height: 2.65rem;
		padding: 0.65rem 2.55rem 0.65rem 2.25rem;
		border: 1px solid var(--color-border-strong);
		border-radius: var(--radius-sm);
		outline: none;
		background: var(--color-surface);
		color: var(--color-text);
		font-size: var(--text-sm);
		transition:
			border-color var(--duration-normal) var(--ease-standard),
			box-shadow var(--duration-normal) var(--ease-standard);
	}
	:global(.combobox-input::placeholder) {
		color: var(--color-text-subtle);
	}
	.has-selection :global(.combobox-input[data-state='closed']) {
		color: transparent;
		caret-color: transparent;
	}
	.selected-values {
		position: absolute;
		top: 50%;
		left: 2.25rem;
		right: 2.55rem;
		overflow: hidden;
		color: var(--color-text);
		font-size: var(--text-sm);
		white-space: nowrap;
		pointer-events: none;
		text-overflow: ellipsis;
		transform: translateY(-50%);
	}
	:global(.combobox-input:hover:not(:disabled)) {
		border-color: var(--color-accent-muted);
	}
	:global(.combobox-input:focus) {
		border-color: var(--color-border-focus);
		box-shadow: var(--focus-ring);
	}
	:global(.combobox-input:disabled) {
		cursor: not-allowed;
		opacity: 0.5;
	}
	:global(.combobox-search) {
		position: absolute;
		top: 50%;
		left: 0.75rem;
		z-index: 1;
		color: var(--color-text-subtle);
		pointer-events: none;
		transform: translateY(-50%);
	}
	:global(.combobox-trigger) {
		position: absolute;
		top: 0;
		right: 0;
		display: grid;
		width: 2.5rem;
		height: 100%;
		place-items: center;
		border: 0;
		outline: none;
		background: transparent;
		color: var(--color-text-subtle);
		cursor: pointer;
	}
	:global(.combobox-trigger:focus-visible) {
		color: var(--color-accent);
	}
	:global(.combobox-trigger:disabled) {
		cursor: not-allowed;
	}
	:global(.combobox-content) {
		z-index: var(--z-dropdown);
		width: var(--bits-combobox-anchor-width);
		min-width: var(--bits-combobox-anchor-width);
		max-height: min(18rem, var(--bits-combobox-content-available-height));
		overflow: hidden;
		padding: 0.35rem;
		border: 1px solid var(--color-border-strong);
		border-radius: var(--radius-md);
		background: var(--color-surface-raised);
		box-shadow: var(--shadow-md);
	}
	:global(.combobox-viewport) {
		max-height: calc(min(18rem, var(--bits-combobox-content-available-height)) - 0.7rem);
		overflow: auto;
	}
	:global(.combobox-item) {
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
	:global(.combobox-item[data-highlighted]) {
		background: var(--color-surface-hover);
		color: var(--color-text);
	}
	:global(.combobox-item[data-disabled]) {
		cursor: not-allowed;
		opacity: 0.45;
	}
	:global(.combobox-indicator) {
		color: var(--color-accent);
	}
	.empty,
	.field > p {
		max-width: none;
		font-size: var(--text-xs);
		line-height: 1.45;
		color: var(--color-text-subtle);
	}
	.empty {
		padding: 0.65rem;
	}
	.error {
		color: var(--color-danger) !important;
	}
	.error-state :global(.combobox-input),
	.error-state .mobile-combobox-trigger {
		border-color: color-mix(in srgb, var(--color-danger), transparent 35%);
	}
	.mobile-combobox-trigger {
		display: grid;
		grid-template-columns: 1rem minmax(0, 1fr) 1rem;
		align-items: center;
		width: 100%;
		height: 2.65rem;
		gap: 0.65rem;
		padding: 0.65rem 0.75rem;
		border: 1px solid var(--color-border-strong);
		border-radius: var(--radius-sm);
		outline: none;
		background: var(--color-surface);
		color: var(--color-text);
		font: inherit;
		font-size: var(--text-sm);
		text-align: left;
		cursor: pointer;
	}
	.mobile-combobox-trigger > :last-child {
		justify-self: end;
		color: var(--color-text-subtle);
	}
	.mobile-combobox-trigger:hover:not(:disabled) {
		border-color: var(--color-accent-muted);
	}
	.mobile-combobox-trigger:focus-visible,
	:global(.mobile-combobox-close:focus-visible),
	.mobile-combobox-search:focus,
	.mobile-combobox-item:focus-visible {
		box-shadow: var(--focus-ring);
	}
	.mobile-combobox-trigger:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}
	.mobile-combobox-trigger span {
		min-width: 0;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.mobile-placeholder {
		color: var(--color-text-subtle);
	}
	:global(.mobile-combobox-overlay) {
		position: fixed;
		inset: 0;
		z-index: var(--z-modal);
		background: color-mix(in srgb, var(--color-overlay) 85%, transparent);
		backdrop-filter: blur(4px);
	}
	:global(.mobile-combobox-dialog) {
		position: fixed;
		inset: 0;
		z-index: calc(var(--z-modal) + 1);
		display: grid;
		grid-template-rows: auto minmax(0, 1fr);
		outline: none;
		background: var(--color-surface-raised);
	}
	.mobile-combobox-heading {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1.25rem 1.5rem;
		border-bottom: 1px solid var(--color-border);
	}
	:global(.mobile-combobox-title) {
		margin: 0;
		color: var(--color-text);
		font: 500 var(--text-xl) var(--font-display);
		letter-spacing: var(--tracking-display);
	}
	:global(.mobile-combobox-close) {
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
	:global(.mobile-combobox-close:hover) {
		background: var(--color-surface-hover);
		color: var(--color-text);
	}
	.mobile-combobox-body {
		display: grid;
		min-height: 0;
		grid-template-rows: auto minmax(0, 1fr);
		gap: 1rem;
		padding: 1rem 1.5rem 1.5rem;
	}
	.mobile-combobox-search-wrap {
		display: flex;
		align-items: center;
		gap: 0.65rem;
		padding: 0 0.75rem;
		border: 1px solid var(--color-border-strong);
		border-radius: var(--radius-sm);
		background: var(--color-surface);
		color: var(--color-text-subtle);
	}
	.mobile-combobox-search {
		width: 100%;
		height: 2.65rem;
		border: 0;
		outline: none;
		background: transparent;
		color: var(--color-text);
		font: inherit;
		font-size: var(--text-sm);
	}
	.mobile-combobox-search::placeholder {
		color: var(--color-text-subtle);
	}
	.mobile-combobox-options {
		overflow: auto;
		padding: 0.35rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
	}
	.mobile-combobox-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		min-height: 2.8rem;
		padding: 0.65rem 0.75rem;
		border: 0;
		border-radius: var(--radius-sm);
		outline: none;
		background: transparent;
		color: var(--color-text-muted);
		font: inherit;
		font-size: var(--text-sm);
		text-align: left;
		cursor: pointer;
	}
	.mobile-combobox-item:hover:not(:disabled),
	.mobile-combobox-item.selected {
		background: var(--color-surface-hover);
		color: var(--color-text);
	}
	.mobile-combobox-item.selected :global(svg) {
		color: var(--color-accent);
	}
	.mobile-combobox-item:disabled {
		cursor: not-allowed;
		opacity: 0.45;
	}

	@media (min-width: 701px) {
		:global(.mobile-combobox-overlay),
		:global(.mobile-combobox-dialog) {
			display: none;
		}
	}
</style>
