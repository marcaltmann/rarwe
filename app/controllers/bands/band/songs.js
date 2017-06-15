import Ember from 'ember';

export default Ember.Controller.extend({
  test: 'test1',

  actions: {
    updateRating: function(params) {
      var song = params.item,
          rating = params.rating;

      song.set('rating', rating);
    },
  },
});
