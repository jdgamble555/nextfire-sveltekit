import { getUserWithUsername, postToJSON } from '$lib/database';
import { collection, getDocs, getFirestore, limit, orderBy, query, where } from 'firebase/firestore';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, setHeaders }) => {
    const { username } = params;

    setHeaders({
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*'
    });

    const userDoc = await getUserWithUsername(username);

    // If no user, short circuit to 404 page
    if (!userDoc) {
        return {
            notFound: true,
        };
    }

    // JSON serializable data
    let user = null;
    let posts = null;

    if (userDoc) {
        user = userDoc.data();

        const postsQuery = query(
            collection(getFirestore(), userDoc.ref.path, 'posts'),
            where('published', '==', true),
            orderBy('createdAt', 'desc'),
            limit(5)
        );
        posts = (await getDocs(postsQuery)).docs.map(postToJSON);
    }

    return {
        props: { user, posts }, // will be passed to the page component as props
    };
};