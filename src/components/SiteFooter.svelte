<script lang="ts">
	import BrandMark from './BrandMark.svelte';
</script>

<footer class="mt-20 border-t border-base-300 bg-base-200/75 text-base-content">
	<div class="mx-auto max-w-[var(--content-wide)] px-4 py-14 sm:px-6 lg:px-8">
		<div class="grid gap-10 md:grid-cols-12">
			<div class="space-y-4 md:col-span-5">
				<BrandMark />
				<p class="max-w-md text-sm leading-relaxed text-base-content/75">
					An open-source engine reimplementation for Skyrim Special Edition, built in Rust on Bevy
					with Luau scripting and modern GPU-ready asset formats.
				</p>
			</div>

			<div class="space-y-3 md:col-span-3">
				<h3 class="text-sm font-semibold text-base-content">For players &amp; modders</h3>
				<ul class="list-none space-y-2 p-0 text-sm">
					<li>
						<a href="/#start" class="link text-base-content/80 link-hover">Quick start guide</a>
					</li>
					<li>
						<a href="/modding" class="link text-base-content/80 link-hover">Modding help hub</a>
					</li>
					<li>
						<a href="/releases" class="link text-base-content/80 link-hover"
							>Releases &amp; builds</a
						>
					</li>
					<li>
						<a href="/roadmap" class="link text-base-content/80 link-hover">Live project board</a>
					</li>
				</ul>
			</div>

			<div class="space-y-3 md:col-span-4">
				<h3 class="text-sm font-semibold text-base-content">Community &amp; source</h3>
				<ul class="list-none space-y-2 p-0 text-sm">
					<li>
						<a
							href="https://github.com/Mudcrab-Team/mudcrab"
							target="_blank"
							rel="noreferrer"
							class="link text-base-content/80 link-hover"
						>
							Engine repository on GitHub
						</a>
					</li>
					<li>
						<a
							href="https://discord.gg/29GRf8QShH"
							target="_blank"
							rel="noreferrer"
							class="link text-base-content/80 link-hover"
						>
							Discord community
						</a>
					</li>
					<li>
						<a
							href="https://github.com/Mudcrab-Team/mudcrab/blob/main/CONTRIBUTING.md"
							target="_blank"
							rel="noreferrer"
							class="link text-base-content/80 link-hover"
						>
							Contributing guide
						</a>
					</li>
					<li>
						<a
							href="https://github.com/Mudcrab-Team/mudcrab/blob/main/LEGAL.md"
							target="_blank"
							rel="noreferrer"
							class="link text-base-content/80 link-hover"
						>
							Legal &amp; trademark notice
						</a>
					</li>
				</ul>
			</div>
		</div>

		<div
			class="mt-10 flex flex-col gap-4 border-t border-base-300 pt-8 text-sm text-base-content/65 md:flex-row md:items-end md:justify-between"
		>
			<div class="max-w-2xl space-y-1.5">
				<p class="text-sm leading-relaxed text-base-content/70">
					Mudcrab is independent and open source, licensed under GPL-3.0-or-later. It is not
					affiliated with or endorsed by Bethesda Softworks, ZeniMax Media, or Microsoft.
				</p>
				<p class="text-sm leading-relaxed text-base-content/70">
					No proprietary Skyrim assets are distributed. You need a legally owned copy of Skyrim
					Special Edition to supply game data.
				</p>
			</div>
			<p class="shrink-0 text-sm text-base-content/60">Rust 2024 · Bevy 0.19 · Luau</p>
		</div>
	</div>
</footer>
