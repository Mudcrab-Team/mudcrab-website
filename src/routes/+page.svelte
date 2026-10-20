<script lang="ts">
	import Accordion from '../components/Accordion.svelte';
	import Badge from '../components/Badge.svelte';
	import Button from '../components/Button.svelte';
	import Card from '../components/Card.svelte';
	import Divider from '../components/Divider.svelte';
	import Link from '../components/Link.svelte';
	import SectionHeader from '../components/SectionHeader.svelte';

	const faqItems = [
		{
			value: 'assets',
			title: 'Does Mudcrab include Skyrim game assets?',
			content:
				'No. Mudcrab does not distribute proprietary game assets, artwork, audio, or game data. You supply data from your own legally purchased copy of The Elder Scrolls V: Skyrim Special Edition.'
		},
		{
			value: 'copy',
			title: 'Do I need a copy of Skyrim Special Edition?',
			content:
				'Yes. A legally purchased copy is required to provide the original game data that Mudcrab converts for use with the engine.'
		},
		{
			value: 'affiliation',
			title: 'Is Mudcrab affiliated with Bethesda?',
			content:
				'No. Mudcrab is an independent, open-source project and is not affiliated with, endorsed by, or connected to Bethesda Softworks, ZeniMax Media, or Microsoft.'
		}
	];
</script>

{#snippet githubIcon()}
	<img src="https://cdn.simpleicons.org/github" alt="" aria-hidden="true" />
{/snippet}

{#snippet discordIcon()}
	<img src="https://cdn.simpleicons.org/discord" alt="" aria-hidden="true" />
{/snippet}

<section class="full-bleed hero-section" aria-labelledby="hero-title">
	<div class="hero-content">
		<Badge tone="accent" size="md">Next-gen Skyrim</Badge>
		<h1 id="hero-title">Mudcrab</h1>
		<h2>The same game, rebuilt for a seamless new world.</h2>
		<p>
			Mudcrab is a new Bevy engine for Skyrim Special Edition: built in Rust, scripted with Luau,
			and designed to stream one open world without loading screens.
		</p>
		<div class="actions">
			<Button
				variant="primary"
				href="https://github.com/realfakenerd/mudcrab"
				target="_blank"
				leading={githubIcon}>View on GitHub</Button
			>
			<Button
				variant="secondary"
				href="https://discord.gg/SnACRkduR"
				target="_blank"
				leading={discordIcon}>Join Discord</Button
			>
		</div>
	</div>
</section>

<main>
	<section class="section intro-section" aria-labelledby="intro-heading">
		<SectionHeader
			id="intro-heading"
			eyebrow="A new foundation"
			title="An engine made for the world beyond the loading screen."
			description="Mudcrab rethinks the runtime beneath Skyrim Special Edition while respecting the game and modding ecosystem people already know. It modernizes legacy formats for a fast, stream-friendly engine without shipping any proprietary game data."
		/>
		<div class="intro-grid">
			<div class="intro-copy">
				<p>
					The project translates original data into modern runtime formats, then runs it in a
					Bevy-powered engine with a focus on performance, extensibility, and seamless exploration.
				</p>
				<Link href="https://github.com/realfakenerd/mudcrab/blob/main/LEGAL.md" external
					>Read the legal notice</Link
				>
			</div>
			<Card
				variant="feature"
				eyebrow="Bring your own data"
				title="Open source, responsibly built"
				description="Mudcrab does not include or distribute copyrighted game assets. A legally purchased copy of Skyrim Special Edition supplies the source data."
			/>
		</div>
	</section>

	<Divider ornament spacing="lg" label="Mudcrab capabilities" />

	<section class="section" aria-labelledby="features-heading">
		<SectionHeader
			id="features-heading"
			eyebrow="Engine highlights"
			title="Built to make the old world feel new."
			description="A modern engine architecture replaces historical constraints with systems designed for performance, modding, and long-running exploration."
		/>
		<div class="card-grid">
			<Card
				variant="feature"
				eyebrow="01 · Seamless world"
				title="No loading screens"
				description="Stream interiors, exteriors, and cities in real time so the world stays connected as you move through it."
			/>
			<Card
				variant="feature"
				eyebrow="02 · Bevy + Rust"
				title="A new runtime"
				description="A modern engine foundation built in Rust with Bevy, prioritizing responsive performance and maintainable systems."
			/>
			<Card
				variant="feature"
				eyebrow="03 · Luau"
				title="Scripting for modders"
				description="Sandboxed Luau scripting provides a fast, flexible foundation for gameplay systems and new kinds of mods."
			/>
			<Card
				variant="feature"
				eyebrow="04 · Modern data"
				title="Made to stream"
				description="Legacy formats are converted into GPU-native and stream-friendly runtime assets for the engine to use efficiently."
			/>
		</div>
	</section>

	<section class="section pipeline-section" aria-labelledby="pipeline-heading">
		<SectionHeader
			id="pipeline-heading"
			eyebrow="From data to world"
			title="A modern path from original files to the game."
			description="Mudcrab keeps game data separate from the engine and transforms it into formats suited to a contemporary renderer and runtime."
			align="center"
		/>
		<ol class="pipeline">
			<li>
				<span class="step-number">01</span>
				<h3>Game data</h3>
				<p>Your legally owned Skyrim Special Edition installation.</p>
			</li>
			<li>
				<span class="step-number">02</span>
				<h3>Converter</h3>
				<p>Assets and records are prepared for Mudcrab’s runtime.</p>
			</li>
			<li>
				<span class="step-number">03</span>
				<h3>Modern formats</h3>
				<p>Stream-friendly data for graphics, world state, and scripts.</p>
			</li>
			<li>
				<span class="step-number">04</span>
				<h3>Bevy engine</h3>
				<p>A connected world powered by the new Mudcrab runtime.</p>
			</li>
		</ol>
	</section>

	<section class="section full-bleed roadmap-section" aria-labelledby="roadmap-heading">
		<SectionHeader
			id="roadmap-heading"
			eyebrow="In development"
			title="Building the engine, one system at a time."
			description="Mudcrab is actively developed in focused milestones that move from data conversion and runtime foundations to gameplay and platform support."
		/>
		<div class="roadmap">
			<div class="roadmap-item">
				<span>01</span>
				<div>
					<h3>Asset modernization</h3>
					<p>Convert legacy game formats into modern runtime data.</p>
				</div>
			</div>
			<div class="roadmap-item">
				<span>02</span>
				<div>
					<h3>Core engine</h3>
					<p>Build the Bevy runtime, renderer, streaming, and profiling foundations.</p>
				</div>
			</div>
			<div class="roadmap-item">
				<span>03</span>
				<div>
					<h3>Scripting and launcher</h3>
					<p>Develop Luau integration, modern UI, and a built-in setup experience.</p>
				</div>
			</div>
			<div class="roadmap-item">
				<span>04</span>
				<div>
					<h3>Gameplay and persistence</h3>
					<p>Implement core systems for physics, animation, combat, and save states.</p>
				</div>
			</div>
			<div class="roadmap-item">
				<span>05</span>
				<div>
					<h3>Platforms and networking</h3>
					<p>Extend the engine across devices and explore future multiplayer support.</p>
				</div>
			</div>
		</div>
	</section>

	<section class="section community-section" aria-labelledby="community-heading">
		<SectionHeader
			id="community-heading"
			eyebrow="Get involved"
			title="Help shape the next engine."
			description="Whether you work in Rust, build mods, improve documentation, or test new systems, there is room to contribute to Mudcrab."
			align="center"
		/>
		<div class="community-actions">
			<Button
				variant="primary"
				href="https://github.com/realfakenerd/mudcrab"
				target="_blank"
				leading={githubIcon}>Explore the repository</Button
			>
			<Button
				variant="secondary"
				href="https://github.com/realfakenerd/mudcrab/blob/main/CONTRIBUTING.md"
				target="_blank">Read the contribution guide</Button
			>
		</div>
	</section>

	<section class="section faq-section" aria-labelledby="faq-heading">
		<SectionHeader
			id="faq-heading"
			eyebrow="Good to know"
			title="Frequently asked questions"
			description="The important details about Mudcrab, game data, and the project’s independence."
		/>
		<Accordion items={faqItems} defaultValue="assets" />
	</section>
</main>

<style>
	.hero-section {
		position: relative;
		display: flex;
		align-items: center;
		min-height: 60svh;
		padding: 7rem max(1rem, calc((100vw - var(--content-wide)) / 2)) 4rem;
		overflow: hidden;
		background-image: url('/wallpapers/0.jpg');
		background-position: center;
		background-size: cover;
		background-attachment: fixed;
	}

	.hero-section::before {
		position: absolute;
		inset: 0;
		background-image:
			linear-gradient(to right, var(--color-background) 0%, transparent 70%),
			linear-gradient(to bottom, var(--color-background) 0%, transparent 45%);
		content: '';
		pointer-events: none;
	}

	.full-bleed {
		width: 100vw;
		margin-inline: calc(50% - 50vw);
	}

	.hero-content {
		position: relative;
		z-index: 1;
		max-width: 46rem;
	}

	h1 {
		max-width: 12ch;
		margin: 1rem 0 0;
		font-size: clamp(3rem, 7vw, 5.75rem);
		line-height: 0.9;
	}

	.hero-section h2 {
		max-width: 22ch;
		margin: 1rem 0 0;
		font-size: clamp(1.2rem, 2vw, 1.7rem);
		line-height: 1.15;
	}

	.hero-section p {
		max-width: 60ch;
		margin: 1.25rem 0 0;
		font-size: clamp(1rem, 1.2vw, 1.1rem);
		line-height: 1.6;
	}

	.actions,
	.community-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin-top: 1.5rem;
	}

	.section {
		padding-block: 5rem;
	}

	.intro-section {
		padding-top: 6.5rem;
	}

	.intro-grid {
		display: grid;
		grid-template-columns: minmax(0, 1.25fr) minmax(17rem, 0.75fr);
		gap: 2rem;
		align-items: start;
	}

	.intro-copy {
		max-width: 50rem;
	}

	.intro-copy p {
		margin: 0 0 1.25rem;
		font-size: var(--text-lg);
		line-height: 1.65;
	}

	.card-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}

	.pipeline-section,
	.community-section {
		padding-inline: clamp(1rem, 5vw, 5rem);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		background: linear-gradient(
			145deg,
			color-mix(in srgb, var(--color-surface-hover) 50%, transparent),
			color-mix(in srgb, var(--color-background-soft) 40%, transparent)
		);

		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.pipeline {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1rem;
		padding: 0;
		margin: 0;
		list-style: none;
	}

	.pipeline li {
		position: relative;
		padding: 1.25rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		background: var(--color-background);
	}

	.pipeline li:not(:last-child)::after {
		position: absolute;
		top: 50%;
		right: -0.7rem;
		z-index: 1;
		width: 0.4rem;
		height: 0.4rem;
		border-top: 1px solid var(--color-accent);
		border-right: 1px solid var(--color-accent);
		content: '';
		transform: rotate(45deg);
	}

	.step-number,
	.roadmap-item > span {
		color: var(--color-accent);
		font: 600 var(--text-xs) var(--font-body);
		letter-spacing: 0.12em;
	}

	.pipeline h3,
	.roadmap-item h3 {
		margin: 0.7rem 0 0.45rem;
		font-size: var(--text-lg);
	}

	.pipeline p,
	.roadmap-item p {
		margin: 0;
		color: var(--color-text-muted);
		font-size: var(--text-sm);
		line-height: 1.6;
	}

	.roadmap-section {
		padding-inline: max(var(--page-gutter), calc((100vw - var(--content-wide)) / 2));
		background-image:
			linear-gradient(
				to bottom,
				var(--color-background) 0%,
				color-mix(in srgb, var(--color-background) 94%, transparent) 20%,
				color-mix(in srgb, var(--color-background) 94%, transparent) 80%,
				var(--color-background) 100%
			),
			url('/wallpapers/0.jpg');
		background-position: center;
		background-size: cover;
	}

	.roadmap {
		display: grid;
		max-width: 52rem;
		border-top: 1px solid var(--color-border);
	}

	.roadmap-item {
		display: grid;
		grid-template-columns: 3rem 1fr;
		gap: 1rem;
		padding: 1.25rem 0;
		border-bottom: 1px solid var(--color-border);
	}

	.community-section {
		text-align: center;
	}

	.community-actions {
		justify-content: center;
	}

	.faq-section {
		max-width: 52rem;
	}

	@media (max-width: 800px) {
		.section {
			padding-block: 3.5rem;
		}

		.intro-grid,
		.card-grid,
		.pipeline {
			grid-template-columns: 1fr;
		}

		.pipeline li:not(:last-child)::after {
			top: auto;
			right: 50%;
			bottom: -0.7rem;
			transform: rotate(135deg);
		}

		.pipeline-section,
		.community-section {
			padding-inline: 1.25rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.hero-section {
			background-attachment: scroll;
		}
	}

	@media (max-width: 700px) {
		.hero-section {
			min-height: 0;
			padding-top: 7rem;
			background-attachment: scroll;
		}
	}
</style>
