import { getPosts } from '$lib/database';
import type { PageServerLoad } from './$types';

export const load = (async () => {

    const posts = await getPosts();

    return {
        props: {
            posts
        }
    };
    
}) satisfies PageServerLoad;