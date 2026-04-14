import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";

const googleProvider = new GoogleAuthProvider();

export const authService = {
  async register(email: string, password: string) {
    const credential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    return credential.user;
  },

  async login(email: string, password: string) {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return credential.user;
  },

  async loginWithGoogle() {
    const credential = await signInWithPopup(auth, googleProvider);
    return credential.user;
  },

  async logout() {
    await signOut(auth);
  },

  async getIdToken() {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      return null;
    }

    return currentUser.getIdToken();
  },
};
