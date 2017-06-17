import { test } from 'qunit';
import moduleForAcceptance from 'rarwe/tests/helpers/module-for-acceptance';
import Pretender from 'pretender';
import httpStubs from '../helpers/http-stubs';

moduleForAcceptance('Acceptance | bands', {
  afterEach() {
    server.shutdown();
  },
});

var server;

test('List bands', function(assert) {
  server = new Pretender(function() {
    httpStubs.stubBands(this, [
      {
        id: 1,
        attributes: {
          name: 'Radiohead',
        },
      },
      {
        id: 2,
        attributes: {
          name: 'Long Distance Calling',
        },
      },
    ]);
  });

  visit('/bands');

  andThen(function() {
    assertLength(assert, '.band-link', 2, 'All band links are rendered');
    assertElement(assert, '.band-link:contains("Radiohead")',
      'First band link contains the band name');
    assertElement(assert, '.band-link:contains("Long Distance Calling")',
      'The other band link contains the band name');
  });
});

test('Create a new band', function(assert) {
  server = new Pretender(function() {
    httpStubs.stubBands(this, [
      {
        id: 1,
        attributes: {
          name: 'Radiohead',
        },
      },
    ]);
    httpStubs.stubCreateBand(this, 2);
    httpStubs.stubSongs(this, 2, []);
  });

  visit('/bands');
  fillIn('.new-band', 'Long Distance Calling');
  click('.new-band-button');

  andThen(function() {
    assertLength(assert, '.band-link', 2, 'All band links are rendered');
    assertTrimmedText(assert, '.band-link:last', 'Long Distance Calling',
      'Created band appears at the end of the list');
    assertElement(assert, '.nav a.active:contains("Songs")', 'The Songs tab is active');
  });
});

test('Create a new song in two steps', function(assert) {
  server = new Pretender(function() {
    httpStubs.stubBands(this, [
      {
        id: 1,
        attributes: {
          name: 'Radiohead',
        },
      },
    ]);
    httpStubs.stubSongs(this, 1, []);
    httpStubs.stubCreateSong(this, 1);
  });

  selectBand('Radiohead');
  click('a:contains("create one")');
  fillIn('.new-song', 'Killer Cars');
  submit('.new-song-form');

  andThen(function() {
    assertElement(assert, '.songs .song:contains("Killer Cars")',
      'Creates the song and displays it in the list');
  });
});
