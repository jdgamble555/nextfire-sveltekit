<script lang="ts">
	import { userData } from '$lib/database';

	export let fallback = false;

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
