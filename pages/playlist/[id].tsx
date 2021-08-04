import Image from 'next/image'
import Error from 'next/error'
import { useEffect, useState } from 'react'
import extractColors from 'image-color-analyzer'
import { GetServerSidePropsContext } from 'next'
import { server } from '../../config'

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const res = await fetch(`${server}/api/playlist/${context.params!.id}`, {
        method: 'GET',
        headers: {
            cookie: context.req.headers.cookie as string,
        },
    })
    const data = await res.json()
    return {
        props: {
            playlistResponse: res.ok
                ? { success: res.ok, ...data }
                : {
                      success: false,
                      status: res.status,
                      message: data?.message ?? 'Internal server error',
                  },
        },
    }
}

type Props = {
    playlistResponse:
        | { success: true; status: number; data: PlaylistResponse }
        | { success: false; status: number; message: string }
}

const Home: React.FC<Props> = ({ playlistResponse }) => {
    const [imgLoaded, setImgLoaded] = useState(false)
    const [colors, setColors] = useState<{ color: string; share: number }[]>([])

    useEffect(() => {
        console.log(imgLoaded ? 'Image now fully loaded' : 'Still loading image')
        console.log(playlistResponse)
    }, [imgLoaded, playlistResponse])

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
            {!playlistResponse.success ? (
                <Error statusCode={playlistResponse.status} title={playlistResponse.message} />
            ) : (
                <>
                    <Image
                        onLoad={handleImageLoad}
                        alt="Test"
                        objectFit="cover"
                        width="150"
                        height="150"
                        src={playlistResponse.data.images[0].url}
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
