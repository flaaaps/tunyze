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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const playlistId = req.query.id as string
    if (!playlistId) {
        res.send({ success: false, error: 'Please include a playlist id' })
        return
    }
    const considerAllArtists = req.query.considerAllArtists
    logger.info("Starting to fetch playlists' tracks...")
    logger.info(
        considerAllArtists
            ? 'The genres of all featured artists will be included.'
            : "Only the primary artists' genres will be included."
    )

    let refetches = 0 // TODO: Instead compare total and fetched
    try {
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
        logger.info(`We got ${items.length} items, the total is ${mainResult.total}`)

        const artists: { [key: string]: PlaylistItemTrackArtist[] } = {}
        items.forEach((item) => {
            artists[item.track.id] = item.track.artists
        })
        const artistIdsToFetch: string[] = []
        for (let trackId of Object.keys(artists)) {
            const artistList = artists[trackId]
            if (considerAllArtists) {
                for (let artist of artistList) {
                    artistIdsToFetch.push(artist.id)
                }
            } else {
                artistIdsToFetch.push(artistList[0].id)
            }
        }
        const artistRes = (
            await axios.get(
                `https://api.spotify.com/v1/artists?ids=${encodeURIComponent(
                    artistIdsToFetch.join(',')
                )}`,
                {
                    headers: {
                        Authorization: AUTH_TOKEN,
                    },
                }
            )
        ).data

        if (artistRes?.artists) {
            const artistObjects: ArtistResponse[] = artistRes.artists
            const genreList: string[] = []

            artistObjects.forEach((artist) => {
                genreList.push(...artist.genres)
            })
            const countedGenres = count(genreList)
            logger.info('We are done fetching now!')
            res.send({
                success: true,
                genres: countedGenres.items.slice(0, parseInt(req.query.limit as string) || 10),
            })
        } else {
            res.send({ success: false, error: 'An unexpected error occurred' })
        }
    } catch (error) {
        res.send({ success: false, error: error.message })
        return
    }
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
        console.log('An error occurred!')
        return { success: false, ...error.response.data.error, status: 'babas' }
    }
}
