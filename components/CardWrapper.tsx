import React from 'react'

interface Props {
    style?: React.CSSProperties
    className?: string
}

const CardWrapper: React.FC<Props> = ({ children, style, className }) => {
    return (
        <div
            className={`bg-background rounded-sm ${className ? className : ''}`}
            style={{
                boxShadow: '10px 10px 0px rgba(60, 87, 228, 0.8)',
                ...style,
            }}
        >
            {children}
        </div>
    )
}

export default CardWrapper
