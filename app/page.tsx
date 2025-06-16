"use client";

import { auth, provider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CircleCheck } from "lucide-react";
import SplitType from "split-type";

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
  const headingsRef = useRef<(HTMLHeadingElement | null)[]>([]);

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

    // 標題進場動畫
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
          duration: 0.8,
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    // section3 - 文字切換 + 圖片固定效果
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

      // 每段文字進場與出場動畫
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

        // 滑出時淡出
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

        // 切換圖片
        ScrollTrigger.create({
          trigger: section,
          start: "top 70%",
          end: "bottom center",
          onEnter: () => showImage(index),
          onEnterBack: () => showImage(index),
        });
      });
    });

    return () => {
      mm.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
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
            <h1
              ref={(el) => {
                headingsRef.current[0] = el!;
              }}
              className="text-[200px] text-[var(--color-primary)] mt-[-50px]"
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
        className="bg-black w-full relative top-full z-30 rounded-[80px_80px_0_0] pt-24 pb-40 px-10 flex flex-col items-center gap-12"
      >
        <span className="bg-white rounded-full px-7 py-3">Solution</span>
        <h3
          ref={(el) => {
            headingsRef.current[1] = el!;
          }}
          className="text-white text-[58px]"
        >
          Think, plan and write
        </h3>
        <Image
          src={"/landing/notes-page.png"}
          alt="page img"
          width={1000}
          height={700}
          className="p-8 bg-[#21C7FF] rounded-2xl"
        />
      </div>

      {/* 第三段：圖片固定＋文字滑動 */}
      <div className="flex justify-center">
        <div
          ref={pinSection}
          className="flex flex-col md:flex-row pt-5 bg-[#F7F6F9] min-h-[300vh] -m-[200px] w-full"
        >
          {/* 左側固定圖片容器 */}
          <div
            ref={pinImage}
            className="sticky top-[15vh] w-[55%] h-[60vh] flex items-center justify-center"
          >
            <Image
              ref={(el) => {
                images.current[0] = el!;
              }}
              src="/landing/page-home.png"
              alt="page-home"
              width={700}
              height={455}
              className="absolute left-0 opacity-0 transition-opacity duration-500"
            />
            <Image
              ref={(el) => {
                images.current[1] = el!;
              }}
              src="/landing/page-notes.png"
              alt="page-notes"
              width={700}
              height={450}
              className="absolute left-0 opacity-0 transition-opacity duration-500"
            />
            <Image
              ref={(el) => {
                images.current[2] = el!;
              }}
              src="/landing/page-notes.png"
              alt="Step 3"
              width={400}
              height={500}
              className="absolute opacity-0 transition-opacity duration-500"
            />
          </div>

          {/* 右側文字內容 */}
          <div className="w-[45%] flex flex-col gap-[50vh] pt-[20vh] pr-30">
            <div
              key={0}
              ref={(el) => {
                textSections.current[0] = el!;
              }}
              className="opacity-0 flex flex-col gap-4"
            >
              <div className="flex items-center justify-center w-fit gap-2 bg-white rounded-full px-7 py-3">
                <Image
                  src="/icons/Home.svg"
                  alt="home icon"
                  width={16}
                  height={16}
                ></Image>
                <p>Home</p>
              </div>
              <div className="flex items-end justify-between mb-[20px]">
                <h2
                  ref={(el) => {
                    headingsRef.current[2] = el!;
                  }}
                  className="text-[50px] font-semibold leading-[110%] text-[var(--color-primary)]"
                >
                  Your
                  <br />
                  Dashboard
                </h2>
                <p>自定義你的儀表板</p>
              </div>
              <hr className="text-gray-400" />
              <div className="flex items-center gap-3 mt-[20px]">
                <CircleCheck className="text-[var(--color-primary)]" />
                <p className="text-base">待辦事項</p>
              </div>
              <div className="flex items-center gap-3 mt-[20px]">
                <CircleCheck className="text-[var(--color-primary)]" />
                <p className="text-base">最近筆記</p>
              </div>
              <div className="flex items-center gap-3 mt-[20px]">
                <CircleCheck className="text-[var(--color-primary)]" />
                <p className="text-base">自訂快速連結</p>
              </div>
              <div className="absolute -top-50 -right-20">
                <p className="text-[280px] font-semibold text-[#F0EFF4]">01</p>
              </div>
            </div>

            <div
              key={1}
              ref={(el) => {
                textSections.current[1] = el!;
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
                <p>Notes</p>
              </div>
              <div className="flex items-end justify-between mb-[20px]">
                <h2
                  ref={(el) => {
                    headingsRef.current[3] = el!;
                  }}
                  className="text-[50px] font-semibold leading-[110%] text-[var(--color-primary)]"
                >
                  Noting
                  <br />
                  Easily
                </h2>
                <p>快速建立、管理、搜尋筆記</p>
              </div>
              <hr className="text-gray-400" />
              <div className="flex items-center gap-3 mt-[20px]">
                <CircleCheck className="text-[var(--color-primary)]" />
                <p className="text-base">卡片式筆記管理</p>
              </div>
              <div className="flex items-center gap-3 mt-[20px]">
                <CircleCheck className="text-[var(--color-primary)]" />
                <p className="text-base">拖曳移動</p>
              </div>
              <div className="flex items-center gap-3 mt-[20px]">
                <CircleCheck className="text-[var(--color-primary)]" />
                <p className="text-base">支援 Markdown 語法與 Tooltip 使用</p>
              </div>
              <div className="absolute -top-50 -right-20">
                <p className="text-[280px] font-semibold text-[#F0EFF4]">02</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 第四段：元件介紹 */}
      <div className="h-[1000px] bg-[#F7F6F9] flex flex-col justify-center items-center gap-12 px-24">
        <span className="bg-white rounded-full px-7 py-3 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]">
          Features
        </span>
        <h3
          ref={(el) => {
            headingsRef.current[4] = el!;
          }}
          className="text-[58px]"
        >
          Think, plan and write
        </h3>
        <div className="w-full flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="w-1/3 h-full p-8 rounded-2xl bg-white flex flex-col gap-4 overflow-hidden group relative">
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
            <div className="w-2/3 bg-white rounded-2xl">
              <div className="relative h-full flex items-end">
                <Image
                  src="/landing/3/3-04.png"
                  alt="todolist"
                  width={480}
                  height={700}
                  className="absolute bottom-0 right-0"
                ></Image>
                <Image
                  src="/landing/3/3-06.png"
                  alt="todolist"
                  width={100}
                  height={100}
                  className="absolute top-15 left-15"
                ></Image>
                <div className="flex flex-col items-start gap-4 p-8 w-90">
                  <h4 className="text-xl font-semibold">行事曆</h4>
                  <p className="text-gray-600">
                    支援週、日、月多種視圖切換，新增事件並串聯筆記內容，將行程與想法無縫整合。
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-2/3 h-full p-8 rounded-2xl bg-white flex flex-col gap-4 overflow-hidden group relative">
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
                  className="absolute top-1/2 left-35 -translate-x-1/2 -translate-y-1/2 z-2"
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
                  className="absolute -bottom-10 right-10 -translate-x-1/2 -translate-y-1/2 z-2"
                />
              </div>

              <div className="flex flex-col items-center gap-4">
                <h4 className="text-xl font-semibold">流程圖</h4>
                <p className="text-gray-600">
                內建整合 Excalidraw 開源白板工具，開啟畫布自由繪製流程圖、心智圖或手稿。
                </p>
              </div>
            </div>

            <div className="w-1/3 bg-white rounded-2xl">
              <div className="relative h-full flex items-end">
                <Image
                  src="/landing/3/3-04.png"
                  alt="todolist"
                  width={480}
                  height={700}
                  className="absolute bottom-0 right-0"
                ></Image>
                <Image
                  src="/landing/3/3-06.png"
                  alt="todolist"
                  width={100}
                  height={100}
                  className="absolute top-15 left-15"
                ></Image>
                <div className="flex flex-col items-start gap-4 p-8 w-80">
                  <h4 className="text-xl font-semibold">行事曆</h4>
                  <p className="text-gray-600">
                    內建整合 Excalidraw 開源白板工具，開啟畫布自由繪製流程圖、心智圖或手稿，圖像化思考更直覺。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
