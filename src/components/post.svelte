<script lang="ts">
	export let post: any;
	export let admin = false;

	const wordCount = post?.content.trim().split(/\s+/g).length;
	const minutesToRead = (wordCount / 100 + 1).toFixed(0);
</script>

<div class="card">
	<a href={`/${post.username}`}>
		<strong>By @{post.username}</strong>
	</a>

	<h2>
		<a href={`/${post.username}/${post.slug}`}>{post.title}</a>
	</h2>

	<footer>
		<span>
			{wordCount} words. {minutesToRead} min read
		</span>
		<span class="push-left">💗 {post.heartCount || 0} Hearts</span>
	</footer>

	<!-- If admin view, show extra controls for user -->
	{#if admin}
		<a href={`/admin/${post.slug}`}>
			<h3>
				<button class="btn-blue">Edit</button>
			</h3>
		</a>
		{#if post.published}
			<p class="text-success">Live</p>
			:
			<p class="text-danger">Unpublished</p>
		{/if}
	{/if}
</div>
