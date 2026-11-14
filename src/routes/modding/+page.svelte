<script lang="ts">
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import AlertTriangle from '@lucide/svelte/icons/alert-triangle';
	import MessageSquare from '@lucide/svelte/icons/message-square';
	import CodeBlock from '../../components/CodeBlock.svelte';

	let guideSection = $state<'mo2' | 'luau' | 'repair' | 'ui'>('mo2');

	const compatibilityRows = [
		{
			format: '.esm / .esp / .esl',
			handling: 'Imported into SQLite tables weighted by load_order',
			status: 'Supported',
			tone: 'text-success'
		},
		{
			format: '.bsa archives & loose files',
			handling: 'Extracted and layered in archive/MO2 priority order',
			status: 'Supported',
			tone: 'text-success'
		},
		{
			format: '.nif meshes',
			handling: 'Converted offline to glTF 2.0 (.glb) with bounds and collision',
			status: 'Supported',
			tone: 'text-success'
		},
		{
			format: '.dds textures',
			handling: 'Native BC1-BC7 copied to KTX2; uncompressed encoded via CPU or GPU',
			status: 'Supported',
			tone: 'text-success'
		},
		{
			format: '.pex Papyrus bytecode',
			handling: 'AST transpiled to Luau and executed on runtime.luau',
			status: 'In progress',
			tone: 'text-warning'
		},
		{
			format: '.swf / .gfx Scaleform UI',
			handling: 'Transpiled offline into Bevy 0.19 bsn! widget trees and Luau handlers',
			status: 'Phase 3',
			tone: 'text-info'
		},
		{
			format: 'SKSE native .dll plugins',
			handling: 'Not loaded; native engine hooks differ from original memory layouts',
			status: 'Post-release',
			tone: 'text-base-content/70'
		}
	];

	const mo2Cli = `# Convert an MO2 profile layered on top of Skyrim Data
cargo run --release -p converter --bin converter -- \\
  "C:\\Steam\\steamapps\\common\\Skyrim Special Edition\\Data" \\
  modern_assets \\
  --mo2-instance "C:\\Modding\\MO2" \\
  --mo2-profile "Default" \\
  --texture-encoder gpu`;

	const sqliteQuery = `-- How Mudcrab resolves winning plugin overrides by load order
SELECT * FROM refr_objects
WHERE form_id = ?
ORDER BY load_order DESC
LIMIT 1;`;

	const luauMod = `-- Native Luau mod with async web access and Engine bindings
local HTTP = Engine.HTTP
local Weather = Engine.Weather

function onGameLoaded()
    HTTP.getAsync("https://api.openweathermap.org/data/2.5/weather?q=Tokyo", function(response)
        if response.status == 200 then
            local data = response.json()
            local condition = data.weather[1].main
            if condition == "Rain" then
                Weather.setActiveWeather("SkyrimRainyOvercast")
                Engine.Debug.notification("Syncing Skyrim weather to local rain")
            end
        end
    end)
end`;

	const repairCli = `# 1. Check converted output manifest and verify file hashes
cargo run --release -p converter --bin converter -- check modern_assets --full

# 2. Preview failed-asset repairs (writes repair-report.json, leaves pack unchanged)
cargo run --release -p converter --bin converter -- \\
  repair-failed "<Skyrim Data>" modern_assets \\
  --mo2-instance "<MO2 instance>" --mo2-profile "<Profile>"

# 3. Publish validated repairs with a rollback journal
cargo run --release -p converter --bin converter -- \\
  repair-failed "<Skyrim Data>" modern_assets --apply`;

	const uiTranspile = `// Generated Bevy 0.19 bsn! UI tree from Scaleform InventoryMenu.gfx
use bevy::prelude::*;

pub fn spawn_inventory_menu(mut commands: Commands) {
    commands.spawn(bsn! {
        Node {
            width: Val::Percent(100.0),
            height: Val::Percent(100.0),
            justify_content: JustifyContent::SpaceBetween,
            ..default()
        } [
            Node {
                width: Val::Px(400.0),
                flex_direction: FlexDirection::Column,
                ..default()
            } [
                Text::new("INVENTORY"),
                ButtonNode [ Text::new("Iron Longsword") ]
            ]
        ]
    });
}`;
</script>

<svelte:head>
	<title>Modding Help &amp; Reference · Mudcrab Engine</title>
	<meta
		name="description"
		content="Modding help for Mudcrab: Mod Organizer 2 profile conversion, SQLite plugin layering, Luau scripting, Bevy bsn! UI, and failed conversion repair."
	/>
</svelte:head>

<main class="py-12 sm:py-16">
	<section class="grid gap-10 border-b border-base-300 pb-12 lg:grid-cols-12 lg:items-center">
		<div class="space-y-4 lg:col-span-7">
			<h1 class="font-display text-[clamp(2.25rem,4.5vw,3.5rem)] font-bold text-base-content">
				Modding help and format reference
			</h1>
			<p class="prose-measure text-base-content/80">
				Everything modders and mod-list authors need to layer Skyrim Special Edition plugins,
				convert Mod Organizer 2 profiles, repair failed assets, and script with Luau.
			</p>
			<div class="flex flex-wrap items-center gap-4 pt-2">
				<a
					href="https://discord.gg/29GRf8QShH"
					target="_blank"
					rel="noreferrer"
					class="btn gap-2 font-semibold text-accent-content btn-accent"
				>
					<MessageSquare size={17} aria-hidden="true" />
					<span>Ask in Discord</span>
				</a>
				<a
					href="https://github.com/Mudcrab-Team/mudcrab/tree/main/docs/specs/modding"
					target="_blank"
					rel="noreferrer"
					class="inline-flex link items-center gap-1.5 text-sm font-medium text-info link-hover"
				>
					<span>Read full modding specs on GitHub</span>
					<ArrowRight size={15} aria-hidden="true" />
				</a>
			</div>
		</div>

		<div class="overflow-hidden rounded-box border border-base-300 lg:col-span-5">
			<img
				src="/images/modding-forge.jpg"
				alt="Nordic stone workshop with drafting table and hearth embers"
				class="aspect-[3/2] w-full object-cover"
			/>
		</div>
	</section>

	<section class="py-14" aria-labelledby="compat-heading">
		<div class="max-w-2xl space-y-3">
			<h2 id="compat-heading">Mod format compatibility</h2>
			<p class="text-base-content/75">
				Mudcrab converts legacy Skyrim files offline into GPU-ready formats and resolves plugin
				overrides inside SQLite.
			</p>
		</div>

		<div class="mt-8 overflow-x-auto rounded-box border border-base-300 bg-base-200/50">
			<table class="table table-zebra">
				<thead>
					<tr class="border-b border-base-300 text-sm text-base-content">
						<th>Source format</th>
						<th>How Mudcrab handles it</th>
						<th>Status</th>
					</tr>
				</thead>
				<tbody>
					{#each compatibilityRows as row (row.format)}
						<tr class="border-b border-base-300/70">
							<td class="font-mono text-sm font-semibold text-base-content">{row.format}</td>
							<td class="text-sm text-base-content/80">{row.handling}</td>
							<td class="text-sm font-semibold {row.tone}">{row.status}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>

	<section class="border-t border-base-300 py-14" aria-labelledby="guides-heading">
		<div class="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
			<div class="max-w-2xl space-y-2">
				<h2 id="guides-heading">Practical modding workflows</h2>
				<p class="text-base-content/75">
					Select a workflow below for exact launcher settings, CLI flags, and starter scripts.
				</p>
			</div>

			<div role="tablist" aria-label="Modding workflows" class="tabs-box tabs bg-base-200 p-1">
				<button
					type="button"
					role="tab"
					aria-selected={guideSection === 'mo2'}
					class="tab text-sm font-medium {guideSection === 'mo2'
						? 'tab-active bg-primary text-primary-content'
						: ''}"
					onclick={() => (guideSection = 'mo2')}
				>
					MO2 setup
				</button>
				<button
					type="button"
					role="tab"
					aria-selected={guideSection === 'luau'}
					class="tab text-sm font-medium {guideSection === 'luau'
						? 'tab-active bg-primary text-primary-content'
						: ''}"
					onclick={() => (guideSection = 'luau')}
				>
					Luau &amp; Papyrus
				</button>
				<button
					type="button"
					role="tab"
					aria-selected={guideSection === 'repair'}
					class="tab text-sm font-medium {guideSection === 'repair'
						? 'tab-active bg-primary text-primary-content'
						: ''}"
					onclick={() => (guideSection = 'repair')}
				>
					Repair &amp; debug
				</button>
				<button
					type="button"
					role="tab"
					aria-selected={guideSection === 'ui'}
					class="tab text-sm font-medium {guideSection === 'ui'
						? 'tab-active bg-primary text-primary-content'
						: ''}"
					onclick={() => (guideSection = 'ui')}
				>
					Scaleform to bsn!
				</button>
			</div>
		</div>

		<div class="mt-8">
			{#if guideSection === 'mo2'}
				<div class="grid gap-8 lg:grid-cols-12">
					<div class="min-w-0 space-y-4 lg:col-span-5">
						<h3>Overlay Mod Organizer 2 profiles in place</h3>
						<p class="text-sm leading-relaxed text-base-content/80">
							In the Launcher, switch source mode to <strong>MO2 profile</strong>, open MO2
							settings, and drop the folder containing
							<code class="text-info">ModOrganizer.ini</code>. Select your profile from the dropdown
							while keeping your base Skyrim Data folder configured.
						</p>
						<ul class="list-disc space-y-2 pl-5 text-sm text-base-content/80">
							<li>
								MO2 instances must declare a supported Skyrim <code class="text-info">gameName</code
								>.
							</li>
							<li>
								Configured directories may resolve through junctions, while profile, enabled-mod,
								and asset reparse points are rejected for safety.
							</li>
							<li>
								Changes to MO2 window settings or disabled mods do not invalidate the whole cache;
								only winning assets and plugin changes re-run.
							</li>
						</ul>
					</div>
					<div class="min-w-0 space-y-4 lg:col-span-7">
						<CodeBlock code={mo2Cli} language="bash" filename="CLI MO2 conversion" />
						<CodeBlock code={sqliteQuery} language="sql" filename="SQLite mod layering query" />
					</div>
				</div>
			{:else if guideSection === 'luau'}
				<div class="grid gap-8 lg:grid-cols-12">
					<div class="min-w-0 space-y-4 lg:col-span-5">
						<h3>Sandboxed Luau replaces single-threaded Papyrus</h3>
						<p class="text-sm leading-relaxed text-base-content/80">
							Legacy <code class="text-info">.pex</code> bytecode inside archives or
							<code class="text-info">Scripts/</code> folders transpiles into Luau scripts running
							on <code class="text-info">crates/shared/src/papyrus_runtime.luau</code>.
						</p>
						<ul class="list-disc space-y-2 pl-5 text-sm text-base-content/80">
							<li>
								Scripts run in an isolated Luau sandbox with safe engine bindings and no arbitrary
								OS filesystem access.
							</li>
							<li>
								Async HTTP and WebSockets let mods fetch live weather, leaderboards, or local LLM
								dialogue via Ollama.
							</li>
							<li>
								Hot-reloading and <code class="text-info">.d.lua</code> editor type definitions are part
								of the Phase 3 modder experience.
							</li>
						</ul>
					</div>
					<div class="min-w-0 lg:col-span-7">
						<CodeBlock code={luauMod} language="luau" filename="scripts/LiveWeatherSync.lua" />
					</div>
				</div>
			{:else if guideSection === 'repair'}
				<div class="grid gap-8 lg:grid-cols-12">
					<div class="min-w-0 space-y-4 lg:col-span-5">
						<h3>Repair failed conversions without rebuilding the world</h3>
						<p class="text-sm leading-relaxed text-base-content/80">
							When a mod pack has corrupt meshes or interrupted textures, use
							<code class="text-info">repair-failed</code> to stage only failed inputs and their texture/skeleton
							dependencies, leaving the rest of your pack intact.
						</p>
						<div role="alert" class="alert border border-warning/40 bg-base-200 text-sm">
							<AlertTriangle size={18} class="shrink-0 text-warning" aria-hidden="true" />
							<span>
								Match your original <code class="text-info">--texture-encoder</code> flags when
								repairing, and close the running engine before
								<code class="text-info">--apply</code>.
							</span>
						</div>
						<p class="text-sm text-base-content/75">
							BodySlide and Outfit Studio files under <code class="text-info">CalienteTools</code>
							are automatically excluded as authoring data and logged under
							<code class="text-info">excluded_inputs</code> in the manifest.
						</p>
					</div>
					<div class="lg:col-span-7">
						<CodeBlock code={repairCli} language="bash" filename="Validate & repair pack" />
					</div>
				</div>
			{:else}
				<div class="grid gap-8 lg:grid-cols-12">
					<div class="min-w-0 space-y-4 lg:col-span-5">
						<h3>Native Bevy UI instead of Scaleform Flash</h3>
						<p class="text-sm leading-relaxed text-base-content/80">
							Original Skyrim menus rely on Adobe Flash (<code class="text-info">.swf</code> /
							<code class="text-info">.gfx</code>) and ActionScript 2.0. Mudcrab eliminates embedded
							browser or Flash runtimes completely.
						</p>
						<ul class="list-disc space-y-2 pl-5 text-sm text-base-content/80">
							<li>
								Flash shapes, buttons, and containers transpile offline into Bevy 0.19
								<code class="text-info">bsn!</code> declarative widget trees.
							</li>
							<li>
								ActionScript UI callbacks transpile to Luau handlers so one scripting runtime drives
								both UI and gameplay.
							</li>
						</ul>
					</div>
					<div class="lg:col-span-7">
						<CodeBlock code={uiTranspile} language="rust" filename="src/ui/inventory_menu.rs" />
					</div>
				</div>
			{/if}
		</div>
	</section>
</main>
