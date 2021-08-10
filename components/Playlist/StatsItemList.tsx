import React from 'react'
import StatsItem from './StatsItem'

interface Props {
    owner: string
    followerCount: string | number
    trackCount: number
}

const StatsItemList: React.FC<Props> = ({ owner, followerCount, trackCount }) => {
    return (
        <div className="flex mt-4">
            <StatsItem label={owner} iconPath="person.svg" alt="Author" />
            <StatsItem label={followerCount} iconPath="heart.svg" alt="Followers" />
            <StatsItem label={trackCount} iconPath="disk.svg" alt="Songs" />
        </div>
    )
}

export default StatsItemList
