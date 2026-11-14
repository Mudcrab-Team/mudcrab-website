<script lang="ts">
	import AlertTriangle from '@lucide/svelte/icons/alert-triangle';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import { onMount } from 'svelte';
	import { CONVERTER_GUIDE_URL, DISCORD_URL, MODDING_SPECS_URL } from '$lib/site';
	import CodeBlock from '../../components/CodeBlock.svelte';
	import DiscordIcon from '../../components/icons/DiscordIcon.svelte';

	const sections = [
		{ id: 'compatibility', label: 'Format compatibility' },
		{ id: 'mo2', label: 'MO2 profiles & SQLite' },
		{ id: 'luau', label: 'Luau & Papyrus' },
		{ id: 'repair', label: 'Repair & debug' },
		{ id: 'ui', label: 'Scaleform to bsn!' }
	] as const;

	let activeSection = $state<string>(sections[0].id);

	const compatibilityRows = [
		{
			format: '.esm / .esp / .esl',
			handling: 'Imported into SQLite tables weighted by load_order',
			status: 'Supported',
			badge: 'badge-success'
		},
		{
			format: '.bsa archives & loose files',
			handling: 'Extracted and layered in archive and MO2 priority order',
			status: 'Supported',
			badge: 'badge-success'
		},
		{
			format: '.nif meshes',
			handling: 'Converted offline to glTF 2.0 (.glb) with bounds and collision',
			status: 'Supported',
			badge: 'badge-success'
		},
		{
			format: '.dds textures',
			handling: 'Native BC1 to BC7 copied to KTX2; uncompressed encoded via CPU or GPU',
			status: 'Supported',
			badge: 'badge-success'
		},
		{
			format: '.pex Papyrus bytecode',
			handling: 'AST transpiled to Luau and executed on papyrus_runtime.luau',
			status: 'In progress',
			badge: 'badge-warning'
		},
		{
			format: '.swf / .gfx Scaleform UI',
			handling: 'Transpiled offline into Bevy 0.19 bsn! widget trees and Luau handlers',
			status: 'Phase 3',
			badge: 'badge-info'
		},
		{
			format: 'SKSE native .dll plugins',
			handling: 'Not loaded; native engine hooks differ from original memory layouts',
			status: 'Post-release',
			badge: 'badge-ghost text-base-content/85'
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
local openWeatherApiKey = "<YOUR_OPENWEATHER_API_KEY>"

function onGameLoaded()
    local url = "https://api.openweathermap.org/data/2.5/weather?q=Tokyo&appid=" .. openWeatherApiKey
    HTTP.getAsync(url, function(response)
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
  repair-failed "<Skyrim Data>" modern_assets \\
  --mo2-instance "<MO2 instance>" --mo2-profile "<Profile>" --apply`;

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

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						activeSection = entry.target.id;
						break;
					}
				}
			},
			{ rootMargin: '-20% 0px -65% 0px' }
		);

		for (const s of sections) {
			const el = document.getElementById(s.id);
			if (el) observer.observe(el);
		}
		return () => observer.disconnect();
	});
</script>

<svelte:head>
	<title>Modding Help Center · Mudcrab Engine</title>
	<meta
		name="description"
		content="Modding help for Mudcrab: Mod Organizer 2 profile conversion, SQLite plugin layering, Luau scripting, Bevy bsn! UI, and failed conversion repair."
	/>
</svelte:head>

<main class="py-12 sm:py-16">
	<header class="grid gap-8 border-b border-base-300 pb-12 lg:grid-cols-12 lg:items-center">
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
					href={DISCORD_URL}
					target="_blank"
					rel="noreferrer"
					class="btn gap-2 font-semibold btn-primary"
				>
					<DiscordIcon size={17} />
					<span>Ask in Discord</span>
				</a>
				<a
					href={MODDING_SPECS_URL}
					target="_blank"
					rel="noreferrer"
					class="inline-flex link items-center gap-1.5 text-sm font-medium text-accent link-hover"
				>
					<span>Read full modding specs on GitHub</span>
					<ArrowRight size={15} aria-hidden="true" />
				</a>
			</div>
		</div>

		<div class="overflow-hidden rounded-box border border-base-300 lg:col-span-5">
			<img
				src="/images/path-mod.webp"
				alt="A Nordic stone workshop with parchment schematics on a wooden bench and warm forge embers"
				width="1200"
				height="896"
				class="aspect-[16/10] w-full object-cover"
			/>
		</div>
	</header>

	<nav
		aria-label="Modding sections"
		class="sticky top-16 z-20 -mx-4 overflow-x-auto border-b border-base-300 bg-base-100/95 px-4 py-2 backdrop-blur-md lg:hidden"
	>
		<div class="tabs flex-nowrap gap-1">
			{#each sections as s (s.id)}
				<a
					href="#{s.id}"
					class="tab shrink-0 text-sm font-medium {activeSection === s.id
						? 'tab-active text-primary'
						: 'text-base-content/75'}"
				>
					{s.label}
				</a>
			{/each}
		</div>
	</nav>

	<div class="mt-10 grid gap-12 lg:grid-cols-12">
		<aside class="hidden lg:col-span-3 lg:block">
			<div class="sticky top-24 space-y-6">
				<nav aria-label="On this page">
					<ul class="menu w-full gap-1 border-l border-base-300 p-0 pl-3">
						{#each sections as s (s.id)}
							<li>
								<a
									href="#{s.id}"
									class="text-sm font-medium {activeSection === s.id
										? 'bg-secondary text-secondary-content'
										: 'text-base-content/75'}"
								>
									{s.label}
								</a>
							</li>
						{/each}
					</ul>
				</nav>

				<div class="space-y-2 border-t border-base-300 pt-4 text-sm">
					<a
						href={CONVERTER_GUIDE_URL}
						target="_blank"
						rel="noreferrer"
						class="block link text-accent link-hover"
					>
						Converter guide on GitHub
					</a>
					<a href="/play" class="block link text-base-content/75 link-hover">
						Player setup guide
					</a>
				</div>
			</div>
		</aside>

		<div class="min-w-0 space-y-16 lg:col-span-9">
			<section id="compatibility" class="scroll-mt-24 space-y-5" aria-labelledby="compat-heading">
				<div class="space-y-2">
					<h2 id="compat-heading">Mod format compatibility</h2>
					<p class="prose-measure text-base-content/75">
						Mudcrab converts legacy Skyrim files offline into GPU-ready formats and resolves plugin
						overrides inside SQLite.
					</p>
				</div>

				<div class="overflow-x-auto rounded-box border border-base-300 bg-base-200/50">
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
									<td>
										<span class="badge badge-soft badge-sm font-semibold {row.badge}">
											{row.status}
										</span>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</section>

			<section
				id="mo2"
				class="scroll-mt-24 space-y-6 border-t border-base-300 pt-14"
				aria-labelledby="mo2-heading"
			>
				<div class="space-y-3">
					<h2 id="mo2-heading">Overlay Mod Organizer 2 profiles in place</h2>
					<p class="prose-measure text-base-content/80">
						In the launcher, switch source mode to <strong>MO2 profile</strong>, open MO2 settings,
						and drop the folder containing <code class="text-accent">ModOrganizer.ini</code>. Select
						your profile from the dropdown while keeping your base Skyrim Data folder configured.
					</p>
					<ul class="list-disc space-y-2 pl-5 text-base-content/80">
						<li>
							MO2 instances must declare a supported Skyrim <code class="text-accent">gameName</code
							>.
						</li>
						<li>
							Configured directories may resolve through junctions, while profile, enabled-mod, and
							asset reparse points are rejected for safety.
						</li>
						<li>
							Changes to MO2 window settings or disabled mods do not invalidate the whole cache;
							only winning assets and plugin changes re-run.
						</li>
					</ul>
				</div>

				<div class="space-y-4">
					<CodeBlock code={mo2Cli} language="bash" filename="CLI MO2 conversion" />
					<CodeBlock code={sqliteQuery} language="sql" filename="SQLite mod layering query" />
				</div>
			</section>

			<section
				id="luau"
				class="scroll-mt-24 space-y-6 border-t border-base-300 pt-14"
				aria-labelledby="luau-heading"
			>
				<div class="space-y-3">
					<h2 id="luau-heading">Sandboxed Luau replaces single-threaded Papyrus</h2>
					<p class="prose-measure text-base-content/80">
						Legacy <code class="text-accent">.pex</code> bytecode inside archives or
						<code class="text-accent">Scripts/</code> folders transpiles into Luau scripts running
						on
						<code class="text-accent">crates/shared/src/papyrus_runtime.luau</code>.
					</p>
					<ul class="list-disc space-y-2 pl-5 text-base-content/80">
						<li>
							Scripts run in an isolated Luau sandbox with safe engine bindings and no arbitrary OS
							filesystem access.
						</li>
						<li>
							Async HTTP and WebSockets let mods fetch live weather, leaderboards, or local LLM
							dialogue. For authenticated APIs such as OpenWeather, supply your own key by replacing
							<code class="text-accent">&lt;YOUR_OPENWEATHER_API_KEY&gt;</code> in your local mod configuration.
						</li>
						<li>
							Hot-reloading and <code class="text-accent">.d.lua</code> editor type definitions are part
							of the Phase 3 modder experience.
						</li>
					</ul>
				</div>

				<CodeBlock code={luauMod} language="luau" filename="scripts/LiveWeatherSync.lua" />
			</section>

			<section
				id="repair"
				class="scroll-mt-24 space-y-6 border-t border-base-300 pt-14"
				aria-labelledby="repair-heading"
			>
				<div class="space-y-3">
					<h2 id="repair-heading">Repair failed conversions without rebuilding the world</h2>
					<p class="prose-measure text-base-content/80">
						When a mod pack has corrupt meshes or interrupted textures, use
						<code class="text-accent">repair-failed</code> to stage only failed inputs and their texture
						or skeleton dependencies, leaving the rest of your pack intact.
					</p>
					<div role="alert" class="alert border border-warning/40 bg-base-200 text-sm">
						<AlertTriangle size={18} class="shrink-0 text-warning" aria-hidden="true" />
						<span>
							Match your original <code class="text-accent">--texture-encoder</code> flags when
							repairing, and close the running engine before
							<code class="text-accent">--apply</code>.
						</span>
					</div>
					<p class="prose-measure text-sm text-base-content/75">
						BodySlide and Outfit Studio files under <code class="text-accent">CalienteTools</code>
						are automatically excluded as authoring data and logged under
						<code class="text-accent">excluded_inputs</code> in the manifest.
					</p>
				</div>

				<CodeBlock code={repairCli} language="bash" filename="Validate & repair pack" />
			</section>

			<section
				id="ui"
				class="scroll-mt-24 space-y-6 border-t border-base-300 pt-14"
				aria-labelledby="ui-heading"
			>
				<div class="space-y-3">
					<h2 id="ui-heading">Native Bevy UI instead of Scaleform Flash</h2>
					<p class="prose-measure text-base-content/80">
						Original Skyrim menus rely on Adobe Flash (<code class="text-accent">.swf</code> and
						<code class="text-accent">.gfx</code>) and ActionScript 2.0. Mudcrab eliminates embedded
						browser or Flash runtimes completely.
					</p>
					<ul class="list-disc space-y-2 pl-5 text-base-content/80">
						<li>
							Flash shapes, buttons, and containers transpile offline into Bevy 0.19
							<code class="text-accent">bsn!</code> declarative widget trees.
						</li>
						<li>
							ActionScript UI callbacks transpile to Luau handlers so one scripting runtime drives
							both UI and gameplay.
						</li>
					</ul>
				</div>

				<CodeBlock code={uiTranspile} language="rust" filename="src/ui/inventory_menu.rs" />
			</section>
		</div>
	</div>
</main>
