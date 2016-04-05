
jQuery(function(){
	$("#headerDiv").load("employerHeader.html");
	$("#footerDiv").load("footer.html").hide();
});
$(document).ready(function(){
	
	$(window).resize();
	//$('textarea').cleditor({  width: 670, height: 175, controls:  "bold italic underline strikethrough subscript superscript | font size style | color highlight removeformat | bullets numbering | outdent indent | alignleft center alignright justify" });
	//cleditor for aboiut this job
	var about_this_job = $('#about-this-job').cleditor({  width: 670, height: 175, controls:  "bold italic underline strikethrough subscript superscript | font size style | color highlight removeformat | bullets numbering | outdent indent | alignleft center alignright justify" })[0];
	$(about_this_job.$frame[0]).attr('id',"aboutjob");
	var about_job_frame = $('#aboutjob')[0].contentWindow.document;
	
	//cleditor for requirements
	var requirements = $('#requirements').cleditor({  width: 670, height: 175, controls:  "bold italic underline strikethrough subscript superscript | font size style | color highlight removeformat | bullets numbering | outdent indent | alignleft center alignright justify" })[0];
	$(requirements.$frame[0]).attr('id',"iframe_requirements");
	var requirements_frame = $('#iframe_requirements')[0].contentWindow.document;
	
	//cleditor for responsibilities
	var responsibilities = $('#responsibilities').cleditor({  width: 670, height: 175, controls:  "bold italic underline strikethrough subscript superscript | font size style | color highlight removeformat | bullets numbering | outdent indent | alignleft center alignright justify" })[0];
	$(responsibilities.$frame[0]).attr('id',"iframe_responsibilities");
	var responsibilities_frame = $('#iframe_responsibilities')[0].contentWindow.document;
	
	$('input').val("");
	$('#skills').html("")
	$(about_job_frame).find('body').html("");
	$(requirements_frame).find('body').html("");
	$(responsibilities_frame).find('body').html("");
	
	$('.about').click(function(){
		$('#footerDiv').css({'position':'fixed','bottom':'0','z-index':'9999','width':'100%'}).toggle();
		var close_button = "<div class='close_footer'><img src='images/popup-closeButton.png'></div>";
		$('#footerDiv').append(close_button);
		$('.back-to-top').css({'z-index':'10000'});
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
	$('.back-to-top').click(function(event) {
        event.preventDefault();
        jQuery('html, body').animate({scrollTop: 0}, duration);
        return false;
    });
	
	$('#loadJobs').click( function(){
		if($('#overlay').css('opacity') == "1")
		{	
			//alert("hi");
			getMoreJobs();
		}
	});
	
	//get all the skill from by making the ajax call
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
	//alert(JSON.stringify(skills_set));
	function addOpacityForFixedDivs(op){
		
		if ( navigator.userAgent.toLowerCase().indexOf("ie") > -1){
			//$('.job-extra-details').css('opacity', op);
			$('.back-to-top ').css('opacity',op);
			$('.about').css('opacity',op);
			$('#footerDiv').css('opacity',op);
			
		}
	}
	$('#tabs li').click(function(){
		$('#tabs a').removeClass("selectedtab");
		var id = $(this).attr("rel");

		//$('#'+id).show();			
		$(this).find('a').addClass("selectedtab");
		var index = $(this).index();
		
		if(index == 1){
			// if the tab clicked is Engaged Tab than populate the tab with the companies the person is engaged with
			$('#allJobs').hide();
			$('#newJob').show();
			$('#search-query1').css("opacity", "0");
			$('.icon-magnifier1').css("opacity", "0");
			$('#loadJobs').css("opacity", "0");
		}
		if(index == 0){
			// if the tab clicked is Engaged Tab than populate the tab with the companies the person is engaged with
			$('#allJobs').show();
			$('#newJob').hide()
			$('#search-query1').css("opacity", "");
			$('.icon-magnifier1').css("opacity", "");
			$('#loadJobs').css("opacity", "");
			
			
		}
	});
	function showBasicForm(){
		$('.advanced-form').hide();
		$('.basic-form').show();
		$('#advanced').css({"border-bottom":"none", "color":"black"});
		$('#basic').css({"border-bottom":"2px solid #0088CC","color":"#0088CC"});
		//alert("basic");
	}
	function showAdvForm(){
		$('.advanced-form').show();
		$('.basic-form').hide();
		$('#basic').css({"border-bottom":"none","color":"black"});
		$('#advanced').css({"border-bottom":"2px solid #0088CC","color":"#0088CC"});
		//alert("advanced");
	}
	$('#basic').click(function(){
		showBasicForm();
	});
	$('#advanced').click(function(){
		validateBasicform();
	});
	$('.previous').click(function(){
		showBasicForm();
	});
	
	$('.next').click(function() {
		validateBasicform();
	});
	function validateBasicform(){
		//first clear all the errors and red borders
		$('#skill-values').css({"border":"1px solid #cccccc"});
		$('.error').css('visibility','hidden')
		$('.basic-form input').css({"border":"1px solid #CCCCCC"});
		$('#about-this-job').parents('.cleditorMain').css({"border":"1px solid #CCCCCC"});
		$('#requirements').parents('.cleditorMain').css({"border":"1px solid #CCCCCC"});
		$('#responsibilities').parents('.cleditorMain').css({"border":"1px solid #CCCCCC"});
		$('#required-skills-form').css({"border":"none"});
		var emptyTextBoxes = $('.basic-form input:text').filter(function(){
			return this.value == "" && this.id != "required-skills-form" ;
		});
		//alert(JSON.stringify(emptyTextBoxes));
		
		var emptyTextArea = [];
		if($(about_job_frame).text().trim() == "" ){
			emptyTextArea = emptyTextArea.concat("about-this-job");
			
		}
		if($(requirements_frame).text().trim() == ""){
			//alert($('#requirements').text().trim());
			emptyTextArea = emptyTextArea.concat("requirements");
		}
		if($(responsibilities_frame).text().trim() == ""){
			//alert($('#responsibilities').text().trim());
			emptyTextArea = emptyTextArea.concat("responsibilities");
		}
		var skills = false;
		if($('#skills').text() == ""){
			//alert($('#skills').text());
			$('#skill-values').css({"border":"1px solid red"});
			$('#skill-values').parent('.key-value').find('.error').css('visibility','visible');
			 skills = true;
		}
		//alert(JSON.stringify(emptyTextarea));
		emptyTextBoxes.each(function() {
			if(this.id != "required-skills-form") {
				$('#' + this.id).css({"border":"1px solid red"});
				$('#' + this.id).parent('.key-value').find('.error').css('visibility','visible');
			}
		});
		//alert(emptyTextArea);
		for(var i=0; i < emptyTextArea.length; i++) {
			$('#' + emptyTextArea[i]).parents('.cleditorMain').css({"border":"1px solid red"});
			$('#' + emptyTextArea[i]).parents('.text-key-value').find('.error').css('visibility','visible');
		}
		if((emptyTextBoxes.length == 0 || typeof emptyTextBoxes == "undefined") && emptyTextArea.length == 0 && skills == false){
			$('.basic-form input').css({"border":"1px solid #CCCCCC"});
			$('#about-this-job').css({"border":"1px solid #CCCCCC"});
			$('#requirements').css({"border":"1px solid #CCCCCC"});
			$('#responsibilities').css({"border":"1px solid #CCCCCC"});
			$('#required-skills-form').css({"border":"none"});
			showAdvForm();
		}
	}
	$('#submit-adv-form').click(function(){
		//alert('hi')
		$('.error').css('visibility','hidden')
		$('.advanced-form input').css({"border":"1px solid #CCCCCC"});
		var emptyTextBoxes = $('.advanced-form  input:text').filter(function(){
			return this.value == "" && this.id != "required-skills-form" ;
		});
		emptyTextBoxes.each(function() {
			$('#' + this.id).css({"border":"1px solid red"});
			$('#' + this.id).parent('.key-value').find('.error').css('visibility','visible');
		});
		if(emptyTextBoxes.length == 0 || typeof emptyTextBoxes == "undefined") {
			
			//add this job to the list and push this on to backend
			
			var job_title = $('#job-title-form').val();
			var company_name = $('#company-name-form').val();
			var location = $('#location-form').val();
			var employment_type = $('#employment-type').val();
			var salary = $('#salary').val();
			var overtime = $('#overtime').val();
			var benefit = $('#benefit').val();
			var relocation_assistance = $('#relocation-assistance').val();
			var interview_travel_reimb= $('#interview-travel-reimb').val();
			var travel_requirements= $('#travel-requirements').val();
			var visa_candidates= $('#visa-candidates').val();
			var recruitment_fee= $('#recruitment-fee').val();
			var required_skills = added_skills;
			var about_this_job = $(about_job_frame).find('body').html();
			var requirements = $(requirements_frame).find('body').html();
			var responsibilities = $(responsibilities_frame).find('body').html();
			
			
			//save these values on back end and get the first set of jobs and load them
			//alert("job_title " + job_title + "|  company_name " + company_name + "| location"  + location + "| required_skills" + required_skills + "| about_this_job " + about_this_job + "| requirements " + requirements + "| responsibilities" + responsibilities);
			
			/*var htmlString = "";
			var desc = about_this_job.substring(0,300) + "...";
			htmlString = htmlString + "<ul class='jobs'> <div class='job'> <img title='" + company_name + "' src=''/> <div class='company_name_location_jobTitle'> <div class='job_title'>" + .job_title + "</div> <div class='company_name'>" + data.list[i].company_name + "  |  " + data.list[i].location + "</div> </div> <div class='job_description'>" + desc + "</div> </div><a class='show_more'>Show More </a>  <a class='show_less'>Show Less </a> <div class='links'> <a  id='submissions'>0 Submissions</a><a  id='requests'> 0 Requests</a><a  id='engaged'> 0 Engagements</a></div></ul>" 
			$('.allJobsContent').prepend(htmlString);
			*/
			
			//After saving to DB and showing up the new job on the all jobs tab
			showBasicForm();
			$('input').val("");
			$(about_job_frame).find('body').html("");
			$(requirements_frame).find('body').html("");
			$(responsibilities_frame).find('body').html("");
			$('#skills').html("")
			$('.advanced-form input').css({"border":"1px solid #CCCCCC"});
			$('#allJobs').show();
			$('#newJob').hide()
			$('#search-query1').css("opacity", "");
			$('.icon-magnifier1').css("opacity", "");
			$('#loadJobs').css("opacity", "");
			
		}
	});
	$('li.skills').click(function(event) {
        $('ul.tags').hide();
		$('#required-skills-form').val($(this).text());
		var value = $('#required-skills-form').val();
		var present = false;
		var i = added_skills.indexOf(value);
		//alert(i);
		if(i != -1){
			present = true;
		}
		
		if( present == true && value !="" ){
			alert(value + " is already added");
		} 
		else{
			var htmlString =  "";
			htmlString = htmlString + "<span class='tagStyleWithCloseBtn'  id="+ value +">"+ value +"  <a class='closebutton' > </a></span>";
			//alert(htmlString);
			$('#skills').append(htmlString);
			added_skills.push(value);
		} 
		$('#required-skills-form').val("").select();
    });
	
	// add skills when clicked in add button
	$('#add_skill').click( function() {
		$('ul.tags').hide();
		var value = $('#required-skills-form').val().trim();
		var present = false;
		var present = false;
		var i = added_skills.indexOf(value);
		//alert(i);
		if(i != -1){
			present = true;
		}
		
		if( (present == true && value !="") || value == "" ){
			alert("already added / enter text");
		} 
		else{
			var htmlString =  "";
			htmlString = htmlString + "<span class='tagStyleWithCloseBtn'  id="+ value +">"+ value +"  <a class='closebutton' > </a></span>";
			$('#skills').append(htmlString);
			added_skills.push(value);
		} 
		$('#required-skills-form').val("");
	});
	
	$('#required-skills-form').keyup(function(event){
		
		$('ul.tags').show(); //.css('top', top + "px");
		var top = $('.skill-values').position().top + $('.skill-values').height() + 6;
		//alert(top);
		$('ul.tags').css('top', top + "px");
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
		
		
	});
	var job_list = [];
	getMoreJobs();
	function getMoreJobs() {
		$.ajax({
			type: "GET",
			url: "employer-page-posted-jobs.txt",
			dataType: 'json',
			success: function(data)
			{	
				job_list = job_list.concat(data.list);
				//alert(JSON.stringify(job_list));
				var htmlString = "";
				var company_id = data.company_id;
				var job_id = data.job_id;
				var recruiter_id = data.recruiter_id;
				for(var i = 0; i < data.list.length; i++){
					desc =  data.list[i].job_description.substring(0,300) + "...";
					company_id = data.list[i].company_id;
					job_id = data.list[i].job_id;
					recruiter_id = data.list[i].recruiter_id;
					
					
					
					//alert( desc);
					htmlString = htmlString + "<ul class='jobs'> <div class='job'> <img title='" + data.list[i].company_name + "' src=' " + data.list[i].company_logo + "'/> <div class='company_name_location_jobTitle'> <div class='job_title'>" + data.list[i].job_title + "</div> <div class='company_name'>" + data.list[i].company_name + "  |  " + data.list[i].location + "</div> </div> <div class='job_description'>" + desc + "<a class='show_more'>Show More </a> </div> </div><div class='links'> <a  id='submissions'> " + data.list[i].total_submission + " Submissions</a><a  id='requests'> " + data.list[i].total_requests + " Requests</a><a  id='engaged'> " + data.list[i].total_engagements + " Engagements</a></div></ul>" 
					
				}
				
				$('.allJobsContent').append(htmlString);
				$('.job_title').click(function(){
					var index = $(this).parents('ul.jobs').index();
					//alert(index);
					window.open( job_list[index].job_link, "_blank"); 
				});
				
				
				
				//Hide the hover items when you move the mouse off them
				$('.retract_arrow_box').mouseleave(function(){
					$(this).hide();
				});
				$('.engage_arrow_box').mouseleave(function(){
					$(this).hide();
				});
				$('.disengage_arrow_box').mouseleave(function(){
					
					$(this).hide();
				});
				
				
			},
			
			error: function(err) 
			{
				//alert(JSON.stringify(err));
			}
		});
	}

	
	//search for the key in the candidate list and show only those candidtes that match the key
	$('#search-query').keyup(function(){
		if($('#overlay').css('opacity') == "1")
		{
			var filter = $(this).val();
			if($('#overlay').css('opacity') == "1")
			{
				$('ul.jobs').each(function(){
					if($(this).find('.job_title').text().search(new RegExp(filter,"i")) < 0){
						$(this).hide();
						//alert("hi");
					} else {
						$(this).show();
					}
				});
			}
		}
	});
	$('#search-query').click(function(){
		if($('#overlay').css('opacity') == "1")
		{
			$(this).val('');
			
		} else{
			$(this).attr('disabled',"disabled");
		}
	});
	
	// remove the skills when you click on X
	$('body').on("click", ".closebutton", function() {
		//var removeItem = $(this).parent("span").text();
		$(this).parent("span").remove();
		var i = added_skills.indexOf($(this).parent("span").text().trim());
		//alert(i);
		if(i != -1){
			added_skills.splice(i,1);
		}
		//alert(added_skills);
		
	});
	
	
	// show less and show more buttons/ links on click hides and shows the description div
	$('body').on("click", ".show_less", function() {
		if($('#overlay').css('opacity') == "1")
		{
			var index = $(this).parents('ul.jobs').index();
			$(this).hide();
			//alert(index);
			var desc = job_list[index].job_description.substring(0,300) + "...<a class='show_more'>Show More </a> ";
			$('ul.jobs').eq(index).find(".job_description").html(desc);
			$('ul.jobs').eq(index).find(".show_more").show();
		}
	});
	$('body').on("click", ".show_more", function() {
		if($('#overlay').css('opacity') == "1")
		{
			var index = $(this).parents('ul.jobs').index();
			//alert(index + " " + job_list.length );
			$(this).hide();
			$('ul.jobs').eq(index).find(".job_description").html(job_list[index].job_description+ " <a class='show_less'>Show Less </a> ");
			$('ul.jobs').eq(index).find(".job_description").attr("height","auto");
			$('ul.jobs').eq(index).find(".job_description").height();
			$('ul.jobs').eq(index).find(".show_less").show();
		}
	});

});