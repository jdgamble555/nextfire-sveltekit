import { getPostRef, getUserWithUsername, postToJSON } from '$lib/database';
import { getDoc } from 'firebase/firestore';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {

  const { username, slug } = params;
  const userDoc = await getUserWithUsername(username);

  if (!userDoc) {
    return {
      notFound: true
    }
  }

  const postRef = getPostRef(userDoc.ref.path, slug);

  return {
    props: {
      _post: getDoc(postRef).then(postToJSON),
      path: postRef.path
    }
  };
  
}) satisfies PageServerLoad;