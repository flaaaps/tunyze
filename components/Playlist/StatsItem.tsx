import Image from 'next/image'
import React from 'react'

interface Props {
    iconPath: string
    alt: string
    label: string | number
}

const StatsItem: React.FC<Props> = ({ iconPath, alt, label }) => {
    return (
        <div className="flex items-center mr-5">
            <div className="mr-1 h-5">
                <Image src={`/images/${iconPath}`} alt={alt} width="20" height="20" />
            </div>
            <span>{label}</span>
        </div>
    )
}

export default StatsItem
