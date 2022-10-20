<script lang="ts">
	import AuthCheck from '$components/auth-check.svelte';
	import HeartButton from '$components/heart-button.svelte';
	import PostContent from '$components/post-content.svelte';
	import { docData, userData } from '$lib/database';
	import type { PageServerData } from './$types';
	import { doc, getFirestore } from 'firebase/firestore';
	import { onDestroy } from 'svelte';
	import Metatags from '$components/metatags.svelte';

	export let data: PageServerData;

	let { post, path } = data.props as any;

	const postRef = doc(getFirestore(), path);

	$: ({ user } = $userData);

	const unsub = docData(postRef).subscribe((p) => (p ? (post = p) : null));

	onDestroy(unsub);
</script>

<main class="container">
	<Metatags title={post.title} description={post.title} />

	<section>
		<PostContent {post} />
	</section>

	<aside class="card">
		<p>
			<strong>{post.heartCount || 0} 🤍</strong>
		</p>

		<AuthCheck fallback={true}>
			<HeartButton {postRef} {user} />
		</AuthCheck>

		{#if user?.uid === post.uid}
			<a href={`/admin/${post.slug}`}>
				<button class="btn-blue">Edit Post</button>
			</a>
		{/if}
	</aside>
</main>

<style>
	@import '$styles/post.module.css';
</style>
