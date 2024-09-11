const songsOnPlaylistMapperResponse = ({ id, name }, songs) => ({
  playlist: {
    id,
    name,
    songs,
  }
});

module.exports = { songsOnPlaylistMapperResponse };
