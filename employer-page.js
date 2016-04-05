$(document).ready(function(){
	var $container = $('#container'),$items = $('.item');		
	$container.isotope({
		itemSelector: '.item',
		masonry: {
			columnWidth: 52
		},				
		getSortData : {
			selected : function( $item ){			
			return ($item.hasClass('selected') ? -1000 : 0 ) + $item.index();				
			}
		}, 
		sortBy : 'selected'					
	});
		/*$(".resumeContainer,.filterSidebar ul:not(#filterTags)").mCustomScrollbar({theme:'dark',autoHideScrollbar: true,advanced:{
		updateOnContentResize: true },autoDraggerLength:true});*/
		
		
	//***** When user clicks on "View" button on the hover card *****
	$('.emp-image-over,.toolButton img').click(function(){	
		var $previousSelected = $('.selected'); 				
		if ( $(this).closest('.item').hasClass('selected') ) { 			
		}
		else{						
			$previousSelected.removeClass('selected');
			$previousSelected.children('.emp-collapse').show();
			$previousSelected.children('.expand').hide();
			if($previousSelected.attr('id')=="emp-item5"){
				$($previousSelected).closest('.item').css('width','');
				$('#container').css('width','');
				$('#emp-item5').css('margin-top','');				
			}
			$(this).closest('.item').addClass('selected');
			if ($(this).closest('.item').attr('id')=='emp-item5') {
				$(this).closest('.item.selected').css('width','1000px');
				$('#container').css('width','1100px');				
			}
			
			$(this).closest('.item').children('.emp-collapse').hide();
			$(this).closest('.item').children('.expand').show();
		}				
		$container.isotope('relayout');		
		$container
		  .isotope( 'updateSortData', $(this).closest('.item') )
		  .isotope( 'updateSortData', $previousSelected )				  
		  .isotope();				  		
		$('body,html').animate({ scrollTop: 0},5);
		if ($(this).closest('.item').attr('id')=='emp-item5'){
			$('#submittedResumeList').empty();			
			switch_outertabs($('.defaulttab'));						
		}
	});	
		
		
	//***** When user clicks on "Done EDit" button on expanded tab*****
	$('.doneedit').click(function(){
		var $previousSelected = $('.selected'); //For switching with older one
		if ($(this).closest('.item').hasClass('selected')) { 
			$(this).closest('.item').removeClass('selected');
			$(this).closest('.item').children('.emp-collapse').show();
			$(this).closest('.item').children('.expand').hide();
			if ($(this).closest('.item').attr('id')=='emp-item5'){
				$(this).closest('.item').css('width','');
				$('#container').css('width','');
				$('#emp-item5').css('margin-top','');
				$('.emp-collapse').show();
				$('#emp-item5').css({'transform':'','margin-top':''});
			}							
		}
		$container.isotope('reLayout');
		$container
		  .isotope( 'updateSortData', $(this).closest('.item') )
		  .isotope( 'updateSortData', $previousSelected )
		  .isotope();			  		
		$('body,html').animate({ scrollTop: 0},5); 				
	});
	
	
	//*****When user clicks on outer tabs, display corresponding resume list*****
	function switch_outertabs(obj)
	{
		$('.emp-tab-content').hide();
		//Deselect current tab
		$('#outertabs a').removeClass("selectedtab");
		var id = obj.attr("rel");		
		$('#'+id).show();
		//Add selected tab class to user selected tab		
		obj.addClass("selectedtab");
		//Empty container and load new resumes
		if(id.toLowerCase() == "reviewedrestab"){
			$('#reviewedResumeList').empty();
			loadSubmittedResumes('reviewedResumeList');			
		}
		else if(id.toLowerCase() == "selectedrestab"){
			$('#selectedResumeList').empty();
			loadSubmittedResumes('selectedResumeList');			
		}
		else if(id.toLowerCase() == "submittedrestab"){
			$('#submittedResumeList').empty();
			loadSubmittedResumes('submittedResumeList');			
		}
		else if(id.toLowerCase() == "rejectedrestab"){
			$('#rejectedResumeList').empty();
			loadSubmittedResumes('rejectedResumeList');			
		}
		else if(id.toLowerCase() == "withdrawntab"){
			$('#withdrawnResumeList').empty();
			loadSubmittedResumes('withdrawnResumeList');			
		}
		else if(id.toLowerCase() == "interviewedtab"){
			$('#interviewedResumeList').empty();
			loadSubmittedResumes('interviewedResumeList');			
		}
		else if(id.toLowerCase() == "resulttab"){
			$('#resultResumeList').empty();
			loadSubmittedResumes('resultResumeList');			
		}				
	}
	
	
	//***** Loads list of resumes obtained by making ajax call*****
	var ulId = "";
	function loadSubmittedResumes(id){
		//Make search, pagination visible
		$('.resumeContainer').css('display','none');
		$('#'+id+',.navigator,.vline,.pagerText').css('display','block');	
		
		var resumeCtr=0;
		$.ajax({
			type:"GET",
			url:"submittedResumeData.xml",
			datatype:"xml",			
			success:function(xml){
				$(xml).find('resume').each(function(){
					var name = $(this).find('name').text().trim();
					var title = $(this).find('title').text().trim();
					var company = $(this).find('company').text().trim();
					var imageUrl = $(this).find('imageurl').text().trim();
					var desc = $(this).find('description').text().trim();
					var tags = $(this).find('tags').text().trim();
					var clientName = $(this).find('clientName').text().trim();
					var postName = $(this).find('postName').text().trim();
					var totalPages = parseInt($(this).parent().children().length)%12;					
					var tagArray = new Array();
					tagArray = tags.split(",");
					var createList = "";
					for (item in tagArray){
						createList += '<li><a href="">'+tagArray[item].trim()+'</a></li>';						
					}
					var resultHtml="";
					resultHtml = '<li>'+
									'<div class="profileBox">'+
										'<div id="imageHolder">'+
											'<img src="'+imageUrl+'">'+
										'</div>'+
										'<div id="detailsHolder">'+
											'<div class="candidateName">'+name+'</div>'+
											'<div class="candidateTitle">'+title+'</div>'+
											'<div class="candidateCompany">'+company+'</div>'+
											'<ul class="candidateTagList">'+createList+'</ul>'+
											'<div class="candidateDesc">'+desc+'</div>'+
											'<div class="clientName">'+clientName+'</div>'+												
											'<div class="postName">'+postName+'</div>'+
										'</div>'+
									'</div>'+
								'</li>';					
					$('#'+id).append(resultHtml);					
					$container.isotope('reLayout');

					//Display hover card when user hovers over name, profile picture
					$('#imageHolder img,.candidateName').hover(function(e){
						e.preventDefault();							
						//Display Tooltip, dynamically populate values
						var name = $(this).closest('li').find('.candidateName').html();
						var title = $(this).closest('li').find('.candidateTitle').html();
						var company = $(this).closest('li').find('.candidateCompany').html();
						var source = $(this).closest('li').find('#imageHolder img').attr('src');
						var desc = $(this).closest('li').find('.candidateDesc').html();
						var clientName = $(this).closest('li').find('.clientName').html();
						var postName = $(this).closest('li').find('.postName').html();
						ulId = $(this).closest('ul').attr('id');
						//Limit length of description to 140 characters. if more, add ellipsis
						if((desc.length)>140){
							desc = desc.substring(0,140)+"...";
						}
						//Seperate title and company with "|" symbol
						var header="";
						var tags = [];
						var tagHtml="";
						if(title && company)
							header = title +" | "+ company;
						else if(title)
							header = title;
						else if(company)
							header = company;
						//Add tags list in the tooltip hover
						$(this).closest('li').find('.candidateTagList>li').each(function(){
							var tag = $(this).find('a').html();
							tagHtml += '<li><a href="">'+tag+'</a></li>';
						});						
						$('#tt-box .profileName').html(name);
						$('#tt-box .profileTitle').html(header);
						$('#tt-box .profileDesc').html(desc);
						$('#tt-box .profileTagList').html(tagHtml);
						$('#tt-box .tt-span1 img').attr('src',source);
						$('#tt-box .clientEmpName a').html(clientName);
						$('#tt-box .clientPostName a').html(postName);
						var top = $(this).offset().top - $('#tt-box').height() - 26; 
						var left = $(this).closest('li').offset().left-7;	
						var arrowTop = $('#tt-box').height() - 1;
						//Set top, left position for tooltip and arrow for the tooltip
						$('.arrow-border').css('top',arrowTop);
						$('#tt-box').css({'display':'block','top':top+'px','position':'absolute','left':left+'px'});	
						//Hover over tool-tip
						$('#tt-box').hover(function(){
							$('#tt-box').css({'display':'block'});
							$(this).find('.tt-btn').live('click',function(e){
								e.stopPropagation();
								//Hide search, pagination when resume is displayed
								$('#'+ulId+',.navigator,.vline,.pagerText').css('display','none');								
								$('#tt-box').css('display','none');
								$('#sortList').css('display','none');
								$('.resumeContainer').css('display','block');															
								$container.isotope('reLayout');
								$.ajax({
									type: "GET",
									url: "ResumeDetails.txt",
									dataType: 'json',
									error: function(err) { },
									success: function(data)
									{	
										//alert(JSON.stringify(data));
										var name = "<h1>" + data.firstName + " " + data.lastName + "</h1>";
										var location= "<h2>" + data.primaryEmail + "<br/>" + data.phone + "<br/>" + data.location +   "</h2> ";
										
										/* Skills */
										var skill = data.skills.split(",");
										var skills= "";
										for(var i = 0; i < skill.length; i++){
											skills = skills + "<a href= ''>" + skill[i] + "</a>";
										}
										/* Tools */
										var tools = data.tools.split(",");
										var tool= "";
										for(var i = 0; i < tools.length; i++){
											tool = tool + "<a href= ''>" + tools[i] + "</a>";
										}
										/* Technology */
										var techs = data.technology.split(",");
										var tech= "";
										for(var i = 0; i < techs.length; i++){
											tech = tech + "<a href= ''>" + techs[i] + "</a>";
										}
										/* Environment */
										var envs = data.environment.split(",");
										var env= "";
										for(var i = 0; i < envs.length; i++){
											env = env + "<a href= ''>" + envs[i] + "</a>";
										}
										/* Education */
										var edu = "";
										for(var i = 0; i < data.educationList.length; i++){
											edu = edu + "<div class='edu_section'><div class='degree_year'> <span class='degree'>" + data.educationList[i].degree + " in "+ data.educationList[i].major + " " + "<span>-</span>" + " " + "<span class=year>" +  data.educationList[i].startdate + " to " + data.educationList[i].endDate + "</span> </div>" + "<div class='univ_location'> <span class='univ'>" +  data.educationList[i].location + "</span></div></div>";		
										}
										/* Work Exp */
										var exp = "";
										for(var i = 0; i < data.experienceList.length; i++){
											exp = exp +	"<div class='exp_section'><div class='work_title'>" + data.experienceList[i].title + "</div><div class='work_company'><span class='name'>" + data.experienceList[i].employer + "</span>"+" " + "<span>-</span>" + " " + "<span>" + data.experienceList[i].location + "</span> </div>" + "<div class='work_date'>"	+	data.experienceList[i].startdate + " to " + data.experienceList[i].enddate + "<div class='work_description'>" + data.experienceList[i].desc + "</div></div>";
										}
										$('#resName').html( name); 
										$('#resTitle').html(location ); 
										$('#summaryBody').html(data.summary);
										$('#skills_expertise li:eq(0) .skillValue').html(skills);
										$('#skills_expertise li:eq(2) .skillValue').html(tool);
										$('#skills_expertise li:eq(1) .skillValue').html(tech);
										$('#skills_expertise li:eq(3) .skillValue').html(env);
										$('#eduBody').html(edu);
										$('#expBody').html(exp)
									}
								});	
							});
						},function(){
							$('#tt-box').css('display','none');
						});						
					},function(){						
					});
					//Limit profile to 12 per page (3 columns)
					resumeCtr++;
					if(resumeCtr > 11){						
						return;
					}
				});
			},
			error:function(){}
		});	
		$(document).click(function(){
			$('#tt-box').css('display','none');
		});		
	}
	
	
	//***** when user clicks on "Sort" dropdown in tabsWrapper div *****
	$('#sortList').click(function(e){
		e.stopPropagation();
		$('#sortList').find('.pop-up.dropdown').addClass('active');
	});
	
	
	//***** When user clicks on document body, the pop-ups should disappear*****
	$(document).click(function(){		
		$('.pop-up.dropdown').removeClass('active');
	});
	
	
	//***** Resume options dropdown click *****
	$('#resumeCategory').click(function(e){
		e.stopPropagation();
		$('#resumeCategory .pop-up.dropdown').addClass('active');
	});
	
	
	//***** Select any option from category list in resume *****
	$('#resCategoryList li').click(function(e){
		e.preventDefault();
		$('#resCategoryList li').find('img').css('visibility','hidden');
		$(this).find('img').css('visibility','visible');
	});
	
	
	//***** Display tooltip when hovering over resume options *****
	$('#resCategoryList li').hover(function(){
		var top = $(this).offset().top; 
		//Set position for tooltip dynamically
		var left = $(this).closest('ul').offset().left + $(this).closest('ul').width();	
		$('.resume-tt').css({'display':'block','top':top,'left':left});
		var anchor_id = $(this).find('a').attr('id');
		var popupHtml="";
		//Display pop-up content for submitted, withdrawn etc
		switch(anchor_id){
			case 'resume_submitted':{
				$('.resume-tt > div[id$="-tooltip"]').css({'display':'none'});
				$('#submitted-tooltip').css({'display':'block'});
			}
			break;
			case 'resume_reviewed':{
				$('.resume-tt > div[id$="-tooltip"]').css({'display':'none'});
				$('#reviewed-tooltip').css({'display':'block'});
			}
			break;
			case 'resume_rejected':{
				$('.resume-tt > div[id$="-tooltip"]').css({'display':'none'});
				$('#rejected-tooltip').css({'display':'block'});
			}
			break;
			case 'resume_selected':{
				$('.resume-tt > div[id$="-tooltip"]').css({'display':'none'});
				$('#selected-tooltip').css({'display':'block'});
			}
			break;
			case 'resume_interviewed':{
				$('.resume-tt > div[id$="-tooltip"]').css({'display':'none'});
				$('#interviewed-tooltip').css({'display':'block'});
			}
			break;
			case 'resume_result':{
				$('.resume-tt > div[id$="-tooltip"]').css({'display':'none'});
				$('#result-tooltip').css({'display':'block'});
			}
			break;
			case 'resume_withdrawn':{
				$('.resume-tt > div[id$="-tooltip"]').css({'display':'none'});
				$('#withdrawn-tooltip').css({'display':'block'});
			}
			break;			
		}
	}, function(){
		$('.resume-tt').css('display','none');
	});
	
	
	//***** Close Resume *****
	$('#resumeClose').click(function(){
		$('.resumeContainer').css('display','none');
		$('#'+ulId).empty();
		loadSubmittedResumes(ulId);
		$('.navigator,.vline,.pagerText, #sortList').css('display','block');				
	});
	
	
	//***** View Next Resume List *****
	$('.rightNav').click(function(){
		var controlTab = $(this).closest('ul').attr('id');
		$('#'+controlTab).empty();
		loadSubmittedResumes(controlTab);
		var currPageNo = parseInt($('.currPage').html().trim());
		if(currPageNo<5)
			$('.currPage').html((currPageNo+1));
	});
	
	
	//***** View Prev Resume List *****
	$('.leftNav').click(function(){
		var controlTab = $(this).closest('ul').attr('id');
		$('#'+controlTab).empty();
		loadSubmittedResumes(controlTab);
		var currPageNo = parseInt($('.currPage').html().trim());
		if(currPageNo>1)
			$('.currPage').html((currPageNo-1));
	});
	
	
	
	// ************ BASIC SETTINGS MODULES BEGIN*************
	
	//***** Avatar display file name in fake layer ******
	 $('#logoFile').live("change",function() {
		var url = "images";			
		var fileName = $('#logoFile').attr('value');	
		$('.fakefile input').attr('value',fileName);				
	});	
		
		
	//***** Logo save button *****
	$('#logo_save_btn').click(function() {
		var url = "images";
		$('#logoDiv').empty();
		var fileName = $('#logoFile').val();
		if(fileName)
		{	var thumb = new Image();
			thumb.src = url+"/"+fileName;
			thumb.alt = url+"/"+fileName;
			$('#logoDiv').append(thumb);											
		}
		
		
	});	
	
	//***** Company Name save button *****
	$('#companyName_save_btn').click(function() {
		$('#companyNameDiv').empty();
		var compName = $('#companyName').val();
		$('#companyNameDiv').append(compName);		
	});
	
	//***** Contact Name in Company save button *****
	$('#companyContactName_save_btn').click(function() {
		$('#companyContactNameDiv').empty();
		var fullName=$('#first_name').val()+" "+$('#last_name').val();
		$('#companyContactNameDiv').append(fullName);
		$('.fname').html($('#first_name').val());
		$('.lname').html($('#last_name').val());
	});
	
	//***** Username save button *****
	$('#companyContactUsername_save_btn').click(function() {
		$('#usernameDiv').empty();
		var username= "http://sowo/" + $('#username').val();
		$('#usernameDiv').append(username);
	});
	
	//***** Password save button *****
	$('#password_save_btn').click(function() {		
		var newpass = $('input#newPassword').val();
		var retypepass = $('input#retypePassword').val();
		var currpass = $('input#currentPassword').val();
		hideErrorMsg();	
		//Not null field validations
		if(currpass=='') {
			$('input#currentPassword').addClass('errorClass');
			val = "Password cannot be blank...";
			$('#currentPassword').before ( "<label for='currentPassword' class='error' >" + val + "  </label>" );
			return false;
		}	
		if(newpass=='') {
			$('input#newPassword').addClass('errorClass');
			val = "Password cannot be blank...";
			$('#newPassword').before ( "<label for='newPassword' class='error' >" + val + "  </label>" );
			return false;
		}			
		if(retypepass=='') {
			$('input#retypePassword').addClass('errorClass');
			val = "Password cannot be blank...";
			$('#retypePassword').before ( "<label for='retypePassword' class='error' >" + val + "  </label>" );
			return false;
		}			
		if(newpass!=retypepass) {
			val = "Password do not match..";
			$('input#newPassword').addClass('errorClass');
			$('input#newPassword').before ( "<label for='newPassword' class='error' >" + val + "  </label>" );				
			return false;
		}
		else {
			$('#newPassword').removeClass('errorClass');
			$("label[for=newPassword ]").hide();					
		}
	});
	
	//***** When user leaves current password textbox *****
	$('input#currentPassword').change(function() {
		var currpass = $('input#currentPassword').val();
		//If password is not blank, remove error message
		if(currpass=='') {
			$('input#currentPassword').addClass('errorClass');
			val = "Password cannot be blank...";
			$('#currentPassword').before ( "<label for='currentPassword' class='error' >" + val + "  </label>" );			
			return false;
		}
		else {
			$('#currentPassword').removeClass('errorClass');
			$("label[for=currentPassword]").hide();	
		}		
	});
	
	//***** When user leaves new password textbox *****
	$('input#newPassword').change(function() {
		var newpass = $('input#newPassword').val();
		if(newpass=='') {
			$('input#newPassword').addClass('errorClass');
			val = "Password cannot be blank...";
			$('#newPassword').before ( "<label for='newPassword' class='error' >" + val + "  </label>" );			
			return false;
		}
		else {
			$('#newPassword').removeClass('errorClass');
			$("label[for=newPassword]").hide();	
		}		
	});
	
	//***** Clear fields when user clicks on Password Edit button *****
	$('#passwordEdit').click(function() {
		$('input#currentPassword').val('');
		$('input#newPassword').val('');
		$('input#retypePassword').val('');
	});
	
	//***** Cler fields when password close btn is clicked *****
	$('#password_close_btn').click(function() {
		$('#currentPassword').removeClass('errorClass');
		$("label[for=currentPassword]").hide();	
		$('#newPassword').removeClass('errorClass');
		$("label[for=newPassword]").hide();	
		$('#retypePassword').removeClass('errorClass');
		$("label[for=retypePassword]").hide();	
	});
	
	//***** Hides error msgs *****
	function hideErrorMsg() {
		$('#currentPassword').removeClass('errorClass');
		$("label[for=currentPassword]").hide();	
		$('#newPassword').removeClass('errorClass');
		$("label[for=newPassword]").hide();	
		$('#retypePassword').removeClass('errorClass');
		$("label[for=retypePassword]").hide();	
	}
	
	//***** Primary email save button *****
	$('#primaryEmail_save_btn').click(function() {
		$('#primaryEmailDiv').empty();
		var primaryemail=  $('input#primaryEmail').val();
		$('#primaryEmailDiv').append(primaryemail);
	});
	
	//***** Company email save button *****
	$('#companyEmail_save_btn').click(function() {
		$('#companyEmailDiv').empty();
		var secondaryemail=  $('input#companyEmail').val();
		$('#companyEmailDiv').append(secondaryemail);
	});
	
	//***** Other email save button *****
	$('#otherEmail_save_btn').click(function() {
		$('#otherEmailDiv').empty();
		var secondaryemail=  $('input#otherEmail').val();
		$('#otherEmailDiv').append(secondaryemail);
	});
	
	//***** Location save button click *****
	$('#location_save_btn').click(function() {
		$('#locationCity').empty();
		$('#locationState').empty();
		$('#locationZip').empty();		
		$('#locationCity').text($('input#city').val());
		$('#locationState').text($('input#state').val());
		$('#locationZip').text($('input#zip').val());		
	});
	
	//***** Location edit button *****
	$('#locationEdit').click(function() {
		$('input#city').val($('#locationCity').text());
		$('input#state').val($('#locationState').text());
		$('input#zip').val($('#locationZip').text());
	});
	
	//***** Company Logo Edit & Cancel click *****
	$('#logoEdit').click(function() {		
		var full_fileName = $('#logoDiv img').attr('alt');
		var filename = full_fileName.split("/")[1];
		$('.fakefile input').attr('value',filename);	
	});
	$('#logo_close_btn').click(function(){
		$('.fakefile input').attr('value','');
	});
	
	//***** Company name Edit & cancel click*****
	$('#companyName_close_btn').click(function(){
		$('#companyName').val('');
	});	
	$('#companyName_edit_btn').click(function() {
		$('input#companyName').val($('#companyNameDiv').text());		
	});
	
	//***** Company Contact person Name Edit & cancel click*****
	$('#companyContactName_close_btn').click(function(){
		$('#first_name').val('');
		$('#last_name').val('');
	});	
	$('#companyContactName_edit_btn').click(function() {
		$('input#first_name').val($('.fname').text());
		$('input#last_name').val($('.lname').text());		
	});
	
	//***** User name Edit & cancel click*****
	$('#companyContactUsername_close_btn').click(function(){
		$('#username').val('');
	});	
	$('#companyContactUsername_edit_btn').click(function() {
		$('input#username').val($('#usernameDiv').text());		
	});
	
	//***** Primary Email Edit & cancel click*****
	$('#primaryEmail_close_btn').click(function(){
		$('#primaryEmail').val('');
	});	
	$('#primaryEmail_edit_btn').click(function() {
		$('input#primaryEmail').val($('#primaryEmailDiv').text());		
	});
	
	//***** Company Email Edit & cancel click*****
	$('#companyEmail_close_btn').click(function(){
		$('#companyEmail').val('');
	});	
	$('#companyEmail_edit_btn').click(function() {
		$('input#companyEmail').val($('#companyEmailDiv').text());		
	});
	
	//***** Company Email Edit & cancel click*****
	$('#otherEmail_close_btn').click(function(){
		$('#otherEmail').val('');
	});	
	$('#otherEmail_edit_btn').click(function() {
		$('input#companyEmail').val($('#otherEmailDiv').text());		
	});
	
	//***** Location Edit & cancel click*****
	$('#location_close_btn').click(function(){
		$('#city').val('');
		$('#state').val('');
		$('#state').val('');
	});	
	$('#location_edit_btn').click(function() {
		$('input#city').val($('#locationCity').text());
		$('input#state').val($('#locationState').text());
		$('input#zip').val($('#locationZip').text());		
	});
	
	// ************ BASIC SETTINGS MODULES END*************
	
	//***** Anonymous function calls *****
	$(function () {
		$('#logo-popup-wrapper').modalPopLite({ openButton: '#logoEdit', saveButton: '#logo_save_btn', closeButton: '#logo_close_btn', isModal: true });
		$('#companyName-popup-wrapper').modalPopLite({ openButton: '#companyName_edit_btn', saveButton: '#companyName_save_btn', closeButton: '#companyName_close_btn', isModal: true });
		$('#companyContactName-popup-wrapper').modalPopLite({ openButton: '#companyContactName_edit_btn', saveButton: '#companyContactName_save_btn', closeButton: '#companyContactName_close_btn', isModal: true });
		$('#companyContactUsername-popup-wrapper').modalPopLite({ openButton: '#companyContactUsername_edit_btn', saveButton: '#companyContactUsername_save_btn', closeButton: '#companyContactUsername_close_btn', isModal: true });
		$('#password-popup-wrapper').modalPopLite({ openButton: '#password_edit_btn', saveButton: '#password_save_btn', closeButton: '#password_close_btn', isModal: true });
		$('#primaryEmail-popup-wrapper').modalPopLite({ openButton: '#primaryEmail_edit_btn', saveButton: '#primaryEmail_save_btn', closeButton: '#primaryEmail_close_btn', isModal: true });
		$('#companyEmail-popup-wrapper').modalPopLite({ openButton: '#companyEmail_edit_btn', saveButton: '#companyEmail_save_btn', closeButton: '#companyEmail_close_btn', isModal: true });
		$('#otherEmail-popup-wrapper').modalPopLite({ openButton: '#otherEmail_edit_btn', saveButton: '#otherEmail_save_btn', closeButton: '#otherEmail_close_btn', isModal: true });
		$('#location-popup-wrapper').modalPopLite({ openButton: '#location_edit_btn', saveButton: '#location_save_btn', closeButton: '#location_close_btn', isModal: true });
		//When user clicks on tabs like slected, withdrawn, rejected, etc
		$('#outertabs a').click(function(){
			switch_outertabs($(this));
		});
	});
});