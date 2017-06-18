import Ember from 'ember';
import { capitalize } from '../../../helpers/capitalize';
const { Controller, computed } = Ember;

export default Controller.extend({
  queryParams: {
    sortBy: 'sort',
    searchTerm: 's',
  },

  title: '',
  songCreationStarted: false,

  isAddButtonDisabled: computed.empty('title'),
  hasSongs: computed.bool('model.songs.length'),
  canCreateSong: computed.or('songCreationStarted', 'hasSongs'),

  searchTerm: '',
  matchingSongs: computed('model.songs.@each.title', 'searchTerm', function() {
    var searchTerm = this.get('searchTerm').toLowerCase();
    return this.get('model.songs').filter(function(song) {
      return song.get('title').toLowerCase().indexOf(searchTerm) !== -1;
    });
  }),

  sortBy: 'ratingDesc',
  sortProperties: computed('sortBy', function() {
    var options = {
      'ratingDesc': 'rating:desc,title:asc',
      'ratingAsc' : 'rating:asc,title:asc',
      'titleDesc' : 'title:desc',
      'titleAsc'  : 'title:asc',
    };
    return options[this.get('sortBy')].split(',');
  }),
  sortedSongs: computed.sort('matchingSongs', 'sortProperties'),

  newSongPlaceholder: computed('model.name', function() {
    var bandName = this.get('model.name');
    return `New ${capitalize(bandName)} song`;
  }),

  actions: {
    enableSongCreation() {
      this.set('songCreationStarted', true);
    },
    updateRating(params) {
      var song = params.item,
          rating = params.rating;

      if (song.get('rating') === rating) {
        rating = 0;
      }

      song.set('rating', rating);
      return song.save();
    },
  },
});
