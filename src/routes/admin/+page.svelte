<script lang="ts">
	import AuthCheck from '$components/auth-check.svelte';
	import CreateNewPost from '$components/create-new-post.svelte';
	import PostList from '$components/post-list.svelte';
</script>

<main>
	<AuthCheck>
		<PostList />
		<CreateNewPost />
	</AuthCheck>
</main>
