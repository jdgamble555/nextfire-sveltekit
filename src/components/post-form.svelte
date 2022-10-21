<script lang="ts">
	import { serverTimestamp, updateDoc } from 'firebase/firestore';
	import toast from 'svelte-french-toast';
	import SvelteMarkdown from 'svelte-markdown';
	import ImageUploader from './image-uploader.svelte';
	import { createForm } from 'svelte-forms-lib';

	export let postRef: any;
	export let preview = false;
	export let post: any;

	const { form, errors, handleSubmit, handleChange, touched } = createForm({
		initialValues: post,
		onSubmit: async (values) => {
			const { content, published } = values;
			await updateDoc(postRef, {
				content,
				published,
				updatedAt: serverTimestamp()
			});

			$touched.content = false;
			$touched.published = false;

			toast.success('Post updated successfully!');
		},
		validate: (values) => {
			let errs: any = {};
			if (values.content) {
				if (values.content === '') {
					errs['content'] = 'content is required';
				} else if (values.content!.length < 10) {
					console.log('me');
					errs['content'] = 'content is too short';
				} else if (values.content.length > 20000) {
					errs['content'] = 'content is too long';
				}
			}
			return errs;
		}
	});
</script>

<form on:submit={handleSubmit}>
	{#if preview}
		<div class="card">
			<SvelteMarkdown source={$form.content} />
		</div>
	{/if}

	<div class={preview ? 'hidden' : 'controls'}>
		<ImageUploader />

		<textarea name="content" on:input={handleChange} bind:value={$form.content} />

		{#if $errors.content}
			<p class="text-danger">{$errors.content}</p>
		{/if}

		<fieldset>
			<label htmlfor="published">
				<input
					class="checkbox"
					name="published"
					type="checkbox"
					bind:checked={$form.published}
					on:input={handleChange}
					id="published"
				/>
				Published
			</label>
		</fieldset>
		<button
			type="submit"
			class="btn-green"
			disabled={!($touched.content || $touched.published) || !!$errors.content}
		>
			Save Changes
		</button>
	</div>
</form>

<style>
	@import '$styles/admin.module.css';
</style>
