<script lang="ts">
	import { doc, getFirestore, serverTimestamp, setDoc } from 'firebase/firestore';
	import toast from 'svelte-french-toast';
	import { useUserData } from '$lib/database';
	import { goto } from '$app/navigation';

	const kebabCase = (s: string) => {
		let x = s.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g);
		return x ? x.join('-').toLowerCase() : '';
	};
	let title = '';

	const userData = useUserData();
	const { username } = $userData;

	// Ensure slug is URL safe
	$: slug = encodeURI(kebabCase(title));

	// Validate length
	$: isValid = title.length > 3 && title.length < 100;

	// Create a new post in firestore
	const createPost = async (e: Event) => {
		const uid = $userData.user!.uid;
		const ref = doc(getFirestore(), 'users', uid, 'posts', slug);

		// Tip: give all fields a default value here
		const data = {
			title,
			slug,
			uid,
			username,
			published: false,
			content: '# hello world!',
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp(),
			heartCount: 0
		};

		await setDoc(ref, data);

		toast.success('Post created!');

		// Imperative navigation after doc is set
		goto(`/admin/${slug}`);
	};

	const onChange = (e: Event) => {
		title = (e.target as HTMLFormElement).value;
	};
</script>

<form on:submit|preventDefault={createPost}>
	<input value={title} on:input={onChange} placeholder="My Awesome Article!" class="input" />
	<p>
		<strong>Slug:</strong>
		{slug}
	</p>
	<button type="submit" disabled={!isValid} class="btn-green"> Create New Post </button>
</form>
