import React from 'react'
import PlaylistInfoItem from './PlaylistInfoItem'

interface Props {
    owner: string
    followerCount: string | number
    trackCount: number
}

const PlaylistInfoList: React.FC<Props> = ({ owner, followerCount, trackCount }) => {
    return (
        <div className="flex mt-4">
            <PlaylistInfoItem label={owner} iconPath="person.svg" alt="Author" />
            <PlaylistInfoItem label={followerCount} iconPath="heart.svg" alt="Followers" />
            <PlaylistInfoItem label={trackCount} iconPath="disk.svg" alt="Songs" />
        </div>
    )
}

export default PlaylistInfoList
