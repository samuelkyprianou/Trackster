class Playlist < ApplicationRecord
  belongs_to :user
  has_many :track_playlists, :dependent => :delete_all
  has_many :tracks, through: :track_playlists
  accepts_nested_attributes_for :tracks, :allow_destroy => true
end
