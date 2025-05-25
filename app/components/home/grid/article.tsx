"use client";

import { FaArrowRight } from 'react-icons/fa6';
import Card from '../ui/card';
import Anchor from '../ui/anchor';

export default function Article() {

    return (
        <Card className='flex flex-col justify-center gap-4 p-8'>
            <h2 className='font-pixelify-sans truncate text-xl'>
                我是標題
            </h2>
            <p className='line-clamp-3 leading-relaxed max-md:line-clamp-4 max-sm:line-clamp-2'>
                A short story about my web development journey started.
            </p>
            <div className='inline-flex flex-col items-center justify-center gap-6 sm:flex-row sm:justify-between'>
                <Anchor className='cancel-drag px-4 py-2' href={"/"}>
                    <FaArrowRight className='-rotate-45 transition-transform duration-300 group-hover:rotate-0'/> Read More
                    <span className='sr-only'>title</span>
                </Anchor>
                <small className='text-gray-600 dark:text-gray-400'>November 21, 2023</small>
            </div>
        </Card>
    );
}
