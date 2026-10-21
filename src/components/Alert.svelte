<script lang="ts">
	import AlertTriangle from '@lucide/svelte/icons/alert-triangle';
	import CheckCircle2 from '@lucide/svelte/icons/check-circle-2';
	import Info from '@lucide/svelte/icons/info';
	import X from '@lucide/svelte/icons/x';
	import type { Snippet } from 'svelte';

	let {
		tone = 'info',
		title,
		dismissible = false,
		onDismiss,
		children
	}: {
		tone?: 'info' | 'success' | 'warning' | 'danger';
		title?: string;
		dismissible?: boolean;
		onDismiss?: () => void;
		children: Snippet;
	} = $props();

	let visible = $state(true);

	function dismiss() {
		visible = false;
		onDismiss?.();
	}
</script>

{#if visible}
	<div class="alert {tone}" role={tone === 'danger' ? 'alert' : 'status'}>
		<div class="icon" aria-hidden="true">
			{#if tone === 'success'}
				<CheckCircle2 size={18} strokeWidth={1.75} />
			{:else if tone === 'warning' || tone === 'danger'}
				<AlertTriangle size={18} strokeWidth={1.75} />
			{:else}
				<Info size={18} strokeWidth={1.75} />
			{/if}
		</div>
		<div class="copy">
			{#if title}<strong>{title}</strong>{/if}
			<div class="message">{@render children()}</div>
		</div>
		{#if dismissible}
			<button class="dismiss" type="button" aria-label="Dismiss alert" onclick={dismiss}>
				<X size={16} strokeWidth={1.75} aria-hidden="true" />
			</button>
		{/if}
	</div>
{/if}

<style>
	:global(.alert) {
		display: flex;
		align-items: flex-start;
		gap: 0.8rem;
		padding: 1rem 1.1rem;
		border: 1px solid var(--color-border);
		background: var(--color-surface);
		color: var(--color-text-muted);
	}
	:global(.alert.info) {
		border-color: var(--color-accent-muted);
	}
	:global(.alert.success) {
		border-color: color-mix(in srgb, var(--color-success) 45%, var(--color-border));
	}
	:global(.alert.warning) {
		border-color: color-mix(in srgb, var(--color-warning) 45%, var(--color-border));
	}
	:global(.alert.danger) {
		border-color: color-mix(in srgb, var(--color-danger) 45%, var(--color-border));
	}
	.icon {
		display: grid;
		flex: 0 0 auto;
		place-items: center;
		margin-top: 0.1rem;
		color: var(--color-accent);
	}
	:global(.alert.success) .icon {
		color: var(--color-success);
	}
	:global(.alert.warning) .icon {
		color: var(--color-warning);
	}
	:global(.alert.danger) .icon {
		color: var(--color-danger);
	}
	.copy {
		display: grid;
		flex: 1 1 auto;
		gap: 0.3rem;
		min-width: 0;
	}
	strong {
		color: var(--color-text);
		font-size: var(--text-sm);
		font-weight: 600;
	}
	.message {
		font-size: var(--text-sm);
		line-height: 1.5;
	}
	.dismiss {
		display: grid;
		flex: 0 0 auto;
		place-items: center;
		width: 1.75rem;
		height: 1.75rem;
		margin: -0.25rem -0.35rem 0 0;
		padding: 0;
		border: 0;
		outline: none;
		background: transparent;
		color: var(--color-text-subtle);
		cursor: pointer;
		transition:
			color var(--duration-normal) var(--ease-standard),
			background var(--duration-normal) var(--ease-standard);
	}
	.dismiss:hover {
		background: var(--color-surface-hover);
		color: var(--color-text);
	}
	.dismiss:focus-visible {
		box-shadow: var(--focus-ring);
		color: var(--color-accent);
	}
</style>
