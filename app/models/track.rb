class Track < ApplicationRecord
    has_many :track_playlists
    has_many :playlists, through: :track_playlists
end
