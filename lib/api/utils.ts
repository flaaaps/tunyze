import axios from 'axios'

export async function executeRequest<T>(
    access_token: string,
    href: string
): Promise<
    { success: true; status: number; data: T } | { success: false; status: number; message: string }
> {
    try {
        const response = await axios.get(href, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        })
        let data = response.data
        return { data, status: response.status, success: true }
    } catch (error) {
        console.log('Error while fetching data!')
        if (error.response) {
            return {
                success: false,
                status: error.response.data.error.status,
                message: error.response.data.error.message,
            }
        } else {
            return {
                success: false,
                status: 500,
                message: 'Internal server error. Try again later.',
            }
        }
    }
}
