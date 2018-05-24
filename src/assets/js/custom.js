$(document).ready(function(){
	$(".mobile-nav").click(function(){
		$(".navigation").slideToggle(500);
	});

	$(".mobile-filter-list i").click(function(){
		$(".filter-list").slideToggle(500);
	});

	$(".mobile-search i").click(function(){
		$(".search-input").slideToggle(500);
	});

	$(".fan").click(function(){
		var flag = $(this).find("i").hasClass("fa-heart")
		// console.log(flag)

		if(flag === true){
			$(this).find("i").removeClass("fa-heart")
			$(this).find("i").addClass("fa-heart-o")
		}
		else{
			$(this).find("i").removeClass("fa-heart-o")
			$(this).find("i").addClass("fa-heart")
		}
	});

	jQuery(".finalist-carousel").owlCarousel({
	    loop:true,
	    margin:0,
	    responsiveClass:false,
	    nav:false,
	    items:4,
	    responsive:{
	        0:{
	            items:1,
	            nav:true
	        },
	        580:{
	            items:3,
	            nav:true
	        },
	        1000:{
	            items:4,
	            nav:true,
	        }
    	}
	});
	jQuery(".news-carousel").owlCarousel({
	    loop:true,
	    margin:0,
	    responsiveClass:false,
	    nav:false,
	    items:1,
	    responsive:{
	        0:{
	            items:1,
	            nav:true
	        },
	        580:{
	            items:1,
	            nav:true
	        },
	        1000:{
	            items:1,
	            nav:true,
	        }
    	}
	});

	
      
    jQuery(".terms_condition_block").mCustomScrollbar({
    	theme:"dark-3"
    });
    jQuery(".highlights-wrap").mCustomScrollbar({
    	theme:"dark-3"
    });
    jQuery(".transaction-table").mCustomScrollbar({
    	theme:"dark-3"
    });
        
   

	//register forms
	$(".artist a").click(function(){
		$(".for-artist .step1").addClass("next_form")
		$(this).closest(".main-step").addClass("previous_form")
		$(this).closest(".main-step").removeClass("next_form")
	})
	$(".listner a").click(function(){
		$(".for-listner .step1").addClass("next_form")
		$(this).closest(".main-step").addClass("previous_form")
		$(this).closest(".main-step").removeClass("next_form")
	})

	
	
	$(".next-btn").click(function(){
		$(this).closest(".steps").removeClass("next_form")
		$(this).closest(".steps").next().addClass("next_form")

		
	});
	$(".back-btn").click(function(){
		$(".steps").addClass("previous_form")
		$(this).closest(".steps").prev().addClass("next_form")
		$(this).closest(".steps").removeClass("next_form")

	});

	$(".filter-head a").click(function() {
		$(".filter-drop-down").slideToggle(400)
	});


	var showChar = 200;
	var ellipsestext = "...";
	var moretext = "more...";
	var lesstext = "less";
	$('.profile-description p').each(function() {
		var content = $(this).html();

		if(content.length > showChar) {

			var c = content.substr(0, showChar);
			var h = content.substr(showChar-1, content.length - showChar);

			var html = c + '<span class="moreelipses">'+ellipsestext+'</span>&nbsp;<span class="morecontent"><span>' + h + '</span>&nbsp;&nbsp;<a href="" class="more-link">'+moretext+'</a></span>';

			$(this).html(html);
		}

	});

	$(".more-link").click(function(){
		if($(this).hasClass("less")) {
			$(this).removeClass("less");
			$(this).html(moretext);
		} else {
			$(this).addClass("less");
			$(this).html(lesstext);
		}
		$(this).parent().prev().toggle();
		$(this).prev().toggle();
		return false;
	});

	$(".pwd-icon").click(function(){

		$(this).find(".fa").toggleClass("fa-eye-slash")
		//$(this).find(".fa-eye-slash").addClass("open")
		if($(this).find(".fa").hasClass("fa-eye-slash")){
			$(this).prev().attr('type', 'text')
		}
		else{
			$(this).prev().attr('type', 'password')
		}
	})
});