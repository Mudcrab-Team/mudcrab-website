<script lang="ts">
	import type { PageData } from './$types';
	import Button from '../../components/Button.svelte';
	import CodeBlock from '../../components/CodeBlock.svelte';
	import SectionHeader from '../../components/SectionHeader.svelte';

	let { data }: { data: PageData } = $props();

	let setupMode = $state<'launcher' | 'cli' | 'synthetic'>('launcher');

	let latestRelease = $derived(data.releases?.[0]);
	let otherReleases = $derived(data.releases?.slice(1) || []);

	const launcherCmd = `git clone https://github.com/Mudcrab-Team/mudcrab.git
cd mudcrab
cargo build --release --bin engine --bin launcher
cargo run --release -p launcher`;

	const gpuConvertCmd = `# Convert Skyrim SE data using GPU texture compression (recommended on modern GPUs)
cargo run --release -p converter --bin converter -- \\
  "<Skyrim Data>" modern_assets --texture-encoder gpu --cpu-jobs 8 --io-jobs 4

# Launch directly into Tamriel
cargo run --release -p engine --bin engine -- --assets modern_assets`;

	const syntheticCmd = `cargo run -p dummy-content -- gen Data
cargo run -p converter --bin converter -- Data modern_assets
cargo run -p engine --bin engine -- --assets modern_assets --worldspace 1`;

	const requirements = [
		{
			label: 'Game copy',
			value: 'Legal installation of The Elder Scrolls V: Skyrim Special Edition'
		},
		{
			label: 'Graphics API',
			value: 'GPU with Vulkan, DirectX 12, or Metal and BC texture support'
		},
		{
			label: 'Disk space',
			value: '20 to 30 GB free for Rust build output and converted assets'
		},
		{
			label: 'Toolchain',
			value: 'Rust toolchain (or devenv shell) to compile launcher and engine'
		}
	];
</script>

<svelte:head>
	<title>Play and Releases · Mudcrab</title>
	<meta
		name="description"
		content="Build and launch Mudcrab for Skyrim Special Edition, configure GPU texture conversion, and inspect published releases."
	/>
</svelte:head>

<div class="releases-page">
	<header class="page-intro">
		<h1>Play Mudcrab</h1>
		<p>
			Build the desktop launcher and Bevy engine from source, convert your Skyrim Special Edition
			installation once, and enter Tamriel without loading screens.
		</p>
	</header>

	<section class="setup-workbench" aria-labelledby="setup-heading">
		<div class="workbench-top">
			<h2 id="setup-heading">Choose how you want to run</h2>
			<div class="segmented" role="tablist" aria-label="Setup workflow">
				<button
					type="button"
					role="tab"
					aria-selected={setupMode === 'launcher'}
					class:active={setupMode === 'launcher'}
					onclick={() => (setupMode = 'launcher')}
				>
					Launcher
				</button>
				<button
					type="button"
					role="tab"
					aria-selected={setupMode === 'cli'}
					class:active={setupMode === 'cli'}
					onclick={() => (setupMode = 'cli')}
				>
					GPU CLI
				</button>
				<button
					type="button"
					role="tab"
					aria-selected={setupMode === 'synthetic'}
					class:active={setupMode === 'synthetic'}
					onclick={() => (setupMode = 'synthetic')}
				>
					No-Skyrim test
				</button>
			</div>
		</div>

		{#if setupMode === 'launcher'}
			<div class="setup-panel">
				<div class="setup-steps">
					<ol>
						<li>
							<strong>Build engine and launcher together:</strong> Both binaries live side by side in
							the same Cargo profile so the launcher starts the matching engine.
						</li>
						<li>
							<strong>Auto-detect Skyrim SE:</strong> The launcher locates Steam installs
							automatically, or lets you drag your <code>Data</code> folder onto the window.
						</li>
						<li>
							<strong>Convert and play:</strong> Press <strong>Start</strong> to build
							<code>modern_assets</code>, then press <strong>Play Mudcrab</strong>. Later runs reuse
							unchanged assets automatically.
						</li>
					</ol>
				</div>
				<CodeBlock code={launcherCmd} language="bash" filename="Build and open the launcher" />
			</div>
		{:else if setupMode === 'cli'}
			<div class="setup-panel">
				<div class="setup-steps">
					<ol>
						<li>
							<strong>Accelerate texture encoding on GPU:</strong> Passing
							<code>--texture-encoder gpu</code> runs a wgpu compute encoder that cuts full conversion
							time dramatically on modern GPUs while keeping native BC textures untouched.
						</li>
						<li>
							<strong>Customize starting cell:</strong> Pass <code>--worldspace</code>,
							<code>--grid-x</code>, and <code>--grid-y</code> to spawn anywhere in Tamriel.
						</li>
						<li>
							<strong>Switch walk and noclip in-game:</strong> Sessions start in Rapier 3D WALK
							mode; press <code>V</code> or run <code>tcl</code> in the console to toggle free flight.
						</li>
					</ol>
				</div>
				<CodeBlock
					code={gpuConvertCmd}
					language="bash"
					filename="GPU-accelerated conversion and launch"
				/>
			</div>
		{:else}
			<div class="setup-panel">
				<div class="setup-steps">
					<ol>
						<li>
							<strong>Zero copyrighted data required:</strong> The <code>dummy-content</code>
							crate generates a small deterministic game fixture into <code>Data</code>.
						</li>
						<li>
							<strong>Verify pipeline end to end:</strong> Convert the synthetic fixture and launch
							the engine against worldspace form ID <code>1</code>.
						</li>
						<li>
							<strong>Ideal for modders and contributors:</strong> Test rendering changes or Luau scripts
							in seconds.
						</li>
					</ol>
				</div>
				<CodeBlock
					code={syntheticCmd}
					language="bash"
					filename="Run synthetic test fixture (worldspace 1)"
				/>
			</div>
		{/if}
	</section>

	<section class="requirements-section" aria-labelledby="req-heading">
		<SectionHeader
			id="req-heading"
			title="System requirements"
			description="What your machine needs to compile Mudcrab, convert game assets, and stream Tamriel smoothly."
		/>
		<div class="req-grid">
			{#each requirements as req}
				<div class="req-item">
					<span class="req-label">{req.label}</span>
					<p class="req-value">{req.value}</p>
				</div>
			{/each}
		</div>
	</section>

	<section class="releases-list" aria-labelledby="releases-heading">
		<SectionHeader
			id="releases-heading"
			title="Published releases"
			description="Tagged prebuilt builds and release notes synchronized from GitHub."
		>
			{#snippet action()}
				<Button
					variant="secondary"
					href="https://github.com/Mudcrab-Team/mudcrab/releases"
					target="_blank"
				>
					All releases on GitHub
				</Button>
			{/snippet}
		</SectionHeader>

		{#if data.error}
			<div class="release-empty">
				<p>
					Unable to fetch releases from GitHub right now. Check the
					<a
						href="https://github.com/Mudcrab-Team/mudcrab/releases"
						target="_blank"
						rel="noreferrer"
					>
						GitHub releases page
					</a>
					or build from <code>main</code> using the instructions above.
				</p>
			</div>
		{:else if !latestRelease}
			<div class="release-empty">
				<h3>Building directly from main</h3>
				<p>
					Prebuilt binary releases have not been tagged yet while Phase 1 and Phase 2 acceptance
					milestones are finalized. Clone <code>main</code> above to run the latest launcher and
					engine, or follow progress on the <a href="/roadmap">live roadmap</a>.
				</p>
			</div>
		{:else}
			<article class="release-card">
				<div class="release-header">
					<div class="title-group">
						<h3>{latestRelease.name || latestRelease.tag_name}</h3>
						<span class="release-tag">{latestRelease.prerelease ? 'Pre-release' : 'Latest'}</span>
					</div>
					<span class="release-date">
						{new Date(latestRelease.published_at).toLocaleDateString()}
					</span>
				</div>

				{#if latestRelease.body}
					<pre class="notes-text">{latestRelease.body}</pre>
				{/if}

				{#if latestRelease.assets && latestRelease.assets.length > 0}
					<div class="assets">
						<h4>Downloads</h4>
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
			</article>

			{#if otherReleases.length > 0}
				<div class="older-releases">
					<h3>Earlier releases</h3>
					<ul>
						{#each otherReleases as release}
							<li>
								<span class="older-name">{release.name || release.tag_name}</span>
								<span class="older-date">
									{new Date(release.published_at).toLocaleDateString()}
								</span>
							</li>
						{/each}
					</ul>
				</div>
			{/if}
		{/if}
	</section>
</div>

<style>
	.releases-page {
		display: flex;
		flex-direction: column;
		gap: 3.5rem;
		padding-top: 2.5rem;
	}

	.page-intro {
		padding-bottom: 2rem;
		border-bottom: 1px solid var(--color-border);
	}

	.page-intro h1 {
		font-size: clamp(2.1rem, 4vw, 3.25rem);
		line-height: 1.04;
		margin-bottom: 1rem;
	}

	.setup-workbench {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.workbench-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1.5rem;
		flex-wrap: wrap;
	}

	.segmented {
		display: inline-flex;
		padding: 0.25rem;
		border: 1px solid var(--color-border-strong);
		border-radius: var(--radius-md);
		background: var(--color-surface);
		flex-wrap: wrap;
	}

	.segmented button {
		padding: 0.5rem 0.95rem;
		border: 0;
		border-radius: var(--radius-sm);
		background: transparent;
		color: var(--color-text-muted);
		font-size: var(--text-sm);
		font-weight: 600;
		cursor: pointer;
		transition:
			background var(--duration-fast) var(--ease-standard),
			color var(--duration-fast) var(--ease-standard);
	}

	.segmented button:hover {
		color: var(--color-text);
	}

	.segmented button.active {
		background: var(--color-accent);
		color: var(--color-accent-ink);
	}

	.setup-panel {
		display: grid;
		grid-template-columns: 0.9fr 1.1fr;
		gap: 2rem;
		align-items: start;
		padding: clamp(1.25rem, 3vw, 2.25rem);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		background: var(--color-surface);
	}

	.setup-steps ol {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin: 0;
	}

	.setup-steps code,
	.release-empty code {
		padding: 0.1rem 0.35rem;
		border-radius: var(--radius-sm);
		background: var(--color-surface-inset);
		color: var(--color-steel-bright);
		font-family: var(--font-mono);
		font-size: var(--text-sm);
	}

	.requirements-section,
	.releases-list {
		padding-top: 2.5rem;
		border-top: 1px solid var(--color-border);
	}

	.req-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 1.5rem;
		border-top: 1px solid var(--color-border);
		padding-top: 1.5rem;
	}

	.req-item {
		display: flex;
		flex-direction: column;
		gap: 0.45rem;
	}

	.req-label {
		color: var(--color-steel-bright);
		font-size: var(--text-sm);
		font-weight: 600;
	}

	.req-value {
		margin: 0;
		color: var(--color-text-muted);
	}

	.release-empty,
	.release-card {
		padding: 1.75rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		background: var(--color-surface);
	}

	.release-empty h3 {
		margin-bottom: 0.5rem;
		font-family: var(--font-display);
	}

	.release-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 1rem;
		margin-bottom: 1.25rem;
	}

	.title-group {
		display: flex;
		align-items: baseline;
		gap: 0.85rem;
	}

	.release-tag {
		color: var(--color-accent);
		font-size: var(--text-sm);
		font-weight: 600;
	}

	.release-date {
		color: var(--color-text-subtle);
		font-size: var(--text-sm);
	}

	.notes-text {
		white-space: pre-wrap;
		font-family: var(--font-body);
		font-size: var(--text-body);
		line-height: 1.6;
		color: var(--color-text-muted);
		background: transparent;
		padding: 0;
		margin: 0;
		border: 0;
	}

	.assets {
		margin-top: 1.5rem;
		padding-top: 1.25rem;
		border-top: 1px solid var(--color-border);
	}

	.assets h4 {
		margin-bottom: 0.75rem;
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
		margin: 0;
	}

	.size {
		color: var(--color-text-subtle);
		font-size: var(--text-sm);
	}

	.older-releases {
		margin-top: 1.5rem;
		padding-top: 1.5rem;
		border-top: 1px solid var(--color-border);
	}

	.older-releases h3 {
		margin-bottom: 0.75rem;
	}

	.older-releases ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.older-releases li {
		display: flex;
		justify-content: space-between;
		padding: 0.65rem 0;
		border-bottom: 1px solid var(--color-border);
	}

	.older-date {
		color: var(--color-text-subtle);
		font-size: var(--text-sm);
	}

	@media (max-width: 900px) {
		.setup-panel {
			grid-template-columns: 1fr;
		}

		.req-grid {
			grid-template-columns: 1fr 1fr;
		}
	}

	@media (max-width: 560px) {
		.req-grid {
			grid-template-columns: 1fr;
		}

		.segmented {
			display: grid;
			grid-template-columns: repeat(3, minmax(0, 1fr));
			width: 100%;
		}

		.segmented button {
			padding: 0.5rem 0.35rem;
			text-align: center;
		}
	}
</style>
