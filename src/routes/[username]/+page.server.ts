import { getUserPosts, getUserWithUsername } from '$lib/database';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
    const { username } = params;

    const userDoc = await getUserWithUsername(username);

    // If no user, short circuit to 404 page
    if (!userDoc) {
        return {
            notFound: true
        };
    }

    return {
        props: {
            user: userDoc.data(),
            posts: getUserPosts(userDoc.ref.path)
        }
    };
    
}) satisfies PageServerLoad;