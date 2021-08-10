import Image from 'next/image'
import React from 'react'
import CardWrapper from '../CardWrapper'
import StatsItem from './StatsItem'

interface Props {
    owner: User
}

const OwnerInfo: React.FC<Props> = ({ owner }) => {
    return (
        <CardWrapper className="xl:col-span-2 lg:col-span-3 md:col-span-3 sm:col-span-4 col-span-6">
            <div className="flex h-full justify-between">
                <div className="px-7 flex flex-col justify-center h-full w-full">
                    <h2 className="text-text font-medium text-base font-serif leading-5">Owner</h2>
                    <h1 className="font-sans text-2xl font-medium text-primary mb-3">
                        {owner.display_name}
                    </h1>
                    <StatsItem
                        iconPath="heart.svg"
                        label={owner.followers.total.format('en-US')}
                        alt="Followers"
                    />
                </div>
                <div
                    style={{
                        position: 'relative',
                        minWidth: '50%',
                        minHeight: '120px',
                        maxWidth: '150px',
                    }}
                >
                    <Image
                        src={owner.images[0].url}
                        objectFit="cover"
                        layout="fill"
                        alt={owner.display_name}
                        placeholder="empty"
                    />
                </div>
            </div>
        </CardWrapper>
    )
}

export default OwnerInfo
