'use client';

import ThemeToggle from '../config/ThemeToggle';
import Card from '../ui/card';

export default function Theme() {
    return (
        <Card className='relative flex h-full flex-col items-center justify-center'>
            <ThemeToggle/>
        </Card>
    );
}
