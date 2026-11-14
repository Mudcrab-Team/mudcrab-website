<script lang="ts">
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import FolderGit2 from '@lucide/svelte/icons/folder-git-2';
	import Gamepad2 from '@lucide/svelte/icons/gamepad-2';
	import Info from '@lucide/svelte/icons/info';
	import Wrench from '@lucide/svelte/icons/wrench';
	import CodeBlock from '../components/CodeBlock.svelte';

	let audience = $state<'players' | 'modders'>('players');
	let setupTab = $state<'skyrim' | 'synthetic'>('skyrim');
	let moddingTab = $state<'mo2' | 'luau' | 'repair' | 'ui'>('mo2');

	const buildCommands = `git clone https://github.com/Mudcrab-Team/mudcrab.git
cd mudcrab
cargo build --release --bin engine --bin launcher
cargo run --release -p launcher`;

	const syntheticCommands = `git clone https://github.com/Mudcrab-Team/mudcrab.git
cd mudcrab
cargo run -p dummy-content -- gen Data
cargo run -p converter --bin converter -- Data modern_assets
cargo run -p engine --bin engine -- --assets modern_assets --worldspace 1`;

	const mo2Commands = `# Convert a Mod Organizer 2 profile overlaid on Skyrim Data
cargo run --release -p converter --bin converter -- \\
  "<Skyrim Data>" modern_assets \\
  --mo2-instance "<MO2 instance folder>" \\
  --mo2-profile "<Profile name>" \\
  --texture-encoder gpu`;

	const luauExample = `-- Modern Luau mod: sync Skyrim weather from an async web request
-- Configure your own OpenWeather API key before enabling
local HTTP = Engine.HTTP
local Weather = Engine.Weather
local apiKey = "<YOUR_OPENWEATHER_API_KEY>"
local city = "London"

function onGameLoaded()
    local url = "https://api.openweathermap.org/data/2.5/weather?q=" .. city .. "&appid=" .. apiKey
    HTTP.getAsync(url, function(res)
        if res.status == 200 then
            local data = res.json()
            if data.weather[1].main == "Rain" then
                Weather.setActiveWeather("SkyrimRainyOvercast")
            end
        end
    end)
end`;

	const repairCommands = `# Verify every manifest entry and hash in an existing pack
cargo run --release -p converter --bin converter -- check modern_assets --full

# Preview repairs for failed assets, then apply with rollback journal
cargo run --release -p converter --bin converter -- repair-failed "<Skyrim Data>" modern_assets
cargo run --release -p converter --bin converter -- repair-failed "<Skyrim Data>" modern_assets --apply`;

	const uiCode = `// Transpiled from Scaleform InventoryMenu.gfx into native Bevy 0.19 bsn!
commands.spawn(bsn! {
    Node {
        width: Val::Percent(100.0),
        justify_content: JustifyContent::SpaceBetween,
        ..default()
    } [
        Text::new("INVENTORY"),
        ButtonNode [ Text::new("Iron Longsword") ]
    ]
});`;

	const playerSteps = [
		{
			step: '1',
			title: 'Bring your Skyrim SE install',
			detail:
				'Mudcrab ships zero game assets. Point the launcher at a legally owned Steam or GOG Skyrim Special Edition folder.'
		},
		{
			step: '2',
			title: 'Build the engine and launcher',
			detail: 'Compile the Rust workspace once with Cargo, then open the desktop launcher binary.'
		},
		{
			step: '3',
			title: 'Convert assets once',
			detail:
				'Click Start to convert plugins, meshes, textures, and scripts into modern_assets. Later runs reuse unchanged files.'
		},
		{
			step: '4',
			title: 'Walk Tamriel in Bevy',
			detail:
				'Press Play to stream the converted world in first-person with Rapier physics, or toggle noclip with V.'
		}
	];

	const pipelineStages = [
		{
			title: 'Skyrim SE Data',
			detail: 'Plugins (.esm, .esp, .esl), BSA archives, NIF meshes, DDS textures, and PEX scripts.'
		},
		{
			title: 'Offline Converter',
			detail:
				'Parses records, resolves MO2 overrides, and encodes meshes and textures on CPU or GPU.'
		},
		{
			title: 'Modern Asset Pack',
			detail: 'SQLite world database, glTF 2.0 models, KTX2 Basis textures, and transpiled Luau.'
		},
		{
			title: 'Bevy Runtime',
			detail: 'Streams exterior cells from an R-Tree index with instanced indirect rendering.'
		}
	];

	const roadmapPhases = [
		{
			phase: 'Phase 1',
			name: 'Asset modernization pipeline',
			summary:
				'Convert .esm, .nif, .dds, and .pex files into SQLite 3, glTF 2.0, KTX2, and Luau with incremental repair.'
		},
		{
			phase: 'Phase 2',
			name: 'Core engine runtime and renderer',
			summary:
				'Stream Tamriel cells via R-Tree spatial indexing, zero-copy rkyv terrain, and batched indirect draw calls.'
		},
		{
			phase: 'Phase 3',
			name: 'Luau runtime, bsn! UI, and launcher',
			summary:
				'Run sandboxed Luau scripts, transpile Scaleform menus to native Bevy UI, and ship the setup launcher.'
		},
		{
			phase: 'Phase 4',
			name: 'Gameplay, physics, and saves',
			summary:
				'Complete Rapier 3D collision, character animation blending, combat systems, and sub-second save snapshots.'
		},
		{
			phase: 'Phase 5',
			name: 'Ray tracing, VR, and co-op',
			summary:
				'Extend the engine with ray-traced lighting, WebSocket co-op replication, Android ARM64, and OpenXR VR.'
		}
	];

	const faqs = [
		{
			q: 'Is Skyrim playable as a full RPG in Mudcrab today?',
			a: 'Not yet. Mudcrab is in active early development: the converter handles a full Skyrim Special Edition installation and the engine streams the world for walking and exploration, while quests, combat, and inventory gameplay are being built across Phases 3 and 4.'
		},
		{
			q: 'Do I need a legally owned copy of Skyrim Special Edition?',
			a: 'Yes. Mudcrab contains no copyrighted Bethesda textures, meshes, audio, or plugin files. Contributors without a copy can still test the full conversion and engine pipeline using the built-in dummy-content generator.'
		},
		{
			q: 'How does Mudcrab handle Mod Organizer 2 and existing mods?',
			a: 'The converter reads Mod Organizer 2 profiles directly in place without duplicating your Data folder. Non-SKSE plugins layer into SQLite by load order, loose .nif and .dds files convert to glTF and KTX2, and .pex scripts transpile to Luau. Broader SKSE support will be explored after core release.'
		},
		{
			q: 'How long does asset conversion take?',
			a: 'On a full Skyrim SE installation, CPU conversion takes around 28 minutes on a mid-range desktop. Enabling the optional wgpu GPU texture encoder (--texture-encoder gpu) cut a full conversion to under 9 minutes in author benchmarks, and subsequent runs reuse unchanged assets.'
		}
	];
</script>

<svelte:head>
	<title>Mudcrab · Open-Source Engine for Skyrim Special Edition</title>
	<meta
		name="description"
		content="An open-source Rust and Bevy engine reimplementation for Skyrim Special Edition with native Luau modding, MO2 support, and continuous world streaming."
	/>
</svelte:head>

<section
	class="relative flex min-h-[84svh] w-full items-end overflow-hidden bg-[#0b1219] pt-24 pb-16 sm:pb-24"
	aria-labelledby="hero-title"
>
	<img
		src="/images/hero-nordic-peaks.jpg"
		alt="Misty northern mountain peaks and stone watchtower at twilight"
		class="absolute inset-0 h-full w-full object-cover object-center"
	/>
	<div
		class="pointer-events-none absolute inset-0"
		style="background: linear-gradient(to top, var(--color-base-100) 0%, rgba(11, 18, 25, 0.72) 42%, rgba(11, 18, 25, 0.28) 100%), linear-gradient(to right, rgba(11, 18, 25, 0.84) 0%, rgba(11, 18, 25, 0.35) 55%, transparent 100%);"
	></div>

	<div class="relative z-10 mx-auto w-full max-w-[var(--content-wide)] px-4 sm:px-6 lg:px-8">
		<div class="max-w-3xl space-y-5">
			<h1
				id="hero-title"
				class="font-display text-[clamp(2.85rem,6.6vw,5.5rem)] font-bold tracking-tight text-[#edf3f7]"
			>
				Skyrim rebuilt for modern hardware
			</h1>
			<p class="max-w-xl text-base leading-relaxed text-[#d3e0ea]">
				An open-source Rust and Bevy engine for Skyrim Special Edition, built for fast world
				streaming and native Luau modding.
			</p>
			<div class="pt-1">
				<a
					href="#start"
					class="btn gap-2.5 text-base font-semibold text-accent-content shadow-md transition-transform duration-150 ease-out btn-accent btn-lg hover:-translate-y-0.5"
				>
					<span>Play or start modding</span>
					<ArrowRight size={18} aria-hidden="true" />
				</a>
			</div>
		</div>
	</div>
</section>

<main class="mx-auto max-w-[var(--content-wide)] px-4 sm:px-6 lg:px-8">
	<section id="start" class="scroll-mt-24 py-16 sm:py-20" aria-labelledby="workbench-heading">
		<div
			class="flex flex-col gap-6 border-b border-base-300 pb-8 md:flex-row md:items-end md:justify-between"
		>
			<div class="max-w-2xl space-y-3">
				<h2 id="workbench-heading">Choose your path into Mudcrab</h2>
				<p class="prose-measure text-base-content/75">
					Switch between the player setup guide and the modder toolkit depending on what you want to
					build or run.
				</p>
			</div>

			<div role="tablist" aria-label="Choose audience guide" class="tabs-box tabs bg-base-200 p-1">
				<button
					type="button"
					role="tab"
					aria-selected={audience === 'players'}
					class="tab gap-2 text-sm font-semibold {audience === 'players'
						? 'tab-active bg-primary text-primary-content'
						: 'text-base-content/80'}"
					onclick={() => (audience = 'players')}
				>
					<Gamepad2 size={16} aria-hidden="true" />
					<span>For players</span>
				</button>
				<button
					type="button"
					role="tab"
					aria-selected={audience === 'modders'}
					class="tab gap-2 text-sm font-semibold {audience === 'modders'
						? 'tab-active bg-primary text-primary-content'
						: 'text-base-content/80'}"
					onclick={() => (audience = 'modders')}
				>
					<Wrench size={16} aria-hidden="true" />
					<span>For modders</span>
				</button>
			</div>
		</div>

		{#if audience === 'players'}
			<div class="mt-10 space-y-12">
				<div role="status" class="alert border border-primary/35 bg-base-200 text-base-content">
					<Info size={20} class="shrink-0 text-accent" aria-hidden="true" />
					<p class="text-sm leading-relaxed text-base-content/85">
						<strong class="font-semibold text-base-content">Current milestone status:</strong>
						The converter handles a full Skyrim Special Edition installation and the engine streams Tamriel
						for first-person exploration. Quests, combat, and full RPG gameplay are still in active development.
					</p>
				</div>

				<div class="grid gap-10 lg:grid-cols-12 lg:items-start">
					<div class="min-w-0 space-y-6 lg:col-span-6">
						<h3>Run Skyrim data in four steps</h3>
						<ol class="list-none space-y-5 p-0">
							{#each playerSteps as item (item.step)}
								<li class="flex gap-4 border-b border-base-300/80 pb-5 last:border-b-0 last:pb-0">
									<span
										class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-sm font-bold text-secondary-content"
									>
										{item.step}
									</span>
									<div class="min-w-0 space-y-1">
										<h4 class="font-semibold text-base-content">{item.title}</h4>
										<p class="text-sm leading-relaxed text-base-content/75">{item.detail}</p>
									</div>
								</li>
							{/each}
						</ol>
					</div>

					<div class="min-w-0 space-y-4 lg:col-span-6">
						<div class="flex flex-wrap items-center justify-between gap-3">
							<h3>Launcher commands</h3>
							<div role="tablist" aria-label="Install source" class="tabs-border tabs">
								<button
									type="button"
									role="tab"
									aria-selected={setupTab === 'skyrim'}
									class="tab text-sm font-medium {setupTab === 'skyrim'
										? 'tab-active text-accent'
										: ''}"
									onclick={() => (setupTab = 'skyrim')}
								>
									Skyrim SE install
								</button>
								<button
									type="button"
									role="tab"
									aria-selected={setupTab === 'synthetic'}
									class="tab text-sm font-medium {setupTab === 'synthetic'
										? 'tab-active text-accent'
										: ''}"
									onclick={() => (setupTab = 'synthetic')}
								>
									No Skyrim? Synthetic data
								</button>
							</div>
						</div>

						{#if setupTab === 'skyrim'}
							<CodeBlock code={buildCommands} language="bash" filename="Build & run launcher" />
							<p class="text-sm text-base-content/75">
								Requires Rust via rustup, a C/C++ compiler for bundled SQLite and Luau, and a
								Vulkan, DirectX 12, or Metal GPU. Allow 20 to 30 GB of disk space for build output.
							</p>
						{:else}
							<CodeBlock
								code={syntheticCommands}
								language="bash"
								filename="Generate synthetic worldspace 1"
							/>
							<p class="text-sm text-base-content/75">
								The dummy-content generator creates a small legal test fixture in seconds so anyone
								can test conversion and walk around in Bevy without owning Skyrim.
							</p>
						{/if}

						<div class="pt-2">
							<a href="/releases" class="btn gap-2 text-sm font-semibold btn-primary">
								<span>Check build &amp; release notes</span>
								<ArrowRight size={16} aria-hidden="true" />
							</a>
						</div>
					</div>
				</div>

				<div class="grid gap-x-10 gap-y-8 border-t border-base-300 pt-10 md:grid-cols-2">
					<div class="space-y-2">
						<h3>Continuous cell streaming</h3>
						<p class="text-sm leading-relaxed text-base-content/75">
							Exterior cells load around the camera from an R-Tree spatial index with zero-copy rkyv
							terrain payloads, replacing multi-second pauses with rapid door fades.
						</p>
					</div>
					<div class="space-y-2">
						<h3>Optional GPU texture encoding</h3>
						<p class="text-sm leading-relaxed text-base-content/75">
							Pass <code class="text-info">--texture-encoder gpu</code> to encode source textures on a
							wgpu compute shader, cutting a full Skyrim SE conversion from 28 minutes to under 9 minutes.
						</p>
					</div>
					<div class="space-y-2">
						<h3>Batched instanced rendering</h3>
						<p class="text-sm leading-relaxed text-base-content/75">
							Vercidium-style indirect draw batching merges thousands of static meshes into compact
							GPU draw passes on Bevy 0.19.
						</p>
					</div>
					<div class="space-y-2">
						<h3>Rapier collision with noclip fallback</h3>
						<p class="text-sm leading-relaxed text-base-content/75">
							Sessions start in first-person WALK physics and let you toggle NOCLIP at any time with
							<kbd class="kbd kbd-sm">V</kbd> or the <code class="text-info">tcl</code> console command.
						</p>
					</div>
				</div>
			</div>
		{:else}
			<div class="mt-10 space-y-10">
				<div class="grid gap-8 lg:grid-cols-12 lg:items-center">
					<div class="min-w-0 overflow-hidden rounded-box border border-base-300 lg:col-span-5">
						<img
							src="/images/modding-forge.jpg"
							alt="Nordic stone workshop illuminated by steel-blue moonlight and warm forge embers"
							class="aspect-[3/2] w-full object-cover"
						/>
					</div>

					<div class="min-w-0 space-y-5 lg:col-span-7">
						<h3>Two tiers of Skyrim mod support</h3>
						<p class="prose-measure text-base-content/80">
							Mudcrab bridges existing Skyrim mods with a modern sandboxed scripting stack. Non-SKSE
							plugins layer into SQLite by load order, loose NIF and DDS files convert to glTF 2.0
							and KTX2, and Papyrus bytecode transpiles into Luau.
						</p>
						<div class="grid gap-6 border-t border-base-300 pt-5 sm:grid-cols-2">
							<div class="min-w-0 space-y-1.5">
								<h4 class="text-base-content">Legacy mod compatibility</h4>
								<p class="text-sm leading-relaxed text-base-content/75">
									Read-only Mod Organizer 2 profile overlays, SQLite load-order resolution, and
									recoverable repair runs without touching your original Data folder.
								</p>
							</div>
							<div class="min-w-0 space-y-1.5">
								<h4 class="text-base-content">Native Luau and bsn! UI</h4>
								<p class="text-sm leading-relaxed text-base-content/75">
									Write hot-reloaded Luau scripts with async HTTP APIs and replace Flash Scaleform
									menus with declarative Bevy widget trees.
								</p>
							</div>
						</div>
					</div>
				</div>

				<div class="min-w-0 space-y-4 rounded-box border border-base-300 bg-base-200/70 p-5 sm:p-7">
					<div class="flex flex-wrap items-center justify-between gap-3">
						<h3>Modding toolkit examples</h3>
						<div role="tablist" aria-label="Modding topic" class="tabs-box tabs bg-base-100 p-1">
							<button
								type="button"
								role="tab"
								aria-selected={moddingTab === 'mo2'}
								class="tab text-sm font-medium {moddingTab === 'mo2'
									? 'tab-active bg-primary text-primary-content'
									: ''}"
								onclick={() => (moddingTab = 'mo2')}
							>
								MO2 profiles
							</button>
							<button
								type="button"
								role="tab"
								aria-selected={moddingTab === 'luau'}
								class="tab text-sm font-medium {moddingTab === 'luau'
									? 'tab-active bg-primary text-primary-content'
									: ''}"
								onclick={() => (moddingTab = 'luau')}
							>
								Luau scripting
							</button>
							<button
								type="button"
								role="tab"
								aria-selected={moddingTab === 'repair'}
								class="tab text-sm font-medium {moddingTab === 'repair'
									? 'tab-active bg-primary text-primary-content'
									: ''}"
								onclick={() => (moddingTab = 'repair')}
							>
								Repair &amp; check
							</button>
							<button
								type="button"
								role="tab"
								aria-selected={moddingTab === 'ui'}
								class="tab text-sm font-medium {moddingTab === 'ui'
									? 'tab-active bg-primary text-primary-content'
									: ''}"
								onclick={() => (moddingTab = 'ui')}
							>
								bsn! UI
							</button>
						</div>
					</div>

					{#if moddingTab === 'mo2'}
						<CodeBlock code={mo2Commands} language="bash" filename="Convert MO2 profile" />
					{:else if moddingTab === 'luau'}
						<CodeBlock code={luauExample} language="luau" filename="mods/LiveWeatherSync.lua" />
					{:else if moddingTab === 'repair'}
						<CodeBlock code={repairCommands} language="bash" filename="Check & repair pack" />
					{:else}
						<CodeBlock code={uiCode} language="rust" filename="src/ui/inventory_menu.rs" />
					{/if}

					<div class="flex flex-wrap items-center justify-between gap-4 pt-2">
						<p class="text-sm text-base-content/75">
							Need help with load orders, reparse-point errors, or Luau bindings?
						</p>
						<a href="/modding" class="btn gap-2 text-sm font-semibold btn-primary">
							<span>Open modding help center</span>
							<ArrowRight size={16} aria-hidden="true" />
						</a>
					</div>
				</div>
			</div>
		{/if}
	</section>

	<section class="border-t border-base-300 py-16 sm:py-20" aria-labelledby="pipeline-heading">
		<div class="max-w-2xl space-y-3">
			<h2 id="pipeline-heading">How legacy files become a modern pack</h2>
			<p class="prose-measure text-base-content/75">
				Heavy conversion work runs offline once so the Bevy runtime only loads formats a modern GPU
				and database read directly.
			</p>
		</div>

		<div class="mt-10 grid gap-4 md:grid-cols-4">
			{#each pipelineStages as stage, idx (stage.title)}
				<div
					class="relative flex flex-col justify-between rounded-box border border-base-300 bg-base-200/60 p-5"
				>
					<div class="space-y-2">
						<span class="text-sm font-semibold text-accent">Stage {idx + 1}</span>
						<h3>{stage.title}</h3>
						<p class="text-sm leading-relaxed text-base-content/75">{stage.detail}</p>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<section class="border-t border-base-300 py-16 sm:py-20" aria-labelledby="roadmap-heading">
		<div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
			<div class="max-w-2xl space-y-3">
				<h2 id="roadmap-heading">Five phases from converter to co-op</h2>
				<p class="prose-measure text-base-content/75">
					Development moves through five documented milestones tracked openly on GitHub.
				</p>
			</div>
			<a href="/roadmap" class="btn w-fit gap-2 text-sm font-semibold btn-primary">
				<span>Explore live project board</span>
				<ArrowRight size={16} aria-hidden="true" />
			</a>
		</div>

		<div class="mt-10 divide-y divide-base-300 border-y border-base-300">
			{#each roadmapPhases as item (item.phase)}
				<div class="grid gap-2 py-5 md:grid-cols-12 md:items-baseline md:gap-6">
					<span class="text-sm font-semibold text-accent md:col-span-2">{item.phase}</span>
					<h3 class="md:col-span-4">{item.name}</h3>
					<p class="text-sm leading-relaxed text-base-content/75 md:col-span-6">{item.summary}</p>
				</div>
			{/each}
		</div>
	</section>

	<section class="border-t border-base-300 py-16 sm:py-20" aria-labelledby="faq-heading">
		<div class="grid gap-10 lg:grid-cols-12">
			<div class="space-y-4 lg:col-span-4">
				<h2 id="faq-heading">Frequently asked questions</h2>
				<p class="text-base-content/75">
					Answers about ownership, mod compatibility, and how to contribute on GitHub or Discord.
				</p>
				<div class="pt-1">
					<a
						href="https://github.com/Mudcrab-Team/mudcrab"
						target="_blank"
						rel="noreferrer"
						class="btn gap-2 border-base-300 btn-outline text-sm font-semibold hover:border-primary hover:bg-base-200 hover:text-base-content"
					>
						<FolderGit2 size={16} aria-hidden="true" />
						<span>Browse Mudcrab on GitHub</span>
					</a>
				</div>
			</div>

			<div class="space-y-3 lg:col-span-8">
				{#each faqs as faq, index (faq.q)}
					<div class="collapse-arrow collapse rounded-box border border-base-300 bg-base-200/60">
						<input type="radio" name="mudcrab-faq" checked={index === 0} aria-label={faq.q} />
						<div class="collapse-title font-semibold text-base-content">
							{faq.q}
						</div>
						<div class="collapse-content text-base leading-relaxed text-base-content/80">
							<p>{faq.a}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>
</main>
