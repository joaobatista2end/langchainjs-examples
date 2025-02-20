import { ReactNode } from 'react';

interface BaseContainerProps {
    children?: ReactNode;
}

const BaseContainer = (props: BaseContainerProps) => {
    return (
        <div className='w-full max-w-screen-lg mx-auto p-4'>
            {props.children}
        </div>
    )
}

export default BaseContainer