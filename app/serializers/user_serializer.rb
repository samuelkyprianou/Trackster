class UserSerializer < ActiveModel::Serializer
  attributes :data

  def data
    {
      id: object.id,
      username: object.username,
      playlist: parse_playlists(object.playlists)
    }
  end


  def parse_playlists(playlists)
    parsed = playlists.map do |playlist| 
      {
        id: playlist.id,
        name: playlist.name, 
        tracks: playlist.tracks
      }
    end
  end
end
