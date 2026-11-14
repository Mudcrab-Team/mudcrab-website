<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import Clipboard from '@lucide/svelte/icons/clipboard';
	import hljs from 'highlight.js/lib/core';
	import bash from 'highlight.js/lib/languages/bash';
	import css from 'highlight.js/lib/languages/css';
	import javascript from 'highlight.js/lib/languages/javascript';
	import json from 'highlight.js/lib/languages/json';
	import lua from 'highlight.js/lib/languages/lua';
	import powershell from 'highlight.js/lib/languages/powershell';
	import rust from 'highlight.js/lib/languages/rust';
	import sql from 'highlight.js/lib/languages/sql';
	import typescript from 'highlight.js/lib/languages/typescript';

	hljs.registerLanguage('bash', bash);
	hljs.registerLanguage('sh', bash);
	hljs.registerLanguage('css', css);
	hljs.registerLanguage('javascript', javascript);
	hljs.registerLanguage('js', javascript);
	hljs.registerLanguage('json', json);
	hljs.registerLanguage('lua', lua);
	hljs.registerLanguage('luau', lua);
	hljs.registerLanguage('powershell', powershell);
	hljs.registerLanguage('rust', rust);
	hljs.registerLanguage('sql', sql);
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

<div class="w-full overflow-hidden rounded-box border border-base-300 bg-[#080d13] text-[#edf3f7]">
	<div
		class="flex min-h-10 items-center justify-between gap-3 border-b border-base-300/70 bg-[#101924] px-4 py-2"
	>
		<div class="flex min-w-0 items-center gap-3 text-sm">
			{#if filename}
				<span class="truncate font-medium text-[#edf3f7]">{filename}</span>
			{/if}
			<span class="text-sm font-medium text-[#76b0d1]">{language}</span>
		</div>
		{#if copyable}
			<button
				type="button"
				onclick={copyCode}
				aria-label={copied ? 'Code copied' : 'Copy code'}
				class="btn gap-1.5 btn-ghost text-sm font-medium text-[#b4c5d2] btn-xs hover:bg-[#1a2838] hover:text-[#edf3f7]"
			>
				{#if copied}
					<Check size={14} aria-hidden="true" class="text-[#52a87d]" />
					<span>Copied</span>
				{:else}
					<Clipboard size={14} aria-hidden="true" />
					<span>Copy</span>
				{/if}
			</button>
		{/if}
	</div>
	<pre class="m-0 max-h-[26rem] overflow-x-auto p-4 font-mono text-sm leading-relaxed"><code
			>{@html highlightedCode}</code
		></pre>
	{#if copied}<span class="sr-only" role="status">Code copied to clipboard.</span>{/if}
</div>

<style>
	:global(.hljs-comment),
	:global(.hljs-quote) {
		color: #7d93a5;
	}
	:global(.hljs-keyword),
	:global(.hljs-selector-tag),
	:global(.hljs-literal) {
		color: #76b0d1;
	}
	:global(.hljs-string),
	:global(.hljs-title),
	:global(.hljs-section),
	:global(.hljs-attribute) {
		color: #7fc8a2;
	}
	:global(.hljs-number),
	:global(.hljs-variable),
	:global(.hljs-template-variable) {
		color: #e5a645;
	}
	:global(.hljs-built_in),
	:global(.hljs-type),
	:global(.hljs-symbol) {
		color: #9dc9e3;
	}
</style>
