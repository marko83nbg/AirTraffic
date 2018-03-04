$(document).ready(function(){
    var errorMessage = document.getElementById("message");

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position){
			getAircraftData(position.coords.latitude,position.coords.longitude);
			
		    setInterval(function(){
				getAircraftData(position.coords.latitude,position.coords.longitude);
			}, 60000);
		}, showError);
    };

    function showError(error) {
        switch(error.code) {
            case error.PERMISSION_DENIED:
                errorMessage.innerHTML = "You must allow geolocation to use the app.";
                break;
            case error.POSITION_UNAVAILABLE:
                errorMessage.innerHTML = "Location information is unavailable.";
                break;
            case error.TIMEOUT:
                errorMessage.innerHTML = "The request to get user location timed out.";
                break;
            case error.UNKNOWN_ERROR:
                errorMessage.innerHTML = "An unknown error occurred.";
                break;
        };
    };
});

function getAircraftData(latitude, longitude) {
	$.ajax({
	  url: "https://public-api.adsbexchange.com/VirtualRadar/AircraftList.json?lat=" + latitude + "&lng=" + longitude + "&fDstL=0&fDstU=100",
	  dataType: "jsonp"
	})
	.done(function(data){
		var aircraftList = data.acList;
		
		aircraftList = aircraftList.sort(function(a, b) {
			if (b.Alt) {
				if (a.Alt) {
					return (parseInt(b.Alt) > parseInt(a.Alt)) ? 1 : -1;
                                        
				} else {
					return 1;
				};
				
			} else {
				if (a.Alt) {
					return -1;
				} else {
					return 0;
				}
			};
		});
		$(".table tbody").empty();
		for ( i = 0; i <aircraftList.length; i++ ) {
			const aircraftData = data.acList[i];
			var rowId = "acList" + i;
			$(".table tbody").append("<tr id='" + rowId + "'><td>" + aircraftData.Alt + " ft" + "</td>"+
					 "<td>" + aircraftData.Call  + "</td>"+
					 "<td>" + (aircraftData.Trak < 180 ? "<img src='img/airplane_easting.png'>" : "<img src='img/airplane_westing.png'>") + "</td></tr>");
			
		$("#"+rowId).click(function(event) {
                    localStorage.setItem("aircraft", JSON.stringify(aircraftData)); 
                    location.href="details.html"; 
		});	
		};
	})
	.fail(function(jqXHR){
		$(".conteiner").html(jqXHR.toSource());
	});
}
