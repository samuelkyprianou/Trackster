class PlaylistSerializer < ActiveModel::Serializer
    attributes :data
  
    def data
      {
        playlist: object.id,
        name: object.name,
        tracks: object.tracks
      }
    end
  
  

  end
  