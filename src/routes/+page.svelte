<script lang="ts">
	import toast from 'svelte-french-toast';
</script>

<main>
	<div>
		<button type="button" on:click={() => toast.success('hello toast!')}> Toast Me </button>
	</div>
</main>
