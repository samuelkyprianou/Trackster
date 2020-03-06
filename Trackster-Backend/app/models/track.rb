class Track < ApplicationRecord
    has_many :track_playlists, :dependent => :delete_all
    has_many :playlists, through: :track_playlists
end
