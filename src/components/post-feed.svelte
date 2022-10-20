<script lang="ts">
	import Post from './post.svelte';
	export let posts: any;
	export let admin = false;
</script>

{#each posts as post}
	<Post {admin} {post} />
{/each}
