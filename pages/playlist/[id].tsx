import Image from 'next/image'
import Error from 'next/error'
import { useEffect, useState } from 'react'
import extractColors from 'image-color-analyzer'
import { GetServerSidePropsContext } from 'next'

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const res = await fetch(`https://api.spotify.com/v1/playlists/${context.params!.id}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer BQBliaiTWYyWiah-CQSKlFivLu-dBeNdsJvVdmQg7kR3hDlK0MRuFXr9tI7q4vu2I5kZpkbH4ZVHCAsUljl3DImv_LotSFrgv_2O_YdH89BD3RBypE2E15IPmxuXgY1m9Sp-TxXw2YVUCizYu7IubXZk7J0WphvtlALj1nktY5yJze5Z6gR4PzBJKG80IIujl1FAAUz_EdD9zZzVTWpMgJEZN4PJ-I8AwGTPv9ZrX5QJCTvwnbHZGNGvrKVLjeFps0rukGHEP93g705NUIsmYTikqjrr`,
        },
    })
    const statusCode = res.ok ? 200 : res.ok
    let data = await res.json()

    let response = data

    if (data.error) {
        if (data.error.status === 404) {
            return {
                notFound: true,
            }
        }
        data.error.status = statusCode
        response = data.error
    } else {
        data.status = 200
    }

    return {
        props: {
            playlistResponse: response,
        },
    }
}

type Props = {
    playlistResponse: (PlaylistResponse & { status: 200 }) | { status: 500; message: string }
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
            console.log(target)
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
            {playlistResponse.status !== 200 ? (
                <Error statusCode={playlistResponse.status} title={playlistResponse.message} />
            ) : (
                <>
                    <Image
                        onLoad={handleImageLoad}
                        alt="Test"
                        objectFit="cover"
                        width="150"
                        height="150"
                        src={playlistResponse.images[0].url}
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
