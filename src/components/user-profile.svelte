<script lang="ts">
	export let user: any;
</script>

<div class="box-center">
	<img alt={user.displayName} src={user.photoURL || '/hacker.png'} class="card-img-center" />
	<p>
		<i>@{user.username}</i>
	</p>
	<h1>{user.displayName || 'Anonymous User'}</h1>
</div>
