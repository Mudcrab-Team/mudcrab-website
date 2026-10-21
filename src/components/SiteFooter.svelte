<script lang="ts">
	import BrandMark from './BrandMark.svelte';
	import Link from './Link.svelte';
</script>

<footer class="site-footer">
	<div class="footer-inner">
		<div class="footer-top">
			<div class="footer-brand-col">
				<BrandMark subtitle="Skyrim Bevy Engine" />
				<p class="footer-mission">
					An independent, open-source reimplementation of Skyrim Special Edition built in Rust
					and Bevy. Rebuilt for continuous world streaming without cell load doors.
				</p>
				<div class="footer-status-pill">
					<span class="status-dot" aria-hidden="true"></span>
					<span class="status-text">Active Development · Rust 2024 / Bevy 0.19</span>
				</div>
			</div>

			<div class="footer-matrix-col">
				<h4 class="col-title">Architecture</h4>
				<ul class="matrix-list">
					<li>
						<span class="matrix-label">Runtime</span>
						<span class="matrix-value">Rust + Bevy ECS</span>
					</li>
					<li>
						<span class="matrix-label">Scripting</span>
						<span class="matrix-value">Luau Sandbox (mlua)</span>
					</li>
					<li>
						<span class="matrix-label">Streaming</span>
						<span class="matrix-value">Zero-Door Cell Streaming</span>
					</li>
					<li>
						<span class="matrix-label">Licensing</span>
						<span class="matrix-value">GPL-3.0-or-later</span>
					</li>
				</ul>
			</div>

			<div class="footer-links-col">
				<h4 class="col-title">Resources</h4>
				<ul class="links-list">
					<li>
						<Link href="https://github.com/Mudcrab-Team/mudcrab" external>Source Code (GitHub)</Link>
					</li>
					<li>
						<Link href="https://discord.gg/29GRf8QShH" external>Community Discord</Link>
					</li>
					<li>
						<Link href="https://github.com/Mudcrab-Team/mudcrab/blob/main/LEGAL.md" external>Legal Framework</Link>
					</li>
					<li>
						<Link href="/components">Component Showcase</Link>
					</li>
				</ul>
			</div>
		</div>

		<div class="footer-divider" aria-hidden="true">
			<span class="divider-rune">ᛟ</span>
		</div>

		<div class="footer-bottom">
			<div class="footer-legal">
				<p>
					Mudcrab is an independent open-source engine recreation and is not affiliated with, endorsed by, or connected to
					Bethesda Softworks, ZeniMax Media, or Microsoft.
				</p>
				<p class="legal-byo">
					No proprietary assets, textures, meshes, or audio are included. Users provide source data from their own legally acquired
					copy of The Elder Scrolls V: Skyrim Special Edition.
				</p>
			</div>
			<div class="footer-meta">
				<span>Dual licensed under MIT and Apache-2.0</span>
			</div>
		</div>
	</div>
</footer>

<style>
	.site-footer {
		position: relative;
		border-top: 1px solid var(--color-border);
		background: color-mix(in srgb, var(--color-background-soft) 85%, transparent);
		margin-top: clamp(4rem, 8vw, 8rem);
	}

	.footer-inner {
		width: min(100% - 2rem, var(--content-wide));
		margin: 0 auto;
		padding: clamp(3rem, 6vw, 5rem) 0 3rem;
	}

	.footer-top {
		display: grid;
		grid-template-columns: 2fr 1.25fr 1fr;
		gap: clamp(2rem, 5vw, 4.5rem);
		align-items: start;
	}

	.footer-brand-col {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		max-width: 28rem;
	}

	.footer-mission {
		color: var(--color-text-muted);
		font-size: var(--text-sm);
		line-height: var(--leading-normal);
		margin: 0;
	}

	.footer-status-pill {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		width: fit-content;
		padding: 0.35rem 0.75rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		background: var(--color-surface);
	}

	.status-dot {
		width: 0.45rem;
		height: 0.45rem;
		border-radius: 50%;
		background: var(--color-success);
		box-shadow: 0 0 8px var(--color-success);
	}

	.status-text {
		color: var(--color-text-subtle);
		font-family: var(--font-mono);
		font-size: var(--text-xs);
	}

	.col-title {
		margin: 0 0 1rem;
		color: var(--color-text);
		font: 600 var(--text-sm) var(--font-display);
		letter-spacing: 0.05em;
	}

	.matrix-list,
	.links-list {
		margin: 0;
		padding: 0;
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 0.65rem;
	}

	.matrix-list li {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 1rem;
		font-size: var(--text-xs);
		padding-bottom: 0.4rem;
		border-bottom: 1px dashed color-mix(in srgb, var(--color-border) 60%, transparent);
	}

	.matrix-label {
		color: var(--color-text-subtle);
		font-family: var(--font-mono);
	}

	.matrix-value {
		color: var(--color-text);
		font-family: var(--font-mono);
		font-weight: 500;
	}

	.links-list li {
		font-size: var(--text-sm);
	}

	.footer-divider {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: clamp(2.5rem, 5vw, 3.5rem) 0 2rem;
		height: 1px;
		background: var(--color-border);
	}

	.divider-rune {
		position: absolute;
		display: grid;
		place-items: center;
		width: 1.75rem;
		height: 1.75rem;
		border: 1px solid var(--color-border-strong);
		border-radius: 2px;
		background: var(--color-surface-raised);
		color: var(--color-accent);
		font: 0.875rem var(--font-display);
	}

	.footer-bottom {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: 2rem;
		flex-wrap: wrap;
	}

	.footer-legal {
		max-width: 48rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.footer-legal p {
		margin: 0;
		color: var(--color-text-subtle);
		font-size: var(--text-xs);
		line-height: 1.55;
	}

	.legal-byo {
		color: var(--color-text-muted);
	}

	.footer-meta {
		color: var(--color-text-disabled);
		font-family: var(--font-mono);
		font-size: var(--text-xs);
		white-space: nowrap;
	}

	@media (max-width: 900px) {
		.footer-top {
			grid-template-columns: 1fr;
			gap: 2.5rem;
		}

		.footer-bottom {
			flex-direction: column;
			align-items: flex-start;
		}
	}
</style>
