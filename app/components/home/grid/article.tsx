// "use client";

// import { FaArrowRight } from 'react-icons/fa6';
// import Card from '../ui/card';
// import Anchor from '../ui/anchor';

// export default function Article() {

//     return (
//         <Card className='flex flex-col justify-center gap-4 p-8'>
//             <h2 className='font-pixelify-sans truncate text-xl'>
//              Memo
//             </h2>
//             <p className='line-clamp-3 leading-relaxed max-md:line-clamp-4 max-sm:line-clamp-2'>
//             A place to jot down your memos and thoughts.
//             </p>
//             <div className='inline-flex flex-col items-center justify-center gap-6 sm:flex-row sm:justify-between'>
//                 <Anchor className='cancel-drag px-4 py-2' href={"/"}>
//                     <FaArrowRight className='-rotate-45 transition-transform duration-300 group-hover:rotate-0'/> Read More
//                     <span className='sr-only'>title</span>
//                 </Anchor>
//             </div>
//         </Card>
//     );
// }

import { useState, useRef } from "react";
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

export default function Article() {
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

  const handleSave = () => {
    setTitle(inputTitle);
    setContent(inputContent);
    setLink(inputLink);
    setOpen(false);
  };

  return (
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
                <DialogTitle>編輯文章資訊</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4 mt-4">
                <Input
                  type="text"
                  maxLength={30}
                  placeholder="標題"
                  value={inputTitle}
                  onChange={(e) => setInputTitle(e.target.value)}
                />
                <Input
                  type="text"
                  maxLength={50}
                  placeholder="簡短介紹"
                  value={inputContent}
                  onChange={(e) => setInputContent(e.target.value)}
                />
                <Input
                  type="url"
                  placeholder="連結"
                  value={inputLink}
                  onChange={(e) => setInputLink(e.target.value)}
                />
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
  );
}
