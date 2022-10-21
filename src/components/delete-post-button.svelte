<script lang="ts">
	import { goto } from '$app/navigation';
	import { deleteDoc } from 'firebase/firestore';
	import toast from 'svelte-french-toast';

	export let postRef: any;

	const deletePost = async () => {
		const doIt = confirm('are you sure!');
		if (doIt) {
			await deleteDoc(postRef);
			goto('/admin');
			toast('post annihilated ', { icon: '🗑️' });
		}
	};
</script>

<button class="btn-red" on:click={deletePost}> Delete </button>
