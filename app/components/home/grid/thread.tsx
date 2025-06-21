"use client";

import { useState, useRef, useEffect } from "react";
import { FaArrowRight, FaSquareThreads } from "react-icons/fa6";
import Anchor from "../ui/anchor";
import Card from "../ui/card";
import Image from "next/image";
import { SquarePen, Images } from "lucide-react";
import { Undo2 } from "lucide-react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getLink, saveLink } from "@/lib/firestore";

const DEFAULT_URL = "https://www.threads.net/";
const DEFAULT_ICON = null;

export default function Thread({ userUid }: { userUid: string }) {
  const [url, setUrl] = useState(DEFAULT_URL);
  const [icon, setIcon] = useState<string | null>(DEFAULT_ICON);

  const [inputUrl, setInputUrl] = useState(url);
  const [inputIcon, setInputIcon] = useState<string | null>(icon);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userUid) return;
    getLink(userUid).then((data) => {
      if (data) {
        setUrl(data.url || DEFAULT_URL);
        setIcon(data.icon || DEFAULT_ICON);
        setInputUrl(data.url || DEFAULT_URL);
        setInputIcon(data.icon || DEFAULT_ICON);
      }
      setIsLoading(false);
    });
  }, [userUid]);

  if (isLoading) {
    return <div className="h-full bg-white rounded-3xl"></div>;
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setInputIcon(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setUrl(inputUrl);
    setIcon(inputIcon);
    setOpen(false);

    if (userUid) {
      await saveLink(userUid, {
        url: inputUrl,
        icon: inputIcon,
      });
    }
  };

  const handleReset = () => {
    setInputUrl(DEFAULT_URL);
    setInputIcon(DEFAULT_ICON);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="h-full"
    >
      <Card
        className="relative flex items-center justify-center group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* 外部連結箭頭 */}
        <div className="absolute bottom-3 left-3">
          <Anchor href={url} className="cancel-drag" target="_blank">
            <FaArrowRight className="-rotate-45 transition-transform duration-300 group-hover:rotate-0" />
            <span className="sr-only">Open Thread</span>
          </Anchor>
        </div>

        {/* 編輯按鈕（hover 時出現） */}
        <div className="absolute top-5 right-5">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              {isHovered && (
                <button
                  className="cancel-drag cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <SquarePen className="w-[20px] h-[20px] text-gray-500" />
                </button>
              )}
            </DialogTrigger>
            <DialogContent
              className="sm:max-w-md cancel-drag !max-w-[26rem] border-0"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col gap-10 mt-2">
                <DialogHeader>
                  <DialogTitle>編輯快速連結</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                  <Input
                    type="url"
                    placeholder="輸入網站連結"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                  />
                  <div className="flex gap-2 items-center">
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Images />
                      選擇圖片
                    </Button>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button variant="outline" onClick={handleReset}>
                      <Undo2 />
                      恢復預設
                    </Button>
                  </div>
                </div>
                {inputIcon && (
                  <Image
                    src={inputIcon}
                    alt="Selected Icon"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                )}
                <DialogFooter className="mt-4">
                  <Button
                    onClick={handleSave}
                    className="bg-[var(--color-primary)] w-full"
                  >
                    儲存
                  </Button>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* 顯示上傳圖示或預設 icon */}
        {icon ? (
          <Anchor href={url} target="_blank">
            <Image
              src={icon}
              alt="Website Icon"
              width={48}
              height={48}
              className="object-cover rounded-full"
            />
          </Anchor>
        ) : (
          <FaSquareThreads size="6rem" className="text-black dark:text-white" />
        )}
      </Card>
    </motion.div>
  );
}
