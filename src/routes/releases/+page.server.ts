import type { PageServerLoad } from './$types';

export const prerender = false;

interface ReleaseAsset {
	name: string;
	browser_download_url: string;
	size: number;
}

interface Release {
	name: string;
	tag_name: string;
	prerelease: boolean;
	published_at: string;
	body: string;
	assets: ReleaseAsset[];
}

export const load: PageServerLoad = async ({ fetch, setHeaders }) => {
	try {
		const res = await fetch('https://api.github.com/repos/Mudcrab-Team/mudcrab/releases', {
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Mudcrab-Website/1.0',
				Accept: 'application/vnd.github.v3+json'
			}
		});

		if (!res.ok) {
			throw new Error(`GitHub responded with HTTP ${res.status}`);
		}

		const releases: Release[] = await res.json();

		// Cache on Cloudflare CDN for 5 minutes, client for 1 minute
		setHeaders({
			'cache-control': 'public, max-age=60, s-maxage=300'
		});
		return { releases };
	} catch (err) {
		console.error('Failed to load GitHub Releases:', err);
		setHeaders({
			'cache-control': 'no-store'
		});
		return { releases: [], error: 'Failed to load releases' };
	}
};
