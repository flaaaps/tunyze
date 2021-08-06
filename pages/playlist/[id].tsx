import Image from 'next/image'
import Error from 'next/error'
import { useEffect, useState } from 'react'
import extractColors from 'image-color-analyzer'
import { GetServerSidePropsContext } from 'next'
import { fetchPlaylistById } from '../../lib/api'

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const playlistData = await fetchPlaylistById(context)
    return {
        props: {
            playlistData,
        },
    }
}

type PlaylistDataProps =
    | { success: true; status: number; data: PlaylistResponse }
    | { success: false; status: number; message: string }

type Props = {
    playlistData: PlaylistDataProps
}

const Home: React.FC<Props> = ({ playlistData }) => {
    const [imgLoaded, setImgLoaded] = useState(false)
    const [colors, setColors] = useState<{ color: string; share: number }[]>([])

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
            {!playlistData.success ? (
                <Error statusCode={playlistData.status} title={playlistData.message} />
            ) : (
                <>
                    <Image
                        onLoad={handleImageLoad}
                        alt="Test"
                        objectFit="cover"
                        width="150"
                        height="150"
                        src={playlistData.data.images[0].url}
                    />

                    {colors.map((color) => (
                        <div
                            key={color.color}
                            style={{
                                width: '50px',
                                height: '50px',
                                display: 'inline-block',
                                backgroundColor: `rgb(${color.color})`,
                            }}
                        ></div>
                    ))}
                </>
            )}
        </>
    )
}

export default Home
