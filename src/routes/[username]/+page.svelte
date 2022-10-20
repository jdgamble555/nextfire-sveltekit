<script lang="ts">
	import type { PageServerData } from './$types';
	import PostFeed from '$components/post-feed.svelte';
	import UserProfile from '$components/user-profile.svelte';
	import { userData } from '$lib/database';
	import Metatags from '$components/metatags.svelte';

	export let posts: PageServerData;
	export let admin: boolean;
	let user: any;
	$: ({ user } = $userData);
</script>

<main>
	<Metatags title={user.username} description={`${user.username}'s public profile`} />
	<UserProfile {user} />
	<PostFeed {posts} {admin} />
</main>
