"use client";

import { auth, provider } from "@/lib/firebase";
import {
  signInWithPopup,
} from "firebase/auth";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const login = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      router.push("/note")
    } catch (error) {
      console.error("登入失敗：", error);
    }
  };

  return (
    <>
      <nav>
        <header>
          <div className="flex justify-between">
            <h1 id="logo">Logo</h1>
            <nav className="flex gap-4">
              <li>
                <a href="#">About</a>
              </li>
              <li>
                <a href="#">Features</a>
              </li>
              <li>
                <a href="#">Contact</a>
              </li>
            </nav>
          </div>
        </header>
      </nav>
      <main className="text-center">
        <h1 className="text-[200px]">NoteCard</h1>
        <button 
          onClick={login} 
          className="border px-[16px] py-[8px] rounded-full cursor-pointer">
          使用 Google 登入
        </button>
      </main>
    </>
  );
}
