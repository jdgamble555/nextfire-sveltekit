<script lang="ts">
	import SvelteMarkdown from 'svelte-markdown';
	export let post: any;

	const createdAt =
		typeof post?.createdAt === 'number' ? new Date(post.createdAt) : post.createdAt.toDate();
</script>

<div class="card">
	<h1>{post?.title}</h1>
	<span class="text-sm">
		Written by{' '}
		<a href={`/${post.username}/`} class="text-info">
			@{post.username}
		</a>{' '}
		on {createdAt.toISOString()}
	</span>
	<SvelteMarkdown source={post?.content} />
</div>
