<script lang="ts">
	import { Toaster } from 'svelte-french-toast';
	import '$styles/globals.css';
	import Navbar from '$components/navbar.svelte';
</script>

<Navbar />
<slot />
<Toaster />
