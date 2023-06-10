import { getPosts } from '$lib/database';
import type { PageServerLoad } from './$types';

export const load = (async () => {

    return {
        props: {
            posts: getPosts()
        }
    };
    
}) satisfies PageServerLoad;