# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_03_02_135831) do

  create_table "playlists", force: :cascade do |t|
    t.string "name"
    t.integer "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_playlists_on_user_id"
  end

  create_table "track_playlists", force: :cascade do |t|
    t.integer "track_id", null: false
    t.integer "playlist_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["playlist_id"], name: "index_track_playlists_on_playlist_id"
    t.index ["track_id"], name: "index_track_playlists_on_track_id"
  end

  create_table "tracks", force: :cascade do |t|
    t.string "title"
    t.integer "duration"
    t.string "artist"
    t.string "cover_small"
    t.string "album_title"
    t.string "preview"
    t.integer "deezer_track_id"
    t.integer "deezer_album_id"
    t.integer "deezer_artist_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "username"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  add_foreign_key "playlists", "users"
  add_foreign_key "track_playlists", "playlists"
  add_foreign_key "track_playlists", "tracks"
end
