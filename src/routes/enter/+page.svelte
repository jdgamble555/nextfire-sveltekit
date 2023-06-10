<script lang="ts">
	import Username from '$components/username.svelte';
	import { loginWithGoogle, logout, loginAnonymously, useUserData } from '$lib/database';

	const userData = useUserData();
	$: ({ user, username } = $userData);
</script>

<main>
	{#if user}
		{#if !username}
			<Username />
		{:else}
			<button on:click={logout}>Sign Out</button>
		{/if}
	{:else}
		<button class="btn-google" on:click={loginWithGoogle}>
			<img src="/google.png" alt="Sign in with Google" /> Sign in with Google
		</button>
		<button on:click={loginAnonymously}> Sign in Anonymously </button>
	{/if}
</main>
