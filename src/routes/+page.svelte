<script lang="ts">
	import Accordion from '../components/Accordion.svelte';
	import Button from '../components/Button.svelte';
	import CodeBlock from '../components/CodeBlock.svelte';
	import SectionHeader from '../components/SectionHeader.svelte';

	let activeAudience = $state<'players' | 'modders'>('players');
	let activeScriptTab = $state<'luau' | 'papyrus'>('luau');

	const luauExample = `local QF_MQ101_0003372B = Class("QF_MQ101_0003372B", Quest)

function QF_MQ101_0003372B:onInit()
    Engine.Debug.notification("Helgen Execution Quest Started!")
    task.wait(1.5)
    self.Alias_Ralof:getReference():enable()
end`;

	const papyrusExample = `Scriptname QF_MQ101_0003372B extends Quest

ReferenceAlias Property Alias_Ralof auto
ReferenceAlias Property Alias_Hadvar auto

Event OnInit()
    Debug.Notification("Helgen Execution Quest Started!")
    Utility.Wait(1.5)
    Alias_Ralof.GetReference().Enable()
EndEvent`;

	const formatRows = [
		{
			legacy: 'Skyrim.esm and .esp plugins',
			modern: 'SQLite 3 + R-Tree and rkyv',
			purpose: 'Real-time spatial cell streaming without loading screens'
		},
		{
			legacy: '.nif meshes and skeletons',
			modern: 'glTF 2.0 (.glb)',
			purpose: 'PBR materials, skinning, and instanced indirect GPU draws'
		},
		{
			legacy: '.dds textures and terrain LOD',
			modern: 'KTX2 (BC7 and UASTC)',
			purpose: 'Native BC block preservation with optional wgpu GPU encoding'
		},
		{
			legacy: '.pex Papyrus bytecode',
			modern: 'Sandboxed Luau (.lua)',
			purpose: 'JIT-compiled mod scripts with coroutines and async web APIs'
		},
		{
			legacy: '.swf and .gfx Scaleform UI',
			modern: 'Bevy bsn! + Luau handlers',
			purpose: 'Hardware-accelerated native UI nodes without a browser runtime'
		}
	];

	const roadmapPhases = [
		{
			phase: 'Phase 1',
			title: 'Asset modernization pipeline',
			summary:
				'Offline Rust converter turns .esm, .nif, .dds, and .pex files into SQLite, glTF 2.0, KTX2, and Luau.'
		},
		{
			phase: 'Phase 2',
			title: 'Core engine and Vercidium renderer',
			summary:
				'Bevy 0.19 ECS runtime, hybrid exterior R-Tree and interior streaming, and batched indirect draw calls.'
		},
		{
			phase: 'Phase 3',
			title: 'Luau runtime, bsn! UI, and launcher',
			summary:
				'Isolated crates/scripting VM, mudcrab.d.lua editor types, hot reload, and first-run setup launcher.'
		},
		{
			phase: 'Phase 4',
			title: 'Gameplay, Rapier physics, and saves',
			summary:
				'Rapier 3D collision, glTF animation blending, combat systems, and fast save-state snapshots.'
		},
		{
			phase: 'Phase 5',
			title: 'Ray tracing, co-op, and multiplatform',
			summary:
				'Hardware ray-traced lighting, DLSS and FSR 3, native WebSocket co-op, Android ARM64, and OpenXR VR.'
		}
	];

	const faqItems = [
		{
			value: 'assets',
			title: 'Do I need to own Skyrim Special Edition to play?',
			content:
				'Yes. Mudcrab distributes zero copyrighted textures, meshes, audio, or world data. You point the launcher at your legally owned Skyrim Special Edition installation so the offline converter can prepare your local asset pack.'
		},
		{
			value: 'mo2-skse',
			title: 'Do Mod Organizer 2 load orders and SKSE plugins work?',
			content:
				'Mod Organizer 2 profiles, .esm/.esp plugins, .bsa archives, loose textures, meshes, and Papyrus scripts are resolved read-only in place via --mo2-instance and --mo2-profile. Native Windows x86 SKSE .dll plugins are not supported; scripted mods run in sandboxed Luau instead.'
		},
		{
			value: 'requirements',
			title: 'What hardware and disk space are required?',
			content:
				'You need a GPU supporting Vulkan, DirectX 12, or Metal with BC texture formats, plus 20 to 30 GB of free disk space for build output and converted assets. Passing --texture-encoder gpu cuts full conversion time substantially on supported GPUs.'
		},
		{
			value: 'synthetic',
			title: 'Can I test the engine or write scripts without Skyrim installed?',
			content:
				'Yes. The dummy-content crate generates a deterministic synthetic worldspace (form ID 1) with zero copyrighted assets so contributors and modders can test rendering, streaming, and Luau scripts immediately.'
		},
		{
			value: 'affiliation',
			title: 'Is Mudcrab affiliated with Bethesda Softworks?',
			content:
				'No. Mudcrab is an independent open-source engine reimplementation licensed under GPL-3.0-or-later and is not endorsed by or affiliated with Bethesda Softworks, ZeniMax Media, or Microsoft.'
		}
	];
</script>

<svelte:head>
	<title>Mudcrab · Open-source Skyrim engine in Rust and Bevy</title>
</svelte:head>

<section class="full-bleed hero-section" aria-labelledby="hero-title">
	<div class="hero-backdrop" aria-hidden="true"></div>
	<div class="hero-inner">
		<div class="hero-copy">
			<h1 id="hero-title">Skyrim without loading screens</h1>
			<p class="hero-lead">
				An open-source Rust and Bevy engine for your Skyrim Special Edition copy, built for seamless
				worlds and Luau modding.
			</p>
			<div class="hero-action">
				<Button variant="primary" size="lg" href="#workbench">Choose your path</Button>
			</div>
		</div>
	</div>
</section>

<main class="home-main">
	<section id="workbench" class="section workbench-section" aria-labelledby="workbench-heading">
		<div class="workbench-header">
			<div class="workbench-title-group">
				<h2 id="workbench-heading">Built for players and modders</h2>
				<p>
					Pick your role below to see how Mudcrab runs your Skyrim install or modernizes your
					modding workflow.
				</p>
			</div>

			<div class="segmented-control" role="tablist" aria-label="Choose audience view">
				<button
					type="button"
					role="tab"
					id="tab-players"
					aria-selected={activeAudience === 'players'}
					aria-controls="panel-players"
					class:active={activeAudience === 'players'}
					onclick={() => (activeAudience = 'players')}
				>
					For players
				</button>
				<button
					type="button"
					role="tab"
					id="tab-modders"
					aria-selected={activeAudience === 'modders'}
					aria-controls="panel-modders"
					class:active={activeAudience === 'modders'}
					onclick={() => (activeAudience = 'modders')}
				>
					For modders
				</button>
			</div>
		</div>

		{#if activeAudience === 'players'}
			<div id="panel-players" role="tabpanel" aria-labelledby="tab-players" class="audience-panel">
				<div class="panel-column">
					<h3>Four steps from install to Tamriel</h3>
					<ol class="step-list">
						<li>
							<strong>Locate Skyrim Special Edition</strong>
							<p>
								The desktop launcher automatically finds Steam or GOG installs, or lets you drop
								your local <code>Data</code> folder onto the window.
							</p>
						</li>
						<li>
							<strong>Keep your MO2 load order (optional)</strong>
							<p>
								Select a Mod Organizer 2 instance and profile to overlay mods read-only without
								modifying your original game folder.
							</p>
						</li>
						<li>
							<strong>Convert assets once</strong>
							<p>
								Press Start to build your local <code>modern_assets</code> pack. Unchanged assets are
								cached and reused on later runs.
							</p>
						</li>
						<li>
							<strong>Play without cell doors</strong>
							<p>
								Press Play Mudcrab to launch the Bevy engine and walk directly between cities,
								exteriors, and dungeons.
							</p>
						</li>
					</ol>
				</div>

				<div class="panel-column panel-highlight">
					<h3>What changes in-game</h3>
					<ul class="feature-list">
						<li>
							<strong>Continuous world streaming:</strong> Interiors and walled cities like Whiterun stream
							in real time via SQLite R-Tree spatial queries.
						</li>
						<li>
							<strong>Full-horizon draw distance:</strong> Instanced indirect GPU rendering batches thousands
							of draw calls so distant peaks and forests stay crisp.
						</li>
						<li>
							<strong>Walk, fly, and tune visuals:</strong> Start in Rapier 3D walk mode, toggle
							noclip with <code>V</code> or <code>tcl</code>, and save graphics presets in-game.
						</li>
					</ul>
					<div class="panel-cta">
						<Button variant="primary" href="/releases">Download and setup guide</Button>
					</div>
				</div>
			</div>
		{:else}
			<div
				id="panel-modders"
				role="tabpanel"
				aria-labelledby="tab-modders"
				class="audience-panel modder-layout"
			>
				<div class="panel-column">
					<h3>Modern tooling without Papyrus bottlenecks</h3>
					<ul class="feature-list">
						<li>
							<strong>Sandboxed Luau JIT:</strong> Powered by <code>mlua</code> with native coroutines,
							hot-reloading on save, and async HTTP or WebSocket APIs for local LLMs like Ollama.
						</li>
						<li>
							<strong>MO2 instance resolution:</strong> Point the converter at your existing Mod Organizer
							2 profile and let Mudcrab resolve winning overrides cleanly.
						</li>
						<li>
							<strong>Autocomplete and type checking:</strong> Install
							<code>mudcrab-types</code> for <code>mudcrab.d.lua</code> definitions across VS Code, Zed,
							and Neovim.
						</li>
						<li>
							<strong>Flash UI to Bevy bsn!:</strong> Scaleform <code>.gfx</code> menus and ActionScript
							2.0 handlers transpile to native GPU UI widgets and unified Luau.
						</li>
					</ul>
					<div class="panel-cta">
						<Button variant="primary" href="/modding">Open modding guide</Button>
					</div>
				</div>

				<div class="panel-column code-workbench">
					<div class="code-workbench-bar">
						<h3>Papyrus bytecode transpiled to Luau</h3>
						<div class="mini-segmented" role="tablist" aria-label="Script comparison">
							<button
								type="button"
								role="tab"
								aria-selected={activeScriptTab === 'luau'}
								class:active={activeScriptTab === 'luau'}
								onclick={() => (activeScriptTab = 'luau')}
							>
								Luau output
							</button>
							<button
								type="button"
								role="tab"
								aria-selected={activeScriptTab === 'papyrus'}
								class:active={activeScriptTab === 'papyrus'}
								onclick={() => (activeScriptTab = 'papyrus')}
							>
								Papyrus source
							</button>
						</div>
					</div>
					{#if activeScriptTab === 'luau'}
						<CodeBlock code={luauExample} language="luau" filename="scripts/QF_MQ101.lua" />
					{:else}
						<CodeBlock code={papyrusExample} language="text" filename="Source/QF_MQ101.psc" />
					{/if}
				</div>
			</div>
		{/if}
	</section>

	<section class="section forge-section" aria-labelledby="forge-heading">
		<div class="forge-media">
			<img
				src="/images/modding-forge.jpg"
				alt="Nordic stone workshop lit by cool slate moonlight and a warm brass astrolabe beside scrolls and forge tools"
				width="1200"
				height="800"
				loading="lazy"
			/>
		</div>

		<div class="forge-content">
			<SectionHeader
				id="forge-heading"
				title="From legacy archives to GPU-native assets"
				description="Mudcrab separates the open-source engine from Bethesda data. An offline Rust converter turns your Skyrim files once into formats a modern GPU and database read directly."
			/>

			<div class="format-ledger" role="table" aria-label="Asset conversion mapping">
				<div class="format-row format-head" role="row">
					<span role="columnheader">Skyrim input</span>
					<span role="columnheader">Mudcrab output</span>
					<span role="columnheader">Runtime gain</span>
				</div>
				{#each formatRows as row}
					<div class="format-row" role="row">
						<span role="cell" class="format-legacy">{row.legacy}</span>
						<span role="cell" class="format-modern">{row.modern}</span>
						<span role="cell" class="format-purpose">{row.purpose}</span>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section class="section roadmap-section" aria-labelledby="roadmap-heading">
		<SectionHeader
			id="roadmap-heading"
			title="Five phases from asset pipeline to co-op Tamriel"
			description="Development progresses in clear milestones from offline data conversion and Bevy rendering through gameplay, ray tracing, and multiplayer."
		/>

		<div class="phase-ledger">
			{#each roadmapPhases as item}
				<div class="phase-row">
					<span class="phase-name">{item.phase}</span>
					<h3>{item.title}</h3>
					<p>{item.summary}</p>
				</div>
			{/each}
		</div>

		<div class="section-cta">
			<Button variant="primary" href="/roadmap">Explore live project board</Button>
		</div>
	</section>

	<section class="section faq-section" aria-labelledby="faq-heading">
		<SectionHeader
			id="faq-heading"
			title="Common questions"
			description="Key answers on game ownership, mod compatibility, hardware targets, and testing without Skyrim."
		/>
		<Accordion items={faqItems} defaultValue="assets" />
	</section>
</main>

<style>
	.full-bleed {
		width: 100vw;
		margin-inline: calc(50% - 50vw);
	}

	/* Full-bleed Nordic hero bleeding to y = 0 */
	.hero-section {
		position: relative;
		display: flex;
		align-items: flex-end;
		min-height: 96svh;
		padding: 7rem var(--page-gutter) clamp(4rem, 10vh, 6.5rem);
		overflow: hidden;
		background-color: var(--color-background);
		background-image: url('/images/hero-skyrim.jpg');
		background-position: 62% center;
		background-size: cover;
	}

	.hero-backdrop {
		position: absolute;
		inset: 0;
		background:
			linear-gradient(
				to top,
				var(--color-background) 0%,
				color-mix(in srgb, var(--color-background) 84%, transparent) 30%,
				color-mix(in srgb, var(--color-background) 28%, transparent) 62%,
				color-mix(in srgb, var(--color-background) 42%, transparent) 100%
			),
			linear-gradient(
				to right,
				color-mix(in srgb, var(--color-background) 86%, transparent) 0%,
				color-mix(in srgb, var(--color-background) 44%, transparent) 48%,
				transparent 82%
			);
		pointer-events: none;
	}

	.hero-inner {
		position: relative;
		z-index: 1;
		width: min(100%, var(--content-wide));
		margin: 0 auto;
	}

	.hero-copy {
		max-width: 48rem;
		animation: heroRise 520ms var(--ease-standard) both;
	}

	@keyframes heroRise {
		from {
			opacity: 0.01;
			transform: translateY(14px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.hero-copy h1 {
		max-width: 16ch;
		margin: 0;
		font-size: clamp(2.65rem, 5vw, 4.35rem);
		line-height: 1.02;
		color: var(--color-text);
		text-shadow: 0 2px 24px rgb(5 10 16 / 0.55);
	}

	.hero-lead {
		max-width: 46ch;
		margin-top: 1.25rem;
		color: var(--color-text-muted);
		font-size: clamp(1rem, 1.35vw, 1.125rem);
		line-height: 1.55;
	}

	.hero-action {
		margin-top: 1.75rem;
	}

	.home-main {
		display: flex;
		flex-direction: column;
	}

	.section {
		padding-block: clamp(3.5rem, 6.5vw, 5.5rem);
		border-top: 1px solid var(--color-border);
	}

	.workbench-section {
		border-top: 0;
	}

	/* Dual-audience workbench */
	.workbench-header {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 2rem;
		flex-wrap: wrap;
		margin-bottom: 2.25rem;
	}

	.workbench-title-group {
		max-width: 42rem;
	}

	.workbench-title-group h2 {
		margin-bottom: 0.75rem;
	}

	.segmented-control,
	.mini-segmented {
		display: inline-flex;
		padding: 0.25rem;
		border: 1px solid var(--color-border-strong);
		border-radius: var(--radius-md);
		background: var(--color-surface);
	}

	.segmented-control button,
	.mini-segmented button {
		padding: 0.55rem 1.1rem;
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

	.mini-segmented button {
		padding: 0.38rem 0.8rem;
	}

	.segmented-control button:hover,
	.mini-segmented button:hover {
		color: var(--color-text);
	}

	.segmented-control button.active,
	.mini-segmented button.active {
		background: var(--color-accent);
		color: var(--color-accent-ink);
	}

	.audience-panel {
		display: grid;
		grid-template-columns: 1.15fr 0.85fr;
		gap: clamp(2rem, 4vw, 3.5rem);
		padding: clamp(1.5rem, 3vw, 2.5rem);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		background: linear-gradient(155deg, var(--color-surface) 0%, var(--color-background-soft) 100%);
	}

	.audience-panel.modder-layout {
		grid-template-columns: 0.85fr 1.15fr;
	}

	.panel-column {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		min-width: 0;
	}

	.panel-column h3 {
		font-family: var(--font-display);
		color: var(--color-text);
	}

	.panel-highlight {
		padding-left: clamp(0rem, 2.5vw, 2rem);
		border-left: 1px solid var(--color-border);
	}

	.step-list,
	.feature-list {
		display: flex;
		flex-direction: column;
		gap: 1.1rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.step-list {
		counter-reset: launcher-step;
	}

	.step-list li {
		position: relative;
		padding-left: 2.4rem;
		margin: 0;
	}

	.step-list li::before {
		counter-increment: launcher-step;
		content: counter(launcher-step);
		position: absolute;
		top: 0.1rem;
		left: 0;
		display: grid;
		place-items: center;
		width: 1.65rem;
		height: 1.65rem;
		border: 1px solid var(--color-steel);
		border-radius: var(--radius-sm);
		background: var(--color-background-soft);
		color: var(--color-steel-bright);
		font-size: var(--text-sm);
		font-weight: 600;
	}

	.step-list li strong {
		display: block;
		margin-bottom: 0.2rem;
	}

	.feature-list li {
		margin: 0;
		padding-bottom: 1rem;
		border-bottom: 1px solid color-mix(in srgb, var(--color-border) 65%, transparent);
		color: var(--color-text-muted);
	}

	.feature-list li:last-child {
		padding-bottom: 0;
		border-bottom: 0;
	}

	.step-list code,
	.feature-list code {
		padding: 0.1rem 0.35rem;
		border-radius: var(--radius-sm);
		background: var(--color-surface-inset);
		color: var(--color-steel-bright);
		font-family: var(--font-mono);
		font-size: var(--text-sm);
	}

	.panel-cta {
		margin-top: auto;
		padding-top: 0.5rem;
	}

	.code-workbench {
		padding-left: clamp(0rem, 2vw, 1.5rem);
		border-left: 1px solid var(--color-border);
	}

	.code-workbench-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
	}

	/* Forge asymmetric split */
	.forge-section {
		display: grid;
		grid-template-columns: 0.92fr 1.08fr;
		gap: clamp(2rem, 4.5vw, 4rem);
		align-items: center;
	}

	.forge-media {
		overflow: hidden;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		background: var(--color-surface-inset);
		box-shadow: var(--shadow-md);
	}

	.forge-media img {
		display: block;
		width: 100%;
		height: auto;
		aspect-ratio: 3 / 2;
		object-fit: cover;
	}

	.forge-content {
		min-width: 0;
	}

	.format-ledger {
		display: grid;
		border-top: 1px solid var(--color-border);
	}

	.format-row {
		display: grid;
		grid-template-columns: 1.05fr 1fr 1.25fr;
		gap: 1rem;
		align-items: baseline;
		padding: 0.95rem 0;
		border-bottom: 1px solid var(--color-border);
		font-size: var(--text-sm);
	}

	.format-head {
		color: var(--color-text-subtle);
		font-weight: 600;
	}

	.format-legacy {
		color: var(--color-text);
		font-weight: 500;
	}

	.format-modern {
		color: var(--color-accent);
		font-weight: 600;
	}

	.format-purpose {
		color: var(--color-text-muted);
	}

	/* Five-phase ledger */
	.phase-ledger {
		border-top: 1px solid var(--color-border);
	}

	.phase-row {
		display: grid;
		grid-template-columns: 7.5rem 16rem 1fr;
		gap: 1rem 2rem;
		align-items: baseline;
		padding: 1.25rem 0;
		border-bottom: 1px solid var(--color-border);
	}

	.phase-name {
		color: var(--color-steel-bright);
		font-size: var(--text-sm);
		font-weight: 600;
	}

	.phase-row h3 {
		margin: 0;
		color: var(--color-text);
	}

	.phase-row p {
		margin: 0;
	}

	.section-cta {
		margin-top: 2rem;
	}

	/* FAQ */
	.faq-section {
		max-width: 54rem;
	}

	@media (max-width: 960px) {
		.audience-panel,
		.audience-panel.modder-layout,
		.forge-section {
			grid-template-columns: 1fr;
		}

		.panel-highlight,
		.code-workbench {
			padding-left: 0;
			padding-top: 1.5rem;
			border-left: 0;
			border-top: 1px solid var(--color-border);
		}

		.phase-row {
			grid-template-columns: 1fr;
			gap: 0.35rem;
		}
	}

	@media (max-width: 680px) {
		.hero-section {
			min-height: 76svh;
			padding-top: 6rem;
		}

		.format-head {
			display: none;
		}

		.format-row {
			grid-template-columns: 1fr;
			gap: 0.25rem;
		}

		.segmented-control {
			width: 100%;
			display: grid;
			grid-template-columns: 1fr 1fr;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.hero-copy {
			animation: none;
		}
	}
</style>
