import { getUserWithUsername, postToJSON } from '$lib/database';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {

  const { username, slug } = params;
  const userDoc = await getUserWithUsername(username);

  let post;
  let path;

  if (userDoc) {
    // const postRef = userDoc.ref.collection('posts').doc(slug);
    const postRef = doc(getFirestore(), userDoc.ref.path, 'posts', slug);

    post = postToJSON(await getDoc(postRef));

    path = postRef.path;
  }

  return {
    props: { post, path },
    //revalidate: 100,
  };
};