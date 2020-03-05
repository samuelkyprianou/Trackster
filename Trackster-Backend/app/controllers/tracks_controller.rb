class TracksController < ApplicationController


    def index

    end

    def new 
        
    end

    def create
        
        track = Track.create(track_params)
        render json: track
    end

    private

    def track_params
        params.require(:track).permit(:title, :duration, :artist, :cover_small, :album_title, :preview, :deezer_track_id, :deezer_album_id, :deezer_artist_id)
    end
end

