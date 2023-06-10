import { getPost, getUserWithUsername } from '$lib/database';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {

  const { username, slug } = params;
  const userDoc = await getUserWithUsername(username);

  if (!userDoc) {
    return {
      notFound: true
    }
  }

  const { _post, path } = await getPost(userDoc.ref.path, slug);

  return {
    props: {
      _post,
      path
    }
  };

}) satisfies PageServerLoad;