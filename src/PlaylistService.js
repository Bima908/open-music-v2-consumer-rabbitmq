const { Pool } = require('pg');

const { songsOnPlaylistMapperResponse } = require("./utils/songsOnPlaylistMapperResponse");
const NotFoundError = require('./exceptions/NotFoundError');
const { songMapperResponse } = require('./utils/songMapperResponse');

class PlaylistService {
  constructor() {
    this._pool = new Pool();
  }

  async getSongsByPlaylist(playlist_id) {
    const query = {
      text: 'SELECT songs.* FROM songs JOIN playlist_songs ON songs.id = playlist_songs.song_id WHERE playlist_songs.playlist_id = $1',
      values: [playlist_id],
    };

    const result = await this._pool.query(query);
    return result.rows.map(songMapperResponse);
  }

  async getPlaylistById(playlist_id) {
    const query = {
      text: 'SELECT * FROM playlists JOIN users on playlists.user_id = users.id WHERE playlists.id = $1',
      values: [playlist_id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan.');
    }

    const songs = await this.getSongsByPlaylist(playlist_id);
    return songsOnPlaylistMapperResponse(result.rows[0], songs);
  }
}

module.exports = PlaylistService;
