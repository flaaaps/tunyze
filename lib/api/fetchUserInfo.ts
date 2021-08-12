import { GetServerSidePropsContext } from 'next'
import { DataResponse } from '../../pages/playlist/[id]'
import { executeRequest } from './utils'

export async function fetchUserInfo(
    { req }: GetServerSidePropsContext,
    href: string
): Promise<DataResponse<User>> {
    const { access_token } = req.cookies
    if (!access_token) {
        return {
            success: false,
            status: 401,
            message: 'Unauthorized. Sign In with Spotify to continue',
        }
    }

    const response = await executeRequest<User>(access_token, href)
    return { ...response }
}
