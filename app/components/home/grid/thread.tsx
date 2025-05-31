'use client';

import { useState } from 'react';
import { FaArrowRight, FaSquareThreads } from 'react-icons/fa6';
import Anchor from '../ui/anchor';
import Card from '../ui/card';
import Image from "next/image";


export default function Thread() {
    const [url, setUrl] = useState('');
    const [editing, setEditing] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const handleIconClick = () => {
        setInputValue(url);
        setEditing(true);
    };

    const handleSave = () => {
        setUrl(inputValue);
        setEditing(false);
    };

    const faviconUrl = url
        ? `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=64`
        : '';

    return (
        <Card className='relative flex items-center justify-center'>
            <div className='absolute bottom-3 left-3'>
                <Anchor
                    href={"#"}
                    className='cancel-drag'
                    onClick={handleIconClick}
                >
                    <FaArrowRight className='-rotate-45 transition-transform duration-300 group-hover:rotate-0' />
                    <span className='sr-only'>Edit Link</span>
                </Anchor>
            </div>

            {url ? (
                <Anchor href={url} target='_blank'>
                    <Image
                        src={faviconUrl}
                        alt='Website Favicon'
                        width={26}
                        height={26}
                        className='object-cover rounded-full'
                    />
                </Anchor>
            ) : (
                <FaSquareThreads size="6rem" color="black" />
            )}

            {editing && (
                <div className='cancel-drag absolute top-4 left-4 z-10'>
                    <input
                        type='text'
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className='border px-2 py-1 rounded mr-2 w-64'
                        placeholder='Enter website URL'
                    />
                    <button
                        onClick={handleSave}
                        className='bg-blue-500 text-white px-3 py-1 rounded'
                    >
                        Save
                    </button>
                </div>
            )}
        </Card>
    );
}
