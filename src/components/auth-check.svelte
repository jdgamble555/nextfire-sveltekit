<script lang="ts">
	import { useUserData } from '$lib/database';

	export let fallback = false;

	const userData = useUserData();
	$: ({ username } = $userData);
</script>

{#if username}
	<slot />
{:else if fallback}
	<a href="/enter">
		<button>💗 Sign Up</button>
	</a>
{:else}
	<a href="/enter">You must be signed in</a>
{/if}
