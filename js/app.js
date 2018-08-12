/* MODEL */
var locations = [
	{title: 'Xiangshan', id: 0, location: {lat: 25.03283, lng: 121.569576}},
	{title: 'Taipei 101/World Trade Center', id: 1, location: {lat: 25.033102, lng: 121.563292}},
	{title: 'Xinyi Anhe', id: 2, location: {lat: 25.033326, lng: 121.553526}},
	{title: 'Daan', id: 3, location: {lat: 25.032943, lng: 121.543551}},
	{title: 'Daan Park', id: 4, location: {lat: 25.033396, lng: 121.534882}},
	{title: 'Dongmen', id: 5, location: {lat: 25.033847, lng: 121.528739}},
	{title: 'Chiang Kai-Shek Memorial Hall', id: 6, location: {lat: 25.032729, lng: 121.51827}},
	{title: 'NTU Hospital', id: 7, location: {lat: 25.041256, lng: 121.51604}},
	{title: 'Taipei Main Station', id: 8, location: {lat: 25.046255, lng: 121.517532}},
	{title: 'Zhongshan', id: 9, location: {lat: 25.052685, lng: 121.520392}},
	{title: 'Shuanglian', id: 10, location: {lat: 25.057805, lng: 121.520627}},
	{title: 'Minquan W. Rd.', id: 11, location: {lat: 25.062905, lng: 121.51932}},
	{title: 'Yuanshan', id: 12, location: {lat: 25.071353, lng: 121.520118}},
	{title: 'Jiantan', id: 13, location: {lat: 25.084873, lng: 121.525078}},
	{title: 'Shilin', id: 14, location: {lat: 25.093535, lng: 121.52623}},
	{title: 'Zhishan', id: 15, location: {lat: 25.10306, lng: 121.522514}},
	{title: 'Mingde', id: 16, location: {lat: 25.109721, lng: 121.518848}},
	{title: 'Shipai', id: 17, location: {lat: 25.114523, lng: 121.515559}},
	{title: 'Qilian', id: 18, location: {lat: 25.120872, lng: 121.506252}},
	{title: 'Qiyan', id: 19, location: {lat: 25.125491, lng: 121.501132}},
	{title: 'Beitou', id: 20, location: {lat: 25.131841, lng: 121.498633}},
	{title: 'Xinbeitou', id: 21, location: {lat: 25.136933, lng: 121.50253}},
	{title: 'Fuxinggang', id: 22, location: {lat: 25.137474, lng: 121.485444}},
	{title: 'Zhongyi', id: 23, location: {lat: 25.130969, lng: 121.47341}},
	{title: 'Guandu', id: 24, location: {lat: 25.125633, lng: 121.467102}},
	{title: 'Zhuwei', id: 25, location: {lat: 25.13694, lng: 121.459479}},
	{title: 'Hongshulin', id: 26, location: {lat: 25.154042, lng: 121.458872}},
	{title: 'Tamsui', id: 27, location: {lat: 25.167818, lng: 121.445561}}
];
var map;
var Google;
var gMarkers = [];
const FOUR_SQUARE_CLIENT_ID = 'CLIENT_ID';
const FOUR_SQUARE_CLIENT_SECRET = 'CLIENT_SECRET';

/* VIEWMODEL */
var ViewModel = function () {
	'use strict';	// Use JS in 'strict' mode. That is, ALL variables should be declared explicitly.
	var self = this;
	
	this.shouldShowMenu = ko.observable(true);
	this.markers = ko.observableArray([]);
	this.markersFiltered = ko.observableArray([]);
	this.errorMsg = ko.observable('');
	this.filterString = ko.observable('');
	
	// Initialize the marker list
	locations.forEach(function (marker) {
		self.markers().push(marker);
	});
	// Default the filtered markers = markers
	this.markersFiltered(this.markers());

	// Show/Hide the menu on the left side of the screen
	this.toggleMenu = function () {
		self.shouldShowMenu(!self.shouldShowMenu());
	};

	// Open the infowindow of the choosen marker or show error message if something wrong
	this.pickMarker = function (id) {
		if (typeof Google === 'undefined') {
			self.errorMsg('Sorry... Error happened when connecting to Google Maps. Please try again later.');
		} else {
			// Go through all the gMarkers and pick the one with the given id
			gMarkers.forEach(function (gm) {
				if (gm.id === id) {
					// Trigger 'click' event on the Google marker with the same id which was clicked
					Google.maps.event.trigger(gm, 'click');
					return;
				}
			});
		}
	};
	
	// Filter the locations in real-time.
	this.filterMarker = function () {
		// Clean the list view and markers first.
		self.markersFiltered([]);
		hideListings();
		if (self.filterString() === '') {
			// If the filter string is empty, show all the locations
			self.markersFiltered(self.markers());
			showListings(self.markers());
		} else {
			// Loop through the locations. If a location's title contains the filter string, put it into
			// a temp array, and then shows all locations in the temp array.
			var temp = [];
			locations.forEach(function (marker) {
				if (marker.title.toLowerCase().indexOf(self.filterString().toLowerCase()) >= 0) {
					temp.push(marker);
				}
			});
			// Only update map if any of the locations found
			if (temp.length !== 0) {
				self.markersFiltered(temp);
				showListings(temp);
			}
		}
	};
};

/* BINDING */
ko.applyBindings(new ViewModel());

/**
* @description Loop through the markers array and display them all
* @param {object array} an array that contains all the marker objects that should be displayed
*/
function showListings(markers) {
	'use strict';
	var bounds = new Google.maps.LatLngBounds();
	// Extend the boundaries of the map for each marker and display the marker
	for (var i = 0; i < markers.length; i++) {
		let id = markers[i].id;
		gMarkers[id].setMap(map);
		bounds.extend(gMarkers[id].position);
	}
	map.fitBounds(bounds);
	// Make sure that it doesn't zoom in too much.
	if (map.getZoom() > 16) {
		map.setZoom(16);
	}
}

/**
* @description Loop through the markers array and hide them all
*/
function hideListings() {
	gMarkers.forEach(function (gm) {
		gm.setMap(null);
	});
}

/* GOOGEL MAP */
/**
* @description Google Maps callback function which is also
* a ViewModel for controlling the maps, infoWindows and markers etc.
*/
function initMap() {
	'use strict';
	// Store the google object into global variable Google being used in KO ViewModal
	Google = google;

	// Use a constructor to create a new map JS object.
	map = new google.maps.Map(document.getElementById('map'), {
		center: locations[0].location,
		mapTypeControl: false,
		zoom: 13
	});
	
	// Build markers
	locations.forEach(function (markerObj) {
		// Setup the infowindow separately so that the user can open multiple infowindows at the same time.
		var largeInfowindow = new google.maps.InfoWindow();
		var marker = new google.maps.Marker({
			position: markerObj.location,
			map: null,	// Hide the marker first. Will show ALL of markers and fit them to the bound later.
			title: markerObj.title,
			animation: google.maps.Animation.DROP,
			id: markerObj.id,
			opacity: 0.7
		});
		marker.addListener('click', function () {
			populateInfoWindow(this, largeInfowindow);
		});
		marker.addListener('mouseover', function() {
			this.setOptions({'opacity': 1});
		});
		marker.addListener('mouseout', function() {
			this.setOptions({'opacity': 0.6});
		});
		
		// Store the marker objects into global gMarkers to be used globally
		gMarkers.push(marker);
	});
	// Show ALL the initial markers
	showListings(locations);
}

/**
* @description Create and populate infoWindows for markers
* @param {Google marker object} marker: a Google marker object that need to be populate a infoWindow on
* @param {Google infowindow object} infowindow: a Google infowindow object that will be applied to the marker
*/
function populateInfoWindow(marker, infowindow) {
	'use strict';
	// Check to make sure the infowindow is not already opened on this marker.
	// If it is not opened, open it; otherwise, close it.
	if (infowindow.marker !== marker) {
		marker.setAnimation(google.maps.Animation.BOUNCE);
		window.setTimeout(function () {
			marker.setAnimation(null);
		}, 750);
		
		// Get the location coordinate and feed it to FourSquare API.
		var lat = marker.position.lat();
		var lng = marker.position.lng();
		$.ajax({
			url: 'https://api.foursquare.com/v2/venues/search?' +
				'll=' + lat + ',' + lng +
				'&client_id=' + FOUR_SQUARE_CLIENT_ID +
				'&client_secret=' + FOUR_SQUARE_CLIENT_SECRET +
				'&v=20180810'
		})
			.done(function (data) {
				var count = 0;
				var venueNames = '<span>Places to go</span>';
				for (var i = 0; i < data.response.venues.length; i++) {
					if (count++ >= 5) { break; }	// List only 5 places in the infoWindow.
					venueNames += '<li>' + data.response.venues[i].name + '</li>';
				}
				var content = '';
				content += '<div class="info-window">' +
					'<header>' + marker.title + '</header>' +
					'<section>' + venueNames + '</section>' +
					'<footer>Powered by Foursquare.com</footer>' +
					'</div>';
				infowindow.setContent(content);
			})
			.fail(function () {
				var content = '';
				content += '<div class="info-window">' +
					'<header>' + marker.title + '</header>' +
					'<section>Oops... Something wrong happened.<br>Please check the internet connection and try again.</section>' +
					'<footer></footer>' +
					'</div>';
				infowindow.setContent(content);
			});
			// Open the infowindow on the correct marker.
		infowindow.marker = marker;
		// Make sure the marker property is cleared if the infowindow is closed.
		infowindow.addListener('closeclick', function () {
			infowindow.marker = null;
		});
		infowindow.open(map, marker);
	} else {
		infowindow.marker = null;
		infowindow.close();
	}
}

