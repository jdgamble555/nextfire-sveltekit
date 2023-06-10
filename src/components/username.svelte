<script lang="ts">
	import { firestore, useUserData } from '$lib/database';
	import debounce from '$lib/debounce';
	import { doc, getDoc, writeBatch } from 'firebase/firestore';

	let loading = false;
	let isValid = false;
	let username: string | null = null;

	const userData = useUserData();

	const onSubmit = async () => {
		const { user } = $userData;
		if (user && username) {
			// Create refs for both documents
			const userDoc = doc(firestore, 'users', user.uid);
			const usernameDoc = doc(firestore, 'usernames', username);

			// Commit both docs together as a batch write.
			const batch = writeBatch(firestore);
			batch.set(userDoc, {
				username,
				photoURL: user.photoURL,
				displayName: user.displayName
			});
			batch.set(usernameDoc, { uid: user.uid });

			await batch.commit().catch((e: any) => console.error(e));
		}
	};

	const onChange = (e: Event) => {
		// Force form value typed in form to match correct format
		const val = (e.target as HTMLFormElement).value.toLowerCase();
		const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

		// Only set form value if length is < 3 OR it passes regex
		if (val.length < 3) {
			username = val;
			loading = true;
			isValid = false;
		}

		if (re.test(val)) {
			username = val;
			loading = true;
			isValid = false;
		}
	};

	const checkUsername = async () => {
		if (username && username.length >= 3) {
			const ref = doc(firestore, 'usernames', username);
			const snap = await getDoc(ref);
			console.log('Firestore read executed!', snap.exists());
			isValid = !snap.exists();
			loading = false;
		}
	};
</script>

<section>
	<h3>Choose Username</h3>
	<form on:submit|preventDefault={onSubmit}>
		<input
			name="username"
			placeholder="myname"
			bind:value={username}
			on:input={onChange}
			use:debounce={{
				username,
				func: checkUsername,
				duration: 500
			}}
		/>
		{#if loading}
			<p>Checking...</p>
		{:else if isValid}
			<p class="text-success">{username} is available!</p>
		{:else if username && !isValid}
			<p class="text-danger">That username is taken!</p>
		{:else}
			<p />
		{/if}
		<button type="submit" class="btn-green" disabled={!isValid}> Choose </button>

		<h3>Debug State</h3>
		<div>
			Username: {username}
			<br />
			Loading: {loading.toString()}
			<br />
			Username Valid: {isValid.toString()}
		</div>
	</form>
</section>
