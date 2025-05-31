import { motion } from "motion/react"
import Card from "../ui/card";
import Image from "next/image";


const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.6
      }
    }
  };
  
  const fromLeft = {
    hidden: { opacity: 0, x: -30 },
    show: { opacity: 1, x: 0 },
  };
  
  const fromRight = {
    hidden: { opacity: 0, x: 50 },
    show: { opacity: 1, x: 0 },
  };
  
  export default function QuickStartGuide() {
    return (
    <Card className="bg-[#D9F275]">
      <motion.div
        className="note-box relative w-full h-full"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* 左上文字 */}
        <motion.div variants={fromLeft} className="absolute top-8 left-6 text-center rotate-[-6deg] text-black dark:text-white">
          quickly create<br />your notes!
        </motion.div>
  
        {/* 箭頭 */}
        <motion.div variants={fromLeft} className="absolute top-7 right-14 dark:invert">
          <Image 
            src="/img/arrowSvg.svg"
            width={45}
            height={45}
            alt="arrow icon"
          />
        </motion.div>
  
       {/* 人物圖 */}
        <motion.div variants={fromRight} className="w-[170px] object-contain absolute bottom-0 right-5">
          <Image 
            src="/img/CharacterSvg.png"
            width={170}
            height={137}
            alt="Character image"/>
        </motion.div>

      </motion.div>
      </Card>
    );
  }
  