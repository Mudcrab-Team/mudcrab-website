<script lang="ts">
	import './layout.css';
	import { page } from '$app/state';
	import favicon from '$lib/assets/favicon.svg';
	import BrandMark from '../components/BrandMark.svelte';
	import SiteHeader from '../components/SiteHeader.svelte';
	import ThemeSwitcher from '../components/ThemeSwitcher.svelte';
	import PageShell from '../components/PageShell.svelte';
	import SiteFooter from '../components/SiteFooter.svelte';

	let { children } = $props();
	const navigation = $derived([
		{ label: 'Home', href: '/', active: page.url.pathname === '/' },
		{ label: 'Components', href: '/components', active: page.url.pathname === '/components' }
	]);
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<SiteHeader items={navigation} sticky overlay={page.url.pathname === '/'}>
	{#snippet brand()}<BrandMark subtitle="Skyrim Bevy Engine" />{/snippet}
	{#snippet actions()}<ThemeSwitcher />{/snippet}
</SiteHeader>

<PageShell>
	{@render children()}
</PageShell>

<SiteFooter />
