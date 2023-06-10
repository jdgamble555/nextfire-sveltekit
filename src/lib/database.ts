/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getApp, getApps, initializeApp } from 'firebase/app';
import {
    GoogleAuthProvider,
    onIdTokenChanged,
    signOut
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { readable, type Subscriber } from 'svelte/store';
//import { getStorage } from 'firebase/storage';
import {
    collection,
    doc,
    DocumentReference,
    DocumentSnapshot,
    getDoc,
    getDocs,
    getFirestore,
    limit,
    onSnapshot,
    Query,
    query,
    QuerySnapshot,
    where,
    type DocumentData,
    collectionGroup,
    orderBy
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const LIMIT = 10;

const firebaseConfig = {
    projectId: 'test-projects-19046',
    appId: '1:736849418469:web:7546f16c5e355b1c6a9c0c',
    storageBucket: 'test-projects-19046.appspot.com',
    locationId: 'us-central',
    apiKey: 'AIzaSyC7Tu56_1ry-u9AnZfg_AjiMWvvNmFIPGU',
    authDomain: 'test-projects-19046.firebaseapp.com',
    messagingSenderId: '736849418469',
    measurementId: 'G-FKRCW93P0X',
};

export interface Auth {
    displayName: string;
    photoURL: string;
    uid: string;
    email: string;
}

const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

// interface for database record, not firebase record
export interface UserRec {
    id?: string;
    email?: string;
    displayName?: string;
}

const auth = async () => (await import('firebase/auth')).getAuth(firebaseApp);


export const storage = getStorage(firebaseApp);
//const storage = getStorage(firebaseApp);
export const firestore = getFirestore(firebaseApp);

export const loginWithGoogle = async () => {
    const _auth = await auth();
    return (await import('firebase/auth')).signInWithPopup(_auth, new GoogleAuthProvider());
};

export const loginAnonymously = async () => {
    const _auth = await auth();
    return (await import('firebase/auth')).signInAnonymously(_auth);
};

export const logout = async () => {
    const _auth = await auth();
    await signOut(_auth);
};

export const userData = readable({ username: null, user: null },
    (set: Subscriber<{
        [x: string]: any; user: User | null, username: string | null
    }>) => {
        let unsub;
        auth().then((_auth) => {
            // make sure logged in
            unsub = onIdTokenChanged(_auth, (user: User | null) => {
                let username: string | null = null;
                if (!user) {
                    set({ user, username: null });
                    return;
                }
                // check for username doc
                const ref = doc(firestore, 'users', user.uid);
                return onSnapshot(ref, (_doc) => {
                    username = _doc.exists() ? _doc.data()?.username : null;
                    set({ user, username });
                });
            });
        });
        return unsub;
    });

/**`
* Gets a users/{uid} document with username
* @param  {string} username
*/
export async function getUserWithUsername(username: string) {
    const userDoc = (await getDocs(
        query(
            collection(firestore, 'users'),
            where('username', '==', username),
            limit(1)
        )
    )).docs[0];
    return userDoc;
}

export async function getPosts() {
    const posts = await getDocs(
        query(
            collectionGroup(firestore, 'posts'),
            where('published', '==', true),
            orderBy('createdAt', 'desc'),
            limit(LIMIT)
        )
    ).then((_q) => _q.docs.map(postToJSON));
    return posts;
}

export async function getPost(path: string, slug: string) {
    const postRef = doc(firestore, path, 'posts', slug);
    const _post = await getDoc(postRef).then(postToJSON);
    return {
        path: postRef.path,
        _post
    };
}

export async function getUserPosts(path: string) {
    const posts = await getDocs(
        query(
            collection(firestore, path, 'posts'),
            where('published', '==', true),
            orderBy('createdAt', 'desc'),
            limit(5)
        )
    ).then((_q) => _q.docs.map(postToJSON));
    return posts;
}

/**`
 * Converts a firestore document to JSON
 * @param  {DocumentSnapshot} doc
 */
export function postToJSON(doc: DocumentSnapshot) {
    const data = doc.data();
    return {
        ...data,
        // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
        createdAt: data!.createdAt.toMillis(),
        updatedAt: data!.updatedAt.toMillis(),
    };
}

export const docSnap = <T>(docRef: DocumentReference<T>) => {
    return readable<DocumentSnapshot<T> | null>(null, (set) => {
        return onSnapshot(docRef, (snap) => {
            set(snap.exists() ? snap : null);
        });
    });
}

export const docData = <T>(docRef: DocumentReference<T>) => {
    return readable<T | null>(null, (set) => {
        return onSnapshot(docRef, (snap) => {
            set(snap.exists() ? snap.data() : null);
        });
    });
}

export const docDataOnce = <T>(docRef: DocumentReference<T>) => {
    return readable<T | null>(null, (set) => {
        getDoc(docRef).then((snap) => {
            set(snap.exists() ? snap.data() : null);
        });
    });
}

export const collectionSnap = <T = DocumentData>(ref: Query) => {
    return readable<QuerySnapshot<T> | null>(null, (set) => {
        return onSnapshot(ref, (snap) => {
            set(!snap.empty ? snap as QuerySnapshot<T> : null)
        });
    });
}

export const collectionData = <T = DocumentData>(ref: Query) => {
    return readable<T[] | null>(null, (set) => {
        return onSnapshot(ref, (snap) => {
            set(!snap.empty ? snap.docs.map((doc) => doc.data() as T) : null);
        });
    });
}
