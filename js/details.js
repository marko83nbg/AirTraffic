$(document).ready(function(){
    var aircraftJson = localStorage.getItem("aircraft"); 
    var aircraft = JSON.parse(aircraftJson); 
	
    $.ajax({
	url: "https://autocomplete.clearbit.com/v1/companies/suggest?query=" + aircraft.Op,
	dataType: "json"
	})
	.done(function(data){
		var logoSrc = '';
		for ( i = 0 ; i < data.length ; i++){
			var company = data[i];
			if (company.name == aircraft.Op){
                            logoSrc = company.logo;
                            break;
			}
		}
		$(".table tbody").empty();
		
		$(".table tbody").append("<tr><td>" + aircraft.Mdl + "</td>"+
				 "<td>" + aircraft.From+ "</td>"+
				 "<td>" + aircraft.To + "</td>"+
				 "<td><img src='" + logoSrc + "'></td></tr>");
		
		
	})
	.fail(function(jqXHR){
		$(".conteiner").html(jqXHR.toSource());
	});
});


