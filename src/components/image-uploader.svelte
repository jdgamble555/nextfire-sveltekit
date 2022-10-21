<script lang="ts">
	import { userData } from '$lib/database';
	import Loader from './loader.svelte';
	import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
	import { storage } from '$lib/database';

	let uploading = false;
	let progress = 0;
	let downloadURL: any = null;

	// Creates a Firebase Upload Task
	const uploadFile = async (e: any) => {
		// Get the file
		const file = Array.from(e.target.files)[0] as any;
		const extension = file.type.split('/')[1];

		const uid = $userData.uid;

		// Makes reference to the storage bucket location
		const fileRef = ref(storage, `uploads/${uid}/${Date.now()}.${extension}`);
		uploading = true;

		// Starts the upload
		const task = uploadBytesResumable(fileRef, file);

		// Listen to updates to upload task
		task.on('state_changed', (snapshot) => {
			const pct = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);
			progress = Number(pct);
		});

		// Get downloadURL AFTER task resolves (Note: this is not a native Promise)
		task
			.then(() => getDownloadURL(fileRef))
			.then((url: any) => {
				downloadURL = url;
				uploading = false;
			});
	};
</script>

<div class="box">
	<Loader show={uploading} />
	{#if uploading}
		<h3>{progress}%</h3>
	{/if}

	{#if !uploading}
		<label class="btn">
			📸 Upload Img
			<input type="file" on:change={uploadFile} accept="image/x-png,image/gif,image/jpeg" />
		</label>
	{/if}

	{#if downloadURL}
		<code class="upload-snippet">{`![alt](${downloadURL})`}</code>
	{/if}
</div>
