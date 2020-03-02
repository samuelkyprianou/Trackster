class CreateTracks < ActiveRecord::Migration[6.0]
  def change
    create_table :tracks do |t|
      t.string :title
      t.integer :duration
      t.string :artist
      t.string :cover_small
      t.string :album_title
      t.string :preview
      t.integer :deezer_track_id
      t.integer :deezer_album_id
      t.integer :deezer_artist_id

      t.timestamps
    end
  end
end
