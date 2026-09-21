import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  getDocs, 
  getDocFromServer 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { RoutineConfig, ExperimentIdea } from '../types';

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Auth instance
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Firestore instance (with named databaseId if specified)
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Test connection on boot
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client appears offline or connecting...');
    }
    return false;
  }
}

// Auth helpers
export async function signInWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Save or update user profile in Firestore
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(
        userRef,
        {
          userId: user.uid,
          email: user.email || '',
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    }
    return user;
  } catch (error: any) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

// Preferences persistence
export async function saveUserPreferencesToCloud(
  userId: string,
  personaId: string,
  routineConfig: RoutineConfig
): Promise<void> {
  try {
    const prefRef = doc(db, 'users', userId, 'preferences', 'current');
    await setDoc(
      prefRef,
      {
        userId,
        personaId,
        recipientEmail: routineConfig.recipientEmail,
        gmailLabel: routineConfig.gmailLabel,
        dayOfWeek: routineConfig.dayOfWeek,
        time: routineConfig.time,
        timeframeDays: routineConfig.timeframeDays,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (err) {
    console.error('Failed to save preferences to cloud:', err);
  }
}

export async function loadUserPreferencesFromCloud(
  userId: string
): Promise<{ personaId?: string; routineConfig?: Partial<RoutineConfig> } | null> {
  try {
    const prefRef = doc(db, 'users', userId, 'preferences', 'current');
    const snap = await getDoc(prefRef);
    if (snap.exists()) {
      const data = snap.data();
      return {
        personaId: data.personaId,
        routineConfig: {
          recipientEmail: data.recipientEmail,
          gmailLabel: data.gmailLabel,
          dayOfWeek: data.dayOfWeek,
          time: data.time,
          timeframeDays: data.timeframeDays,
        },
      };
    }
    return null;
  } catch (err) {
    console.error('Failed to load preferences from cloud:', err);
    return null;
  }
}

// Experiments persistence
export async function saveUserExperimentToCloud(
  userId: string,
  exp: ExperimentIdea
): Promise<void> {
  try {
    const expRef = doc(db, 'users', userId, 'experiments', exp.id);
    await setDoc(
      expRef,
      {
        userId,
        title: exp.title,
        inspiredBy: exp.inspiredBy,
        coreQuestion: exp.coreQuestion,
        testProtocol: exp.testProtocol,
        expectedSignal: exp.expectedSignal,
        potentialPostAngle: exp.potentialPostAngle,
        status: exp.status,
        userVerified: !!exp.userVerified,
        notes: exp.notes || '',
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (err) {
    console.error('Failed to save experiment to cloud:', err);
  }
}

export async function loadUserExperimentsFromCloud(
  userId: string
): Promise<ExperimentIdea[]> {
  try {
    const colRef = collection(db, 'users', userId, 'experiments');
    const snap = await getDocs(colRef);
    const exps: ExperimentIdea[] = [];
    snap.forEach((d) => {
      const data = d.data();
      exps.push({
        id: d.id,
        title: data.title || '',
        inspiredBy: data.inspiredBy || '',
        coreQuestion: data.coreQuestion || '',
        testProtocol: data.testProtocol || '',
        expectedSignal: data.expectedSignal || '',
        potentialPostAngle: data.potentialPostAngle || '',
        status: data.status || 'to_test',
        userVerified: data.userVerified || false,
        notes: data.notes || '',
      });
    });
    return exps;
  } catch (err) {
    console.error('Failed to load experiments from cloud:', err);
    return [];
  }
}
