<script lang="ts">
	import X from '@lucide/svelte/icons/x';
	import { Dialog } from 'bits-ui';
	import type { Snippet } from 'svelte';

	let {
		open = $bindable(false),
		title,
		description,
		closeOnOutsideClick = true,
		content,
		footer,
		trigger
	}: {
		open?: boolean;
		title: string;
		description?: string;
		closeOnOutsideClick?: boolean;
		content: Snippet;
		footer?: Snippet;
		trigger?: Snippet;
	} = $props();

	function closeFooterAction(event: MouseEvent) {
		if ((event.target as HTMLElement).closest('.modal-action')) open = false;
	}
</script>

<Dialog.Root bind:open>
	{#if trigger}
		<Dialog.Trigger class="modal-trigger">{@render trigger()}</Dialog.Trigger>
	{/if}
	<Dialog.Portal>
		<Dialog.Overlay class="modal-overlay" />
		<Dialog.Content
			class="modal-content"
			interactOutsideBehavior={closeOnOutsideClick ? 'close' : 'ignore'}
			onclick={closeFooterAction}
		>
			<div class="modal-heading">
				<div>
					<Dialog.Title class="modal-title">{title}</Dialog.Title>
					{#if description}<Dialog.Description class="modal-description"
							>{description}</Dialog.Description
						>{/if}
				</div>
				<Dialog.Close class="modal-close" aria-label="Close dialog">
					<X size={18} strokeWidth={1.75} aria-hidden="true" />
				</Dialog.Close>
			</div>
			<div class="modal-body">{@render content()}</div>
			{#if footer}
				<div class="modal-footer">{@render footer()}</div>
			{/if}
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>

<style>
	:global(.modal-trigger) {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: fit-content;
		min-height: 2.5rem;
		padding: 0.65rem 1rem;
		border: 1px solid var(--color-accent);
		border-radius: var(--radius-sm);
		outline: none;
		background: var(--color-accent);
		color: var(--color-accent-ink);
		font: 600 var(--text-xs) var(--font-body);
		letter-spacing: 0.1em;
		text-transform: uppercase;
		cursor: pointer;
	}
	:global(.modal-trigger:hover) {
		filter: brightness(1.1);
	}
	:global(.modal-trigger:focus-visible) {
		box-shadow: var(--focus-ring);
	}
	:global(.modal-overlay) {
		position: fixed;
		inset: 0;
		z-index: var(--z-modal);
		background: color-mix(in srgb, var(--color-background) 78%, transparent);
		backdrop-filter: blur(3px);
	}
	:global(.modal-content) {
		position: fixed;
		top: 50%;
		left: 50%;
		z-index: calc(var(--z-modal) + 1);
		display: grid;
		width: min(calc(100vw - 2rem), 34rem);
		max-height: calc(100vh - 2rem);
		grid-template-rows: auto auto auto;
		transform: translate(-50%, -50%);
		border: 1px solid var(--color-border-strong);
		border-radius: var(--radius-md);
		outline: none;
		background: var(--color-surface-raised);
		box-shadow: var(--shadow-lg);
	}
	.modal-heading {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
		padding: 1.5rem 1.5rem 1rem;
		border-bottom: 1px solid var(--color-border);
	}
	:global(.modal-title) {
		margin: 0;
		color: var(--color-text);
		font: 600 var(--text-lg) var(--font-display);
		letter-spacing: var(--tracking-tight);
	}
	:global(.modal-description) {
		margin-top: 0.45rem;
		font-size: var(--text-sm);
		line-height: 1.5;
	}
	:global(.modal-close) {
		display: grid;
		flex: 0 0 auto;
		place-items: center;
		width: 2rem;
		height: 2rem;
		margin: -0.35rem -0.35rem 0 0;
		padding: 0;
		border: 0;
		border-radius: var(--radius-sm);
		outline: none;
		background: transparent;
		color: var(--color-text-subtle);
		cursor: pointer;
	}
	:global(.modal-close:hover) {
		background: var(--color-surface-hover);
		color: var(--color-text);
	}
	:global(.modal-close:focus-visible) {
		box-shadow: var(--focus-ring);
		color: var(--color-accent);
	}
	.modal-body {
		min-height: 0;
		overflow: auto;
		padding: 1.25rem 1.5rem;
		color: var(--color-text-muted);
		font-size: var(--text-sm);
		line-height: 1.6;
	}
	:global(.modal-action) {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 2.35rem;
		padding: 0.6rem 0.9rem;
		border: 1px solid var(--color-border-strong);
		border-radius: var(--radius-sm);
		font: 600 var(--text-xs) var(--font-body);
		letter-spacing: 0.08em;
		text-transform: uppercase;
		cursor: pointer;
	}
	:global(.modal-action.primary) {
		border-color: var(--color-accent);
		background: var(--color-accent);
		color: var(--color-accent-ink);
	}
	:global(.modal-action.secondary) {
		background: transparent;
		color: var(--color-text-muted);
	}
	:global(.modal-action:hover) {
		filter: brightness(1.1);
	}
	.modal-footer {
		display: flex;
		justify-content: flex-end;
		gap: 0.75rem;
		padding: 1rem 1.5rem 1.5rem;
		border-top: 1px solid var(--color-border);
	}
	:global(.modal-footer-note) {
		margin-right: auto;
		color: var(--color-text-subtle);
		font-size: var(--text-xs);
		line-height: 1.4;
	}
	@media (max-width: 560px) {
		:global(.modal-content) {
			width: min(calc(100vw - 1rem), 34rem);
			max-height: calc(100vh - 1rem);
		}
	}
</style>
