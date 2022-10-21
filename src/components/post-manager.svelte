<script lang="ts">
	import DeletePostButton from './delete-post-button.svelte';
	import { userData } from '$lib/database';
	import { doc, getFirestore } from 'firebase/firestore';
	import { docDataOnce } from '$lib/database';
	import { page } from '$app/stores';
	import PostForm from './post-form.svelte';
	import { onDestroy } from 'svelte';

	let preview = false;

	const { slug } = $page.params;

	const uid = $userData.user!.uid;

	let post: any;

	const postRef = doc(getFirestore(), 'users', uid, 'posts', slug);
	const unsub = docDataOnce(postRef).subscribe((p) => (p ? (post = p) : null));

	onDestroy(unsub);
</script>

<main class="container">
	{#if post}
		<section>
			<h1>{post.title}</h1>
			<p>ID: {post.slug}</p>

			<PostForm {postRef} {post} {preview} />
		</section>

		<aside>
			<h3>Tools</h3>
			<button on:click={() => (preview = !preview)}>{preview ? 'Edit' : 'Preview'}</button>
			<a href={`/${post.username}/${post.slug}`}>
				<button class="btn-blue">Live view</button>
			</a>
			<DeletePostButton {postRef} />
		</aside>
	{/if}
</main>

<style>
	@import '$styles/admin.module.css';
</style>
