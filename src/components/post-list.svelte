<script lang="ts">
	import { collectionData, useUserData } from '$lib/database';
	import { collection, getFirestore, orderBy, query } from 'firebase/firestore';

	import PostFeed from './post-feed.svelte';

	const userData = useUserData();
	const uid = $userData.user!.uid;

	const ref = collection(getFirestore(), 'users', uid, 'posts');
	const postQuery = query(ref, orderBy('createdAt'));

	// todo, create Post type
	const posts = collectionData<any>(postQuery);

</script>

<h1>Manage your Posts</h1>
<PostFeed posts={$posts} admin />
