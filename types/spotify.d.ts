interface PlaylistItemResponse {
    href: string
    items: PlaylistItem[]
    limit: number
    next: string | null
    offset: number
    previous: number | null
    total: number
}

interface PlaylistItem {
    added_at: string
    added_by: {
        external_urls: {
            spotify: string
        }
        href: string
        id: string
        type: string
        uri: string
    }
    is_local: boolean
    primary_color: string | null
    track: PlaylistItemTrack
    video_thumbnail: {
        url: string | null
    }
}

interface PlaylistItemTrack {
    album: {
        album_type: string
        artists: [
            {
                external_urls: {
                    spotify: string
                }
                href: string
                id: string
                name: string
                type: string
                uri: string
            }
        ]
        external_urls: {
            spotify: string
        }
        href: string
        id: string
        images: [
            {
                height: 640
                url: string
                width: 640
            },
            {
                height: 300
                url: string
                width: 300
            },
            {
                height: 64
                url: string
                width: 64
            }
        ]
        name: string
        release_date: string
        release_date_precision: string
        total_tracks: number
        type: string
        uri: string
    }
    artists: PlaylistItemTrackArtist[]
    disc_number: number
    duration_ms: number
    episode: boolean
    explicit: boolean
    external_ids: {
        isrc: string
    }
    external_urls: {
        spotify: string
    }
    href: string
    id: string
    is_local: boolean
    is_playable: boolean
    name: string
    popularity: number
    preview_url: string
    track: boolean
    track_number: number
    type: string
    uri: string
}

interface PlaylistItemTrackArtist {
    external_urls: {
        spotify: string
    }
    href: string
    id: string
    name: string
    type: string
    uri: string
}

interface ArtistResponse {
    external_urls: { spotify: string }
    followers: { href: string | null; total: number }
    genres: string[]
    href: string
    id: string
    images: [
        {
            height: number
            url: string
            width: number
        },
        {
            height: number
            url: string
            width: number
        },
        {
            height: number
            url: string
            width: number
        }
    ]
    name: string
    popularity: number
    type: string
    uri: string
}