import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
  addDoc,
  serverTimestamp,
  orderBy,
} from 'firebase/firestore';
import { auth, db } from '../services/firebaseConfig';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [initializing, setInitializing] = useState(true);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [home, setHome] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [chores, setChores] = useState([]);
  const [roommates, setRoommates] = useState([]);
  const [roommateInvites, setRoommateInvites] = useState([]);
  const [activity, setActivity] = useState([]);
  const [pendingInviteForUser, setPendingInviteForUser] = useState(null);
  const [userInvites, setUserInvites] = useState([]);
  const [error, setError] = useState(null);
  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user || null);
      setError(null);

      if (!user) {
        setUserProfile(null);
        setHome(null);
        setExpenses([]);
        setChores([]);
        setRoommates([]);
        setRoommateInvites([]);
        setActivity([]);
        setPendingInviteForUser(null);
        setUserInvites([]);
        setInitializing(false);
        return;
      }

      try {
        const userRef = doc(db, 'users', user.uid);
        const snap = await getDoc(userRef);
        if (!snap.exists()) {
          const profile = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || '',
            homeId: null,
            createdAt: serverTimestamp(),
          };
          await setDoc(userRef, profile);
          setUserProfile({ id: user.uid, ...profile, createdAt: new Date() });
        } else {
          setUserProfile({ id: snap.id, ...snap.data() });
        }
      } catch (e) {
        console.log('Error loading user profile', e);
        setError('Failed to load user profile. Check Firestore is enabled and rules allow read/write.');
        // Use auth user so app doesn't stay stuck on "Loading…"; they can still try Create Home
        setUserProfile({
          id: user.uid,
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || '',
          homeId: null,
        });
      } finally {
        setInitializing(false);
      }
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    if (!userProfile || !userProfile.homeId) {
      setHome(null);
      setExpenses([]);
      setChores([]);
      setRoommates([]);
      setRoommateInvites([]);
      setActivity([]);
      return;
    }

    const homeRef = doc(db, 'homes', userProfile.homeId);

    let unsubHome = () => {};
    unsubHome = onSnapshot(
      homeRef,
      (snap) => {
        if (snap.exists()) {
          setHome({ id: snap.id, ...snap.data() });
        }
      },
      (e) => {
        console.log('Home snapshot error', e);
      },
    );

    const roommatesQuery = query(
      collection(db, 'users'),
      where('homeId', '==', userProfile.homeId),
    );
    let unsubRoommates = () => {};
    unsubRoommates = onSnapshot(
      roommatesQuery,
      (snap) => {
        const items = [];
        snap.forEach((d) => items.push({ id: d.id, ...d.data() }));
        setRoommates(items);
      },
      (e) => {
        console.log('Roommates snapshot error', e);
      },
    );

    const expensesQuery = query(
      collection(db, 'expenses'),
      where('homeId', '==', userProfile.homeId),
      orderBy('createdAt', 'desc'),
    );
    let unsubExpenses = () => {};
    unsubExpenses = onSnapshot(
      expensesQuery,
      (snap) => {
        const items = [];
        snap.forEach((d) => items.push({ id: d.id, ...d.data() }));
        setExpenses(items);
      },
      (e) => {
        console.log('Expenses snapshot error', e);
      },
    );

    const choresQuery = query(
      collection(db, 'chores'),
      where('homeId', '==', userProfile.homeId),
    );
    let unsubChores = () => {};
    unsubChores = onSnapshot(
      choresQuery,
      (snap) => {
        const items = [];
        snap.forEach((d) => items.push({ id: d.id, ...d.data() }));
        setChores(items);
      },
      (e) => {
        console.log('Chores snapshot error', e);
      },
    );

    // Invites stored in separate collection
    const invitesQuery = query(
      collection(db, 'invites'),
      where('homeId', '==', userProfile.homeId),
      where('status', '==', 'pending'),
    );
    let unsubInvites = () => {};
    unsubInvites = onSnapshot(
      invitesQuery,
      (snap) => {
        const items = [];
        snap.forEach((d) => items.push({ id: d.id, ...d.data() }));
        setRoommateInvites(items);
      },
      (e) => {
        console.log('Invites snapshot error', e);
      },
    );

    // Activity feed
    const activityQuery = query(
      collection(db, 'activity'),
      where('homeId', '==', userProfile.homeId),
      orderBy('createdAt', 'desc'),
    );
    let unsubActivity = () => {};
    unsubActivity = onSnapshot(
      activityQuery,
      (snap) => {
        const items = [];
        snap.forEach((d) => items.push({ id: d.id, ...d.data() }));
        setActivity(items);
      },
      (e) => {
        console.log('Activity snapshot error', e);
      },
    );

    return () => {
      unsubHome();
      unsubRoommates();
      unsubExpenses();
      unsubChores();
      unsubInvites();
      unsubActivity();
    };
  }, [userProfile]);

  // Pending invite for logged-in user (to join a home)
  useEffect(() => {
    if (!firebaseUser || !firebaseUser.email) {
      setPendingInviteForUser(null);
      setUserInvites([]);
      return;
    }
    // We allow seeing invites even if user already has a home (e.g., invited to another home),
    // but JoinHome initial route only uses the first pending invite when there is no home.
    const invitesForUserQuery = query(
      collection(db, 'invites'),
      where('email', '==', firebaseUser.email),
      where('status', '==', 'pending'),
    );

    const unsub = onSnapshot(
      invitesForUserQuery,
      (snap) => {
        const items = [];
        snap.forEach((d) => items.push({ id: d.id, ...d.data() }));
        setUserInvites(items);
        setPendingInviteForUser(items[0] || null);
      },
      (e) => {
        console.log('User invites snapshot error', e);
      },
    );

    return () => unsub();
  }, [firebaseUser, userProfile]);

  const signupWithEmail = async ({ name, email, password }) => {
    setLoadingAction(true);
    setError(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      if (name) {
        await updateProfile(cred.user, { displayName: name });
      }

      const homesSnap = await getDocs(
        query(collection(db, 'homes'), where('invitedEmails', 'array-contains', email.trim())),
      );
      let homeIdToUse = null;
      homesSnap.forEach((d) => {
        if (!homeIdToUse) {
          homeIdToUse = d.id;
        }
      });

      const userRef = doc(db, 'users', cred.user.uid);
      const baseProfile = {
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: name || cred.user.displayName || '',
        homeId: homeIdToUse || null,
        createdAt: serverTimestamp(),
      };
      await setDoc(userRef, baseProfile, { merge: true });
      setUserProfile({ ...baseProfile, id: cred.user.uid });
    } catch (e) {
      console.log('Signup error', e);
      setError(e.message || 'Unable to sign up.');
      throw e;
    } finally {
      setLoadingAction(false);
    }
  };

  const loginWithEmail = async ({ email, password }) => {
    setLoadingAction(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (e) {
      console.log('Login error', e);
      setError(e.message || 'Unable to log in.');
      throw e;
    } finally {
      setLoadingAction(false);
    }
  };

  const logout = async () => {
    setLoadingAction(true);
    setError(null);
    try {
      await signOut(auth);
    } catch (e) {
      console.log('Logout error', e);
      setError(e.message || 'Unable to log out.');
    } finally {
      setLoadingAction(false);
    }
  };

  const createHome = async (homeName) => {
    if (!firebaseUser || !userProfile) {
      setError('Please wait, loading your account…');
      return;
    }
    setLoadingAction(true);
    setError(null);
    try {
      const homesRef = collection(db, 'homes');
      const docRef = await addDoc(homesRef, {
        name: homeName,
        createdBy: firebaseUser.uid,
        members: [firebaseUser.uid],
        invitedEmails: [],
        createdAt: serverTimestamp(),
      });

      const homeId = docRef.id;

      const userRef = doc(db, 'users', firebaseUser.uid);
      await updateDoc(userRef, { homeId });
      setUserProfile((prev) => (prev ? { ...prev, homeId } : prev));
    } catch (e) {
      console.log('Create home error', e);
      setError(e.message || 'Unable to create home.');
      throw e;
    } finally {
      setLoadingAction(false);
    }
  };

  const inviteRoommateByEmail = async (email) => {
    if (!home || !email) return;
    setLoadingAction(true);
    setError(null);
    try {
      const homeRef = doc(db, 'homes', home.id);
      const currentInvites = home.invitedEmails || [];
      if (!currentInvites.includes(email.trim())) {
        await updateDoc(homeRef, {
          invitedEmails: [...currentInvites, email.trim()],
        });
      }

      const invitesRef = collection(db, 'invites');
      await addDoc(invitesRef, {
        email: email.trim(),
        invitedBy: firebaseUser?.uid || null,
        homeId: home.id,
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      const activityRef = collection(db, 'activity');
      await addDoc(activityRef, {
        type: 'roommate_invited',
        homeId: home.id,
        userId: firebaseUser?.uid || null,
        title: `Invited ${email.trim()} to ${home.name}`,
        byDisplayName: userProfile?.displayName || userProfile?.email || '',
        createdAt: serverTimestamp(),
      });
    } catch (e) {
      console.log('Invite roommate error', e);
      setError(e.message || 'Unable to invite roommate.');
      throw e;
    } finally {
      setLoadingAction(false);
    }
  };

  const acceptInvite = async (inviteOverride) => {
    const invite = inviteOverride || pendingInviteForUser;
    if (!firebaseUser || !invite) return;
    setLoadingAction(true);
    setError(null);
    try {
      const homeRef = doc(db, 'homes', invite.homeId);
      const homeSnap = await getDoc(homeRef);
      if (homeSnap.exists()) {
        const data = homeSnap.data();
        const members = Array.isArray(data.members) ? data.members : [];
        if (!members.includes(firebaseUser.uid)) {
          await updateDoc(homeRef, { members: [...members, firebaseUser.uid] });
        }
      }

      const userRef = doc(db, 'users', firebaseUser.uid);
      await updateDoc(userRef, { homeId: invite.homeId });
      setUserProfile((prev) => (prev ? { ...prev, homeId: invite.homeId } : prev));

      const inviteRef = doc(db, 'invites', invite.id);
      await updateDoc(inviteRef, {
        status: 'accepted',
        acceptedAt: serverTimestamp(),
      });

      const activityRef = collection(db, 'activity');
      await addDoc(activityRef, {
        type: 'roommate_joined',
        homeId: invite.homeId,
        userId: firebaseUser.uid,
        title: `${firebaseUser.email} joined the home`,
        byDisplayName: firebaseUser.email,
        createdAt: serverTimestamp(),
      });

      setPendingInviteForUser(null);
    } catch (e) {
      console.log('Accept invite error', e);
      setError(e.message || 'Unable to accept invite.');
      throw e;
    } finally {
      setLoadingAction(false);
    }
  };

  const addExpense = async ({ title, amount, category = 'other', paidBy }) => {
    if (!home || !firebaseUser) return;
    setError(null);
    try {
      const numericAmount = Number(amount);
      if (!title || !numericAmount || Number.isNaN(numericAmount)) {
        return;
      }
      const payerId = paidBy || firebaseUser.uid;
      const expensesRef = collection(db, 'expenses');
      await addDoc(expensesRef, {
        title: title.trim(),
        amount: numericAmount,
        category,
        paidBy: payerId,
        splitBetween: home.members || [],
        homeId: home.id,
        createdAt: serverTimestamp(),
      });

      const activityRef = collection(db, 'activity');
      await addDoc(activityRef, {
        type: 'expense_added',
        homeId: home.id,
        userId: firebaseUser.uid,
        title: `Added ${title.trim()} • $${numericAmount.toFixed(2)}`,
        byDisplayName: userProfile?.displayName || userProfile?.email || '',
        createdAt: serverTimestamp(),
      });
    } catch (e) {
      console.log('Add expense error', e);
      setError(e.message || 'Unable to add expense.');
      throw e;
    }
  };

  const addChore = async ({ title, assignedTo, dueDate }) => {
    if (!home) return;
    setError(null);
    try {
      if (!title || !assignedTo) {
        return;
      }
      const choresRef = collection(db, 'chores');
      await addDoc(choresRef, {
        title: title.trim(),
        assignedTo,
        status: 'pending',
        dueDate: dueDate || null,
        homeId: home.id,
        createdAt: serverTimestamp(),
      });

      const activityRef = collection(db, 'activity');
      await addDoc(activityRef, {
        type: 'chore_added',
        homeId: home.id,
        userId: firebaseUser?.uid || null,
        title: `Created chore: ${title.trim()}`,
        byDisplayName: userProfile?.displayName || userProfile?.email || '',
        createdAt: serverTimestamp(),
      });
    } catch (e) {
      console.log('Add chore error', e);
      setError(e.message || 'Unable to add chore.');
      throw e;
    }
  };

  const completeChore = async (choreId, currentTitle) => {
    if (!home || !choreId) return;
    try {
      const choreRef = doc(db, 'chores', choreId);
      await updateDoc(choreRef, {
        status: 'completed',
        completedAt: serverTimestamp(),
      });

      const activityRef = collection(db, 'activity');
      await addDoc(activityRef, {
        type: 'chore_completed',
        homeId: home.id,
        userId: firebaseUser?.uid || null,
        title: `Completed chore: ${currentTitle}`,
        byDisplayName: userProfile?.displayName || userProfile?.email || '',
        createdAt: serverTimestamp(),
      });
    } catch (e) {
      console.log('Complete chore error', e);
      setError(e.message || 'Unable to complete chore.');
    }
  };

  const updateDisplayName = async (newName) => {
    if (!firebaseUser || !newName.trim()) return;
    setLoadingAction(true);
    setError(null);
    try {
      await updateProfile(firebaseUser, { displayName: newName.trim() });
      const userRef = doc(db, 'users', firebaseUser.uid);
      await updateDoc(userRef, { displayName: newName.trim() });
      setUserProfile((prev) =>
        prev ? { ...prev, displayName: newName.trim() } : prev,
      );
    } catch (e) {
      console.log('Update display name error', e);
      setError(e.message || 'Unable to update name.');
    } finally {
      setLoadingAction(false);
    }
  };

  const leaveHome = async () => {
    if (!home || !firebaseUser) return;
    setLoadingAction(true);
    setError(null);
    try {
      const homeRef = doc(db, 'homes', home.id);
      const snap = await getDoc(homeRef);
      if (snap.exists()) {
        const data = snap.data();
        const members = (data.members || []).filter((id) => id !== firebaseUser.uid);
        await updateDoc(homeRef, { members });
      }
      const userRef = doc(db, 'users', firebaseUser.uid);
      await updateDoc(userRef, { homeId: null });
      setUserProfile((prev) => (prev ? { ...prev, homeId: null } : prev));
    } catch (e) {
      console.log('Leave home error', e);
      setError(e.message || 'Unable to leave home.');
    } finally {
      setLoadingAction(false);
    }
  };

  const removeRoommate = async (roommateId) => {
    if (!home || !firebaseUser || !roommateId) return;
    setLoadingAction(true);
    setError(null);
    try {
      const homeRef = doc(db, 'homes', home.id);
      const snap = await getDoc(homeRef);
      if (snap.exists()) {
        const data = snap.data();
        const members = (data.members || []).filter((id) => id !== roommateId);
        await updateDoc(homeRef, { members });
      }
      const userRef = doc(db, 'users', roommateId);
      await updateDoc(userRef, { homeId: null });
    } catch (e) {
      console.log('Remove roommate error', e);
      setError(e.message || 'Unable to remove roommate.');
    } finally {
      setLoadingAction(false);
    }
  };

  const value = useMemo(
    () => ({
      initializing,
      loadingAction,
      error,
      user: firebaseUser,
      userProfile,
      home,
      expenses,
      chores,
      roommates,
      roommateInvites,
      activity,
      pendingInviteForUser,
      userInvites,
      userInvites,
      pendingInviteForUser,
      hasHome: !!(userProfile && userProfile.homeId),
      signupWithEmail,
      loginWithEmail,
      logout,
      createHome,
      inviteRoommateByEmail,
      addExpense,
      addChore,
      completeChore,
      acceptInvite,
      updateDisplayName,
      leaveHome,
      removeRoommate,
    }),
    [
      initializing,
      loadingAction,
      error,
      firebaseUser,
      userProfile,
      home,
      expenses,
      chores,
      roommates,
      roommateInvites,
      activity,
      pendingInviteForUser,
      userInvites,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return ctx;
};

