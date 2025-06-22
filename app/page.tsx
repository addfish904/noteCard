"use client";

import { auth, provider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CircleCheck } from "lucide-react";
import SplitType from "split-type";
import Link from "next/link";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { IoMail } from "react-icons/io5";

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const router = useRouter();
  const folderWrapper = useRef(null);
  const memoWrapper = useRef(null);
  const checkWrapper = useRef(null);
  const noteWrapper = useRef(null);
  const clockWrapper = useRef(null);

  const scrollSection = useRef(null);
  const blackSection = useRef(null);
  const heroImage = useRef(null);

  const notesPageRef = useRef(null);
  const penRef = useRef(null);
  const tagRef = useRef(null);

  const pinSection = useRef(null);
  const pinImage = useRef(null);
  const textSections = useRef<(HTMLDivElement | null)[]>([]);
  const images = useRef<(HTMLImageElement | null)[]>([]);
  const headingsRef = useRef<(HTMLHeadingElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showProgress, setShowProgress] = useState(false);

  useEffect(() => {
    const introTl = gsap.timeline();
    introTl
      .fromTo(
        heroImage.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.2 }
      )
      .fromTo(
        memoWrapper.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.2 },
        "+=0.1"
      )
      .fromTo(
        folderWrapper.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.2 },
        "+=0.1"
      )
      .fromTo(
        checkWrapper.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.2 },
        "+=0.1"
      )
      .fromTo(
        noteWrapper.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.2 },
        "+=0.1"
      )
      .fromTo(
        clockWrapper.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.2 },
        "+=0.1"
      );

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollSection.current,
        start: "top center",
        end: "bottom center",
        scrub: true,
      },
    });

    tl.fromTo(folderWrapper.current, { x: 0 }, { x: 200 })
      .fromTo(memoWrapper.current, { x: 0 }, { x: 50 }, "<")
      .fromTo(checkWrapper.current, { x: 0 }, { x: 10 }, "<")
      .fromTo(noteWrapper.current, { x: 0 }, { x: -50 }, "<")
      .fromTo(clockWrapper.current, { x: 0 }, { x: -100 }, "<");

    const yValue =
      window.innerWidth < 576 ? -30 : window.innerWidth < 768 ? -160 : -400;

    gsap.to(blackSection.current, {
      y: yValue,
      ease: "none",
      scrollTrigger: {
        trigger: scrollSection.current,
        start: "bottom bottom",
        end: "+=500",
        scrub: true,
      },
    });

    gsap.fromTo(
      notesPageRef.current,
      { y: 400, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: blackSection.current,
          start: "top center",
          toggleActions: "play none none none",
        },
      }
    );

    gsap.fromTo(
      penRef.current,
      { x: 400, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: blackSection.current,
          start: "top center",
          toggleActions: "play none none none",
        },
      }
    );
    gsap.fromTo(
      tagRef.current,
      { x: -400, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: blackSection.current,
          start: "top center",
          toggleActions: "play none none none",
        },
      }
    );

    headingsRef.current.forEach((el) => {
      if (!el) return;
      const split = new SplitType(el, { types: "chars", tagName: "span" });
      gsap.fromTo(
        split.chars,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: "power3.out",
          stagger: 0.05,
          duration: 0.6,
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      // pin 圖片容器
      ScrollTrigger.create({
        trigger: pinSection.current,
        start: "top top",
        end: "bottom bottom",
        pin: pinImage.current,
        pinSpacing: true,
      });

      // 顯示與消失動畫
      textSections.current.forEach((section, index) => {
        gsap.fromTo(
          section,
          { autoAlpha: 1, y: 100 },
          {
            autoAlpha: 1,
            y: 0,
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              end: "top -40%",
              scrub: true,
            },
          }
        );

        gsap.to(section, {
          autoAlpha: 0,
          y: -100,
          scrollTrigger: {
            trigger: section,
            start: "bottom center",
            end: "bottom top",
            scrub: true,
          },
        });

        ScrollTrigger.create({
          trigger: section,
          start: "top 70%",
          end: "bottom center",
          onEnter: () => showImage(index),
          onEnterBack: () => showImage(index),
        });
      });

      // 顯示進度指示器（圓點）僅在 pin 區塊內
      ScrollTrigger.create({
        trigger: pinSection.current,
        start: "top center",
        end: "bottom 90%",
        onEnter: () => setShowProgress(true),
        onLeaveBack: () => setShowProgress(false),
        onLeave: () => setShowProgress(false),
        onEnterBack: () => setShowProgress(true),
      });
    });

    // IntersectionObserver for progress indicator
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = textSections.current.indexOf(
            entry.target as HTMLDivElement
          );
          if (entry.isIntersecting) {
            setActiveIndex(index);
          }
        });
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.6,
      }
    );

    textSections.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      mm.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      observer.disconnect();
    };
  }, []);

  const showImage = (index: number) => {
    images.current.forEach((img, i) => {
      if (img) {
        gsap.to(img, { autoAlpha: i === index ? 1 : 0, duration: 0.2 });
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
    <div className="bg-[#F7F6F9]">
      <div className="bg-[#F7F6F9] overflow-hidden scroll-smooth">
        <nav>
          <header>
            <div className="grid md:grid-cols-3 grid-cols-2 items-center py-6 px-6 sm:px-8">
              <Image src="/logo.svg" alt="logo" width={30} height={20} />

              <ul className="justify-center gap-4 list-none md:flex hidden">
                <li key="about">
                  <a
                    href="#about"
                    className="cursor-pointer bg-white rounded-full px-7 py-3 flex justify-center items-center shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]"
                  >
                    About
                  </a>
                </li>
                <li key="features">
                  <a
                    href="#features"
                    className="cursor-pointer bg-white rounded-full px-7 py-3 flex justify-center items-center shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]"
                  >
                    Features
                  </a>
                </li>
                <li key="Contact">
                  <a
                    href="#contact"
                    className="cursor-pointer bg-white rounded-full px-7 py-3 flex justify-center items-center shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]"
                  >
                    Contact
                  </a>
                </li>
              </ul>

              <div className="flex justify-end">
                <button
                  onClick={login}
                  className="border px-7 py-3 rounded-full cursor-pointer whitespace-nowrap"
                >
                  使用 Google 登入
                </button>
              </div>
            </div>
          </header>
        </nav>

        {/* hero section */}
        <div ref={scrollSection} className="relative text-center sm:mt-6 mt-0">
          <div className="relative z-20">
            <p className="text-[30px] text-[var(--color-primary)]">
              Welcome To
            </p>
            <h1
              ref={(el) => {
                headingsRef.current[0] = el!;
              }}
              className="lg:text-[200px] md:text-[120px] text-[70px] text-[var(--color-primary)] md:mt-[-50px] mt-[-20px]"
            >
              NoteCard
            </h1>
          </div>
          <Image
            ref={heroImage}
            src="/landing/hero.png"
            alt="hero img"
            width={1200}
            height={825}
            className="relative z-30 m-auto lg:-mt-50 md:-mt-20 -mt-8 opacity-0"
          />
          <div
            ref={folderWrapper}
            className="absolute top-[20%] right-[12%]  z-1 opacity-0"
          >
            <Image
              src="/landing/Folder-r.png"
              alt="folder img"
              width={320}
              height={250}
              className="md:w-[320px] w-[220px]"
            />
          </div>
          <div
            ref={memoWrapper}
            className="absolute top-[40%] sm:right-[10%] right-[20%] z-2 opacity-0"
          >
            <Image
              src="/landing/memo.png"
              alt="memo img"
              width={210}
              height={210}
              className="md:w-[210px] sm:w-[180px] w-[100px]"
            />
          </div>
          <div
            ref={checkWrapper}
            className="absolute top-[30%] right-8 z-3 opacity-0"
          >
            <Image
              src="/landing/check.png"
              alt="check icon"
              width={110}
              height={110}
              className="md:w-[110px] sm:w-[90px] w-[70px]"
            />
          </div>

          <div
            ref={noteWrapper}
            className="absolute sm:top-[40%] top-[52%] sm:left-0 left-6 z-1 opacity-0"
          >
            <Image
              src="/landing/hero-note.png"
              alt="note img"
              width={360}
              height={290}
              className="z-2 md:w-[360px] sm:w-[260px] w-[140px]"
            />
          </div>
          <div
            ref={clockWrapper}
            className="absolute top-[35%] sm:left-[17%] left-[25%] z-1 opacity-0"
          >
            <Image
              src="/landing/clock.png"
              alt="clock icon"
              width={120}
              height={120}
              className="md:w-[120px] sm:w-[100px] w-[80px]"
            />
          </div>
          <Image
            src="/landing/circle.svg"
            alt="background circle decoration"
            fill={true}
            className="relative z-0"
          />
        </div>
      </div>

      {/* black section */}
      <div
        ref={blackSection}
        id="about"
        className="bg-black w-full relative top-full z-30 px-10 flex flex-col items-center
        lg:rounded-[80px_80px_0_0] md:rounded-[60px_60px_0_0] rounded-[20px_20px_0_0] md:gap-12 gap-6 md:pt-24 sm:pt-18 pt-12 sm:pb-40 pb-18"
      >
        <span className="bg-white rounded-full px-7 py-3">About</span>
        <div className="flex flex-col items-center -gap-12">
          <h3
            ref={(el) => {
              headingsRef.current[1] = el!;
            }}
            className="text-white sm:text-[40px] md:text-[58px] text-[30px]"
          >
            Think, plan and write
          </h3>
          <h4
            ref={(el) => {
              headingsRef.current[2] = el!;
            }}
            className="text-gray-500 sm:text-[30px] md:text-[40px] text-[24px]"
          >
            in one place
          </h4>
        </div>
        <Image
          ref={notesPageRef}
          src={"/landing/notes-page.png"}
          alt="page img"
          width={1000}
          height={700}
          className="rounded-2xl sm:p-8 p-4 bg-[linear-gradient(150deg,rgba(228,225,238,1)_0%,rgba(199,178,201,1)_100%)]"
        />
        <Image
          ref={penRef}
          src="/landing/1/pen.png"
          alt="pen icon"
          width={120}
          height={120}
          className="absolute top-1/2 right-40 sm:block hidden"
        />
        <Image
          ref={tagRef}
          src="/landing/1/tag.png"
          alt="tag icon"
          width={100}
          height={100}
          className="absolute top-2/3 left-35 sm:block hidden"
        />
      </div>

      {/* 第三段：圖片固定＋文字滑動 */}
      <div className="relative md:flex justify-center hidden">
        {/* 左側進度指示器 */}
        {showProgress && (
          <div className="fixed left-[4%] top-[40%] flex flex-col gap-6 z-10">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all ${
                  activeIndex === index ? "bg-[#333]" : "bg-[#ccc]"
                }`}
              />
            ))}
          </div>
        )}

        <div
          ref={pinSection}
          className="flex flex-col md:flex-row bg-[#F7F6F9] min-h-[300vh] sm:-mt-[400px] mt-0 w-full px-25"
        >
          {/* 左側固定圖片容器 */}
          <div
            ref={pinImage}
            className="sticky top-[15vh] w-[50%] h-[60vh] items-center justify-center hidden md:flex"
          >
            <div className="bg-[#F1F0F3] rounded-2xl w-full max-w-[500px] h-[380px] border border-gray-300">
              <Image
                ref={(el) => {
                  images.current[0] = el!;
                }}
                src="/landing/2/2-01.svg"
                alt="note"
                width={380}
                height={240}
                className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 opacity-0 transition-opacity duration-500
                w-[300px] lg:w-[380px]"
              />
              <Image
                ref={(el) => {
                  images.current[1] = el!;
                }}
                src="/landing/2/2-02.png"
                alt="tag"
                width={320}
                height={320}
                className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 opacity-0  transition-opacity duration-500"
              />
              <Image
                ref={(el) => {
                  images.current[2] = el!;
                }}
                src="/landing/2/2-03.svg"
                alt="markdown"
                width={400}
                height={500}
                className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 opacity-0 transition-opacity duration-500"
              />
            </div>
          </div>
          {/* 右側文字內容 */}
          <div className="w-[50%] flex flex-col gap-30 pt-[10vh] py-6 px-12">
            <div
              key={0}
              ref={(el) => {
                textSections.current[0] = el!;
              }}
              className="opacity-0 flex flex-col gap-4"
            >
              <div className="flex items-center justify-center w-fit gap-2 bg-white rounded-full px-7 py-3">
                <Image
                  src="/icons/Note.svg"
                  alt="note icon"
                  width={16}
                  height={16}
                ></Image>
                <p>Note</p>
              </div>
              <div className="flex items-end justify-between mb-[20px]">
                <h2
                  ref={(el) => {
                    headingsRef.current[3] = el!;
                  }}
                  className="text-[50px] font-semibold leading-[110%] text-[var(--color-primary)]"
                >
                  Card
                  <br />
                  View
                </h2>
                <p>卡片式管理筆記</p>
              </div>
              <hr className="text-gray-400" />
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 mt-[20px]">
                  <CircleCheck className="text-[var(--color-primary)]" />
                  <h4 className="text-lg font-semibold text-[var(--color-primary)]">
                    即時記錄
                  </h4>
                </div>
                <p className="text-gray-700">
                  點擊「＋」號即可快速建立新筆記，讓你在靈感閃現時迅速紀錄。
                </p>
              </div>
              <div className="relative flex flex-col gap-4">
                <div className="flex items-center gap-3 mt-[20px]">
                  <CircleCheck className="text-[var(--color-primary)]" />
                  <h4 className="text-lg font-semibold text-[var(--color-primary)]">
                    即時更新
                  </h4>
                </div>
                <p className="text-gray-700">
                  支援筆記自由拖曳排序，搭配關鍵字搜尋與行事曆連動，點擊活動即可查看相關筆記，實現活動與內容整合。
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 mt-[20px]">
                  <CircleCheck className="text-[var(--color-primary)]" />
                  <h4 className="text-lg font-semibold text-[var(--color-primary)]">
                    快速瀏覽
                  </h4>
                </div>
                <p className="text-gray-700">
                  卡片式筆記管理，一眼掌握所有筆記的標題、標籤，幫助快速回顧與切換，提升效率與閱讀體驗。
                </p>
              </div>
              <p className="absolute -top-40 -right-10 text-[280px] text-[#F0EFF4] font-semibold -z-1">
                01
              </p>
            </div>

            <div
              key={1}
              ref={(el) => {
                textSections.current[1] = el!;
              }}
              className="relative opacity-0 flex flex-col gap-4"
            >
              <div className="flex items-center justify-center w-fit gap-2 bg-white rounded-full px-7 py-3">
                <Image
                  src="/icons/tag.svg"
                  alt="tag icon"
                  width={16}
                  height={16}
                ></Image>
                <p>Tags</p>
              </div>
              <div className="flex items-end justify-between mb-[20px]">
                <h2
                  ref={(el) => {
                    headingsRef.current[4] = el!;
                  }}
                  className="text-[50px] font-semibold leading-[110%] text-[var(--color-primary)]"
                >
                  Tag
                  <br />
                  Organizer
                </h2>
                <p>標籤管理與分類</p>
              </div>
              <hr className="text-gray-400" />
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 mt-[20px]">
                  <CircleCheck className="text-[var(--color-primary)]" />
                  <h4 className="text-lg font-semibold text-[var(--color-primary)]">
                    自由分類
                  </h4>
                </div>
                <p className="text-gray-700">
                  自訂標籤名稱，依照工作、生活、靈感等需求彈性分類筆記，建立屬於自己的筆記系統。
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 mt-[20px]">
                  <CircleCheck className="text-[var(--color-primary)]" />
                  <h4 className="text-lg font-semibold text-[var(--color-primary)]">
                    快速篩選
                  </h4>
                </div>
                <p className="text-gray-700">
                  點擊任一標籤，快速過濾出相關筆記，查找該標籤所有筆記內容。
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 mt-[20px]">
                  <CircleCheck className="text-[var(--color-primary)]" />
                  <h4 className="text-lg font-semibold text-[var(--color-primary)]">
                    顏色辨識
                  </h4>
                </div>
                <p className="text-gray-700">
                  可指定標籤顏色，透過視覺引導快速辨別分類主題，讓筆記畫面更有條理與美感，提升整體閱讀與使用體驗。
                </p>
              </div>
              <p className="absolute -top-45 -right-10 text-[280px] text-[#F3F2F6] font-semibold -z-1">
                02
              </p>
            </div>

            <div
              key={2}
              ref={(el) => {
                textSections.current[2] = el!;
              }}
              className="opacity-0 flex flex-col gap-4"
            >
              <div className="flex items-center justify-center w-fit gap-2 bg-white rounded-full px-7 py-3">
                <Image
                  src="/icons/Edit.svg"
                  alt="edit icon"
                  width={16}
                  height={16}
                ></Image>
                <p>Editor</p>
              </div>
              <div className="flex items-end justify-between mb-[20px]">
                <h2
                  ref={(el) => {
                    headingsRef.current[5] = el!;
                  }}
                  className="text-[50px] font-semibold leading-[110%] text-[var(--color-primary)]"
                >
                  Markdown
                  <br />
                  Support
                </h2>
                <p>支援 Markdown 語法及文字工具列</p>
              </div>
              <hr className="text-gray-400" />
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 mt-[20px]">
                  <CircleCheck className="text-[var(--color-primary)]" />
                  <h4 className="text-lg font-semibold text-[var(--color-primary)]">
                    方便快速
                  </h4>
                </div>
                <p className="text-gray-700">
                  反選文字透過浮動工具列，改變文字樣式，快速編輯。
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 mt-[20px]">
                  <CircleCheck className="text-[var(--color-primary)]" />
                  <h4 className="text-lg font-semibold text-[var(--color-primary)]">
                    所見即所得
                  </h4>
                </div>
                <p className="text-gray-700">
                  輸入 Markdown
                  語法即時渲染，無需切換模式或預覽視窗，所寫即所見。
                </p>
              </div>
              <p className="absolute -top-45 -right-10 text-[280px] text-[#F3F2F6] font-semibold -z-1">
                03
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 第四段：元件介紹 */}
      <div
        id="features"
        className="h-full bg-[#F7F6F9] flex flex-col justify-center items-center sm:pt-2 pt-6 overflow-hidden 
        sm:pb-40 pb-10 lg:px-24 sm:px-12 px-6 md:mt-0 sm:-mt-[400px] mt-0 md:gap-12 gap-6"
      >
        <span className="bg-white rounded-full px-7 py-3 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]">
          Features
        </span>
        <div className="flex flex-col items-center -gap-12">
          <h3
            ref={(el) => {
              headingsRef.current[1] = el!;
            }}
            className="sm:text-[40px] md:text-[58px] text-[30px]"
          >
            Organize your life
          </h3>
          <h4
            ref={(el) => {
              headingsRef.current[2] = el!;
            }}
            className="invert-10 sm:text-[30px] md:text-[40px] text-[24px]"
          >
            in NoteCard
          </h4>
        </div>
        <div className="w-full flex flex-col gap-4">
          <div className="flex gap-4 md:flex-nowrap flex-wrap">
            <div className="md:w-1/3 w-full h-full p-8 rounded-2xl bg-white flex flex-col gap-4 overflow-hidden group relative">
              <div className="relative w-full h-[360px]">
                {/* 左上 */}
                <Image
                  src="/landing/3/3-01.png"
                  alt="todolist1"
                  width={200}
                  height={200}
                  className="absolute top-30 left-1/3 -translate-x-1/2 -translate-y-1/2 
                 transition-transform duration-500 
                 group-hover:-translate-x-[70%] group-hover:-translate-y-[60%] group-hover:rotate-[-5deg]"
                />

                {/* 右下 */}
                <Image
                  src="/landing/3/3-02.png"
                  alt="recently notes"
                  width={250}
                  height={230}
                  className="absolute top-60 left-2/3 -translate-x-1/2 -translate-y-1/2 
                 transition-transform duration-500 
                 group-hover:-translate-x-25 group-hover:rotate-[5deg]"
                />
                <Image
                  src="/landing/3/3-03.png"
                  alt="recently notes"
                  width={120}
                  height={60}
                  className="absolute top-20 right-0
                 transition-transform duration-500 
                 group-hover:translate-x-5 group-hover:-translate-y-5 group-hover:rotate-[15deg]"
                />
              </div>

              <div className="flex flex-col items-center gap-4">
                <h4 className="text-xl font-semibold">首頁小元件</h4>
                <p className="text-gray-600">
                  包含待辦清單、最近筆記等，幫助你完成生活任務記錄，自由修改個人儀表板。
                </p>
              </div>
            </div>
            <div className="md:w-2/3 w-full bg-white rounded-2xl group overflow-hidden hidden md:block">
              <div className="relative h-full flex items-end">
                <Image
                  src="/landing/3/3-04.png"
                  alt="calendar week"
                  width={480}
                  height={360}
                  className="absolute -bottom-15 -right-20 z-1
                  transition-transform duration-500
                  group-hover:-translate-y-8 group-hover:-translate-x-8"
                ></Image>
                <Image
                  src="/landing/3/3-05.png"
                  alt="calendar month"
                  width={500}
                  height={320}
                  className="absolute bottom-30 -right-4
                  transition-transform duration-500"
                ></Image>
                <Image
                  src="/landing/3/3-06.png"
                  alt="todolist"
                  width={100}
                  height={100}
                  className="absolute top-15 left-15"
                ></Image>
                <div className="flex flex-col items-start gap-4 p-8 md:w-90 w-full">
                  <h4 className="text-xl font-semibold">行事曆</h4>
                  <p className="text-gray-600">
                    支援週、日、月多種視圖切換，新增事件並串聯筆記內容，將行程與想法無縫整合。
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-4 md:flex-nowrap flex-wrap">
            <div className="md:w-2/3 w-full h-full p-8 rounded-2xl bg-white flex flex-col gap-4 overflow-hidden group relative">
              <div className="relative w-full h-[360px]">
                <Image
                  src="/landing/3/3-07.png"
                  alt="todolist1"
                  width={480}
                  height={320}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                />
                <Image
                  src="/landing/3/3-08.svg"
                  alt="arrow dec"
                  width={80}
                  height={54}
                  className="absolute top-1/2 left-35 -translate-x-1/2 -translate-y-1/2 z-2
                  transition-transform duration-500
                  group-hover:translate-x-[5%] group-hover:-translate-y-[20%] group-hover:rotate-[-20deg]"
                />
                <Image
                  src="/landing/3/3-09.svg"
                  alt="smile icon"
                  width={25}
                  height={20}
                  className="absolute top-1/2 right-15 -translate-x-1/2 -translate-y-1/2 z-2"
                />
                <Image
                  src="/landing/3/3-10.svg"
                  alt="brush dec"
                  width={88}
                  height={68}
                  className="absolute -bottom-10 right-10 -translate-x-1/2 -translate-y-1/2 z-2
                  transition-transform duration-500
                  group-hover:rotate-[-20deg]"
                />
              </div>

              <div className="flex flex-col items-center gap-4">
                <h4 className="text-xl font-semibold">流程圖</h4>
                <p className="text-gray-600">
                  內建整合 Excalidraw
                  開源白板工具，開啟畫布自由繪製流程圖、心智圖或手稿。
                </p>
              </div>
            </div>

            <div className="md:w-1/3 w-full bg-white rounded-2xl overflow-hidden flex flex-col justify-between group">
              <div className="relative w-full h-[300px]">
                <Image
                  src="/landing/3/3-11.svg"
                  alt="note items"
                  width={300}
                  height={200}
                  className="absolute top-20 right-1/2 translate-x-1/2"
                ></Image>
                <Image
                  src="/landing/3/3-12.svg"
                  alt="drag icon"
                  width={48}
                  height={48}
                  className="absolute bottom-5 right-20 translate-x-1/2 z-2"
                ></Image>
              </div>

              <div className="flex flex-col items-center gap-4 p-8">
                <h4 className="text-xl font-semibold">添加筆記</h4>
                <p className="text-gray-600">自由新增筆記，開始記錄想法吧！</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 第五段：contact */}
      <section
        id="contact"
        className="bg-black text-white h-full flex flex-col gap-8 justify-center items-start py-20 md:px-16 px-8 overflow-hidden"
      >
        <div className="flex items-center gap-3">
          <Image src="/logo-white.svg" alt="logo" width={34} height={20} />
          <h1 id="logo" className="text-xl font-semibold text-white">
            NoteCard
          </h1>
        </div>
        <hr className="w-full text-gray-700" />
        <div className="w-full flex justify-between">
          <div className="flex sm:flex-row sm:w-fit w-full flex-col items-center justify-center gap-4">
            <Link
              href="https://www.linkedin.com/"
              target="_blank"
              className="sm:w-fit w-full flex justify-center items-center gap-4 px-10 py-4 border border-gray-500 rounded-full cursor-pointer transition-all duration-300 bg-transparent hover:bg-[#0C64C5] hover:border-[#0C64C5]"
            >
              <FaLinkedin />
              Linkedin
            </Link>

            <Link
              href="https://github.com/addfish904/noteCard"
              target="_blank"
              className="sm:w-fit w-full flex justify-center items-center gap-4 px-10 py-4 border border-gray-500 rounded-full cursor-pointer transition-all duration-300 bg-transparent hover:bg-[#622783] hover:border-[#622783]"
            >
              <FaGithub />
              Github
            </Link>

            <Link
              href="mailto:rain21509517@gmail.com"
              className="sm:w-fit w-full flex justify-center items-center gap-4 px-10 py-4 border border-gray-500 rounded-full cursor-pointer transition-all duration-300 bg-transparent hover:bg-[#201F60] hover:border-[#201F60]"
            >
              <IoMail />
              Email
            </Link>
          </div>
          {/* start now */}
          <div
            onClick={login}
            className="group md:flex hidden items-center gap-6 transition-all duration-300 hover:translate-x-2 cursor-pointer"
          >
            <p className="text-[40px] font-light">Start Now</p>
            <button className="relative flex items-center gap-2 px-3 py-1 rounded-full border border-white bg-[#000c12] transition-colors duration-300 group-hover:bg-white group-hover:border-[#000c12]">
              <div className="relative w-8 h-4 overflow-hidden">
                {/* 白色箭頭（底層） */}
                <svg
                  className="absolute inset-0 w-full h-full text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h20M18 6l6 6-6 6" />
                </svg>

                {/* 黑色箭頭（上層） */}
                <svg
                  className="absolute inset-0 w-full h-full text-black arrow-clip"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h20M18 6l6 6-6 6" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
