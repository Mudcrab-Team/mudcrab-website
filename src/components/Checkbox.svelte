<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import Minus from '@lucide/svelte/icons/minus';
	import { Checkbox } from 'bits-ui';

	let {
		id = 'checkbox-input',
		label,
		description,
		checked = $bindable(false),
		indeterminate = $bindable(false),
		disabled = false,
		required = false
	}: {
		id?: string;
		label: string;
		description?: string;
		checked?: boolean;
		indeterminate?: boolean;
		disabled?: boolean;
		required?: boolean;
	} = $props();
</script>

<div class="checkbox-field">
	<Checkbox.Root
		{id}
		bind:checked
		bind:indeterminate
		{disabled}
		{required}
		aria-labelledby={`${id}-label`}
		aria-describedby={description ? `${id}-description` : undefined}
		class="checkbox"
	>
		{#snippet children({
			checked: isChecked,
			indeterminate: isIndeterminate
		}: {
			checked: boolean;
			indeterminate: boolean;
		})}
			{#if isIndeterminate}
				<Minus size={15} strokeWidth={2.5} aria-hidden="true" />
			{:else if isChecked}
				<Check size={15} strokeWidth={2.5} aria-hidden="true" />
			{/if}
		{/snippet}
	</Checkbox.Root>
	<div class="copy">
		<label id={`${id}-label`} for={id}>{label}</label>
		{#if description}<p id={`${id}-description`}>{description}</p>{/if}
	</div>
</div>

<style>
	.checkbox-field {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		min-width: 0;
	}
	:global(.checkbox) {
		display: inline-flex;
		flex: 0 0 auto;
		align-items: center;
		justify-content: center;
		width: 1.25rem;
		height: 1.25rem;
		margin-top: 0.05rem;
		padding: 0;
		border: 1px solid var(--color-border-strong);
		border-radius: var(--radius-sm);
		outline: none;
		background: var(--color-surface);
		color: var(--color-accent-ink);
		cursor: pointer;
		transition:
			background var(--duration-normal) var(--ease-standard),
			border-color var(--duration-normal) var(--ease-standard),
			transform var(--duration-fast) var(--ease-standard);
	}
	:global(.checkbox:hover:not(:disabled)) {
		border-color: var(--color-accent);
	}
	:global(.checkbox:focus-visible) {
		border-color: var(--color-border-focus);
		box-shadow: var(--focus-ring);
	}
	:global(.checkbox[data-state='checked']),
	:global(.checkbox[data-state='indeterminate']) {
		border-color: var(--color-accent);
		background: var(--color-accent);
	}
	:global(.checkbox:active:not(:disabled)) {
		transform: scale(0.94);
	}
	:global(.checkbox:disabled) {
		cursor: not-allowed;
		opacity: 0.45;
	}
	.copy {
		display: grid;
		gap: 0.25rem;
		min-width: 0;
	}
	label {
		color: var(--color-text-muted);
		font-size: var(--text-sm);
		line-height: 1.4;
		cursor: pointer;
	}
	p {
		max-width: none;
		font-size: var(--text-xs);
		line-height: 1.45;
	}
</style>
