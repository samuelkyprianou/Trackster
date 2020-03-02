# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

a = User.create(username: "Jeff")

b = Playlist.create(name: "funky", user_id: a.id)

c = Track.create(deezer_track_id: 20, deezer_album_id: 30, deezer_artist_id: 40)

TrackPlaylist.create(track_id: c.id, playlist_id: b.id)

