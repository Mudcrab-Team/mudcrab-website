<script lang="ts">
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import Check from '@lucide/svelte/icons/check';
	import Clock from '@lucide/svelte/icons/clock';
	import { CONTRIBUTING_URL, DISCORD_URL, GITHUB_URL, ISSUES_URL } from '$lib/site';
	import DiscordIcon from '../components/icons/DiscordIcon.svelte';
	import GithubIcon from '../components/icons/GithubIcon.svelte';

	const worksNow = [
		'Full Skyrim Special Edition conversion: plugins to SQLite, meshes to glTF 2.0, textures to KTX2, and Papyrus to Luau.',
		'Continuous exterior cell streaming around the player from an R-tree spatial index, with load doors that fade through black.',
		'First-person walking with Rapier 3D collision and a V or tcl noclip fallback.',
		'Read-only Mod Organizer 2 profile overlays converted in place on top of your Data folder.',
		'Optional wgpu GPU texture encoding and incremental repair-failed runs with a rollback journal.',
		'Synthetic game data from dummy-content so contributors can test without owning Skyrim.'
	];

	const comingNext = [
		'Sandboxed Luau script runtime with async HTTP and WebSocket APIs, plus Scaleform to Bevy bsn! UI menus.',
		'Character animation blending, combat systems, quests, inventory, and save-state snapshots.',
		'Ray-traced global illumination, co-op multiplayer, Android ARM64, and OpenXR VR.'
	];

	const phases = [
		{
			name: 'Asset modernization pipeline',
			detail:
				'Convert .esm, .nif, .dds, and .pex into SQLite, glTF 2.0, KTX2, and Luau with incremental repair.',
			active: true
		},
		{
			name: 'Core engine and Vercidium renderer',
			detail: 'Stream Tamriel cells via an R-tree index with batched indirect draw calls on Bevy.',
			active: true
		},
		{
			name: 'Luau runtime, bsn! UI, and launcher',
			detail:
				'Run sandboxed Luau scripts, transpile Flash menus to Bevy UI, and ship the setup wizard.',
			active: false
		},
		{
			name: 'Gameplay, physics, and persistence',
			detail: 'Complete Rapier 3D physics, animation blending, combat, and save-state snapshots.',
			active: false
		},
		{
			name: 'Ray tracing, VR, and co-op',
			detail:
				'Add ray-traced lighting, DLSS and FSR3 frame generation, co-op multiplayer, Android ARM64, and OpenXR VR.',
			active: false
		}
	];

	const pipeline = [
		{
			title: 'Skyrim SE Data and MO2',
			detail:
				'Read-only .esm, .esp, and .esl plugins, BSA archives, NIF meshes, DDS textures, PEX scripts, and optional MO2 profile overlays.'
		},
		{
			title: 'Offline converter',
			detail:
				'Parses records, resolves load-order overrides, and encodes meshes and textures on CPU or GPU.'
		},
		{
			title: 'Modern asset pack',
			detail:
				'A SQLite world database, glTF 2.0 models, KTX2 textures, transpiled Luau scripts, and a conversion manifest.'
		},
		{
			title: 'Bevy engine runtime',
			detail:
				'Streams cells around the camera and draws static geometry in compact indirect batches.'
		}
	];

	const faqs = [
		{
			q: 'Is Skyrim playable as a full game in Mudcrab today?',
			a: 'Not yet. Mudcrab is in early development: the converter handles a full Skyrim Special Edition install and the engine streams the converted world for you to walk through. Quests, combat, menus, and saves are planned in Phases 3 and 4.'
		},
		{
			q: 'Do I need a legally owned copy of Skyrim Special Edition?',
			a: 'Yes. Mudcrab distributes no Bethesda textures, meshes, audio, or plugins. Point the launcher at your Steam or GOG Skyrim Special Edition folder, or generate synthetic test data with dummy-content if you want to contribute without owning the game.'
		},
		{
			q: 'Which Skyrim mods work with Mudcrab?',
			a: 'Mudcrab supports mods that do not require SKSE. The converter reads Mod Organizer 2 profiles in place, layers plugin records into SQLite by load order, converts loose NIF and DDS files, and transpiles Papyrus bytecode to Luau. Broader SKSE support will be explored after release.'
		},
		{
			q: 'How long does asset conversion take?',
			a: 'The desktop default preserves native BC1 to BC7 blocks where possible, and an optional wgpu GPU encoder cut a full Skyrim SE conversion from 28 minutes to 9 minutes on its author machine. Later runs reuse unchanged assets through the conversion manifest.'
		}
	];
</script>

<svelte:head>
	<title>Mudcrab · Open-Source Rust and Bevy Engine for Skyrim Special Edition</title>
	<meta
		name="description"
		content="Mudcrab is an open-source Rust and Bevy engine reimplementation for Skyrim Special Edition. Convert your install once, walk the streaming world, or build mods with MO2 and Luau."
	/>
</svelte:head>

<section
	class="relative flex min-h-[96svh] w-full items-end overflow-hidden bg-[#0c141d] pt-24 pb-16 sm:pb-24"
	aria-labelledby="hero-title"
>
	<img
		src="/images/hero-riverbank.webp"
		alt="An armored mudcrab with steel-blue plates resting on a river stone in a misty northern valley at dusk"
		width="1376"
		height="768"
		fetchpriority="high"
		class="absolute inset-0 h-full w-full object-cover object-[65%_center]"
	/>
	<div
		class="pointer-events-none absolute inset-0"
		style="background: linear-gradient(to top, var(--color-base-100) 0%, rgba(12, 20, 29, 0.86) 16%, rgba(12, 20, 29, 0.45) 55%, rgba(12, 20, 29, 0.62) 100%), linear-gradient(to right, rgba(12, 20, 29, 0.88) 0%, rgba(12, 20, 29, 0.48) 52%, transparent 100%);"
	></div>

	<div class="relative z-10 mx-auto w-full max-w-[var(--content-wide)] px-4 sm:px-6 lg:px-8">
		<div class="rise-in max-w-3xl space-y-6">
			<h1
				id="hero-title"
				class="font-display text-[clamp(2.85rem,6.6vw,5.75rem)] font-bold tracking-tight text-[#edf3f8]"
			>
				Skyrim, rebuilt on a modern engine
			</h1>
			<p class="max-w-xl text-base leading-relaxed text-[#d5e1ec]">
				An open-source Rust and Bevy engine for Skyrim Special Edition. Convert your copy once into
				SQLite, glTF, KTX2, and Luau, then walk Tamriel or build mods.
			</p>
			<div class="flex flex-wrap items-center gap-3 pt-1">
				<a id="hero-get-started" href="#paths" class="btn gap-2 font-semibold btn-lg btn-primary">
					<span>Choose your path</span>
					<ArrowRight size={18} aria-hidden="true" />
				</a>
				<a
					id="hero-github"
					href={GITHUB_URL}
					target="_blank"
					rel="noreferrer"
					class="btn gap-2 border-[#4a7d9c]/60 bg-[#0c141d]/70 font-medium text-[#edf3f8] backdrop-blur-xs btn-lg hover:border-[#8fb8d1] hover:bg-[#111c28]"
				>
					<GithubIcon size={18} />
					<span>GitHub</span>
				</a>
				<a
					id="hero-discord"
					href={DISCORD_URL}
					target="_blank"
					rel="noreferrer"
					class="btn gap-2 border-[#4a7d9c]/60 bg-[#0c141d]/70 font-medium text-[#edf3f8] backdrop-blur-xs btn-lg hover:border-[#8fb8d1] hover:bg-[#111c28]"
				>
					<DiscordIcon size={18} />
					<span>Discord</span>
				</a>
			</div>
		</div>
	</div>
</section>

<main class="mx-auto max-w-[var(--content-wide)] px-4 sm:px-6 lg:px-8">
	<section id="paths" class="scroll-mt-20 py-16 sm:py-24" aria-labelledby="paths-heading">
		<div class="max-w-2xl space-y-3">
			<h2 id="paths-heading">Start as a player or a modder</h2>
			<p class="prose-measure text-base-content/75">
				Pick the guide that fits what you came to do. Both paths use the same offline converter and
				keep your original Skyrim Data folder untouched.
			</p>
		</div>

		<div class="mt-10 grid gap-8 lg:grid-cols-2">
			<a
				id="path-card-play"
				href="/play"
				class="group flex flex-col overflow-hidden rounded-box border border-base-300 bg-base-200 no-underline transition-[border-color,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-secondary"
			>
				<div class="relative aspect-[16/10] w-full overflow-hidden bg-base-300">
					<img
						src="/images/path-play.webp"
						alt="A lone traveler carrying a warm torch along a snowy stone road toward a Nordic watchtower"
						width="1200"
						height="896"
						loading="lazy"
						class="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
					/>
				</div>
				<div class="flex flex-1 flex-col justify-between gap-6 p-6 sm:p-8">
					<div class="space-y-3">
						<h3 class="font-display text-2xl font-bold text-base-content">
							Walk a converted Skyrim today
						</h3>
						<p class="text-base-content/80">
							Point the launcher at your Steam or GOG install, convert once, and explore the
							streaming world with first-person collision. No Skyrim copy? Generate synthetic data
							in a couple of minutes.
						</p>
						<ul class="space-y-1.5 pt-2 text-sm text-base-content/75">
							<li>Requires Rust, a C/C++ compiler, and 20 to 30 GB of disk space</li>
							<li>Vulkan, DirectX 12, or Metal GPU with BC texture support</li>
							<li>Step-by-step launcher commands, controls, and troubleshooting</li>
						</ul>
					</div>
					<span class="inline-flex items-center gap-2 font-semibold text-accent">
						<span>Open the player setup guide</span>
						<ArrowRight
							size={17}
							aria-hidden="true"
							class="transition-transform duration-150 ease-out group-hover:translate-x-1"
						/>
					</span>
				</div>
			</a>

			<a
				id="path-card-mod"
				href="/modding"
				class="group flex flex-col overflow-hidden rounded-box border border-base-300 bg-base-200 no-underline transition-[border-color,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-secondary"
			>
				<div class="relative aspect-[16/10] w-full overflow-hidden bg-base-300">
					<img
						src="/images/path-mod.webp"
						alt="A Nordic stone workshop at night with parchment schematics on a wooden bench and warm forge embers"
						width="1200"
						height="896"
						loading="lazy"
						class="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
					/>
				</div>
				<div class="flex flex-1 flex-col justify-between gap-6 p-6 sm:p-8">
					<div class="space-y-3">
						<h3 class="font-display text-2xl font-bold text-base-content">
							Bring your load order or script in Luau
						</h3>
						<p class="text-base-content/80">
							Convert Mod Organizer 2 profiles in place, inspect how records layer in SQLite, repair
							failed assets without rebuilding the world, and write sandboxed Luau scripts.
						</p>
						<ul class="space-y-1.5 pt-2 text-sm text-base-content/75">
							<li>Format reference for .esm, .bsa, .nif, .dds, .pex, and Scaleform UI</li>
							<li>CLI recipes for MO2 overlays, GPU encoding, and repair-failed</li>
							<li>Luau async HTTP examples and Bevy bsn! UI widget trees</li>
						</ul>
					</div>
					<span class="inline-flex items-center gap-2 font-semibold text-accent">
						<span>Open the modding help center</span>
						<ArrowRight
							size={17}
							aria-hidden="true"
							class="transition-transform duration-150 ease-out group-hover:translate-x-1"
						/>
					</span>
				</div>
			</a>
		</div>
	</section>

	<div class="rule-diamond" aria-hidden="true"><span></span></div>

	<section class="py-16 sm:py-24" aria-labelledby="status-heading">
		<div class="max-w-2xl space-y-3">
			<h2 id="status-heading">Where Mudcrab is today</h2>
			<p class="prose-measure text-base-content/75">
				Mudcrab is built from the ground up for 1:1 parity with Skyrim Special Edition, inspired by
				projects like OpenMW. Here is what runs right now and what is still ahead.
			</p>
		</div>

		<div class="mt-10 grid gap-10 lg:grid-cols-2">
			<div class="space-y-4">
				<h3>Working in the repository now</h3>
				<ul class="list-none space-y-3 p-0">
					{#each worksNow as item (item)}
						<li class="flex items-start gap-3 text-base-content/85">
							<Check size={18} class="mt-1 shrink-0 text-success" aria-hidden="true" />
							<span>{item}</span>
						</li>
					{/each}
				</ul>
			</div>

			<div class="space-y-4">
				<h3>In progress across Phases 3 to 5</h3>
				<ul class="list-none space-y-3 p-0">
					{#each comingNext as item (item)}
						<li class="flex items-start gap-3 text-base-content/80">
							<Clock size={18} class="mt-1 shrink-0 text-primary" aria-hidden="true" />
							<span>{item}</span>
						</li>
					{/each}
				</ul>
			</div>
		</div>

		<div class="mt-14 space-y-6 border-t border-base-300 pt-10">
			<div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
				<h3>Five milestones from converter to co-op</h3>
				<a
					href="/roadmap"
					class="inline-flex link items-center gap-1.5 font-semibold text-accent link-hover"
				>
					<span>Explore the live project board</span>
					<ArrowRight size={16} aria-hidden="true" />
				</a>
			</div>

			<ul class="steps steps-vertical w-full lg:steps-horizontal">
				{#each phases as phase (phase.name)}
					<li class="step {phase.active ? 'step-secondary' : ''}">
						<div class="space-y-1 py-2 text-left lg:px-2 lg:text-center">
							<div class="font-semibold text-base-content">{phase.name}</div>
							<p class="text-sm text-base-content/70">{phase.detail}</p>
						</div>
					</li>
				{/each}
			</ul>
		</div>
	</section>

	<div class="rule-diamond" aria-hidden="true"><span></span></div>

	<section class="py-16 sm:py-24" aria-labelledby="pipeline-heading">
		<div class="max-w-2xl space-y-3">
			<h2 id="pipeline-heading">Convert once, stream modern formats</h2>
			<p class="prose-measure text-base-content/75">
				The converter does the heavy work offline so the Bevy runtime only reads formats a modern
				GPU and database understand directly.
			</p>
		</div>

		<ol class="mt-10 grid list-none gap-8 border-t border-base-300 p-0 pt-8 md:grid-cols-4">
			{#each pipeline as stage (stage.title)}
				<li class="space-y-2 border-l-2 border-secondary pl-4">
					<h3 class="text-base-content">{stage.title}</h3>
					<p class="text-sm leading-relaxed text-base-content/75">{stage.detail}</p>
				</li>
			{/each}
		</ol>
	</section>

	<section
		class="my-6 rounded-box border border-base-300 bg-neutral px-6 py-12 text-neutral-content sm:px-10 sm:py-14"
		aria-labelledby="community-heading"
	>
		<div class="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
			<div class="max-w-2xl space-y-3">
				<h2 id="community-heading" class="text-neutral-content">Built in the open</h2>
				<p class="prose-measure text-neutral-content/85">
					Converter fixes, rendering work, tests, and documentation are welcome. Follow development,
					ask modding questions, or pick up an issue with the team.
				</p>
				<div class="flex flex-wrap gap-x-6 gap-y-2 pt-1 text-sm">
					<a
						href={GITHUB_URL}
						target="_blank"
						rel="noreferrer"
						class="link text-neutral-content link-hover"
					>
						Browse Mudcrab-Team/mudcrab on GitHub
					</a>
					<a
						href={CONTRIBUTING_URL}
						target="_blank"
						rel="noreferrer"
						class="link text-neutral-content link-hover"
					>
						Read CONTRIBUTING.md
					</a>
					<a
						href={ISSUES_URL}
						target="_blank"
						rel="noreferrer"
						class="link text-neutral-content link-hover"
					>
						Open or search issues
					</a>
				</div>
			</div>

			<div class="shrink-0">
				<a
					href={DISCORD_URL}
					target="_blank"
					rel="noreferrer"
					class="btn gap-2.5 font-semibold btn-lg btn-primary"
				>
					<DiscordIcon size={19} />
					<span>Join the Discord community</span>
				</a>
			</div>
		</div>
	</section>

	<section class="py-16 sm:py-24" aria-labelledby="faq-heading">
		<div class="grid gap-10 lg:grid-cols-12">
			<div class="space-y-3 lg:col-span-4">
				<h2 id="faq-heading">Frequently asked questions</h2>
				<p class="text-base-content/75">
					Ownership, mod compatibility, and what to expect when you build Mudcrab today.
				</p>
			</div>

			<div class="join w-full join-vertical lg:col-span-8">
				{#each faqs as faq, index (faq.q)}
					<div class="collapse-arrow collapse join-item border border-base-300 bg-base-200/60">
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
