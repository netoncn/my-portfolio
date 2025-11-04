import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth"
import { auth } from "./config"

const googleProvider = new GoogleAuthProvider()

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL

export function isAdmin(email: string | null | undefined): boolean {
  if (!email || !ADMIN_EMAIL) return false
  return email.toLowerCase() === ADMIN_EMAIL.toLowerCase()
}

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    const user = result.user

    if (!isAdmin(user.email)) {
      await firebaseSignOut(auth)
      throw new Error("Acesso negado. Apenas o administrador pode fazer login.")
    }

    return user
  } catch (error: any) {
    console.error("[v0] Error signing in with Google:", error)
    throw error
  }
}

export async function signOut() {
  try {
    await firebaseSignOut(auth)
  } catch (error) {
    console.error("[v0] Error signing out:", error)
    throw error
  }
}

export { signOut as signOutUser }

export function onAuthChange(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback)
}
