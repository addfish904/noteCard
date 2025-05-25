import { FaArrowRight, FaLinkedin } from 'react-icons/fa6';
import Anchor from '../ui/anchor';
import Card from '../ui/card';

export default function Thread() {
    return (
        <Card className='relative flex h-full flex-col items-center justify-center bg-black'>
            <div className='absolute bottom-3 left-3'>
                <Anchor className='cancel-drag' href='#' target='_blank'>
                    <FaArrowRight className='-rotate-45 transition-transform duration-300 group-hover:rotate-0' />
                    <span className='sr-only'>Thread</span>
                </Anchor>
            </div>
            <FaLinkedin size='4rem' color='white' />
        </Card>
    );
}
