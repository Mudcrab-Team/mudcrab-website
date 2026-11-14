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
		{ label: 'Play', href: '/play', active: page.url.pathname.startsWith('/play') },
		{ label: 'Modding', href: '/modding', active: page.url.pathname.startsWith('/modding') },
		{ label: 'Roadmap', href: '/roadmap', active: page.url.pathname.startsWith('/roadmap') },
		{ label: 'Releases', href: '/releases', active: page.url.pathname.startsWith('/releases') }
	]);

	const isHome = $derived(page.url.pathname === '/');
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<SiteHeader items={navigation} sticky={!isHome} overlay={isHome}>
	{#snippet brand()}<BrandMark class={isHome ? 'text-current' : ''} />{/snippet}
	{#snippet actions()}<ThemeSwitcher />{/snippet}
</SiteHeader>

{#if isHome}
	{@render children()}
{:else}
	<PageShell>
		{@render children()}
	</PageShell>
{/if}

<SiteFooter />
