import { getUserWithUsername, postToJSON } from '$lib/database';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, setHeaders }) => {

  setHeaders({
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*'
  });

  const { username, slug } = params;
  const userDoc = await getUserWithUsername(username);

  let _post;
  let path;

  if (userDoc) {
    // const postRef = userDoc.ref.collection('posts').doc(slug);
    const postRef = doc(getFirestore(), userDoc.ref.path, 'posts', slug);

    _post = postToJSON(await getDoc(postRef));

    path = postRef.path;
  }

  return {
    props: { _post, path },
    //revalidate: 100,
  };
};