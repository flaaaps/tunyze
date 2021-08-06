import classNames from 'classnames'
import Image from 'next/image'
import React from 'react'
import CardWrapper from './CardWrapper'
import PlaylistInfoList from './PlaylistInfoList'

type Props = {
    playlistData: PlaylistResponse
}

const PlaylistOverview: React.FC<Props> = ({ playlistData }) => {
    return (
        <CardWrapper className="mt-8 mx-10">
            <div className="flex">
                <div
                    style={{
                        position: 'relative',
                        minWidth: '200px',
                        minHeight: '200px',
                    }}
                >
                    <Image
                        alt="Test"
                        className="rounded-l-sm"
                        objectFit="cover"
                        layout="fill"
                        // onLoad={handleImageLoad}
                        src={playlistData.images[0].url}
                    />
                </div>
                <div className="px-9 py-7 flex flex-col justify-center">
                    <h1 className={'text-primary font-semibold text-3xl'}>{playlistData.name}</h1>
                    <p
                        className={classNames(
                            'text-text-light font-serif text-base mt-1',
                            !playlistData.description && 'italic'
                        )}
                    >
                        {playlistData.description || 'Playlist has no description'}
                    </p>
                    <PlaylistInfoList
                        owner={playlistData.owner.display_name}
                        followerCount={new Intl.NumberFormat('en-US').format(
                            playlistData.followers.total
                        )}
                        trackCount={playlistData.tracks.total}
                    />
                </div>
            </div>
        </CardWrapper>
    )
}

export default PlaylistOverview
