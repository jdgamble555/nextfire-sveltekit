import { firestore, postToJSON } from '$lib/database';
import { collectionGroup, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import type { PageServerLoad } from './$types';

const LIMIT = 10;

export const load: PageServerLoad = async () => {

    const ref = collectionGroup(firestore, 'posts');
    const postsQuery = query(
        ref,
        where('published', '==', true),
        orderBy('createdAt', 'desc'),
        limit(LIMIT),
    )

    const posts = (await getDocs(postsQuery)).docs.map(postToJSON);

    return {
        props: { posts }, // will be passed to the page component as props
    };
};