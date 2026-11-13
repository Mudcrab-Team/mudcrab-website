<script lang="ts">
	import BrandMark from './BrandMark.svelte';
	import Link from './Link.svelte';
</script>

<footer class="site-footer">
	<div class="footer-inner">
		<div class="footer-top">
			<div class="footer-brand-col">
				<BrandMark />
				<p class="footer-mission">
					An independent, open-source Rust and Bevy engine for Skyrim Special Edition, rebuilt for
					continuous streaming and Luau modding.
				</p>
			</div>

			<div class="footer-links-col">
				<h3 class="col-title">Players</h3>
				<ul class="links-list">
					<li><Link href="/releases">Download and setup</Link></li>
					<li><Link href="/roadmap">Development roadmap</Link></li>
					<li>
						<Link href="https://github.com/Mudcrab-Team/mudcrab/blob/main/LEGAL.md" external>
							Legal notice
						</Link>
					</li>
				</ul>
			</div>

			<div class="footer-links-col">
				<h3 class="col-title">Modders</h3>
				<ul class="links-list">
					<li><Link href="/modding">Modding documentation</Link></li>
					<li><Link href="/modding#mo2">Mod Organizer 2 guide</Link></li>
					<li><Link href="/modding#luau">Luau scripting API</Link></li>
					<li><Link href="/modding#ui">Flash to Bevy UI</Link></li>
				</ul>
			</div>

			<div class="footer-links-col">
				<h3 class="col-title">Project</h3>
				<ul class="links-list">
					<li>
						<Link href="https://github.com/Mudcrab-Team/mudcrab" external>GitHub repository</Link>
					</li>
					<li>
						<Link href="https://discord.gg/29GRf8QShH" external>Discord community</Link>
					</li>
					<li>
						<Link href="https://github.com/Mudcrab-Team/mudcrab/blob/main/CONTRIBUTING.md" external>
							Contributing guide
						</Link>
					</li>
				</ul>
			</div>
		</div>

		<div class="footer-bottom">
			<div class="footer-legal">
				<p>
					Mudcrab is not affiliated with, endorsed by, or connected to Bethesda Softworks, ZeniMax
					Media, or Microsoft.
				</p>
				<p>
					No copyrighted game assets are distributed. You supply data from your own legally owned
					copy of The Elder Scrolls V: Skyrim Special Edition.
				</p>
			</div>
			<div class="footer-meta">
				<span>Licensed under GPL-3.0-or-later</span>
			</div>
		</div>
	</div>
</footer>

<style>
	.site-footer {
		position: relative;
		margin-top: clamp(4rem, 8vw, 7rem);
		border-top: 1px solid var(--color-border);
		background: var(--color-background-soft);
	}

	.footer-inner {
		width: min(100% - (var(--page-gutter) * 2), var(--content-wide));
		margin: 0 auto;
		padding: clamp(3rem, 5vw, 4.5rem) 0 2.5rem;
	}

	.footer-top {
		display: grid;
		grid-template-columns: 1.75fr repeat(3, 1fr);
		gap: clamp(2rem, 4vw, 3.5rem);
		align-items: start;
		padding-bottom: 2.5rem;
		border-bottom: 1px solid var(--color-border);
	}

	.footer-brand-col {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-width: 24rem;
	}

	.footer-mission {
		margin: 0;
		color: var(--color-text-muted);
		font-size: var(--text-sm);
		line-height: 1.6;
	}

	.col-title {
		margin: 0 0 0.85rem;
		color: var(--color-text);
		font-family: var(--font-display);
		font-size: var(--text-body);
		font-weight: 600;
	}

	.links-list {
		display: flex;
		flex-direction: column;
		gap: 0.55rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.links-list li {
		margin: 0;
		font-size: var(--text-sm);
	}

	.footer-bottom {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: 2rem;
		flex-wrap: wrap;
		padding-top: 1.75rem;
	}

	.footer-legal {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		max-width: 46rem;
	}

	.footer-legal p {
		margin: 0;
		color: var(--color-text-subtle);
		font-size: var(--text-sm);
		line-height: 1.55;
	}

	.footer-meta {
		color: var(--color-text-subtle);
		font-size: var(--text-sm);
		white-space: nowrap;
	}

	@media (max-width: 900px) {
		.footer-top {
			grid-template-columns: 1fr 1fr;
			gap: 2rem;
		}

		.footer-brand-col {
			grid-column: 1 / -1;
			max-width: none;
		}
	}

	@media (max-width: 560px) {
		.footer-top {
			grid-template-columns: 1fr;
		}

		.footer-bottom {
			flex-direction: column;
			align-items: flex-start;
		}
	}
</style>
