<script lang="ts">
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import Info from '@lucide/svelte/icons/info';
	import {
		CONVERTER_GUIDE_URL,
		DISCORD_URL,
		ENGINE_GUIDE_URL,
		ISSUES_URL,
		REQUIREMENTS_URL
	} from '$lib/site';
	import CodeBlock from '../../components/CodeBlock.svelte';
	import DiscordIcon from '../../components/icons/DiscordIcon.svelte';

	let sourceTab = $state<'skyrim' | 'synthetic'>('skyrim');

	const cloneAndBuild = `git clone https://github.com/Mudcrab-Team/mudcrab.git
cd mudcrab
cargo build --release --bin engine --bin launcher`;

	const runLauncher = `cargo run --release -p launcher`;

	const directEngine = `# Start the engine directly on modern_assets (Tamriel 0x3c, cell 0, 0)
cargo run --release -p engine --bin engine -- --assets modern_assets

# Or jump to a specific worldspace and cell grid
cargo run --release -p engine --bin engine -- --assets modern_assets --worldspace 60 --grid-x 5 --grid-y -2`;

	const syntheticPipeline = `cargo run -p dummy-content -- gen Data
cargo run -p converter --bin converter -- Data modern_assets
cargo run -p engine --bin engine -- --assets modern_assets --worldspace 1`;

	const quickProfile = `cargo build --profile quick --bin engine`;

	const requirements = [
		{
			title: 'Skyrim Special Edition (or synthetic data)',
			detail:
				'A legally owned Steam or GOG copy of Skyrim Special Edition. Its Data folder is about 15 GB and is read only; the converter never writes into it.'
		},
		{
			title: 'Rust via rustup',
			detail:
				'rust-toolchain.toml pins the compiler version, and rustup installs it automatically on your first build.'
		},
		{
			title: 'A C and C++ compiler',
			detail:
				'Required to compile the bundled SQLite, Luau, and Basis Universal sources: Visual Studio Build Tools on Windows, Xcode Command Line Tools on macOS, or GCC/Clang on Linux.'
		},
		{
			title: 'A modern desktop GPU',
			detail:
				'Vulkan, DirectX 12, or Metal support with the BC block-compression formats used by converted KTX2 textures.'
		},
		{
			title: '20 to 30 GB of free disk space',
			detail:
				'The Cargo target directory uses 20 to 30 GB across build profiles, plus space for modern_assets and its staging cache.'
		},
		{
			title: 'Linux system libraries',
			detail:
				'On Linux, install Bevy audio, windowing, and udev development packages, or run inside devenv shell.'
		}
	];

	const troubleshooting = [
		{
			q: 'The launcher did not find my Skyrim Special Edition install',
			a: 'The launcher auto-detects a standard Steam install. For GOG or custom library paths, drag and drop your Skyrim Data folder directly onto the launcher window before pressing Start.'
		},
		{
			q: 'The engine started in NOCLIP instead of WALK',
			a: 'During startup and teleports, WALK waits up to 30 seconds of simulation time for Rapier world collision to finish loading. If placement is blocked or collision times out, the session falls back to NOCLIP and explains why in the overlay. Press V or run tcl in the console to retry WALK.'
		},
		{
			q: 'Debug builds are too slow while testing a change',
			a: 'The engine is slow in an unoptimized debug build. Run cargo build --profile quick --bin engine to compile an optimized binary into target/quick/ in about 40 seconds without link-time optimization. Use --release whenever you benchmark.'
		},
		{
			q: 'A few assets failed during conversion',
			a: 'You do not need to reconvert the entire game. Run converter repair-failed to re-convert only failed assets, review repair-report.json, and pass --apply to publish with a rollback journal. See the modding help center for exact commands.'
		}
	];
</script>

<svelte:head>
	<title>Play Mudcrab · Player Setup Guide for Skyrim Special Edition</title>
	<meta
		name="description"
		content="How to build Mudcrab, convert your Skyrim Special Edition Data folder once, and walk Tamriel in Bevy, or test with synthetic data."
	/>
</svelte:head>

<main class="space-y-16 py-12 sm:py-16">
	<header class="space-y-6 border-b border-base-300 pb-10">
		<div class="max-w-3xl space-y-3">
			<h1 class="font-display text-[clamp(2.25rem,4.5vw,3.5rem)] font-bold text-base-content">
				Play Mudcrab
			</h1>
			<p class="prose-measure text-base-content/80">
				Build the launcher and engine from source, convert your Skyrim Special Edition install once,
				and walk the streaming world in Bevy.
			</p>
		</div>

		<div role="status" class="alert border border-secondary/40 bg-base-200 text-base-content">
			<Info size={20} class="shrink-0 text-primary" aria-hidden="true" />
			<div class="space-y-1 text-sm leading-relaxed">
				<p class="font-semibold text-base-content">
					Early development: world exploration works today; RPG gameplay does not yet.
				</p>
				<p class="text-base-content/80">
					The converter handles a full Skyrim SE install and the engine streams exterior cells and
					load doors with first-person collision. Quests, combat, menus, and saves are tracked on
					the <a href="/roadmap" class="link font-medium text-accent">project roadmap</a>. Mudcrab
					ships no Bethesda assets.
				</p>
			</div>
		</div>
	</header>

	<section class="space-y-6" aria-labelledby="prereq-heading">
		<div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
			<div class="space-y-2">
				<h2 id="prereq-heading">Before you start</h2>
				<p class="prose-measure text-base-content/75">
					Make sure your machine has these tools and space ready before compiling the workspace.
				</p>
			</div>
			<a
				href={REQUIREMENTS_URL}
				target="_blank"
				rel="noreferrer"
				class="inline-flex link items-center gap-1.5 text-sm font-medium text-accent link-hover"
			>
				<span>Measured build times &amp; disk sizes</span>
				<ArrowRight size={15} aria-hidden="true" />
			</a>
		</div>

		<div class="grid gap-6 border-t border-base-300 pt-8 md:grid-cols-2 lg:grid-cols-3">
			{#each requirements as item (item.title)}
				<div class="space-y-1.5 border-l-2 border-base-300 pl-4">
					<h3 class="text-base-content">{item.title}</h3>
					<p class="text-sm leading-relaxed text-base-content/75">{item.detail}</p>
				</div>
			{/each}
		</div>
	</section>

	<div class="rule-diamond" aria-hidden="true"><span></span></div>

	<section class="space-y-8" aria-labelledby="setup-heading">
		<div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
			<div class="space-y-2">
				<h2 id="setup-heading">Build, convert, and launch</h2>
				<p class="prose-measure text-base-content/75">
					Use your Skyrim Special Edition install, or switch to the synthetic data fixture if you do
					not have the game installed.
				</p>
			</div>

			<div role="tablist" aria-label="Data source" class="tabs-box tabs bg-base-200 p-1">
				<button
					type="button"
					role="tab"
					id="tab-skyrim-install"
					aria-selected={sourceTab === 'skyrim'}
					class="tab text-sm font-semibold {sourceTab === 'skyrim'
						? 'tab-active bg-secondary text-secondary-content'
						: 'text-base-content/80'}"
					onclick={() => (sourceTab = 'skyrim')}
				>
					Skyrim SE install
				</button>
				<button
					type="button"
					role="tab"
					id="tab-synthetic-data"
					aria-selected={sourceTab === 'synthetic'}
					class="tab text-sm font-semibold {sourceTab === 'synthetic'
						? 'tab-active bg-secondary text-secondary-content'
						: 'text-base-content/80'}"
					onclick={() => (sourceTab = 'synthetic')}
				>
					No Skyrim? Synthetic data
				</button>
			</div>
		</div>

		{#if sourceTab === 'skyrim'}
			<ol class="list-none space-y-10 p-0">
				<li class="grid gap-6 border-t border-base-300 pt-8 lg:grid-cols-12">
					<div class="space-y-2 lg:col-span-5">
						<h3>Clone the repository and build release binaries</h3>
						<p class="text-sm leading-relaxed text-base-content/75">
							The launcher starts the engine binary built next to it, so compile both with the same
							<code class="text-accent">--release</code> profile. The first build compiles Bevy and bundled
							C/C++ libraries.
						</p>
					</div>
					<div class="min-w-0 lg:col-span-7">
						<CodeBlock code={cloneAndBuild} language="bash" filename="Terminal" />
					</div>
				</li>

				<li class="grid gap-6 border-t border-base-300 pt-8 lg:grid-cols-12">
					<div class="space-y-2 lg:col-span-5">
						<h3>Open the desktop launcher and select your Data folder</h3>
						<p class="text-sm leading-relaxed text-base-content/75">
							The launcher automatically finds a Steam install of Skyrim SE. If yours is elsewhere,
							drop your Skyrim <code class="text-accent">Data</code> folder onto the window. Output
							defaults to <code class="text-accent">modern_assets</code>.
						</p>
					</div>
					<div class="min-w-0 lg:col-span-7">
						<CodeBlock code={runLauncher} language="bash" filename="Start launcher" />
					</div>
				</li>

				<li class="grid gap-6 border-t border-base-300 pt-8 lg:grid-cols-12">
					<div class="space-y-2 lg:col-span-5">
						<h3>Convert once, then press PLAY MUDCRAB</h3>
						<p class="text-sm leading-relaxed text-base-content/75">
							Press <strong>Start</strong> in the launcher to run the converter. A first conversion
							takes a while; subsequent runs reuse unchanged files via
							<code class="text-accent">conversion-manifest.json</code>. When it finishes, press
							<strong>PLAY MUDCRAB</strong>, or launch the engine directly from the command line.
						</p>
					</div>
					<div class="min-w-0 lg:col-span-7">
						<CodeBlock code={directEngine} language="bash" filename="Direct engine launch" />
					</div>
				</li>
			</ol>
		{:else}
			<div class="grid gap-6 border-t border-base-300 pt-8 lg:grid-cols-12">
				<div class="space-y-3 lg:col-span-5">
					<h3>Generate and walk a legal synthetic world</h3>
					<p class="text-sm leading-relaxed text-base-content/75">
						The <code class="text-accent">dummy-content</code> crate generates a small deterministic
						game fixture containing no copyrighted content. Its worldspace is form ID
						<code class="text-accent">1</code> (the engine defaults to Skyrim Tamriel, so pass
						<code class="text-accent">--worldspace 1</code>).
					</p>
				</div>
				<div class="min-w-0 lg:col-span-7">
					<CodeBlock code={syntheticPipeline} language="bash" filename="Synthetic data pipeline" />
				</div>
			</div>
		{/if}
	</section>

	<section class="space-y-6 border-t border-base-300 pt-14" aria-labelledby="controls-heading">
		<div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
			<div class="space-y-2">
				<h2 id="controls-heading">Once you are in the world</h2>
				<p class="prose-measure text-base-content/75">
					Interactive sessions start in first-person WALK mode with the player collision capsule
					active.
				</p>
			</div>
			<a
				href={ENGINE_GUIDE_URL}
				target="_blank"
				rel="noreferrer"
				class="inline-flex link items-center gap-1.5 text-sm font-medium text-accent link-hover"
			>
				<span>Full engine guide on GitHub</span>
				<ArrowRight size={15} aria-hidden="true" />
			</a>
		</div>

		<div class="overflow-x-auto rounded-box border border-base-300 bg-base-200/60">
			<table class="table">
				<thead>
					<tr class="border-b border-base-300 text-sm text-base-content">
						<th>Action or flag</th>
						<th>How to use it</th>
						<th>Behavior</th>
					</tr>
				</thead>
				<tbody class="text-sm">
					<tr>
						<td class="font-semibold text-base-content">Toggle WALK / NOCLIP</td>
						<td
							>Press <kbd class="kbd kbd-sm">V</kbd> or run <code class="text-accent">tcl</code></td
						>
						<td class="text-base-content/80">
							Cancels a startup collision hold, switches between Rapier capsule physics and free
							camera flight, or retries WALK placement.
						</td>
					</tr>
					<tr>
						<td class="font-semibold text-base-content">Choose starting worldspace</td>
						<td><code class="text-accent">--worldspace &lt;id&gt;</code></td>
						<td class="text-base-content/80">
							Defaults to Skyrim Tamriel (<code class="text-accent">0x3c</code>). Use
							<code class="text-accent">1</code> for the synthetic dummy-content fixture.
						</td>
					</tr>
					<tr>
						<td class="font-semibold text-base-content">Choose starting exterior cell</td>
						<td><code class="text-accent">--grid-x &lt;cell&gt; --grid-y &lt;cell&gt;</code></td>
						<td class="text-base-content/80">
							Spawns at the specified exterior cell coordinates instead of cell (0, 0).
						</td>
					</tr>
					<tr>
						<td class="font-semibold text-base-content">Fast iteration build</td>
						<td><code class="text-accent">{quickProfile}</code></td>
						<td class="text-base-content/80">
							Builds an optimized binary into <code class="text-accent">target/quick/</code> without link-time
							optimization for quick local testing.
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</section>

	<section class="space-y-6 border-t border-base-300 pt-14" aria-labelledby="trouble-heading">
		<div class="grid gap-10 lg:grid-cols-12">
			<div class="space-y-4 lg:col-span-4">
				<h2 id="trouble-heading">Troubleshooting</h2>
				<p class="text-base-content/75">
					Common questions when building, detecting Skyrim, or starting a world session.
				</p>
				<div class="space-y-3 pt-2">
					<a
						href={DISCORD_URL}
						target="_blank"
						rel="noreferrer"
						class="btn gap-2 font-semibold btn-primary"
					>
						<DiscordIcon size={17} />
						<span>Ask in Discord</span>
					</a>
					<div class="flex flex-col gap-1.5 pt-1 text-sm">
						<a href="/modding" class="link text-accent link-hover">
							Converting a Mod Organizer 2 profile? Open the modding center
						</a>
						<a
							href={CONVERTER_GUIDE_URL}
							target="_blank"
							rel="noreferrer"
							class="link text-base-content/75 link-hover"
						>
							Converter CLI reference on GitHub
						</a>
						<a
							href={ISSUES_URL}
							target="_blank"
							rel="noreferrer"
							class="link text-base-content/75 link-hover"
						>
							Search or report an issue
						</a>
					</div>
				</div>
			</div>

			<div class="join w-full join-vertical lg:col-span-8">
				{#each troubleshooting as item, idx (item.q)}
					<div class="collapse-arrow collapse join-item border border-base-300 bg-base-200/60">
						<input type="radio" name="play-trouble" checked={idx === 0} aria-label={item.q} />
						<div class="collapse-title font-semibold text-base-content">
							{item.q}
						</div>
						<div class="collapse-content text-base leading-relaxed text-base-content/80">
							<p>{item.a}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>
</main>
