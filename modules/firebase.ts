/* eslint-disable @typescript-eslint/no-explicit-any */
import { getApp, getApps, initializeApp } from 'firebase/app';
import {
    getAuth,
    GoogleAuthProvider,
    isSignInWithEmailLink,
    onIdTokenChanged,
    sendSignInLinkToEmail,
    signInWithEmailLink,
    signInWithPopup,
    signOut
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { readable, type Subscriber } from 'svelte/store';


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

getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// interface for database record, not firebase record
export interface UserRec {
    id?: string;
    email?: string;
    displayName?: string;
}

const auth = getAuth();

export async function loginWithGoogle() {
    return await signInWithPopup(auth, new GoogleAuthProvider());
}

export async function logout() {
    return await signOut(auth);
}

export async function sendEmailLink(host: string, email: string, isDev = false): Promise<void> {
    const actionCodeSettings = {
        // Your redirect URL
        url: (isDev ? 'http://' : 'https://') + host,
        handleCodeInApp: true,
    };
    try {
        await sendSignInLinkToEmail(
            auth,
            email,
            actionCodeSettings
        );
        localStorage.setItem('emailForSignIn', email);
    } catch (e: any) {
        console.error(e);
    }
}

export async function confirmSignIn(url: string, email?: string): Promise<boolean> {
    if (!email) {
        email = localStorage.getItem('emailForSignIn') || undefined;
    }
    try {
        if (isSignInWithEmailLink(auth, url)) {
            // login user and remove the email localStorage
            if (email) {
                const r = await signInWithEmailLink(auth as any, email, url)
                localStorage.removeItem('emailForSignIn');
                await auth.updateCurrentUser(r.user);
                return true;
            }
        }
    } catch (e: any) {
        console.error(e);
    }
    return false;
}

export const user = readable<User | null>(null, (set: Subscriber<User | null>) =>
    onIdTokenChanged(auth, (u: User | null) => u ? set(u) : set(null))
);
