<script lang="ts">
	import { userData } from '$lib/database';
	$: ({ user, username } = $userData);
</script>

<nav class="navbar">
	<ul>
		<li>
			<a href="/">
				<button class="btn-logo">SvelteKit</button>
			</a>
		</li>

		<!-- user is signed-in and has username -->
		{#if username}
			<li class="push-left">
				<a href="/admin">
					<button class="btn-blue">Write Posts</button>
				</a>
			</li>
			<li>
				<a href={`/${username}`}>
					<img alt={user?.displayName} src={user?.photoURL} />
				</a>
			</li>

			<!-- user is not signed OR has not created username -->
		{:else}
			<li>
				<a href="/enter">
					<button class="btn-blue">Log in</button>
				</a>
			</li>
		{/if}
	</ul>
</nav>
