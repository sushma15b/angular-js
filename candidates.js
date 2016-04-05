$(document).ready(function(){
	var $container = $('#container'),$items = $('.item');
	//make "Submitted Resume Tab" the default one and load list of resumes
	$('#submittedResumeList').empty();			
	switch_outertabs($('.defaulttab'));
	$('.filterFrame').css('display','block');	
	
	//*****When user switches between tabs (submitted, reviewed, rejected, etc), load profile lists*****
	function switch_outertabs(obj)
	{
		$('.emp-tab-content').hide();
		//de-selected previously selected tab
		$('#outertabs a').removeClass("selectedtab");
		var id = obj.attr("rel");		
		$('#'+id).show();	
		//Highlight newly sslected tab
		obj.addClass("selectedtab");
		//Empty current content
		//Load new resume list in tab
		if(id.toLowerCase() == "reviewedrestab"){
			$('#reviewedResumeList').empty();
			loadResumes('reviewedResumeList');			
		}
		else if(id.toLowerCase() == "selectedrestab"){
			$('#selectedResumeList').empty();
			loadResumes('selectedResumeList');			
		}
		else if(id.toLowerCase() == "submittedrestab"){			
			$('#submittedResumeList').empty();
			loadResumes('submittedResumeList');			
		}
		else if(id.toLowerCase() == "rejectedrestab"){
			$('#rejectedResumeList').empty();
			loadResumes('rejectedResumeList');			
		}
		else if(id.toLowerCase() == "withdrawntab"){
			$('#withdrawnResumeList').empty();
			loadResumes('withdrawnResumeList');			
		}
		else if(id.toLowerCase() == "interviewedtab"){
			$('#interviewedResumeList').empty();
			loadResumes('interviewedResumeList');			
		}
		else if(id.toLowerCase() == "resulttab"){
			$('#resultResumeList').empty();
			loadResumes('resultResumeList');			
		}				
	}
	
	//***** Get profile list via AJAX and load the page*****
	var ulId = "";
	function loadResumes(id){
		//Display search, sort, pagination while displaying profile list
		$('.resumeContainer').css('display','none');
		$('#'+id+',.vline,.pagerText').css('display','block');	
		
		var resumeCtr=0;
		/*$.ajax({
			type:"GET",
			url:"submittedResume.txt",
			datatype:"json",
			success:function(data){
				alert("in success");*/
		$.getJSON("submittedRes.json", function(data){

           		$(data.profiles).each(function(i, profile){
					//alert("in each..."+i+"..."+id);
					//alert("name..."+profile.name);
					var submittedCandidateId = profile.submittedCandidateId;
					var name = profile.name;
					var title = profile.title;
					var company = profile.company;
					var imageUrl = profile.imageUrl;
					var desc = profile.description;
					var tags = profile.skills;
					var clientName = profile.recruiterName;
					var postName = profile.postName;
					var tagArray = new Array();
					if(tags!="") {
						tagArray = tags.split(",");
						}
					var createList = "";
					if(tagArray!='undefined') {
						for (item in tagArray){
							createList += '<li><a href="">'+tagArray[item].trim()+'</a></li>';						
						}
					}
					var resultHtml="";
					//Build profile list (3 column layout)
					resultHtml = '<li>'+
									'<div class="profileBox" id="submittedCandidateId'+submittedCandidateId +'">'+
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

					//**** Display Hover card when you hover over profile picture OR profile name ****
					$('#imageHolder img,.candidateName').hover(function(e){
						e.preventDefault();							
						//Populate values for hover card
						var name = $(this).closest('li').find('.candidateName').html();
						var title = $(this).closest('li').find('.candidateTitle').html();
						var company = $(this).closest('li').find('.candidateCompany').html();
						var source = $(this).closest('li').find('#imageHolder img').attr('src');
						var desc = $(this).closest('li').find('.candidateDesc').html();
						var clientName = $(this).closest('li').find('.clientName').html();
						var postName = $(this).closest('li').find('.postName').html();
						ulId = $(this).closest('ul').attr('id');
						//If description text > 140 characters, display first 140 with "..."
						if((desc.length)>140){
							desc = desc.substring(0,140)+"...";
						}
						//seperate title & company with "|" symbol
						var header="";
						var tags = [];
						var tagHtml="";
						if(title && company)
							header = title +" | "+ company;
						else if(title)
							header = title;
						else if(company)
							header = company;
						//Add tag list to hover card of candidates
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
						//Position the hover card - Calculate top, left and the triangle's top position
						var top = $(this).offset().top - $('#tt-box').height() - 26; 
						var left = $(this).offset().left-7;	
						var arrowTop = $('#tt-box').height() - 1;
						$('.arrow-border').css('top',arrowTop);
						$('#tt-box').css({'display':'block','top':top+'px','position':'absolute','left':left+'px'});
						//Position arrow for the hover card
						$('.empHoverCard .down-arrow').css({'left':'20px'});	
						$('.empHoverCard .arrow-border').css({'left':'19px'});
						
						//**** Hover card - on hover functionality ****
						$('#tt-box, #tt-box.filler').hover(function(){
							$('#tt-box').css({'display':'block'});
							//Click on "View" button in the hover card
							$(this).find('.tt-btn').on('click',function(e){
								e.stopPropagation();
								//Hide search box, page navigation and sort by name, sort by description fields when resume is open
								$('#'+ulId+',.more,#resume-search,.pagerText').css('display','none');								
								$('#tt-box').css('display','none');
								$('#sortList').css('display','none');
								//Change resume dimensions depending on whether filter is open or not
								if($('.filterSidebar').css('display')=="block"){																		
									$('.resumeContainer').addClass('narrowContainer');
									$('#emp-item5').addClass('narrowMinHt');
									$('#resumeClose').addClass('narrowClosePos');
									$('.resumeBody').addClass('fontElevenPx');
									$('#summaryBody, #expBody').addClass('fontTwelvePx');
									$('.degree_year .degree .univ_location .univ').addClass('fontThirteenPx');
								}
								else{
									//If filter is not open, display expanded resume
									$('.resumeContainer').removeClass('narrowContainer');
									$('#emp-item5').removeClass('narrowMinHt');
									$('#resumeClose').removeClass('narrowClosePos');
									$('.resumeBody').removeClass('fontElevenPx');
									$('#summaryBody, #expBody').removeClass('fontTwelvePx');
									$('.degree_year .degree .univ_location .univ').removeClass('fontThirteenPx');
								}
								$('.resumeContainer').css('display','block');												
								$('.resumeContainer').scrollTop();
							});
						},function(){
							$('#tt-box').css('display','none');
						});
						
					},function(){
						$('#tt-box').css('display','none');
					});
					
					//limit number of profiles to 12 per page (3 column)
					resumeCtr++;
					if(resumeCtr > 15){						
						exit;
					}
				});
			//}
		});
		$(document).click(function(){
			$('#tt-box').css('display','none');
		});		
	}// loadResumes function end
	
	
	//More btn for fb invite friends div 
	$(".more").live('click', function(){
		//alert("more clicked...");
		var id = "submittedResumeList";
		loadResumes(id);
					
	
	});
		
	
	
	//*****Display tooltip when hovering over resume options in resume(selected, withdrawn, etc)*****
	$('#resCategoryList li').hover(function(){
		var top = $(this).offset().top; 
		var left = $(this).closest('ul').offset().left + $(this).closest('ul').width();	
		$('.resume-tt').css({'display':'block','top':top,'left':left});
		var anchor_id = $(this).find('a').attr('id');
		var popupHtml="";
		//depending on resume option, display corresponding html
		//ie., for submitted, display tooltip for submttedand like-wise
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
	
	
	//*****Select any option from category list in resume*****
	$('#resCategoryList li').click(function(){
		$('#resCategoryList li').find('img').css('visibility','hidden');
		$(this).find('img').css('visibility','visible');
	});
	
	
	//*****Close Resume*****
	$('#resumeClose').click(function(){
		$('.resumeContainer').css('display','none');
		$('#'+ulId).empty();
		loadResumes(ulId);
		$('.more,#resume-search,.pagerText, #sortList').css('display','block');		
	});
	
	
	//*****View Next Resume List*****
	$('.rightNav').click(function(){
		var controlTab = $(this).closest('ul').attr('id');
		$('#'+controlTab).empty();
		loadResumes(controlTab);
		var currPageNo = parseInt($('.currPage').html().trim());
		if(currPageNo<5)
			$('.currPage').html((currPageNo+1));
	});
	
	
	//*****View Prev Resume List*****
	$('.leftNav').click(function(){
		var controlTab = $(this).closest('ul').attr('id');
		$('#'+controlTab).empty();
		loadResumes(controlTab);
		var currPageNo = parseInt($('.currPage').html().trim());
		if(currPageNo>1)
			$('.currPage').html((currPageNo-1));
	});

	
	//*****When user clicks on "Show Filter"/"Hide Filter" button*****
	$('#displayFilter').click(function(){
		//If filter has "show filter" properties, change it to "Hide Filter"
		if($('#displayFilter').hasClass('showFilter')){			
			$('#displayFilter').addClass('hideFilter');
			$('#displayFilter').html('Hide Filter');
			$('#displayFilter').removeClass('showFilter');						
			$('.item.selected').css({'max-height':'1190px'});
			$('#emp-item5').animate({'width':'840px','left':'220px'},600,function(){
				$('.filterSidebar').css('display','block');
				//Change resume dimensions depending on whether filter is open or not
				if($('.resumeContainer').css('display')=="block"){																		
					$('.resumeContainer').addClass('narrowContainer');
					$('#emp-item5').addClass('narrowMinHt');
					$('#resumeClose').addClass('narrowClosePos');
					$('.resumeBody').addClass('fontElevenPx');
					$('#summaryBody, #expBody').addClass('fontTwelvePx');
					$('.degree_year .degree .univ_location .univ').addClass('fontThirteenPx');
				}
			});
			$('.tabsWrapper').animate({'width':'830px'},600);
			$('#container').animate({'min-height':'1300px'},600);			
			$('.emp-tab-content').animate({'width':'830px'},600);
			$('.profileBox').animate({'margin-right':'85px'},600);
			$('.more').animate({'width':'755px'},600);	
			
		}
		else{
			//If filter is not shown anymore, expanded the tabs
			$('.filterSidebar').css('display','none');
			$('#displayFilter').removeClass('hideFilter');
			$('#displayFilter').addClass('showFilter');	
			$('#displayFilter').html('Show Filter');			
			$('.item.selected').css({'min-height':'460px'});
			if($('.resumeContainer').css('display')=="block"){	
				//Display expanded resume - increase width
				$('.resumeContainer').removeClass('narrowContainer');
				$('#emp-item5').removeClass('narrowMinHt');
				$('#resumeClose').removeClass('narrowClosePos');
				$('.resumeBody').removeClass('fontElevenPx');
				$('#summaryBody, #expBody').removeClass('fontTwelvePx');
				$('.degree_year .degree .univ_location .univ').removeClass('fontThirteenPx');
			}
			else{
				$('.profileBox').animate({'margin-right':''},600);
				$('.more').animate({'width':'940px'},600);	
			}
			//Expand other parent controls too
			$('#emp-item5').animate({'width':'1000px','left':'0px'},500);
			$('#container').animate({'min-height':'960px'},600);			
			$('.emp-tab-content').animate({'width':'1000px'},600);
			$('.tabsWrapper').animate({'width':'990px'},600);
			$('.more').animate({'width':'940px'},600);			
			
		}				
	});
	
	
	//***** when user clicks on "Sort" dropdown in tabsWrapper div *****
	$('#sortList').click(function(e){
		e.stopPropagation();
		e.preventDefault();
		$('#sortList').find('.pop-up.dropdown').addClass('active');
	});
	
	
	//***** When user clicks on document body, the pop-ups should disappear*****
	$(document).click(function(){		
		$('.pop-up.dropdown').removeClass('active');
	});
	
	
	//*****Resume options dropdown click*****
	$('#resumeCategory').click(function(e){
		e.stopPropagation();
		$('#resumeCategory .pop-up.dropdown').addClass('active');		
	});
	
	
	//*****Check mark display on Resume categories' option list*****
	$('#resCategoryList li a').click(function(e){
		e.preventDefault();
	});	
	
	
	//***** When user clicks on Filter Links on left, load grid column again *****
	$('#fltrJobTitle').find('a').click(function(e){
		e.preventDefault();
		//Highlight the selected link in category list
		$(this).closest('ul').find('.highlighter').removeClass('highlighter');
		$(this).addClass('highlighter');
		var currTab = $('.selectedtab').attr('rel');
		var currentTag = $(this).html();
		$('#'+currTab).find('>ul').empty();
		//Add the selected tag under "search" in filter
		var liHtml = "<li><span>"+currentTag+"<a class='tagClose'>x</a></span></li>";
		if($('#filterTags').children().length > 2)
			$('#filterTags li:nth-child(1)').remove();
		$('#filterTags').append(liHtml);	
	});
	
	$('#filterSearchIcon').click(function(){
		var searchTag = $('#filter-search').val();
		$('#filter-search').val('');
		var liHtml = "<li><span>"+searchTag+"<a class='tagClose'>x</a></span></li>";
		//Limit no of tags to 3 under the search header
		if($('#filterTags').children().length > 2)
			$('#filterTags li:nth-child(1)').remove();
		$('#filterTags').append(liHtml);
	});
	
	//***** Close tags when Close symbol i sclicked*****
	$('#filterTags .tagClose').click(function(e){
		e.preventDefault();
		$(this).closest('li').remove();
	});
	
	//*****Anonymous function calls*****
	$(function () {		
		$('#outertabs a').click(function(){
			switch_outertabs($(this));
		});
	});
});