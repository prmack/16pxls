$(document).ready(function(){
	wt.fix({
		elements:'h1, h2, p, blockquote',
		chars:10,
		method:'nbsp',
		event:'resize'
	});
	$('.slick-slider').slick({
		dots : true,
		arrows : false,
		fade : true,
		infinite : true,
		autoplay : true,
		speed : 800,
		lazyLoad : 'ondemand'
	});
	$('.topbar a',).click(function(){
		var getHref = $(this).attr('href');
		$('html, body').animate({
			scrollTop: $(getHref).offset().top - 90
		}, 2000);
		return false;
	});
});
