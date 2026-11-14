<script lang="ts">
	import AlertTriangle from '@lucide/svelte/icons/alert-triangle';
	import Download from '@lucide/svelte/icons/download';
	import type { PageData } from './$types';
	import CodeBlock from '../../components/CodeBlock.svelte';

	let { data }: { data: PageData } = $props();

	let buildTab = $state<'linux' | 'windows' | 'synthetic'>('linux');

	let latestRelease = $derived(data.releases?.[0]);
	let olderReleases = $derived(data.releases?.slice(1, 5) ?? []);

	const installLinuxMac = `# Install Rust via rustup and Bevy Linux dependencies first
git clone https://github.com/Mudcrab-Team/mudcrab.git
cd mudcrab
cargo build --release --bin engine --bin launcher
cargo run --release -p launcher`;

	const installWindows = `# Requires Rust via rustup and Visual Studio Build Tools (C/C++)
git clone https://github.com/Mudcrab-Team/mudcrab.git
cd mudcrab
cargo build --release --bin engine --bin launcher
cargo run --release -p launcher`;

	const syntheticSetup = `# Test the full pipeline without a Skyrim Special Edition install
git clone https://github.com/Mudcrab-Team/mudcrab.git
cd mudcrab
cargo run -p dummy-content -- gen Data
cargo run -p converter --bin converter -- Data modern_assets
cargo run -p engine --bin engine -- --assets modern_assets --worldspace 1`;
</script>

<svelte:head>
	<title>Releases &amp; Source Builds · Mudcrab Engine</title>
	<meta
		name="description"
		content="Build Mudcrab from source on Linux, macOS, or Windows, or download tagged GitHub releases."
	/>
</svelte:head>

<main class="space-y-14 py-12 sm:py-16">
	<section class="space-y-6 border-b border-base-300 pb-12" aria-labelledby="install-heading">
		<div class="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
			<div class="max-w-2xl space-y-3">
				<h1
					id="install-heading"
					class="font-display text-[clamp(2.25rem,4.5vw,3.5rem)] font-bold text-base-content"
				>
					Build and releases
				</h1>
				<p class="prose-measure text-base-content/80">
					Clone the Rust workspace to run the launcher and engine today, or inspect published GitHub
					releases below.
				</p>
			</div>

			<div
				role="tablist"
				aria-label="Platform build instructions"
				class="tabs-box tabs bg-base-200 p-1"
			>
				<button
					type="button"
					role="tab"
					aria-selected={buildTab === 'linux'}
					class="tab text-sm font-medium {buildTab === 'linux'
						? 'tab-active bg-secondary text-secondary-content'
						: ''}"
					onclick={() => (buildTab = 'linux')}
				>
					Linux &amp; macOS
				</button>
				<button
					type="button"
					role="tab"
					aria-selected={buildTab === 'windows'}
					class="tab text-sm font-medium {buildTab === 'windows'
						? 'tab-active bg-secondary text-secondary-content'
						: ''}"
					onclick={() => (buildTab = 'windows')}
				>
					Windows
				</button>
				<button
					type="button"
					role="tab"
					aria-selected={buildTab === 'synthetic'}
					class="tab text-sm font-medium {buildTab === 'synthetic'
						? 'tab-active bg-secondary text-secondary-content'
						: ''}"
					onclick={() => (buildTab = 'synthetic')}
				>
					Synthetic fixture
				</button>
			</div>
		</div>

		{#if buildTab === 'linux'}
			<CodeBlock code={installLinuxMac} language="bash" filename="Linux & macOS source build" />
		{:else if buildTab === 'windows'}
			<CodeBlock code={installWindows} language="powershell" filename="Windows PowerShell build" />
		{:else}
			<CodeBlock
				code={syntheticSetup}
				language="bash"
				filename="Try without Skyrim (dummy-content)"
			/>
		{/if}

		<p class="text-sm text-base-content/75">
			Build both <code class="text-accent">engine</code> and
			<code class="text-accent">launcher</code>
			with the same Cargo profile so the launcher locates the matching engine binary next to it.
		</p>
	</section>

	<section class="space-y-6" aria-labelledby="latest-release-heading">
		<div class="space-y-2">
			<h2 id="latest-release-heading">Latest GitHub release</h2>
			<p class="text-base-content/75">
				Tagged builds and release notes fetched from <code class="text-accent"
					>Mudcrab-Team/mudcrab</code
				>.
			</p>
		</div>

		{#if data.error}
			<div role="alert" class="alert border border-warning/40 bg-base-200 text-base-content">
				<AlertTriangle size={18} class="shrink-0 text-warning" aria-hidden="true" />
				<span
					>{data.error}. Use the source build instructions above or view releases directly on
					GitHub.</span
				>
			</div>
		{:else if !latestRelease}
			<div class="rounded-box border border-base-300 bg-base-200/50 p-6">
				<p class="text-base-content/80">
					No tagged binary releases are published yet. Clone <code class="text-accent">main</code> using
					the source commands above to try the latest converter and engine.
				</p>
			</div>
		{:else}
			<article class="space-y-6 rounded-box border border-base-300 bg-base-200/60 p-6 sm:p-8">
				<div
					class="flex flex-wrap items-baseline justify-between gap-4 border-b border-base-300 pb-4"
				>
					<h3 class="text-base font-semibold text-base-content">
						{latestRelease.name || latestRelease.tag_name}
					</h3>
					<span class="text-sm text-base-content/70">
						{latestRelease.prerelease ? 'Pre-release · ' : ''}{new Date(
							latestRelease.published_at
						).toLocaleDateString()}
					</span>
				</div>

				<pre
					class="m-0 font-sans text-base leading-relaxed whitespace-pre-wrap text-base-content/85">{latestRelease.body}</pre>

				{#if latestRelease.assets && latestRelease.assets.length > 0}
					<div class="space-y-3 border-t border-base-300 pt-5">
						<h4 class="font-semibold text-base-content">Downloadable assets</h4>
						<ul class="list-none space-y-2 p-0">
							{#each latestRelease.assets as asset (asset.name)}
								<li class="flex flex-wrap items-center justify-between gap-2 text-sm">
									<a
										href={asset.browser_download_url}
										target="_blank"
										rel="noopener noreferrer"
										class="inline-flex link items-center gap-2 font-medium text-accent link-hover"
									>
										<Download size={15} aria-hidden="true" />
										<span>{asset.name}</span>
									</a>
									<span class="text-base-content/65">
										{(asset.size / 1024 / 1024).toFixed(2)} MB
									</span>
								</li>
							{/each}
						</ul>
					</div>
				{/if}
			</article>

			{#if olderReleases.length > 0}
				<div class="divide-y divide-base-300 border-y border-base-300">
					{#each olderReleases as rel (rel.tag_name)}
						<div class="flex flex-wrap items-center justify-between gap-4 py-4">
							<span class="font-medium text-base-content">{rel.name || rel.tag_name}</span>
							<span class="text-sm text-base-content/70">
								{new Date(rel.published_at).toLocaleDateString()}
							</span>
						</div>
					{/each}
				</div>
			{/if}
		{/if}
	</section>
</main>
