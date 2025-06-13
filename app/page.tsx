"use client";

import { auth, provider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const router = useRouter();
  const folderWrapper = useRef(null);
  const memoWrapper = useRef(null);
  const scrollSection = useRef(null);
  const blackSection = useRef(null);
  const heroImage = useRef(null);

  const pinSection = useRef(null);
  const pinImage = useRef(null);
  const textSections = useRef<(HTMLDivElement | null)[]>([]);
  const images = useRef<(HTMLImageElement | null)[]>([]);

  useEffect(() => {
    const introTl = gsap.timeline();
    introTl
      .fromTo(
        heroImage.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 }
      )
      .fromTo(
        memoWrapper.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        "+=0.2"
      )
      .fromTo(
        folderWrapper.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        "+=0.2"
      );

    // scrollTrigger animation for folder and memo
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollSection.current,
        start: "top center",
        end: "bottom center",
        scrub: true,
      },
    });

    tl.fromTo(folderWrapper.current, { x: 0 }, { x: 200 }).fromTo(
      memoWrapper.current,
      { x: 0 },
      { x: 50 },
      "<"
    );

    gsap.to(blackSection.current, {
      y: -200,
      ease: "none",
      scrollTrigger: {
        trigger: scrollSection.current,
        start: "bottom bottom",
        end: "+=500",
        scrub: true,
      },
    });

    // 文字切換 + 圖片固定效果
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      // 固定圖片
      ScrollTrigger.create({
        trigger: pinSection.current,
        start: "top top",
        end: "bottom bottom",
        pin: pinImage.current,
        pinSpacing: true,
      });

      // 每段文字進場與出場動畫（滑入＋淡出）
      textSections.current.forEach((section, index) => {
        gsap.fromTo(
          section,
          { autoAlpha: 0, y: 100 },
          {
            autoAlpha: 1,
            y: 0,
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              end: "top 30%",
              scrub: true,
            },
          }
        );

        // 滑出時淡出
        gsap.to(section, {
          autoAlpha: 0,
          y: -100,
          scrollTrigger: {
            trigger: section,
            start: "bottom 40%",
            end: "bottom top",
            scrub: true,
          },
        });

        // 切換圖片
        
          ScrollTrigger.create({
            trigger: section,
            start: "top center",
            end: "bottom center",
            onEnter: () => showImage(index),
            onEnterBack: () => showImage(index),
          });
          
      }
    );
    });

    return () => {
      mm.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const showImage = (index: number) => {
    images.current.forEach((img, i) => {
      if (img) {
        gsap.to(img, { autoAlpha: i === index ? 1 : 0, duration: 0.3 });
      }
    });
  };
  

  const login = async () => {
    try {
      await signInWithPopup(auth, provider);
      router.push("/home");
    } catch (error) {
      console.error("登入失敗：", error);
    }
  };

  return (
    <>
      <div className="bg-[#F7F6F9] overflow-hidden">
        <nav>
          <header>
            <div className="flex justify-between p-6">
              <h1 id="logo">Logo</h1>
              <ul className="flex gap-4 list-none">
                {["Solution", "Features", "Contact"].map((item) => (
                  <li
                    key={item}
                    className="bg-white rounded-full px-7 py-3 flex justify-center items-center shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]"
                  >
                    <a href="#">{item}</a>
                  </li>
                ))}
              </ul>
              <button
                onClick={login}
                className="border px-[16px] py-[8px] rounded-full cursor-pointer"
              >
                使用 Google 登入
              </button>
            </div>
          </header>
        </nav>

        {/* hero section */}
        <div ref={scrollSection} className="relative text-center">
          <div className="relative z-20">
            <p className="text-[30px] text-[var(--color-primary)]">
              Welcome To
            </p>
            <h1 className="text-[200px] text-[var(--color-primary)] mt-[-50px]">
              NoteCard
            </h1>
          </div>

          <Image
            ref={heroImage}
            src="/landing/hero.png"
            alt="hero img"
            width={1200}
            height={825}
            className="relative z-30 m-auto -mt-50 opacity-0"
          />

          <div
            ref={folderWrapper}
            className="absolute top-[20%] right-[12%] w-[290px] h-[230px] z-0 opacity-0"
          >
            <Image
              src="/landing/Folder-r.png"
              alt="folder img"
              width={290}
              height={230}
            />
          </div>

          <div
            ref={memoWrapper}
            className="absolute top-[40%] right-[10%] w-[186px] h-[196px] z-0 opacity-0"
          >
            <Image
              src="/landing/memo.png"
              alt="memo img"
              width={186}
              height={196}
            />
          </div>
        </div>
      </div>

      {/* black section */}
      <div
        ref={blackSection}
        className="bg-black w-full relative top-full z-30 rounded-[80px_80px_0_0] py-24 px-10 flex flex-col items-center gap-12"
      >
        <span className="bg-white rounded-full px-7 py-3">Solution</span>
        <h3 className="text-white text-[58px]">Think, plan and write</h3>
        <Image
          src={"/landing/notes-page.png"}
          alt="page img"
          width={1000}
          height={700}
          className="p-8 bg-[#21C7FF] rounded-2xl"
        />
      </div>

      {/* 第三段：圖片固定＋文字滑動 */}
      <div
        ref={pinSection}
        className="flex flex-col md:flex-row pt-5 gap-20 px-10 bg-[#F7F6F9] h-full -m-[200px]"
      >
        {/* 左側固定圖片容器 */}
        <div
          ref={pinImage}
          className="sticky top-[20vh] w-1/2 h-[60vh] flex items-center justify-center"
        >
          <Image
            ref={(el) => {
              images.current[0] = el!;
            }}
            src="/landing/note-tutorial1.jpg"
            alt="Step 1"
            width={400}
            height={500}
            className="absolute opacity-0 transition-opacity duration-500"
          />
          <Image
            ref={(el) => {
              images.current[1] = el!;
            }}
            src="/landing/note-tutorial2.jpg"
            alt="Step 2"
            width={400}
            height={500}
            className="absolute opacity-0 transition-opacity duration-500"
          />
          <Image
            ref={(el) => {
              images.current[2] = el!;
            }}
            src="/landing/note-tutorial1.jpg"
            alt="Step 3"
            width={400}
            height={500}
            className="absolute opacity-0 transition-opacity duration-500"
          />
        </div>

        {/* 右側文字內容 */}
        <div className="w-1/2 flex flex-col gap-[50vh] mt-[20vh]">
          {["Step 1: Capture", "Step 2: Organize", "Step 3: Review"].map(
            (text, i) => (
              <div
                key={i}
                ref={(el) => {
                  textSections.current[i] = el!;
                }}
                className="text-[36px] font-bold opacity-0"
              >
                {text}
                <p className="text-[16px] font-normal mt-2">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia
                  vel sit omnis porro inventore.
                </p>
              </div>
            )
          )}
          </div>
      </div>
    </>
  );
}
