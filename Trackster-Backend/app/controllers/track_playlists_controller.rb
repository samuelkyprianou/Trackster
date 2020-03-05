class TrackPlaylistsController < ApplicationController

    def index
        trackplaylists = TrackPlaylist.all
        render json: trackplaylists
    end

    def new

    end

    def create
        trackplaylist = TrackPlaylist.create(trackplaylist_params)
        playlist = Playlist.find(trackplaylist.playlist_id)
        render json: playlist
    end
    

    private

    def trackplaylist_params
        params.require(:track_playlist).permit(:track_id, :playlist_id)
    end
end
