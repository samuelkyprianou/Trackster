class PlaylistSerializer < ActiveModel::Serializer
    attributes :data
  
    def data
      {
        id: object.id,
        name: object.name,
        tracks: object.tracks
      }
    end
  
  

  end
  