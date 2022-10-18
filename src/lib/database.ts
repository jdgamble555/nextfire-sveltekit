/* eslint-disable @typescript-eslint/no-explicit-any */
import { getApp, getApps, initializeApp } from 'firebase/app';
import {
    getAuth,
    GoogleAuthProvider,
    onIdTokenChanged,
    signInAnonymously,
    signInWithPopup,
    signOut
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { readable, type Subscriber } from 'svelte/store';
//import { getStorage } from 'firebase/storage';
import { doc, getFirestore, onSnapshot } from 'firebase/firestore';


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

const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// interface for database record, not firebase record
export interface UserRec {
    id?: string;
    email?: string;
    displayName?: string;
}

const auth = getAuth(firebaseApp);
//const storage = getStorage(firebaseApp);
export const firestore = getFirestore(firebaseApp);

export const loginWithGoogle = async () => await signInWithPopup(auth, new GoogleAuthProvider());
export const logout = async () => await signOut(auth);
export const loginAnonymously = async () => await signInAnonymously(auth);

export const userData = readable({ username: null, user: null },
    (set: Subscriber<{ user: User | null, username: string | null }>) => {

        // make sure logged in
        return onIdTokenChanged(auth, (user: User | null) => {
            let unsubscribe;
            let username: string | null = null;
            if (user) {
                // check for username doc
                const ref = doc(firestore, 'users', user.uid);
                unsubscribe = onSnapshot(ref, (_doc) => {
                    username = _doc.exists() ? _doc.data()?.username : null;
                    set({ user, username });
                });
            }
            set({ user, username: null });
            return unsubscribe;
        });
    });
