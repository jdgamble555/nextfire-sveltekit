<script lang="ts">
	import AuthCheck from '$components/auth-check.svelte';
	import PostManager from '$components/post-manager.svelte';
</script>

<AuthCheck>
	<PostManager />
</AuthCheck>
