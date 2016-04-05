jQuery(function(){
	$("#headerDiv").load("employerHeader.html");
	$("#footerDiv").load("footer.html").hide();
});
$(document).ready(function(){
	$('#required-skills').val("");
	$('.error').css('visibility','hidden');
	$(window).resize(function(){ 
		if($(this).height() < 700)
		{
			$(".job-title-location-date-edit-popUp").height($(window).height() - 300);
			$(".job-extra-details-edit-popUp").height($(window).height() - 200);
			$(".about-this-job-edit-popUp").height($(window).height() - 200);
			$(".responsiblities-edit-popUp").height($(window).height() - 200);
			$(".requirements-edit-popUp").height($(window).height() - 200);
			$(".required-skills-edit-popUp").height($(window).height() - 200);
			
		}
		var pos = $(this).height() < 450 ? 'absolute': 'fixed';
		$('.job-extra-details').css({position:pos});
	});
	$(window).resize();
	$('.textarea').attr("value","").focus();
	var skills_set = []
	var added_skills = [];
	$.ajax({
		type: "GET",
		url: "skillsData.txt",
		dataType: 'json',
		async: false,
		success: function(data)
		{
			//alert(JSON.stringify(data));
			for(var i=0;i< data.length;i++){
				skills_set.push(data[i].skill);
			}
			
			var htmlString= "";
			for(var i=0;i < skills_set.length; i++){
				htmlString=  htmlString + "<li class='skills'>" + skills_set[i] + "</li>"
			}
			$('ul.tags').html(htmlString);
		}
	});
	$.ajax({
		type: "GET",
		url: "employer-page-job-details.txt",
		dataType: 'json',
		success: function(data)
		{	
			var company_id = data.company_id;
			var job_id = data.job_id;
			var recruiter_id = data.recruiter_id;
			//alert( "company_id: " + company_id + "  job_id:" + job_id + " recruiter_id:" + recruiter_id);
			$('.company_logo img').attr('src',data.company_logo);
			$('.company_logo img').attr('alt',data.company_name);
			$('.job-title').text(data.job_title);
			$('.job-location').text(data.company_name + " | " + data.location);
			$('.job-date').text(data.date);
			$('.about-this-job p').html(data.job_description);
			$('.responsiblities p').html(data.responsiblities);
			$('.requirements p').html(data.requirements);
			$('.employment-type p').html(data.employment_type);
			$('.salary p').html(data.salary);
			$('.benefit p').html(data.benefit);
			$('.overtime p').html(data.overtime);
			$('.relocation-assistance p').html(data.relocation_assistance);
			$('.visa-candidates p').html(data.visa_candidates);
			$('.recruitment-fee p').html(data.recruitment_fee);
			$('.travel-requirements p').html(data.travel_requirements);
			$('.interview-travel-reimbursement p').html(data.interview_travel_reimbursement);
			$('#engagements').text(data.total_engagements + " Engagements");
			$('#submissions').text(data.total_submission + " Submissions");
			$('#requests').text(data.total_requests+ " Requests");
			$('.date p').html(data.date);
			
			$('#job-title-form').val(data.job_title);
			$('#company-name-form').val(data.company_name);
			$('#location-form').val(data.location);
			$('#employment-type-form').val(data.employment_type);
			$('#salary-form').val(data.salary);
			$('#overtime-form').val(data.overtime);
			$('#relocation-assistance-form').val(data.relocation_assistance);
			$('#benefit-form').val(data.benefit);
			$('#interview-travel-reimb-form').val(data.interview_travel_reimbursement);
			$('#travel-requirements-form').val(data.travel_requirements);
			$('#visa-candidates-form').val(data.visa_candidates);
			$('#recruitment-fee-form').val(data.recruitment_fee);
			
			$('textarea').cleditor({  width: 650, height: 285,  controls:  "bold italic underline strikethrough subscript superscript | font size " + "style | color highlight removeformat | bullets numbering | outdent " + "indent | alignleft center alignright justify" });
			$('#about-this-job').val(data.job_description);
			$('#about-this-job').cleditor()[0].updateFrame();
			
			
			$('#responsiblities').val(data.responsiblities);
			$('#responsiblities').cleditor()[0].updateFrame();
			
			$('#requirements').val(data.requirements);
			$('#requirements').cleditor()[0].updateFrame();
			var tags = data.tags.split(",");
			var htmlString= ""
			for(var i =0 ; i< tags.length; i++){
				htmlString = htmlString + "<span class='tagStyle'>" + tags[i] + " </span>"
			}
			$('.tag_list p').html(htmlString);
			
			
			var skills = data.required_skills.split(",");
			htmlString= "<div class='tags'>";
			for(var i =0 ; i< skills.length; i++){
				htmlString = htmlString + "<span class='tagStyle'>" + skills[i] + " </span>"
			}
			htmlString = htmlString + "</div>"
			$('.required-skills p').html(htmlString);
			
			htmlString= "<div  class='tags_list'>";
			for(var i =0 ; i< skills.length; i++){
				htmlString = htmlString + "<span class='tagStyleWithCloseBtn'  id="+ skills[i] +">"+ skills[i] +"  <a class='closebutton' > </a></span>";
				added_skills.push(skills[i].trim());
			}
			htmlString = htmlString + "</div>"
			$('.added-tags').html(htmlString);
			
			
			$('.skills').click(function(event) {
				$('ul.tags').hide();
				$('#required-skills').val($(this).text());
				
			});
			
			
		}
	});
	// add skills when clicked in add button
	$('#add_skill').click( function() {
		$('ul.tags').hide();
		var value = $('#required-skills').val().trim();
		var present = false;
		var present = false;
		var i = added_skills.indexOf(value);
		//alert(i);
		if(i != -1){
			present = true;
		}
		
		if( (present == true && value !="") || value == "" ){
			$('.error').css('visibility','visible');
		} 
		else{
			var htmlString =  "";
			htmlString = htmlString + "<span class='tagStyleWithCloseBtn'  id="+ value +">"+ value +"  <a class='closebutton' > </a></span>";
			$('.tags_list').append(htmlString);
			added_skills.push(value);
		} 
		$('#required-skills').val("");
	});
	//upadte the Ui when you edit in the pop up and push it to the back end
	$('#submit-job-title-location-date-form').click(function(){
		var job_title = $('#job-title-form').val()
		var company_name = $('#company-name-form').val()
		var location =  $('#location-form').val()
		//update the new title, name and location on UI and push it to the back end
		$('.job-title').text(job_title);
		$('.job-location').text(company_name + " | " + location);
		
		$('.job-title-location-date-edit-popUp').hide();
		addOpacityForFixedDivs("");
		$('#overlay').css({"opacity":"","pointer-events":""});
		
	});
	
	$('#job-extra-details-form').click(function(){
		var employment_type =  $('#employment-type-form').val();
		var salary = $('#salary-form').val();
		var overtime = $('#overtime-form').val();
		var benefit = $('#benefit-form').val();
		var interview_travel_reimbursement = $('#interview-travel-reimb-form').val();
		var travel_requirements = $('#travel-requirements-form').val();
		var visa_candidates = $('#visa-candidates-form').val();
		var recruitment_fee = $('#recruitment-fee-form').val();
		var relocation_assistance = $('#relocation-assistance-form').val();
		
		//update the Job extra details on UI and push it to the back end
		$('.employment-type p').text(employment_type);
		$('.salary p').text(salary);
		$('.overtime p').text(overtime);
		$('.benefit p').text(benefit);
		$('.relocation-assistance p').text(relocation_assistance);
		$('.interview-travel-reimbursement p').text(interview_travel_reimbursement);
		$('.travel-requirements p').text(travel_requirements);
		$('.visa-candidates p').text(visa_candidates);
		$('.recruitment-fee p').text(recruitment_fee);
		
		$('.job-extra-details-edit-popUp').hide();
		addOpacityForFixedDivs("");
		$('#overlay').css({"opacity":"","pointer-events":""});
	});
	$('#about-this-job-form').click(function(){
		var about_this_job = $('#about-this-job').val();
		
		//update the ABOUT-THIS-JOB on UI and push it to the back end
		$('.about-this-job p').html(about_this_job);
		// ajax call to update about-this-job
		
		
		$('.about-this-job-edit-popUp').hide();
		addOpacityForFixedDivs("");
		$('#overlay').css({"opacity":"","pointer-events":""});
	});
	
	$('#responsiblities-form').click(function(){
		var responsiblities = $('#responsiblities').val();
		
		//update the ABOUT-THIS-JOB on UI and push it to the back end
		$('.responsiblities p').html(responsiblities);
		// ajax call to update about-this-job
		
		
		$('.responsiblities-edit-popUp').hide();
		addOpacityForFixedDivs("");
		$('#overlay').css({"opacity":"","pointer-events":""});
	});
	$('#requirements-form').click(function(){
		var requirements = $('#requirements').val();
		
		//update the ABOUT-THIS-JOB on UI and push it to the back end
		$('.requirements p').html(requirements);
		// ajax call to update about-this-job
		
		
		$('.requirements-edit-popUp').hide();
		addOpacityForFixedDivs("");
		$('#overlay').css({"opacity":"","pointer-events":""});
	});
	$('#required-skills-form').click(function() {
		var required_skills = added_skills;
		$('.error').css('visibility','hidden');
		//update the ABOUT-THIS-JOB on UI and push it to the back end
		var htmlString =  "";
		for(var i=0;i < added_skills.length; i++){
			htmlString = htmlString + "<span class='tagStyle'>"+ added_skills[i] +"</span>";
		}
		//alert(added_skills);
		$('.required-skills p .tags').html(htmlString);
		// ajax call to update about-this-job
		
		
		$('.required-skills-edit-popUp').hide();
		addOpacityForFixedDivs("");
		$('#overlay').css({"opacity":"","pointer-events":""});
		$('#required-skills').val('');
	});
	
	//Clicking on about shows/hides footer
	$('.about').click(function(){
		if($('#overlay').css('opacity') == "1")
		{
			$('#footerDiv').css({'position':'fixed','bottom':'0','z-index':'9999','width':'100%'}).toggle();
			var close_button = "<div class='close_footer'><img src='images/popup-closeButton.png'></div>";
			$('#footerDiv').append(close_button);
			$('.back-to-top').css({'z-index':'10000'});
		}
	});
	
	//hides footer
	$('.close_footer > img').live('click',function(){
		$('#footerDiv').css({'display':'none'});
	});
	// Back to top 
	var offset = 220;
    var duration = 500;
    $(window).scroll(function() {
        if (jQuery(this).scrollTop() > offset) {
            jQuery('.back-to-top').fadeIn(duration);
        } else {
            jQuery('.back-to-top').fadeOut(duration);
        }
    });
	function addOpacityForFixedDivs(op){
		
		if ( navigator.userAgent.toLowerCase().indexOf("ie") > -1){
			$('.job-extra-details').css('opacity', op);
			$('.back-to-top ').css('opacity',op);
			$('.about').css('opacity',op);
			$('#footerDiv').css('opacity',op);
		
		}
	
	
	}
	// open the popup when you click on edit buttons
	$('#job-title-location-date').click(function(){
		if($('#overlay').css('opacity') == "1")
		{
			$('.job-title-location-date-edit-popUp').show();
			addOpacityForFixedDivs("0.3");
			$('#overlay').css({"opacity":"0.3","pointer-events":"none"});
		}
		
	});
	$('#job-extra-details').click(function(){
		if($('#overlay').css('opacity') == "1")
		{
			$('.job-extra-details-edit-popUp').show();
			addOpacityForFixedDivs("0.3");
			$('#overlay').css({"opacity":"0.3","pointer-events":"none"});
		}
	});
	$('#about-this-job-edit').click(function(){
		if($('#overlay').css('opacity') == "1")
		{
			$('.about-this-job-edit-popUp').show();
			addOpacityForFixedDivs("0.3");
			$('#overlay').css({"opacity":"0.3","pointer-events":"none"});
		}
	});
	$('#responsiblities-edit').click(function(){
		if($('#overlay').css('opacity') == "1")
		{
			$('.responsiblities-edit-popUp').show();
			addOpacityForFixedDivs("0.3");
			$('#overlay').css({"opacity":"0.3","pointer-events":"none"})
		}
	});requirements
	$('#requirements-edit').click(function(){
		if($('#overlay').css('opacity') == "1")
		{
			$('.requirements-edit-popUp').show();
			addOpacityForFixedDivs("0.3");
			$('#overlay').css({"opacity":"0.3","pointer-events":"none"});
		}
	});
	$('#required-skills-edit').click(function() {
		if($('#overlay').css('opacity') == "1")
		{
			$('.error').css('visibility','hidden');
			$('.required-skills-edit-popUp').show();
			addOpacityForFixedDivs("0.3");
			$('#overlay').css({"opacity":"0.3","pointer-events":"none"});
		}
	});
	
	// close the popups when clicked on X or on cancel link
	$('#closePopup1 > img').click(function(){
		closePopup1();
	});
	$('.cancel-job-title-location').click(function(){
		closePopup1();
	});
	function closePopup1(){
		$('.job-title-location-date-edit-popUp').hide();
		addOpacityForFixedDivs("");
		$('#overlay').css({"opacity":"","pointer-events":""});
	}
	$('#closePopup2 > img').click(function(){
		closePopup2();
	});
	$('.cancel-job-extra-details').click(function(){
		closePopup2();
	});
	function closePopup2(){
		$('.job-extra-details-edit-popUp').hide();
		addOpacityForFixedDivs("");
		$('#overlay').css({"opacity":"","pointer-events":""});
	}
	$('#closePopup3 > img').click(function(){
		closePopup3();
	});
	$('.cancel-about-this-job').click(function(){
		closePopup3();
	});
	function closePopup3(){
		$('.about-this-job-edit-popUp').hide();
		addOpacityForFixedDivs("");
		$('#overlay').css({"opacity":"","pointer-events":""});
	}
	$('#closePopup4 > img').click(function(){
		closePopup4();
	});
	$('.cancel-responsiblities').click(function(){
		closePopup4();
	});
	function closePopup4(){
		$('.responsiblities-edit-popUp').hide();
		addOpacityForFixedDivs("");
		$('#overlay').css({"opacity":"","pointer-events":""});
	}
	$('#closePopup5 > img').click(function(){
		closePopup5();
	});
	$(' .cancel-requirements').click(function(){
		closePopup5();
	});
	function closePopup5(){
		$('.requirements-edit-popUp').hide();
		addOpacityForFixedDivs("");
		$('#overlay').css({"opacity":"","pointer-events":""});
	}
	$('#closePopup6 > img').click(function(){
		closePopup6();
	});
	$(' .cancel-required-skills').click(function(){
		closePopup6();
	});
	function closePopup6(){
		$('.required-skills-edit-popUp').hide();
		addOpacityForFixedDivs("");
		$('#overlay').css({"opacity":"","pointer-events":""});
		$('#required-skills').val("");
		$('.error').css('visibility','hidden');
	}
	
	//show and hide the edit buttons for the job details
	$('#job-details-edit').click(function() {
		$(this).hide();
		$('#job-details-done').show();
		$('#about-this-job-edit').show();
		$('#responsiblities-edit').show();
		$('#requirements-edit').show();
		$('#required-skills-edit').show();

	});
	$('#job-details-done').click(function() {
		$(this).hide();
		$('#job-details-edit').show();
		$('#about-this-job-edit').hide();
		$('#responsiblities-edit').hide();
		$('#requirements-edit').hide();
		$('#requirements-edit').hide();
		$('#required-skills-edit').hide();

	});
	
	$('#about-this-job-form').click(function(){
		//var about_this_job =  $('#employment-type-form').val();
		//$('#about-this-job').val() = 
	});	
	
    $('.back-to-top').click(function(event) {
        event.preventDefault();
        jQuery('html, body').animate({scrollTop: 0}, duration);
        return false;
    });
	
	
	$('ul.tags').click(function(event) {
        event.stopPropagation();
        return false;
    });
	$('#required-skills').keyup(function(event){
		$('.error').css('visibility','hidden');
		$('ul.tags').show();
		var filter = $(this).val();
		$('.skills').each(function(){
			if($(this).text().search(new RegExp(filter,"i")) < 0){
				$(this).hide();
				//alert(filter);
			} else {
				$(this).show();
			}
		});
		if($('.skills').size() == $('.skills:hidden').size()) {
			$('ul.tags').hide();
			//alert($('.skills').size() == $('.skills:hidden').size());
		}

		$('#required-skills').val() ="";
	});
	
	$('body').on("click", ".closebutton", function() {
		//var removeItem = $(this).parent("span").text();
		$(this).parent("span").remove();
		var i = added_skills.indexOf($(this).parent("span").text().trim());
		//alert(i);
		if(i != -1){
			added_skills.splice(i,1);
		}
		
	});

});