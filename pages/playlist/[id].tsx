import Error from 'next/error'
import { useEffect, useState } from 'react'
import extractColors from 'image-color-analyzer'
import { GetServerSidePropsContext } from 'next'
import { fetchPlaylistById } from '../../lib/api'
import Overview from '../../components/Playlist/Overview'
import OwnerInfo from '../../components/Playlist/OwnerInfo'
import { fetchUserInfo } from '../../lib/api/fetchUserInfo'

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const playlistData = await fetchPlaylistById(context)
    const ownerInfo = playlistData.success
        ? await fetchUserInfo(context, playlistData.data.owner.href)
        : playlistData
    return {
        props: {
            playlistData,
            ownerInfo,
        },
    }
}

type PlaylistDataProps =
    | { success: true; status: number; data: PlaylistResponse }
    | { success: false; status: number; message: string }
export type PlaylistOwner =
    | { success: true; status: number; data: User }
    | { success: false; status: number; message: string }
type Props = {
    playlistData: PlaylistDataProps
    ownerInfo: PlaylistOwner
}

const Home: React.FC<Props> = ({ playlistData, ownerInfo }) => {
    const [imgLoaded, setImgLoaded] = useState(false)
    const [colors, setColors] = useState<{ color: string; share: number }[]>([])
    const error = !ownerInfo.success ? ownerInfo : !playlistData.success ? playlistData : null

    useEffect(() => {
        console.log(imgLoaded ? 'Image now fully loaded' : 'Still loading image')
        console.log(playlistData)
    }, [imgLoaded, playlistData])

    const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement, Event>): void => {
        const target = event.target as HTMLImageElement
        if (target.complete && target.style.visibility !== 'hidden') {
            setColors(
                extractColors(target, {
                    amount: 5,
                })
            )
            setImgLoaded(true)
        }
    }
    return (
        <>
            {playlistData.success && ownerInfo.success ? (
                <div className="w-10/12 mx-auto grid lg:grid-cols-6 md:grid-cols-5 grid-cols-4 grid-rows-2 gap-10 mt-8">
                    <Overview playlistData={playlistData.data} />
                    <OwnerInfo owner={ownerInfo.data} />
                    {/* {colors.map((color) => (
                        <div
                            key={color.color}
                            style={{
                                width: '50px',
                                height: '50px',
                                display: 'inline-block',
                                backgroundColor: `rgb(${color.color})`,
                            }}
                        ></div>
                    ))} */}
                </div>
            ) : (
                error && <Error statusCode={error.status} title={error.message} />
            )}
        </>
    )
}

export default Home
