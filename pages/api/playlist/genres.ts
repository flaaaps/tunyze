import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import Logger from '../../../utils/logger'
import { count } from '../../../utils/data'

const ENV = process.env.NODE_ENV

const logger = new Logger(ENV === 'test' ? 'development' : ENV, 'all')

type TrackFetchResponse =
    | (PlaylistItemResponse & { success: true })
    | { success: false; status: number; message: string }

const AUTH_TOKEN = 'Bearer ' + process.env.AUTH_TOKEN

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (!req.query.playlistId) {
        res.send({ success: false, error: 'Please include a playlistId' })
        return
    }
    const playlistId = req.query.playlistId as string
    const considerAllArtists = req.query.considerAllArtists
    logger.info("Starting to fetch playlists' tracks...")
    logger.info(
        considerAllArtists
            ? 'The genres of all featured artists will be included.'
            : "Only the primary artists' genres will be included."
    )

    let refetches = 0 // TODO: Instead compare total and fetched
    try {
        console.log(await retrievePlaylistTracks(playlistId))
        const mainResult = await retrievePlaylistTracks(playlistId)
        if (mainResult.success == false) {
            res.send(mainResult)
            return
        }

        let offset = 100
        refetches = Math.floor(mainResult.total / 100)
        logger.info(`${refetches} refetches`)

        const items: PlaylistItem[] = mainResult.items
        while (refetches > 0) {
            logger.info('Refetching next page...')
            const result = await retrievePlaylistTracks(playlistId, offset)

            if (result.success == false) {
                res.send(mainResult)
                return
            }
            items.push(...result.items)
            logger.info(`Refetched items, we got ${refetches} refetches left`)
            refetches -= 1
            offset += 100
        }
        logger.info(
            `We got ${items.length} items, the total is ${mainResult.total}`
        )

        const cachedArtists: (PlaylistItemTrackArtist & {
            genres: string[]
        })[] = []
        const artists: { [key: string]: PlaylistItemTrackArtist[] } = {}
        items.forEach((item) => {
            artists[item.track.id] = item.track.artists
        })
        const genreList: string[] = []
        const neededToBeFetched: boolean[] = []
        for (let trackId of Object.keys(artists)) {
            const artistList = artists[trackId]
            if (considerAllArtists) {
                for (let artist of artistList) {
                    if (
                        !cachedArtists.find((item) => item.href === artist.href)
                    ) {
                        neededToBeFetched.push(true)
                        const artistData: ArtistResponse = (
                            await axios.get(artist.href, {
                                headers: { Authorization: AUTH_TOKEN },
                            })
                        ).data
                        cachedArtists.push(artistData)
                    }
                    genreList.push(
                        ...cachedArtists.find(
                            (item) => item.href === artistList[0].href
                        )?.genres!
                    )
                }
            } else {
                if (
                    !cachedArtists.find(
                        (item) => item.href === artistList[0].href
                    )
                ) {
                    neededToBeFetched.push(true)
                    const artistData: ArtistResponse = (
                        await axios.get(artistList[0].href, {
                            headers: { Authorization: AUTH_TOKEN },
                        })
                    ).data
                    cachedArtists.push(artistData)
                }
                genreList.push(
                    ...cachedArtists.find(
                        (item) => item.href === artistList[0].href
                    )?.genres!
                )
            }
        }
        const countedGenres = count(genreList)
        console.log(`${cachedArtists.length} artists needed to be fetched!`)
        console.log(
            'The cached artists are:',
            cachedArtists.map((artist) => artist.name).join(',')
        )
        logger.info('We are done fetching now!')
        res.send({
            success: true,
            genres: countedGenres.items.slice(
                0,
                parseInt(req.query.limit as string) || 10
            ),
        })
    } catch (error) {
        res.send({ success: false, error: error.message })
        return
    }
    // }
    // console.log(req.query.playlistId, "PLAYLIST ID!")
    // if (req.query.playlistId) {
    //     fetchPlaylistTracks(req.query.playlistId as string)
    // } else {
    //     res.send({ success: false, error: "Missing playlist id" })
    // }
    // res.send("Fallback")
}

async function retrievePlaylistTracks(
    playlistId: string,
    offset: number = 0
): Promise<TrackFetchResponse> {
    try {
        return {
            success: true,
            ...(
                await axios.get(
                    `https://api.spotify.com/v1/playlists/${playlistId}/tracks?offset=${offset}`,
                    {
                        headers: {
                            Authorization: AUTH_TOKEN,
                        },
                    }
                )
            )?.data,
        }
    } catch (error) {
        return { success: false, ...error.response.data.error }
    }
}
