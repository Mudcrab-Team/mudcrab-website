<script lang="ts">
	import AlertTriangle from '@lucide/svelte/icons/alert-triangle';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import Check from '@lucide/svelte/icons/check';
	import Download from '@lucide/svelte/icons/download';
	import Info from '@lucide/svelte/icons/info';
	import Plus from '@lucide/svelte/icons/plus';
	import X from '@lucide/svelte/icons/x';
	import Button from '../../components/Button.svelte';
	import Link from '../../components/Link.svelte';
	import Badge from '../../components/Badge.svelte';
	import Card from '../../components/Card.svelte';
	import TextInput from '../../components/TextInput.svelte';
	import Select from '../../components/Select.svelte';
	import Combobox from '../../components/Combobox.svelte';
	import Checkbox from '../../components/Checkbox.svelte';
	import RadioGroup from '../../components/RadioGroup.svelte';
	import Switch from '../../components/Switch.svelte';
	import Accordion from '../../components/Accordion.svelte';
	import Tabs from '../../components/Tabs.svelte';
	import Alert from '../../components/Alert.svelte';
	import Tooltip from '../../components/Tooltip.svelte';
	import Modal from '../../components/Modal.svelte';
	import CodeBlock from '../../components/CodeBlock.svelte';
	import Pagination from '../../components/Pagination.svelte';
	import BrandMark from '../../components/BrandMark.svelte';
	import SectionHeader from '../../components/SectionHeader.svelte';
	import Divider from '../../components/Divider.svelte';
		import EmptyState from '../../components/EmptyState.svelte';

	let searchValue = $state('');
	let category = $state<string | undefined>(undefined);
	let mod = $state<string | undefined>(undefined);
	let enabledMods = $state<string[]>([]);
	let radioValue = $state<string | undefined>('balanced');
	let soundEnabled = $state(true);
	let activeTab = $state<string | undefined>('overview');
	let currentPage = $state(2);

	const categoryItems = [
		{ label: 'All categories', value: 'all' },
		{ label: 'Interface', value: 'interface' },
		{ label: 'Installation', value: 'installation' },
		{ label: 'Updates', value: 'updates' }
	];
	const modItems = [
		{ label: 'SkyUI', value: 'skyui' },
		{ label: 'Unofficial Skyrim Special Edition Patch', value: 'ussep' },
		{ label: 'Static Mesh Improvement Mod', value: 'smim' },
		{ label: 'Ordinator — Perks of Skyrim', value: 'ordinator' },
		{ label: 'Legacy of the Dragonborn', value: 'lotd' },
		{ label: 'Frostfall', value: 'frostfall', disabled: true }
	];
	const radioItems = [
		{ label: 'Performance', value: 'performance', description: 'Prioritize a faster experience.' },
		{ label: 'Balanced', value: 'balanced', description: 'A considered default for most players.' },
		{ label: 'Immersion', value: 'immersion', description: 'Keep the atmosphere front and center.' }
	];
	const accordionItems = [
		{
			value: 'interface',
			title: 'Interface improvements',
			content: 'Keep menus clear and readable while preserving the atmosphere of the world.'
		},
		{
			value: 'controls',
			title: 'Controls and shortcuts',
			content: 'Customize the controls that make your most-used actions feel natural.'
		},
		{
			value: 'legacy',
			title: 'Legacy setting',
			content: 'This setting is not available in the current version.',
			disabled: true
		}
	];
	const codeExample = `const profile = await loadProfile('survival');

if (profile.ready) {
  await applySettings(profile.settings);
}`;

	const tabItems = [
		{
			value: 'overview',
			label: 'Overview',
			content:
				'A focused overview keeps the most important information visible without adding noise.'
		},
		{
			value: 'details',
			label: 'Details',
			content: 'Use this space for supporting information, configuration notes, or deeper context.'
		},
		{
			value: 'unavailable',
			label: 'Unavailable',
			content: 'This area is not available in the current version.',
			disabled: true
		}
	];
</script>

{#snippet arrowIcon()}
	<ArrowRight size={16} strokeWidth={1.75} />
{/snippet}

{#snippet downloadIcon()}
	<Download size={16} strokeWidth={1.75} />
{/snippet}

{#snippet infoIcon()}
	<Info size={14} strokeWidth={1.75} />
{/snippet}

{#snippet successIcon()}
	<Check size={14} strokeWidth={1.75} />
{/snippet}

{#snippet warningIcon()}
	<AlertTriangle size={14} strokeWidth={1.75} />
{/snippet}

{#snippet cardAction()}
	<Link href="/components" arrow>Read more</Link>
{/snippet}

<svelte:head>
	<title>Components — Mudcrab</title>
	<meta
		name="description"
		content="Mudcrab design system component showcase and typography reference."
	/>
</svelte:head>

<div class="showcase">
	<header class="hero">
		<BrandMark compact />
		<div>
			<p class="eyebrow">Mudcrab · Design system</p>
			<h1>Components</h1>
			<p class="hero-copy">
				A reusable component library for a clear, immersive interface inspired by Skyrim's quiet,
				weathered UI language.
			</p>
		</div>
	</header>

	<Divider spacing="lg" label="End of introduction" />

	<main>
		<section class="section" aria-labelledby="typography-heading">
			<SectionHeader
				id="typography-heading"
				eyebrow="01 · Foundations"
				title="Typography"
				description="Cinzel brings an engraved, considered voice to headings. Inter keeps body copy, menus, labels, and controls practical and readable."
			/>

			<div class="specimen-grid">
				<div class="type-specimen">
					<div class="type-row">
						<span class="type-label">H1 · 3xl</span>
						<h1>The Elder Scrolls V</h1>
					</div>
					<div class="type-row">
						<span class="type-label">H2 · 2xl</span>
						<h2>A better way to play</h2>
					</div>
					<div class="type-row">
						<span class="type-label">H3 · xl</span>
						<h3>Thoughtful improvements</h3>
					</div>
					<div class="type-row">
						<span class="type-label">H4 · lg</span>
						<h4>Streamlined, familiar, powerful</h4>
					</div>
					<div class="type-row">
						<span class="type-label">H5 · md</span>
						<h5>Designed for immersion</h5>
					</div>
					<div class="type-row">
						<span class="type-label">H6 · sm</span>
						<h6>Feature overview</h6>
					</div>
				</div>

				<aside class="type-notes">
					<div class="note">
						<span class="type-label">Body</span>
						<p>
							Mudcrab enhances Skyrim's user interface with a calmer visual rhythm, clearer
							hierarchy, and a more immersive reading experience.
						</p>
					</div>
					<div class="note">
						<span class="type-label">Lead</span>
						<p class="lead">Clarity without breaking immersion.</p>
					</div>
					<div class="note">
						<span class="type-label">Utilities</span>
						<p class="eyebrow">Eyebrow / overline</p>
						<p class="small">Small supporting text for metadata and secondary content.</p>
						<p class="caption">Caption · Updated 2 days ago</p>
					</div>
				</aside>
			</div>
		</section>

		<section class="section" aria-labelledby="buttons-heading">
			<div class="section-heading">
				<p class="eyebrow">02 · Actions</p>
				<h2 id="buttons-heading">Buttons</h2>
				<p>One button component covers text actions, loading states, and icon-only controls.</p>
			</div>

			<div class="button-showcase">
				<div class="button-group">
					<span class="type-label">Variants</span>
					<div class="button-row">
						<Button variant="primary" trailing={arrowIcon}>Get started</Button>
						<Button variant="secondary">View details</Button>
						<Button variant="ghost">Explore</Button>
						<Button variant="danger">Remove</Button>
					</div>
				</div>

				<div class="button-group">
					<span class="type-label">With Lucide icons</span>
					<div class="button-row">
						<Button variant="secondary" leading={downloadIcon}>Download</Button>
						<Button variant="button" label="Add item"><Plus size={17} strokeWidth={1.75} /></Button>
						<Button variant="button" label="Close"><X size={17} strokeWidth={1.75} /></Button>
						<Button variant="button" label="Next" size="sm"
							><ArrowRight size={15} strokeWidth={1.75} /></Button
						>
					</div>
				</div>

				<div class="button-group">
					<span class="type-label">States and sizes</span>
					<div class="button-row">
						<Button size="sm" variant="secondary">Small</Button>
						<Button size="lg" variant="primary">Large</Button>
						<Button variant="secondary" loading>Saving</Button>
						<Button variant="secondary" disabled>Disabled</Button>
					</div>
				</div>
			</div>
		</section>

		<section class="section" aria-labelledby="links-heading">
			<div class="section-heading">
				<p class="eyebrow">03 · Navigation</p>
				<h2 id="links-heading">Links</h2>
				<p>
					Links carry navigation and inline reading actions without competing with primary buttons.
				</p>
			</div>

			<div class="link-showcase">
				<div class="link-example">
					<span class="type-label">Default link</span>
					<Link href="/components" arrow>Read more</Link>
				</div>
				<div class="link-example">
					<span class="type-label">Hover / muted</span>
					<Link href="/components" variant="muted" arrow>View details</Link>
				</div>
				<div class="link-example">
					<span class="type-label">External link</span>
					<Link href="https://github.com" external>View on GitHub</Link>
				</div>
				<div class="link-example">
					<span class="type-label">Inline link</span>
					<p>
						Read the <Link href="/components" variant="inline" underline={false}
							>component documentation</Link
						> to learn more.
					</p>
				</div>
			</div>
		</section>

		<section class="section" aria-labelledby="badges-heading">
			<div class="section-heading">
				<p class="eyebrow">04 · Metadata</p>
				<h2 id="badges-heading">Badges</h2>
				<p>Compact labels make status, category, and environment information easy to scan.</p>
			</div>

			<div class="badge-showcase">
				<div class="badge-group">
					<span class="type-label">Tones</span>
					<div class="badge-row">
						<Badge>Neutral</Badge>
						<Badge tone="accent">Accent</Badge>
						<Badge tone="success" icon={successIcon}>Success</Badge>
						<Badge tone="warning" icon={warningIcon}>Warning</Badge>
						<Badge tone="danger">Danger</Badge>
					</div>
				</div>
				<div class="badge-group">
					<span class="type-label">Sizes and context</span>
					<div class="badge-row">
						<Badge size="md" tone="accent" icon={infoIcon}>Development</Badge>
						<Badge size="md" tone="success" icon={successIcon}>Installed</Badge>
						<Badge size="sm">Version 1.0</Badge>
					</div>
				</div>
			</div>
		</section>

		<section class="section" aria-labelledby="cards-heading">
			<div class="section-heading">
				<p class="eyebrow">05 · Surfaces</p>
				<h2 id="cards-heading">Cards</h2>
				<p>
					Cards group related content into quiet, bordered surfaces with clear hierarchy and
					optional interaction.
				</p>
			</div>

			<div class="card-showcase">
				<Card
					variant="feature"
					eyebrow="Feature card"
					title="More control"
					description="Additional options and customization, presented with a little more room to breathe."
					footer={cardAction}
				/>
				<Card
					variant="interactive"
					href="/components"
					eyebrow="Blog card"
					title="Designing for immersion"
					description="Thoughts on UI design in Skyrim and how to improve the player experience."
				/>
				<Card
					variant="media"
					eyebrow="Gallery card"
					title="Inventory redesign"
					description="A clearer, more organized inventory interface."
					image="https://picsum.photos/seed/mudcrab-gallery/800/450"
				/>
			</div>
		</section>

		<section class="section" aria-labelledby="empty-state-heading">
			<div class="section-heading">
				<p class="eyebrow">05 · Content</p>
				<h2 id="empty-state-heading">Empty state</h2>
				<p>Give unavailable content a clear explanation and a useful next step.</p>
			</div>

			<EmptyState
				icon={infoIcon}
				title="No saved profiles yet"
				description="Create a profile to keep your preferred settings ready for the next session."
			>
				{#snippet action()}
					<Button variant="secondary">Create profile</Button>
				{/snippet}
			</EmptyState>
		</section>

		<section class="section" aria-labelledby="inputs-heading">
			<div class="section-heading">
				<p class="eyebrow">06 · Forms</p>
				<h2 id="inputs-heading">Text inputs</h2>
				<p>
					Inputs keep labels, help text, and validation messages close to the control they describe.
				</p>
			</div>

			<div class="input-showcase">
				<div class="input-group">
					<span class="type-label">Default states</span>
					<div class="input-grid">
						<TextInput
							id="component-search"
							label="Search"
							type="search"
							placeholder="Search components..."
							bind:value={searchValue}
						/>
						<TextInput
							id="component-email"
							label="Email address"
							type="email"
							placeholder="you@example.com"
							description="We will only use this for account updates."
						/>
					</div>
				</div>
				<div class="input-group">
					<span class="type-label">Validation and states</span>
					<div class="input-grid">
						<TextInput
							id="component-required"
							label="Required field"
							placeholder="Enter a value"
							required
						/>
						<TextInput
							id="component-error"
							label="Username"
							value="mud"
							error="Username must be at least 4 characters."
						/>
						<TextInput
							id="component-disabled"
							label="Disabled input"
							value="Unavailable"
							disabled
						/>
					</div>
				</div>
			</div>
		</section>

		<section class="section" aria-labelledby="select-heading">
			<div class="section-heading">
				<p class="eyebrow">07 · Forms</p>
				<h2 id="select-heading">Select</h2>
				<p>
					A styled select with keyboard navigation and predictable focus behavior, powered by
					bits-ui.
				</p>
			</div>

			<div class="input-showcase select-showcase">
				<div class="input-group">
					<span class="type-label">Selection states</span>
					<div class="input-grid">
						<Select
							id="component-category"
							label="Category"
							items={categoryItems}
							bind:value={category}
						/>
						<Select
							id="component-disabled-select"
							label="Disabled select"
							items={categoryItems}
							placeholder="Unavailable"
							disabled
						/>
					</div>
				</div>
			</div>
		</section>

		<section class="section" aria-labelledby="combobox-heading">
			<div class="section-heading">
				<p class="eyebrow">08 · Forms</p>
				<h2 id="combobox-heading">Combobox</h2>
				<p>Search a list of options and select one without leaving the keyboard.</p>
			</div>

			<div class="input-showcase">
				<div class="input-group">
					<span class="type-label">Searchable selection</span>
					<div class="input-grid">
						<Combobox
							id="component-mod"
							label="Installed mod"
							items={modItems}
							placeholder="Search installed mods..."
							description="Type to filter the available options."
							bind:value={mod}
						/>
						<Combobox
							id="component-enabled-mods"
							label="Enabled mods"
							items={modItems}
							placeholder="Search mods to enable..."
							description="The list stays open so you can select several options."
							multiple
							bind:value={enabledMods}
						/>
					</div>
				</div>
			</div>
		</section>

		<section class="section" aria-labelledby="checkbox-heading">
			<div class="section-heading">
				<p class="eyebrow">08 · Forms</p>
				<h2 id="checkbox-heading">Checkbox</h2>
				<p>Use checkboxes for independent settings, preferences, and consent choices.</p>
			</div>

			<div class="input-showcase checkbox-showcase">
				<div class="input-group">
					<span class="type-label">Checkbox states</span>
					<div class="checkbox-grid">
						<Checkbox
							id="feature-checkbox"
							label="Enable feature"
							description="Allow this feature to be used in your workspace."
							checked
						/>
						<Checkbox
							id="notifications-checkbox"
							label="Enable notifications"
							description="Receive updates when something changes."
						/>
						<Checkbox id="disabled-checkbox" label="Unavailable setting" disabled />
					</div>
				</div>
			</div>
		</section>

		<section class="section" aria-labelledby="radio-heading">
			<div class="section-heading">
				<p class="eyebrow">09 · Forms</p>
				<h2 id="radio-heading">Radio group</h2>
				<p>
					Radio groups are for mutually exclusive choices where the user can select only one option.
				</p>
			</div>

			<div class="input-showcase radio-showcase">
				<div class="input-group">
					<RadioGroup
						id="interface-mode"
						label="Interface mode"
						items={radioItems}
						bind:value={radioValue}
					/>
				</div>
				<div class="input-group">
					<RadioGroup
						id="disabled-mode"
						label="Disabled group"
						items={radioItems}
						value="balanced"
						disabled
						orientation="horizontal"
					/>
				</div>
			</div>
		</section>

		<section class="section" aria-labelledby="switch-heading">
			<div class="section-heading">
				<p class="eyebrow">10 · Forms</p>
				<h2 id="switch-heading">Switch</h2>
				<p>
					Use switches for immediate on/off preferences that take effect as soon as they change.
				</p>
			</div>

			<div class="input-showcase switch-showcase">
				<div class="input-group">
					<span class="type-label">Preference states</span>
					<div class="checkbox-grid">
						<Switch
							id="sound-switch"
							label="Interface sounds"
							description="Play sounds for menus and interactions."
							bind:checked={soundEnabled}
						/>
						<Switch
							id="cloud-switch"
							label="Cloud saves"
							description="Keep your progress synchronized across devices."
						/>
						<Switch id="disabled-switch" label="Unavailable setting" disabled />
					</div>
				</div>
			</div>
		</section>

		<section class="section" aria-labelledby="accordion-heading">
			<div class="section-heading">
				<p class="eyebrow">11 · Disclosure</p>
				<h2 id="accordion-heading">Accordion</h2>
				<p>Use accordions to progressively reveal related details without overwhelming the page.</p>
			</div>

			<div class="input-showcase accordion-showcase">
				<div class="input-group">
					<span class="type-label">Single item open</span>
					<Accordion items={accordionItems} defaultValue="interface" />
				</div>
			</div>
		</section>

		<section class="section" aria-labelledby="tabs-heading">
			<div class="section-heading">
				<p class="eyebrow">12 · Navigation</p>
				<h2 id="tabs-heading">Tabs</h2>
				<p>Use tabs to organize related views while keeping one focused panel visible at a time.</p>
			</div>

			<div class="input-showcase tabs-showcase">
				<div class="input-group">
					<span class="type-label">Automatic activation</span>
					<Tabs items={tabItems} bind:value={activeTab} />
				</div>
			</div>
		</section>

		<section class="section" aria-labelledby="alert-heading">
			<div class="section-heading">
				<p class="eyebrow">13 · Feedback</p>
				<h2 id="alert-heading">Alert</h2>
				<p>
					Use alerts for important context, system status, and messages that need the user’s
					attention.
				</p>
			</div>

			<div class="input-showcase alert-showcase">
				<div class="input-group">
					<span class="type-label">Semantic tones</span>
					<div class="alert-list">
						<Alert tone="info" title="Information">Your settings are saved automatically.</Alert>
						<Alert tone="success" title="Saved">Your load order has been updated.</Alert>
						<Alert tone="warning" title="Review needed"
							>Some changes may affect your current session.</Alert
						>
						<Alert tone="danger" title="Unable to connect" dismissible
							>The server could not be reached. Try again in a moment.</Alert
						>
					</div>
				</div>
			</div>
		</section>

		<section class="section" aria-labelledby="tooltip-heading">
			<div class="section-heading">
				<p class="eyebrow">14 · Feedback</p>
				<h2 id="tooltip-heading">Tooltip</h2>
				<p>
					Use tooltips for brief, non-essential hints that clarify controls without adding visual
					clutter.
				</p>
			</div>

			<div class="input-showcase tooltip-showcase">
				<div class="input-group">
					<span class="type-label">Placement and keyboard access</span>
					<div class="tooltip-list">
						<Tooltip content="Shows the current installation status.">Hover or focus me</Tooltip>
						<Tooltip content="Additional details appear on the right." side="right"
							>Right-side hint</Tooltip
						>
						<Tooltip content="This hint opens after a short delay." side="bottom" delay={500}
							>Delayed hint</Tooltip
						>
					</div>
				</div>
			</div>
		</section>

		<section class="section" aria-labelledby="modal-heading">
			<div class="section-heading">
				<p class="eyebrow">15 · Overlay</p>
				<h2 id="modal-heading">Modal</h2>
				<p>
					Use modals for focused tasks that need a clear decision or a small amount of dedicated
					space.
				</p>
			</div>

			<div class="input-showcase modal-showcase">
				<div class="input-group">
					<span class="type-label">Controlled dialog</span>
					<Modal
						title="Change load order"
						description="Review this change before applying it to your current profile."
					>
						{#snippet trigger()}Open modal{/snippet}
						{#snippet content()}
							<p>Moving this entry may change which resources take priority when the game loads.</p>
						{/snippet}
						{#snippet footer()}
							<button class="modal-action secondary" type="button">Cancel</button>
							<button class="modal-action primary" type="button">Accept</button>
						{/snippet}
					</Modal>
				</div>
			</div>
		</section>

		<section class="section" aria-labelledby="code-block-heading">
			<div class="section-heading">
				<p class="eyebrow">16 · Utility</p>
				<h2 id="code-block-heading">Code block</h2>
				<p>
					Use code blocks for readable configuration examples, terminal output, and snippets that
					should be easy to copy.
				</p>
			</div>

			<div class="code-showcase">
				<div class="input-group">
					<span class="type-label">Copyable snippet</span>
					<CodeBlock code={codeExample} language="typescript" filename="profile.ts" />
				</div>
			</div>
		</section>

		<section class="section" aria-labelledby="pagination-heading">
			<div class="section-heading">
				<p class="eyebrow">17 · Navigation</p>
				<h2 id="pagination-heading">Pagination</h2>
				<p>
					Use pagination to move through larger collections while keeping the current position clear
					and keyboard accessible.
				</p>
			</div>

			<div class="pagination-showcase">
				<div class="input-group">
					<span class="type-label">Controlled pages</span>
					<Pagination bind:page={currentPage} totalPages={5} label="Example pages" />
				</div>
			</div>
		</section>

		<section class="section tokens" aria-labelledby="tokens-heading">
			<div class="section-heading">
				<p class="eyebrow">16 · Usage</p>
				<h2 id="tokens-heading">Semantic HTML first</h2>
				<p>
					Use the correct heading level for the document structure. The theme handles the visual
					hierarchy.
				</p>
			</div>
			<div class="token-grid">
				<div class="token-card"><code>&lt;h1&gt;</code><span>Page title</span></div>
				<div class="token-card"><code>&lt;h2&gt;</code><span>Major section</span></div>
				<div class="token-card"><code>&lt;h3&gt;</code><span>Component group</span></div>
				<div class="token-card"><code>&lt;p&gt;</code><span>Body content</span></div>
			</div>
		</section>
	</main>

	<footer>
		<span class="eyebrow">Next</span>
		<p>Layout primitives and an accessibility review are next.</p>
	</footer>
</div>

<style>
	.showcase {
		width: min(100% - 2rem, var(--content-wide));
		margin: 0 auto;
		padding: clamp(2rem, 7vw, 6rem) 0;
	}
	.hero {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		max-width: 48rem;
	}
	.hero :global(.brand-symbol) {
		display: grid;
		width: 4.5rem;
		height: 4.5rem;
		flex: 0 0 auto;
		place-items: center;
		border: 1px solid var(--color-border-strong);
		color: var(--color-accent);
		font: 2.5rem var(--font-display);
		transform: rotate(45deg);
	}
	.hero :global(.brand-symbol)::first-letter {
		display: block;
		transform: rotate(-45deg);
	}
	.hero h1 {
		margin-top: 0.4rem;
	}
	.hero-copy {
		margin-top: 1.25rem;
		max-width: 42rem;
		font-size: var(--text-lg);
	}
	.eyebrow {
		margin-bottom: 0.7rem;
	}
	.rule {
		height: 1px;
		margin: clamp(2.5rem, 8vw, 6rem) 0;
		background: linear-gradient(90deg, var(--color-border), transparent);
	}
	.section + .section {
		margin-top: clamp(4rem, 10vw, 8rem);
	}
	.section-heading {
		max-width: 42rem;
		margin-bottom: 2.5rem;
	}
	.section-heading h2 {
		margin-bottom: 1rem;
	}
	.specimen-grid {
		display: grid;
		grid-template-columns: minmax(0, 1.5fr) minmax(16rem, 0.75fr);
		gap: 1px;
		border: 1px solid var(--color-border);
		background: var(--color-border);
	}
	.type-specimen,
	.type-notes {
		background: var(--color-surface);
	}
	.type-row {
		display: grid;
		grid-template-columns: 6rem 1fr;
		align-items: baseline;
		gap: 1rem;
		padding: 1.35rem 1.5rem;
		border-bottom: 1px solid var(--color-border);
	}
	.type-row:last-child {
		border-bottom: 0;
	}
	.type-label {
		display: block;
		color: var(--color-text-subtle);
		font: 600 var(--text-xs) var(--font-body);
		letter-spacing: var(--tracking-label);
		text-transform: uppercase;
	}
	.type-notes {
		display: grid;
		align-content: start;
	}
	.note {
		padding: 1.5rem;
		border-bottom: 1px solid var(--color-border);
	}
	.note:last-child {
		border-bottom: 0;
	}
	.note > :not(.type-label) {
		margin-top: 0.75rem;
	}
	.note .eyebrow {
		color: var(--color-text-muted);
	}
	.note .caption {
		margin-top: 0.9rem;
	}
	.tokens {
		padding-top: 1px;
	}
	.button-showcase {
		display: grid;
		gap: 1px;
		border: 1px solid var(--color-border);
		background: var(--color-border);
	}
	.link-showcase {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1px;
		border: 1px solid var(--color-border);
		background: var(--color-border);
	}
	.badge-showcase {
		display: grid;
		gap: 1px;
		border: 1px solid var(--color-border);
		background: var(--color-border);
	}
	.card-showcase {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
	}
	.pagination-showcase,
	.code-showcase {
		display: grid;
		width: 100%;
		min-width: 0;
		gap: 1px;
		border: 1px solid var(--color-border);
		background: var(--color-border);
	}
	.pagination-showcase .input-group,
	.code-showcase .input-group {
		width: 100%;
		min-width: 0;
		max-width: 100%;
		padding: 1.5rem;
		background: var(--color-surface);
	}
	.input-showcase {
		display: grid;
		gap: 1px;
		border: 1px solid var(--color-border);
		background: var(--color-border);
	}
	.input-group {
		display: grid;
		gap: 1rem;
		padding: 1.5rem;
		background: var(--color-surface);
	}
	.alert-list {
		display: grid;
		gap: 0.75rem;
	}
	.tooltip-list {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.75rem;
	}

	.input-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1.25rem;
	}
	.checkbox-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1.5rem;
	}
	.select-showcase {
		margin-top: 0;
	}

	.badge-group {
		display: grid;
		gap: 1rem;
		padding: 1.5rem;
		background: var(--color-surface);
	}
	.badge-row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.75rem;
	}
	.link-example {
		display: grid;
		align-content: start;
		gap: 1rem;
		min-height: 8rem;
		padding: 1.5rem;
		background: var(--color-surface);
	}
	.link-example p {
		font-size: var(--text-sm);
	}
	.link-example :global(.link) {
		display: inline-flex;
	}
	.button-group {
		display: grid;
		gap: 1rem;
		padding: 1.5rem;
		background: var(--color-surface);
	}
	.button-row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.75rem;
	}
	.token-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 0.75rem;
	}
	.token-card {
		display: grid;
		gap: 0.65rem;
		padding: 1.25rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		background: var(--color-surface);
	}
	.token-card code {
		color: var(--color-accent);
		font: 0.85rem var(--font-mono);
	}
	.token-card span {
		color: var(--color-text-muted);
		font-size: var(--text-sm);
	}
	footer {
		display: flex;
		gap: 1rem;
		align-items: baseline;
		margin-top: clamp(4rem, 10vw, 8rem);
		padding-top: 1.5rem;
		border-top: 1px solid var(--color-border);
	}
	footer .eyebrow {
		flex: 0 0 auto;
		margin: 0;
	}
	footer p {
		font-size: var(--text-sm);
	}
	@media (max-width: 700px) {
		.showcase {
			width: min(100% - 1.5rem, var(--content-wide));
		}
		.hero {
			align-items: flex-start;
		}
		.hero :global(.brand-symbol) {
			width: 3.25rem;
			height: 3.25rem;
			font-size: 1.75rem;
		}
		.specimen-grid {
			grid-template-columns: 1fr;
		}
		.link-showcase {
			grid-template-columns: repeat(2, 1fr);
		}
		.card-showcase {
			grid-template-columns: 1fr;
		}
		.input-grid,
		.checkbox-grid {
			grid-template-columns: 1fr;
		}
		.token-grid {
			grid-template-columns: repeat(2, 1fr);
		}
		.type-row {
			grid-template-columns: 4.5rem 1fr;
			padding-inline: 1rem;
		}
		footer {
			display: block;
		}
		footer p {
			margin-top: 0.75rem;
		}
	}
	@media (max-width: 420px) {
		.type-row {
			grid-template-columns: 1fr;
			gap: 0.5rem;
		}
		.link-showcase {
			grid-template-columns: 1fr;
		}
		.token-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
