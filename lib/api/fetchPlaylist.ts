import { GetServerSidePropsContext } from 'next'
import { DataResponse } from '../../pages/playlist/[id]'
import { executeRequest } from './utils'

export async function fetchPlaylistById({
    req,
    res,
    params,
}: GetServerSidePropsContext): Promise<DataResponse<PlaylistResponse>> {
    const { access_token } = req.cookies
    const id = params?.id
    if (!access_token) {
        return {
            success: false,
            status: 401,
            message: 'Unauthorized. Sign In with Spotify to continue',
        }
    }

    const response = await executeRequest<PlaylistResponse>(
        access_token,
        `https://api.spotify.com/v1/playlists/${id}`
    )
    return { ...response }
}
