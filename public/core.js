var healthtrack = angular.module('healthtrack', []);


function mainController($scope, $http, $window, $document) {
    $scope.formData = {};

    $scope.parseJson = function (json) {
    	let parsed = JSON.parse(json);
    	console.log("JSON Parsed: " + parsed);
    	return parsed;
    };

    

    $scope.addMarker = function (name, lat, lon, start, end, hr) {
        if (!name) {
            name = "Unknown";
        }
        
        // Marker values based on HR
        let markerIcon = "";
        $window.L.AwesomeMarkers.Icon.prototype.options.prefix = 'fa';
        // Classify colour based on HR
        switch (true) {
            case (hr < 80):
                markerIcon = L.AwesomeMarkers.icon({
                    icon: 'heart-o',
                    markerColor: 'green'
                  });
                break;
            case (hr >= 80 && hr < 90):
                markerIcon = L.AwesomeMarkers.icon({
                    icon: 'heart',
                    markerColor: 'orange'
                  });
                break;
            case (hr >= 90):
                markerIcon = L.AwesomeMarkers.icon({
                    icon: 'heartbeat',
                    markerColor: 'red'
                  });
                break;
            default:
                markerIcon = L.AwesomeMarkers.icon({
                    icon: 'heart-o',
                    markerColor: 'green'
                  });
                break;
        }   
        // Calculate time spent
        let startTime = moment(start);
        let endTime = moment(end);
        let difference = Math.round(endTime.diff(startTime, 'hours', true)) + " hours";
        // < 1 hour, display minutes
        if (difference < 1) {
            difference = Math.round(endTime.diff(startTime, 'minutes', true)) + " minutes";
        }
        // Last visited
        let timeSince = endTime.fromNow();
        // Create marker     
        $window.L.marker([lat, lon], {
            title : name,
            icon  : markerIcon
        }).bindTooltip('You have a average HR of ' + hr + ' at ' + name + "</br>" + "Last Visited: " + timeSince + "</br>" + "Time spent here: " + difference).addTo($window.placesmap);
        // Focus on latest marker
        $window.placesmap.setView([lat, lon], 13);
    };

    $scope.addGroups = function(groups) {
        for (group in groups) {
            let locationGroup = groups[group];
            let rootLocation = locationGroup[0];
            let groupHeartRate = locationGroup[0].heartRate;
            let groupName = "";
            let mostRecentVisit = {};
            // Loop over group members, generate group name and find most recent visit
            for (var i = 0; i < locationGroup.length; i++) {
                let currentLocation = locationGroup[i];
                // Check if this is the most recent visit so far
                if (angular.equals({}, mostRecentVisit) || mostRecentVisit.end < currentLocation.end) {
                    mostRecentVisit.start = currentLocation.start;
                    mostRecentVisit.end = currentLocation.end;
                }
                // Construct group name (append all different location names)
                if (currentLocation.name) {
                    if (!(groupName.trim() === currentLocation.name.trim())) {
                        if (groupName === "") {
                            groupName += currentLocation.name;
                        } else {
                            groupName += ", " + currentLocation.name;
                        }
                    }
                }
                
            }
            // Generate group zone
            let locationCircle = $window.L.circle([rootLocation.lat, rootLocation.lon], {
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.5,
                radius: 150
            }).bindTooltip('You have visited ' + locationGroup.length + ' locations in this area').addTo($window.placesmap);
            // Generate group HR marker
            $scope.addMarker(groupName, rootLocation.lat, rootLocation.lon, mostRecentVisit.start, mostRecentVisit.end, groupHeartRate);
        }

    } 

    // On controller load get movesPlaces
    $http.get('/databox-app-healthtrack/ui/api/movesPlaces').then(function (success) {
        $scope.movesPlaces = JSON.parse(JSON.stringify(success.data));
    }, function (error) {
        console.log('Error: ' + error);
    });

    // On controller load get markers
    $http.get('/databox-app-healthtrack/ui/api/locationMarkers').then(function (success) {
        console.log('Markers: ' + success);
    }, function (error) {
        console.log('Markers Error: ' + error);
    });

    $scope.downloadGroups = function() {
        // On controller load get groups
        $http.get('/databox-app-healthtrack/ui/api/locationGroups').then(function (success) {
            $scope.locationGroups = JSON.parse(JSON.stringify(success.data));
            $scope.monthlyGroups = $scope.locationGroups.length;
            // TODO Add check here when possible against a feedback store for zones
            $scope.monthlyFeedbackNeeded = $scope.locationGroups.length;
            $scope.addGroups($scope.locationGroups);
        }, function (error) {
            console.log('Groups Error: ' + error);
        });
    };

    $document.ready(function() {
        $scope.downloadGroups();
    });

}



healthtrack.controller("mainController",mainController);

