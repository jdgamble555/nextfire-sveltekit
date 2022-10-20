<script lang="ts">
	export let title = 'The Full Next.js + Firebase Course';
	export let description = 'A complete Next.js + Firebase course by Fireship.io';
	export let image = 'https://fireship.io/courses/react-next-firebase/img/featured.png';
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:site" content="@fireship_dev" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={image} />

	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={image} />
</svelte:head>
