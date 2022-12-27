<script lang="ts">
	import type { PageServerData } from './$types.js';
	import Loader from '$components/loader.svelte';
	import {
		collectionGroup,
		getDocs,
		getFirestore,
		limit,
		orderBy,
		query,
		startAfter,
		Timestamp,
		where
	} from 'firebase/firestore';
	import PostFeed from '$components/post-feed.svelte';
	import Metatags from '$components/metatags.svelte';

	export let data: PageServerData;

	let posts: any[] = data ? data.props.posts : [];

	const LIMIT = 10;

	let loading = false;
	let postsEnd = false;

	const getMorePosts = async () => {
		loading = true;
		const last = posts[posts.length - 1];

		const cursor =
			typeof last.createdAt === 'number' ? Timestamp.fromMillis(last.createdAt) : last.createdAt;

		const ref = collectionGroup(getFirestore(), 'posts');
		const postsQuery = query(
			ref,
			where('published', '==', true),
			orderBy('createdAt', 'desc'),
			startAfter(cursor),
			limit(LIMIT)
		);

		const newPosts = (await getDocs(postsQuery)).docs.map((doc) => doc.data());

		posts = posts.concat(newPosts);
		loading = false;

		if (newPosts.length < LIMIT) {
			postsEnd = true;
		}
	};
</script>

<main>
	<Metatags title="Home Page" description="Get the latest posts on our site" />

	<div class="card card-info">
		<h2>💡 Next.js + Firebase - The Full Course</h2>
		<p>Welcome! This app is built with Next.js and Firebase and is loosely inspired by Dev.to.</p>
		<p>
			Sign up for an 👨‍🎤 account, ✍️ write posts, then 💞 heart content created by other users. All
			public content is server-rendered and search-engine optimized.
		</p>
	</div>

	<PostFeed {posts} />

	{#if !loading && !postsEnd}
		<button on:click={getMorePosts}>Load more</button>
	{/if}

	<Loader show={loading} />

	{#if postsEnd}
		You have reached the end!
	{/if}
</main>
