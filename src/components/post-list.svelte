<script lang="ts">
	import { collectionSnap, userData } from '$lib/database';
	import { collection, getFirestore, orderBy, query } from 'firebase/firestore';
	import { onDestroy } from 'svelte';

	import PostFeed from './post-feed.svelte';

	const uid = $userData.user!.uid;

	const ref = collection(getFirestore(), 'users', uid, 'posts');
	const postQuery = query(ref, orderBy('createdAt'));

	let posts: any[] | null = [];
	$: posts;

	const unsub = collectionSnap(postQuery).subscribe((snap) => {
		posts = snap ? snap.docs.map((doc) => doc.data()) : null;
	});

	onDestroy(unsub);
</script>

<h1>Manage your Posts</h1>
<PostFeed {posts} admin />
