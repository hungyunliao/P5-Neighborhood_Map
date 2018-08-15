# Neighborhood Map | Taipei Metro System (Taipei MRT)
This is a Single-Page Application that lets people search/filter Taipei Metro stations (currently Tamsui line 淡水線) and get five interesting places to go nearby the station. This SPA uses KnockoutJS as the MVVM library and is powered by Google Maps, Foursquare and Bootstrap.

Visit the webiste (Heroku) at [https://taipeimetrofun.herokuapp.com/](https://taipeimetrofun.herokuapp.com/)

## Application Features
Clean UI with a menu section that users can search/filter the stations by name
<img src="img/UI.png" width="800px"/>

Info windows and nearby places information
<img src="img/click_marker.png" width="800px"/>

Responsive design for mobile phones (iPhone X)<br>
<img src="img/mobile_menu.png" width="300px" height="500"/>&emsp;<img src="img/mobile.png" width="300px" height="500"/>

Real-time filtering the stations by name and resizing the map to fit the boundary
<img src="gif/filter_list.gif" width="800px"/>

Showing info windows when users click on the list or the markers
<img src="gif/click_marker.gif" width="800px"/>

## Usage
1. Git clone or fork this repo.

2. In the `index.html` file, replace `GOOGLE_MAP_API_KEY` with your Google Maps API key.
```html
<script async defer src="https://maps.googleapis.com/maps/api/js?key=GOOGLE_MAP_API_KEY&callback=initMap"></script>
```

3. In the `js/app.js` file, replace `CLIENT_ID` and `CLIENT_SECRET` with your Foursquare Client ID and Client Secret respectively.
```javascript
const FOUR_SQUARE_CLIENT_ID = 'CLIENT_ID';
const FOUR_SQUARE_CLIENT_SECRET = 'CLIENT_SECRET';
```

4. Open/Run `index.html` in your browser.

## Skills
1. KnockoutJS MVVM library
2. Google Maps: Markers, InfoWindows, Boundary and Styles
3. Mobile first, Responsive Web Design
4. jQuery Ajax and error handling
5. Site performance optimization
6. Bootstrap CSS
