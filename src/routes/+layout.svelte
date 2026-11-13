<script lang="ts">
	import './layout.css';
	import { page } from '$app/state';
	import BrandMark from '../components/BrandMark.svelte';
	import SiteHeader from '../components/SiteHeader.svelte';
	import ThemeSwitcher from '../components/ThemeSwitcher.svelte';
	import PageShell from '../components/PageShell.svelte';
	import SiteFooter from '../components/SiteFooter.svelte';

	let { children } = $props();
	const navigation = $derived([
		{ label: 'Overview', href: '/', active: page.url.pathname === '/' },
		{ label: 'Modding', href: '/modding', active: page.url.pathname === '/modding' },
		{ label: 'Releases', href: '/releases', active: page.url.pathname === '/releases' },
		{ label: 'Roadmap', href: '/roadmap', active: page.url.pathname === '/roadmap' }
	]);
</script>

<svelte:head>
	<link rel="icon" type="image/png" href="/brand/mudcrab-icon.png" />
	<meta
		name="description"
		content="Mudcrab is an open-source Rust and Bevy engine for Skyrim Special Edition with seamless world streaming, MO2 support, and sandboxed Luau modding."
	/>
</svelte:head>

<SiteHeader items={navigation} sticky overlay={page.url.pathname === '/'}>
	{#snippet brand()}<BrandMark />{/snippet}
	{#snippet actions()}<ThemeSwitcher />{/snippet}
</SiteHeader>

<PageShell>
	{@render children()}
</PageShell>

<SiteFooter />
