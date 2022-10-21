<script lang="ts">
	import type { PageServerData } from './$types';
	import PostFeed from '$components/post-feed.svelte';
	import UserProfile from '$components/user-profile.svelte';
	import Metatags from '$components/metatags.svelte';

	export let data: PageServerData;
	const { user, posts } = data.props as any;
</script>

<main>
	{#if user}
		<Metatags title={user.username} description={`${user.username}'s public profile`} />
		<UserProfile {user} />
		<PostFeed {posts} />
	{/if}
</main>
