<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import Clipboard from '@lucide/svelte/icons/clipboard';
	import hljs from 'highlight.js/lib/core';
	import bash from 'highlight.js/lib/languages/bash';
	import css from 'highlight.js/lib/languages/css';
	import ini from 'highlight.js/lib/languages/ini';
	import javascript from 'highlight.js/lib/languages/javascript';
	import json from 'highlight.js/lib/languages/json';
	import lua from 'highlight.js/lib/languages/lua';
	import powershell from 'highlight.js/lib/languages/powershell';
	import rust from 'highlight.js/lib/languages/rust';
	import typescript from 'highlight.js/lib/languages/typescript';

	hljs.registerLanguage('bash', bash);
	hljs.registerLanguage('css', css);
	hljs.registerLanguage('ini', ini);
	hljs.registerLanguage('javascript', javascript);
	hljs.registerLanguage('js', javascript);
	hljs.registerLanguage('json', json);
	hljs.registerLanguage('lua', lua);
	hljs.registerLanguage('luau', lua);
	hljs.registerLanguage('powershell', powershell);
	hljs.registerLanguage('rust', rust);
	hljs.registerLanguage('typescript', typescript);
	hljs.registerLanguage('ts', typescript);

	let {
		code,
		language = 'text',
		filename,
		copyable = true
	}: {
		code: string;
		language?: string;
		filename?: string;
		copyable?: boolean;
	} = $props();

	let copied = $state(false);
	let copyTimer: ReturnType<typeof setTimeout> | undefined;
	let highlightedCode = $derived.by(() => {
		try {
			return hljs.highlight(code, { language }).value;
		} catch {
			return code.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
		}
	});

	async function copyCode() {
		try {
			await navigator.clipboard.writeText(code);
			copied = true;
			if (copyTimer) clearTimeout(copyTimer);
			copyTimer = setTimeout(() => {
				copied = false;
			}, 1800);
		} catch {
			copied = false;
		}
	}
</script>

<div class="code-block">
	<div class="code-header">
		<div class="code-meta">
			{#if filename}<span class="code-filename">{filename}</span>{/if}
			<span class="code-language">{language}</span>
		</div>
		{#if copyable}
			<button
				class="copy-button"
				type="button"
				onclick={copyCode}
				aria-label={copied ? 'Code copied' : 'Copy code'}
			>
				{#if copied}
					<Check size={15} strokeWidth={1.75} aria-hidden="true" />
					<span>Copied</span>
				{:else}
					<Clipboard size={15} strokeWidth={1.75} aria-hidden="true" />
					<span>Copy</span>
				{/if}
			</button>
		{/if}
	</div>
	<pre><code>{@html highlightedCode}</code></pre>
	{#if copied}<span class="sr-only" role="status">Code copied to clipboard.</span>{/if}
</div>

<style>
	.code-block {
		width: 100%;
		min-width: 0;
		max-width: 100%;
		overflow: hidden;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		background: var(--color-surface-inset);
		box-shadow: var(--shadow-sm);
	}

	.code-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		min-height: 2.65rem;
		padding: 0.45rem 0.75rem 0.45rem 1rem;
		border-bottom: 1px solid var(--color-border);
		background: var(--color-surface);
	}

	.code-meta {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		min-width: 0;
	}

	.code-filename {
		overflow: hidden;
		color: var(--color-text);
		font-size: var(--text-sm);
		font-weight: 500;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.code-language {
		color: var(--color-steel-bright);
		font-size: var(--text-sm);
		font-weight: 500;
	}

	.copy-button {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		flex: 0 0 auto;
		padding: 0.35rem 0.6rem;
		border: 1px solid transparent;
		border-radius: var(--radius-sm);
		background: transparent;
		color: var(--color-text-muted);
		font-size: var(--text-sm);
		font-weight: 500;
		cursor: pointer;
		transition:
			border-color var(--duration-fast) var(--ease-standard),
			color var(--duration-fast) var(--ease-standard);
	}

	.copy-button:hover {
		border-color: var(--color-border-strong);
		color: var(--color-text);
	}

	.copy-button:focus-visible {
		outline: 2px solid var(--color-border-focus);
		outline-offset: 2px;
	}

	pre {
		display: block;
		width: 100%;
		min-width: 0;
		max-width: 100%;
		max-height: 28rem;
		margin: 0;
		overflow-x: auto;
		overflow-y: auto;
		padding: 1.15rem 1rem;
		color: var(--color-text-muted);
		font: var(--text-sm) / 1.65 var(--font-mono);
		tab-size: 2;
		white-space: pre;
	}

	code {
		display: block;
		min-width: max-content;
		font: inherit;
		color: inherit;
	}

	:global(.hljs-comment),
	:global(.hljs-quote) {
		color: var(--color-text-subtle);
	}

	:global(.hljs-keyword),
	:global(.hljs-selector-tag),
	:global(.hljs-literal) {
		color: var(--color-accent);
	}

	:global(.hljs-string),
	:global(.hljs-title),
	:global(.hljs-section),
	:global(.hljs-attribute) {
		color: var(--color-success);
	}

	:global(.hljs-number),
	:global(.hljs-variable),
	:global(.hljs-template-variable) {
		color: var(--color-accent-hover);
	}

	:global(.hljs-built_in),
	:global(.hljs-type),
	:global(.hljs-symbol) {
		color: var(--color-steel-bright);
	}

	@media (max-width: 560px) {
		pre {
			white-space: pre-wrap;
			overflow-wrap: anywhere;
			word-break: break-word;
		}

		code {
			min-width: 0;
		}
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}
</style>
