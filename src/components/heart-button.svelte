<script lang="ts">
	import { docSnap } from '$lib/database';
	import {
		doc,
		DocumentReference,
		DocumentSnapshot,
		getFirestore,
		increment,
		writeBatch,
		type DocumentData
	} from 'firebase/firestore';
	import { onMount } from 'svelte';
	import type { Readable } from 'svelte/store';

	export let postRef: any;
	export let user: any;

	let heartRef: DocumentReference;
	let heartDoc: Readable<DocumentSnapshot<DocumentData> | null>;

	onMount(() => {
		heartRef = doc(getFirestore(), postRef.path, 'hearts', user.uid);
		heartDoc = docSnap(heartRef);
	});

	// Create a user-to-post relationship
	const addHeart = async () => {
		if (user && heartRef) {
			const uid = user.uid;
			const batch = writeBatch(getFirestore());

			batch.update(postRef, { heartCount: increment(1) });
			batch.set(heartRef, { uid });

			await batch.commit();
		}
	};

	// Remove a user-to-post relationship
	const removeHeart = async () => {
		if (user && heartRef) {
			const batch = writeBatch(getFirestore());

			batch.update(postRef, { heartCount: increment(-1) });
			batch.delete(heartRef);

			await batch.commit();
		}
	};
</script>

{#if $heartDoc}
	<button on:click={removeHeart}>💔 Unheart</button>
{:else}
	<button on:click={addHeart}>💗 Heart</button>
{/if}
