<script lang="ts">
	import type { PageData } from './$types';
	import Card from '../../components/Card.svelte';
	import CodeBlock from '../../components/CodeBlock.svelte';
	import SectionHeader from '../../components/SectionHeader.svelte';
	import Divider from '../../components/Divider.svelte';
	import Badge from '../../components/Badge.svelte';

	let { data }: { data: PageData } = $props();

	// If there are releases, get the latest one
	let latestRelease = $derived(data.releases?.[0]);
	let otherReleases = $derived(data.releases?.slice(1) || []);

	const installLinuxMac = `git clone https://github.com/Mudcrab-Team/mudcrab.git
cd mudcrab
cargo build --release`;
	const installWindows = `git clone https://github.com/Mudcrab-Team/mudcrab.git
cd mudcrab
cargo build --release`;
</script>

<svelte:head>
	<title>Releases - Mudcrab</title>
</svelte:head>

<div class="releases-page">
	<section class="section install-section">
		<SectionHeader
			eyebrow="Download"
			title="Install Mudcrab"
			description="Clone and build Mudcrab from source on your machine."
			align="center"
		/>

		<div class="install-methods">
			<Card variant="default">
				{#snippet children()}
					<h3>Linux & macOS</h3>
					<p>Run this command in your terminal to build from source.</p>
					<div class="code-container">
						<CodeBlock code={installLinuxMac} language="bash" />
					</div>
				{/snippet}
			</Card>

			<Card variant="default">
				{#snippet children()}
					<h3>Windows</h3>
					<p>Run this command in PowerShell to build from source.</p>
					<div class="code-container">
						<CodeBlock code={installWindows} language="powershell" />
					</div>
				{/snippet}
			</Card>
		</div>
	</section>

	<Divider spacing="lg" />

	<section class="section releases-list">
		<SectionHeader
			title="Latest Release"
			description="The most recent updates, bug fixes, and features."
		/>

		{#if data.error}
			<div class="error">
				<p>{data.error}</p>
			</div>
		{:else if !latestRelease}
			<div class="empty">
				<p>No releases found yet.</p>
			</div>
		{:else}
			<Card variant="feature">
				{#snippet children()}
					<div class="release-header">
						<div class="title-group">
							<h3>{latestRelease.name || latestRelease.tag_name}</h3>
							{#if latestRelease.prerelease}
								<Badge tone="warning">Pre-release</Badge>
							{:else}
								<Badge tone="success">Latest</Badge>
							{/if}
						</div>
						<span class="release-date"
							>{new Date(latestRelease.published_at).toLocaleDateString()}</span
						>
					</div>

					<div class="release-notes markdown-body">
						<!-- Ideally this would render markdown, but for now we just show text or use a simple render -->
						<pre class="notes-text">{latestRelease.body}</pre>
					</div>

					{#if latestRelease.assets && latestRelease.assets.length > 0}
						<div class="assets">
							<h4>Assets</h4>
							<ul>
								{#each latestRelease.assets as asset}
									<li>
										<a href={asset.browser_download_url} target="_blank" rel="noopener noreferrer">
											{asset.name}
										</a>
										<span class="size">({(asset.size / 1024 / 1024).toFixed(2)} MB)</span>
									</li>
								{/each}
							</ul>
						</div>
					{/if}
				{/snippet}
			</Card>
		{/if}
	</section>
</div>

<style>
	.releases-page {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		padding: 2.5rem 0 5rem;
	}

	.install-methods {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.5rem;
		margin-top: 2rem;
	}

	@media (min-width: 768px) {
		.install-methods {
			grid-template-columns: 1fr 1fr;
		}
	}

	.code-container {
		margin-top: 1.5rem;
	}

	.release-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.title-group {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.title-group h3 {
		margin: 0;
	}

	.release-date {
		color: var(--color-text-muted);
		font-size: var(--text-sm);
	}

	.notes-text {
		white-space: pre-wrap;
		font-family: var(--font-body);
		font-size: var(--text-sm);
		line-height: 1.6;
		color: var(--color-text);
		background: transparent;
		padding: 0;
		margin: 0 0 2rem 0;
		border: none;
	}

	.assets {
		margin-top: 2rem;
		padding-top: 1.5rem;
		border-top: 1px solid var(--color-border);
	}

	.assets h4 {
		margin-top: 0;
		margin-bottom: 1rem;
		font-size: var(--text-base);
	}

	.assets ul {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.assets li {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.assets a {
		color: var(--color-accent);
		text-decoration: none;
	}

	.assets a:hover {
		text-decoration: underline;
	}

	.size {
		color: var(--color-text-subtle);
		font-size: var(--text-sm);
	}
</style>
