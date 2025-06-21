import { useState, useEffect } from "react";
import Card from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaArrowRight } from "react-icons/fa6";
import { SquarePen } from "lucide-react";
import Anchor from "../ui/anchor";
import { getArticle, saveArticle } from "@/lib/firestore";
import { motion } from "framer-motion";

export default function Article({ userUid }: { userUid: string }) {
  const [title, setTitle] = useState("Memo");
  const [content, setContent] = useState(
    "A place to jot down your memos and thoughts."
  );
  const [link, setLink] = useState("/");

  const [inputTitle, setInputTitle] = useState(title);
  const [inputContent, setInputContent] = useState(content);
  const [inputLink, setInputLink] = useState(link);

  const [open, setOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 初始載入資料
  useEffect(() => {
    if (!userUid) return;
    getArticle(userUid).then((data) => {
      if (data) {
        setTitle(data.title || "");
        setContent(data.content || "");
        setLink(data.link || "");
      }
      setIsLoading(false);
    });
  }, [userUid]);

  if (isLoading) {
    return <div className="h-full bg-white rounded-3xl"></div>;
  }

  const handleSave = async () => {
    setTitle(inputTitle);
    setContent(inputContent);
    setLink(inputLink);
    setOpen(false);

    await saveArticle(userUid, {
      title: inputTitle,
      content: inputContent,
      link: inputLink,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="h-full"
    >
      <Card
        className="relative flex flex-col justify-center gap-4 p-8 group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Hover 時出現編輯按鈕 */}
        {isHovered && (
          <div className="absolute top-4 right-4">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <button
                  className="cancel-drag cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <SquarePen className="w-[20px] h-[20px] text-gray-500" />
                </button>
              </DialogTrigger>
              <DialogContent
                className="sm:max-w-md cancel-drag !max-w-[26rem] border-0"
                onClick={(e) => e.stopPropagation()}
              >
                <DialogHeader>
                  <DialogTitle>編輯內容</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4 mt-4">
                  <div className="flex flex-col gap-2">
                    <label>標題</label>
                    <Input
                      type="text"
                      maxLength={30}
                      placeholder="標題"
                      value={inputTitle}
                      onChange={(e) => setInputTitle(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label>
                      內文
                      <span className="text-s text-gray-500 ml-1">
                        (限 100 字內)
                      </span>
                    </label>
                    <Input
                      type="text"
                      maxLength={100}
                      placeholder="簡短介紹"
                      value={inputContent}
                      onChange={(e) => setInputContent(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label>連結</label>
                    <Input
                      type="url"
                      placeholder="連結"
                      value={inputLink}
                      onChange={(e) => setInputLink(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter className="mt-4">
                  <Button
                    onClick={handleSave}
                    className="bg-[var(--color-primary)] w-full"
                  >
                    儲存
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}

        <h2 className="font-pixelify-sans truncate text-xl">{title}</h2>
        <p className="line-clamp-3 leading-relaxed max-md:line-clamp-4 max-sm:line-clamp-2">
          {content}
        </p>
        <div className="inline-flex flex-col items-center justify-center gap-6 sm:flex-row sm:justify-between">
          <Anchor className="cancel-drag px-4 py-2" href={link}>
            <FaArrowRight className="-rotate-45 transition-transform duration-300 group-hover:rotate-0" />{" "}
            Read More
            <span className="sr-only">title</span>
          </Anchor>
        </div>
      </Card>
    </motion.div>
  );
}
