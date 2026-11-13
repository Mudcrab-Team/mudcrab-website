<script lang="ts">
	import Button from '../../components/Button.svelte';
	import CodeBlock from '../../components/CodeBlock.svelte';

	let scriptView = $state<'luau' | 'papyrus' | 'bsn'>('luau');

	const tocItems = [
		{ id: 'compatibility', label: 'Compatibility matrix' },
		{ id: 'mo2', label: 'Mod Organizer 2 profiles' },
		{ id: 'luau', label: 'Luau scripting API' },
		{ id: 'migration', label: 'Papyrus to Luau guide' },
		{ id: 'ui', label: 'Flash UI to Bevy bsn!' },
		{ id: 'testing', label: 'Editor types and testing' }
	];

	const compatibilityRows = [
		{
			area: 'Master and plugin files (.esm, .esp)',
			status: 'Supported',
			tone: 'ok',
			detail: 'Parsed into skyrim_world.db (SQLite 3 + R-Tree) with load-order resolution.'
		},
		{
			area: 'BSA archives and loose assets (.nif, .dds)',
			status: 'Supported',
			tone: 'ok',
			detail: 'Converted to glTF 2.0 (.glb) and KTX2 (native BC preservation or UASTC).'
		},
		{
			area: 'Mod Organizer 2 instances and profiles',
			status: 'Supported',
			tone: 'ok',
			detail: 'Read in place via launcher MO2 settings or --mo2-instance / --mo2-profile flags.'
		},
		{
			area: 'Papyrus scripts (.pex / .psc)',
			status: 'Transpiled',
			tone: 'info',
			detail: 'Compiled bytecode and source transpile into sandboxed Luau (.lua) scripts.'
		},
		{
			area: 'Scaleform menus (.swf / .gfx)',
			status: 'Transpiled',
			tone: 'info',
			detail: 'Layouts convert to Bevy 0.19 bsn! nodes and ActionScript 2.0 becomes Luau.'
		},
		{
			area: 'Native x86 SKSE plugins (.dll)',
			status: 'Unsupported',
			tone: 'warn',
			detail: 'Memory-hooking Windows DLLs do not load in Bevy; reimplement features in Luau.'
		},
		{
			area: 'Authoring folders and asset symlinks',
			status: 'Excluded',
			tone: 'warn',
			detail:
				'CalienteTools (BodySlide) data is skipped and symlinked/reparse asset paths are rejected.'
		}
	];

	const papyrusMapping = [
		{
			concept: 'Script class',
			papyrus: 'Scriptname QuestScript extends Quest',
			luau: 'local QuestScript = Class("QuestScript", Quest)'
		},
		{
			concept: 'Form properties',
			papyrus: 'Actor Property PlayerRef auto',
			luau: 'self.PlayerRef = Engine.getForm(0x00000014)'
		},
		{
			concept: 'Event handlers',
			papyrus: 'Event OnInit() ... EndEvent',
			luau: 'function QuestScript:onInit() ... end'
		},
		{
			concept: 'Script states',
			papyrus: 'State Active ... EndState',
			luau: 'self:setState("Active")'
		},
		{
			concept: 'Async wait',
			papyrus: 'Utility.Wait(2.5)',
			luau: 'task.wait(2.5)'
		},
		{
			concept: 'Global native call',
			papyrus: 'Debug.Notification("Hello")',
			luau: 'Engine.Debug.notification("Hello")'
		},
		{
			concept: 'Reference method',
			papyrus: 'TargetRef.Enable()',
			luau: 'self.TargetRef:enable()'
		}
	];

	const mo2ConvertCmd = `cargo run --release -p converter --bin converter -- \\
  "<Skyrim Data>" "<output directory>" \\
  --mo2-instance "<MO2 instance>" \\
  --mo2-profile "<profile>"`;

	const mo2RepairCmd = `# Preview failed-asset repairs in repair-report.json first
cargo run -p converter --bin converter -- repair-failed \\
  "<Skyrim Data>" "<output directory>" \\
  --mo2-instance "<MO2 instance>" \\
  --mo2-profile "<profile>"

# Validate hashes and publish repairs
cargo run -p converter --bin converter -- repair-failed \\
  "<Skyrim Data>" "<output directory>" \\
  --mo2-instance "<MO2 instance>" \\
  --mo2-profile "<profile>" --apply`;

	const luauQuestCode = `local QF_MQ101_0003372B = Class("QF_MQ101_0003372B", Quest)

function QF_MQ101_0003372B:onInit()
    Engine.Debug.notification("Helgen Execution Quest Started!")
    task.wait(1.5)
    self.Alias_Ralof:getReference():enable()
end

local WaitingState = QF_MQ101_0003372B:state("Waiting", { default = true })
function WaitingState:onTouch(actionRef)
    self:setState("Active")
end

local ActiveState = QF_MQ101_0003372B:state("Active")
function ActiveState:onTouch(_actionRef)
    -- No action once active
end`;

	const papyrusQuestCode = `Scriptname QF_MQ101_0003372B extends Quest

ReferenceAlias Property Alias_Ralof auto
ReferenceAlias Property Alias_Hadvar auto

Event OnInit()
    Debug.Notification("Helgen Execution Quest Started!")
    Utility.Wait(1.5)
    Alias_Ralof.GetReference().Enable()
EndEvent

Auto State Waiting
    Event OnTouch(ObjectReference akActionRef)
        GoToState("Active")
    EndEvent
EndState

State Active
    Event OnTouch(ObjectReference akActionRef)
        ; Do nothing
    EndEvent
EndState`;

	const bsnUiCode = `// Transpiled from InventoryMenu.gfx to Bevy 0.19 bsn!
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
                Text::new("Inventory"),
                ButtonNode [
                    Text::new("Iron Longsword"),
                ]
            ]
        ]
    });
}`;

	const luauUiHandlerCode = `local InventoryUI = {}

function InventoryUI:onItemSlotReleased(slot)
    Engine.Player:equipItem(slot.itemID)
    slot:setState("Equipped")
end

return InventoryUI`;

	const luarocksCmd = `luarocks install mudcrab-types`;

	const dummyContentCmd = `cargo run -p dummy-content -- gen Data
cargo run -p converter --bin converter -- Data modern_assets
cargo run -p engine --bin engine -- --assets modern_assets --worldspace 1`;
</script>

<svelte:head>
	<title>Modding Guide · Mudcrab</title>
	<meta
		name="description"
		content="Modding documentation for Mudcrab: Mod Organizer 2 profiles, sandboxed Luau scripting, Papyrus migration, Bevy bsn! UI, and synthetic testing."
	/>
</svelte:head>

<div class="modding-page">
	<header class="docs-intro">
		<h1>Modding Skyrim in Mudcrab</h1>
		<p>
			Keep your existing Mod Organizer 2 load orders, assets, and plugins while moving gameplay
			scripts and custom menus onto sandboxed Luau JIT and native Bevy UI.
		</p>
		<div class="docs-actions">
			<Button variant="primary" href="/releases">Get launcher and converter</Button>
		</div>
	</header>

	<div class="modding-layout">
		<aside class="modding-sidebar" aria-label="Modding guide sections">
			<div class="sidebar-sticky">
				<h2 class="sidebar-heading">Sections</h2>
				<nav class="toc-nav">
					{#each tocItems as item}
						<a href="#{item.id}">{item.label}</a>
					{/each}
				</nav>
				<div class="sidebar-links">
					<a
						href="https://github.com/Mudcrab-Team/mudcrab/tree/main/docs/specs/modding"
						target="_blank"
						rel="noreferrer"
					>
						Engine modding specs on GitHub
					</a>
					<a href="https://discord.gg/29GRf8QShH" target="_blank" rel="noreferrer">
						Ask modders on Discord
					</a>
				</div>
			</div>
		</aside>

		<main class="modding-content">
			<section id="compatibility" class="doc-section" aria-labelledby="compat-heading">
				<h2 id="compat-heading">Compatibility matrix</h2>
				<p>
					Mudcrab converts standard Skyrim Special Edition archives, plugins, meshes, textures, and
					Papyrus bytecode into GPU-native runtime packs. Native Windows x86 SKSE DLLs are not
					loaded because the Bevy engine does not share Skyrim's process memory layout.
				</p>

				<div class="doc-table-wrap">
					<table class="doc-table">
						<thead>
							<tr>
								<th>Mod component</th>
								<th>Status</th>
								<th>How Mudcrab handles it</th>
							</tr>
						</thead>
						<tbody>
							{#each compatibilityRows as row}
								<tr>
									<td class="cell-strong">{row.area}</td>
									<td class="cell-status status-{row.tone}">{row.status}</td>
									<td>{row.detail}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</section>

			<section id="mo2" class="doc-section" aria-labelledby="mo2-heading">
				<h2 id="mo2-heading">Mod Organizer 2 profiles</h2>
				<p>
					Mudcrab reads Mod Organizer 2 instances in place without altering your profile folders.
					Your base Skyrim Special Edition <code>Data</code> folder is still required alongside the instance
					path.
				</p>

				<ol class="doc-steps">
					<li>
						<strong>In the desktop launcher:</strong> Switch the source mode from
						<code>Skyrim Data</code> to <code>MO2 profile</code>, open
						<strong>MO2 settings</strong>, drop the folder containing <code>ModOrganizer.ini</code>,
						and choose your profile from the dropdown.
					</li>
					<li>
						<strong>On the command line:</strong> Pass <code>--mo2-instance</code> and optionally
						<code>--mo2-profile</code> directly to <code>converter</code>.
					</li>
				</ol>

				<CodeBlock code={mo2ConvertCmd} language="bash" filename="Convert an MO2 profile" />

				<p>
					Note that MO2 directories may resolve through junctions, while profile, enabled-mod, and
					asset reparse points are rejected for path safety. Changes to MO2 window settings or
					disabled mod entries do not invalidate your whole conversion cache; only winning asset and
					plugin changes trigger rebuilds.
				</p>

				<h3>Repairing failed mod assets without a full rebuild</h3>
				<p>
					If a single mod mesh or archive causes a failure during conversion, use
					<code>repair-failed</code> to stage and revalidate only affected inputs, then pass
					<code>--apply</code> once <code>repair-report.json</code> looks clean.
				</p>

				<CodeBlock code={mo2RepairCmd} language="bash" filename="Incremental repair workflow" />
			</section>

			<section id="luau" class="doc-section" aria-labelledby="luau-heading">
				<h2 id="luau-heading">Luau scripting API</h2>
				<p>
					Mudcrab replaces Skyrim's single-threaded Papyrus VM with an isolated
					<code>crates/scripting</code> runtime powered by <code>mlua</code> and Luau JIT. Scripts run
					inside a strict sandbox with no host filesystem access while exposing clean engine namespaces.
				</p>

				<ul class="doc-list">
					<li>
						<strong>Engine bindings:</strong> Interact with the world through
						<code>Engine.Player</code>, <code>Engine.Weather</code>, <code>Engine.Cell</code>,
						<code>Engine.UI</code>, and <code>Engine.Debug</code>.
					</li>
					<li>
						<strong>Live hot-reloading:</strong> Edit <code>.lua</code> files while the game is running
						and test changes without restarting the client or recompiling Rust.
					</li>
					<li>
						<strong>Async web and local AI bridges:</strong> Non-blocking HTTP and WebSocket APIs let
						mods connect NPC dialogue to local LLM servers like Ollama or sync live weather.
					</li>
				</ul>
			</section>

			<section id="migration" class="doc-section" aria-labelledby="migration-heading">
				<h2 id="migration-heading">Papyrus to Luau guide</h2>
				<p>
					Existing <code>.pex</code> bytecode and <code>.psc</code> scripts transpile into idiomatic Luau
					classes, state tables, and coroutine yields. Use the mapping below when writing new scripts
					or updating transpiled mods.
				</p>

				<div class="doc-table-wrap">
					<table class="doc-table">
						<thead>
							<tr>
								<th>Concept</th>
								<th>Papyrus (.psc)</th>
								<th>Mudcrab Luau (.lua)</th>
							</tr>
						</thead>
						<tbody>
							{#each papyrusMapping as row}
								<tr>
									<td class="cell-strong">{row.concept}</td>
									<td><code>{row.papyrus}</code></td>
									<td><code>{row.luau}</code></td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>

				<div class="code-compare">
					<div class="code-compare-bar">
						<h3>Quest script example: Helgen startup</h3>
						<div class="segmented" role="tablist" aria-label="Choose script language">
							<button
								type="button"
								role="tab"
								aria-selected={scriptView === 'luau'}
								class:active={scriptView === 'luau'}
								onclick={() => (scriptView = 'luau')}
							>
								Luau (.lua)
							</button>
							<button
								type="button"
								role="tab"
								aria-selected={scriptView === 'papyrus'}
								class:active={scriptView === 'papyrus'}
								onclick={() => (scriptView = 'papyrus')}
							>
								Papyrus (.psc)
							</button>
							<button
								type="button"
								role="tab"
								aria-selected={scriptView === 'bsn'}
								class:active={scriptView === 'bsn'}
								onclick={() => (scriptView = 'bsn')}
							>
								UI node (bsn!)
							</button>
						</div>
					</div>

					{#if scriptView === 'luau'}
						<CodeBlock
							code={luauQuestCode}
							language="luau"
							filename="modern_assets/scripts/QF_MQ101_0003372B.lua"
						/>
					{:else if scriptView === 'papyrus'}
						<CodeBlock
							code={papyrusQuestCode}
							language="text"
							filename="Data/Scripts/Source/QF_MQ101_0003372B.psc"
						/>
					{:else}
						<CodeBlock
							code={bsnUiCode}
							language="rust"
							filename="crates/engine/src/ui/inventory_menu.rs"
						/>
					{/if}
				</div>
			</section>

			<section id="ui" class="doc-section" aria-labelledby="ui-heading">
				<h2 id="ui-heading">Flash UI to Bevy bsn!</h2>
				<p>
					Original Skyrim <code>.swf</code> and <code>.gfx</code> Scaleform interfaces are exported
					offline into declarative Bevy 0.19 <code>bsn!</code> widget trees, while ActionScript 2.0 handlers
					transpile into unified Luau modules. Because UI runs directly on Bevy ECS without an embedded
					browser or webview, menu interactions mutate game state with zero IPC overhead.
				</p>

				<CodeBlock
					code={luauUiHandlerCode}
					language="luau"
					filename="modern_assets/scripts/ui/inventory.lua"
				/>
			</section>

			<section id="testing" class="doc-section" aria-labelledby="testing-heading">
				<h2 id="testing-heading">Editor types and synthetic testing</h2>
				<p>
					Install the EmmyLua and LuaLS type definitions package to get full autocomplete, parameter
					hints, and static checks in VS Code, Zed, Neovim, or Cursor.
				</p>

				<CodeBlock code={luarocksCmd} language="bash" filename="Install mudcrab.d.lua types" />

				<p>
					When you want to iterate on scripts or engine pull requests quickly without reading a full
					Skyrim installation, generate the asset-free synthetic worldspace (form ID
					<code>1</code>) using <code>dummy-content</code>.
				</p>

				<CodeBlock
					code={dummyContentCmd}
					language="bash"
					filename="Generate and boot synthetic test world"
				/>
			</section>
		</main>
	</div>
</div>

<style>
	.modding-page {
		display: flex;
		flex-direction: column;
		gap: 2.5rem;
		padding-top: 2.5rem;
	}

	.modding-layout {
		display: grid;
		grid-template-columns: 15.5rem minmax(0, 1fr);
		gap: clamp(2rem, 4.5vw, 4.5rem);
		align-items: start;
	}

	.modding-sidebar {
		position: relative;
	}

	.sidebar-sticky {
		position: sticky;
		top: 6rem;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		padding-right: 1rem;
		border-right: 1px solid var(--color-border);
	}

	.sidebar-heading {
		font-size: var(--text-body);
		font-family: var(--font-display);
		color: var(--color-text);
	}

	.toc-nav {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.toc-nav a {
		padding: 0.45rem 0.65rem;
		border-left: 2px solid transparent;
		color: var(--color-text-muted);
		font-size: var(--text-sm);
		text-decoration: none;
		transition:
			color var(--duration-fast) var(--ease-standard),
			border-color var(--duration-fast) var(--ease-standard);
	}

	.toc-nav a:hover {
		border-left-color: var(--color-accent);
		color: var(--color-text);
	}

	.sidebar-links {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding-top: 1rem;
		border-top: 1px solid var(--color-border);
	}

	.sidebar-links a {
		font-size: var(--text-sm);
		color: var(--color-steel-bright);
	}

	.modding-content {
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 3.5rem;
	}

	.docs-intro {
		padding-bottom: 2.5rem;
		border-bottom: 1px solid var(--color-border);
	}

	.docs-intro h1 {
		font-size: clamp(2.1rem, 4vw, 3.25rem);
		line-height: 1.04;
		margin-bottom: 1rem;
	}

	.docs-intro p {
		max-width: 60ch;
	}

	.docs-actions {
		margin-top: 1.5rem;
	}

	.doc-section {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		scroll-margin-top: 6rem;
		padding-bottom: 3rem;
		border-bottom: 1px solid var(--color-border);
	}

	.doc-section:last-child {
		border-bottom: 0;
		padding-bottom: 0;
	}

	.doc-section h3 {
		margin-top: 0.75rem;
		font-family: var(--font-display);
		color: var(--color-text);
	}

	.doc-section code,
	.doc-table code {
		padding: 0.1rem 0.35rem;
		border-radius: var(--radius-sm);
		background: var(--color-surface-inset);
		color: var(--color-steel-bright);
		font-family: var(--font-mono);
		font-size: var(--text-sm);
	}

	.doc-steps,
	.doc-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		max-width: 65ch;
	}

	.doc-table-wrap {
		width: 100%;
		overflow-x: auto;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		background: var(--color-surface);
	}

	.doc-table {
		width: 100%;
		border-collapse: collapse;
		text-align: left;
		font-size: var(--text-sm);
	}

	.doc-table th,
	.doc-table td {
		padding: 0.85rem 1rem;
		border-bottom: 1px solid var(--color-border);
		vertical-align: top;
	}

	.doc-table th {
		background: var(--color-surface-raised);
		color: var(--color-text);
		font-weight: 600;
	}

	.doc-table tbody tr:last-child td {
		border-bottom: 0;
	}

	.cell-strong {
		color: var(--color-text);
		font-weight: 600;
	}

	.cell-status {
		font-weight: 600;
		white-space: nowrap;
	}

	.status-ok {
		color: var(--color-success);
	}

	.status-info {
		color: var(--color-steel-bright);
	}

	.status-warn {
		color: var(--color-accent);
	}

	.code-compare {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-top: 0.5rem;
	}

	.code-compare-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.code-compare-bar h3 {
		margin: 0;
	}

	.segmented {
		display: inline-flex;
		padding: 0.25rem;
		border: 1px solid var(--color-border-strong);
		border-radius: var(--radius-md);
		background: var(--color-surface);
	}

	.segmented button {
		padding: 0.45rem 0.85rem;
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

	@media (max-width: 900px) {
		.modding-layout {
			grid-template-columns: 1fr;
			gap: 2rem;
		}

		.sidebar-sticky {
			position: static;
			padding-right: 0;
			padding-bottom: 1.5rem;
			border-right: 0;
			border-bottom: 1px solid var(--color-border);
		}

		.toc-nav {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 0.35rem;
		}
	}

	@media (max-width: 520px) {
		.toc-nav {
			grid-template-columns: 1fr;
		}
	}
</style>
