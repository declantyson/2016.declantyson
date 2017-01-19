/*
 *	2016.declantyson
 *	v1.2.2
 *	19/01/2017
 */

glob = {
    page: "",
    hue: 219,
    sat: 10,
    introReady: false
};
pjaxit.dynamicElementId = "dynamic-content";

function cubeMovement(x, y){
	var YZeroPoint = $(window).height() / 2;
	var XZeroPoint = ($(window).width() / 4) * 3;
	var maxYDeg = 65;
	var maxXDeg = 65;
	
	y = (YZeroPoint - y);
	y = y / YZeroPoint;
	y = maxYDeg * y;	

	x = (XZeroPoint - x);
	x = x / XZeroPoint;
	x = maxXDeg * x;
	
	var z = (-x) / 100;
	if(z < 0) z = -z;
	z = 1.05 + z;

	var string = "rotate3d(1, 0, 0, " + y + "deg) rotate3d(0, 1, 0, " + x + "deg)";

	// light sources 

	var l = (x+90) / 3;
	var rgb = hsl2rgb(glob.hue, glob.sat, l);
	$('#cube .left').css({ backgroundColor : "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")" });

	l = ((x-90) / 3) * -1;
	rgb = hsl2rgb(glob.hue, glob.sat, l);
	$('#cube .right').css({ backgroundColor : "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")" });		

	l = ((y-90) / 3) * -1;
	rgb = hsl2rgb(glob.hue, glob.sat, l);
	$('#cube .top').css({ backgroundColor : "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")" });		

	l = ((y+90) / 3);
	rgb = hsl2rgb(glob.hue, glob.sat, l);
	$('#cube .bottom').css({ backgroundColor : "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")" });	

	l = 60 - (x / 3);
	if(x < 0) {
		l = 60 + (x / 3);
	}
	rgb = hsl2rgb(glob.hue, glob.sat, l);
	$('#cube .front').css({ backgroundColor : "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")" });


	$('#cube').css({
		"transform" : string
	});
}

var blogs = {};
$(document).ready(function(){
    if(glob.processing) return;
    var page = window.location.pathname.split("/")[1];
    if(window.location.pathname.split("/")[1] === "admin") return;
    if(window.location.pathname.split("/")[1] === "") page = "home";
    
    $.ajax({
        url: '/json/',
        type: 'GET'
    }).done(function(data){
        var mostRecent = data[0],
            mostRecentDateParts = mostRecent.date.split('/'),
            mostRecentDate = new Date(),
            newEntry = false;

        mostRecentDate.setFullYear(parseInt(mostRecentDateParts[2]), parseInt(mostRecentDateParts[1]) - 1, parseInt(mostRecentDateParts[0]));

        if(!localStorage.previousUser) {
            localStorage.previousUser = true;
            // first time
            $('.latest-entry p').text('Welcome to declantyson.net! Here is the latest blog entry so you can get a feel for what kind of person I am.');
            newEntry = true;
        } else if(parseInt(localStorage.previousUserDate) < mostRecentDate.getTime()) {
            // new blog since last visit
            $('.latest-entry p').text('Welcome back! There\'s been an update since your last visit.');
            newEntry = true;
        }


        if(newEntry) {
            $('.latest-entry a').attr('href', "/" + mostRecent.slug);
            $('.latest-entry img').attr('src', mostRecent.image);
            $('.latest-entry h3').html(mostRecent.title);
            $('.latest-entry h4').html(mostRecent.date.split(" ")[0]);

            $('.latest-entry').show();
            setTimeout(function () {
                $('.latest-entry .revealer').addClass('in');
                setTimeout(function () {
                    $('.latest-entry .entry-container').addClass('visible');
                    $('.latest-entry .revealer').removeClass('in').addClass('out');
                    glob.slideLatestOut = setTimeout(function () {
                        $('.latest-entry .revealer').removeClass('out').addClass('in');
                        setTimeout(function () {
                            $('.latest-entry .entry-container').removeClass('visible');
                            $('.latest-entry .revealer').addClass('out');
                            setTimeout(function () {
                                $('.latest-entry').remove();
                            }, 400);
                        }, 400);
                    }, 5000);
                }, 400);
            }, 1000);
        }

        var visitDate = new Date();
        localStorage.previousUserDate = visitDate.getTime();


        for(var i in data) {
            var blog = data[i];
            if(typeof(blogs[blog.category]) == "undefined") {
                blogs[blog.category] = [];
            }
            blogs[blog.category].push(blog);
            var $listing = $('<div class="listing"/>');
            $listing.attr('data-slug', blog.slug).attr('data-category', blog.category);
            var $featuredImage = $('<img/>').attr('src', '/assets/featured-images/' + blog.slug + '.jpg');
            var $title = $('<h3/>').html(blog.title);
            var $clear = $('<div class="clear"/>');
            var $date = $('<span/>').text(blog.date.split(" ")[0]);

            $listing.append($featuredImage);
            $listing.append($title);
            $title.append($date);
            $listing.append($clear);

            $('.sidebar .listings').append($listing);
        }

        filterBlogsToCategory("Tech and Design", -1);

        if($('.sidebar .listings').length > 0) {
            $('.sidebar .listings').mCustomScrollbar();
        }
    });

    glob.processing = true;
    glob.pageswitch = false;
    glob.page = page;

    if(page !== "home") {
        changePage(page);
    }

    $('.sidebar li').click(function(){
        if($(this).index() == $('.sizer').attr('data-current') || glob.pageswitch) return;
        if($(this).data('category') == "Awards") {
            /*$('body').removeClass('sidebar-open');
            changePage("awards");
            setTimeout(function() {
                filterBlogsToCategory("Tech and Design", -1, -1);
            }, 450);
            return;*/
        }
        filterBlogsToCategory($(this).data('category'), $(this).index(), $('.sizer').attr('data-current'));
        $('.sizer').attr('class', 'sizer item-' + $(this).index()).attr('data-current', $(this).index());
    });

	$('body').on('mousemove', function(e){
		cubeMovement(e.clientX, e.clientY);
	});

    $('body').on('click', '.blog-icon', function(e){
        $('body').toggleClass('sidebar-open');
    });
	
    $('body').on('contextmenu', 'video', function(e){
        //e.preventDefault();
    });     

    $('body').on('click', '.listings .listing', function(e){
        var $e = $(e.target);
        if(!$e.hasClass('.listing')) $e = $e.closest('.listing');

        $('body').removeClass('sidebar-open');
        changePage($e.data('slug'));
    });

    $('body').on('click', '.latest-entry a', function(e){
        var $e = $(e.target);
        clearTimeout(glob.slideLatestOut);
        $('.latest-entry .revealer').removeClass('out').addClass('in');
        setTimeout(function () {
            $('.latest-entry .entry-container').removeClass('visible');
            $('.latest-entry .revealer').addClass('out');
            setTimeout(function () {
                $('.latest-entry').remove();
            }, 400);
        }, 400);

        changePage($e.attr('href'));
    });

    $('body').on('click', '.portfolio .col', function(e){
        var $e = $(e.target);
        if(!$e.hasClass('.col')) $e = $e.closest('.col');

        $('html, body').animate({
            scrollTop: 0
        }, 250);

        triggerPortfolio($e);
    });

    $('body').on('click', '.view-portfolio-item span', function(e){ 
        $(".view-portfolio-item").removeClass('ready');
        $(".view-portfolio-item div").html("");
        window.location.hash = "";
    }); 

    $('body').on('click', '.view-portfolio-item', function(e){
        var $e = $(e.target);
        if($e.hasClass('view-portfolio-item')) {
            $(".view-portfolio-item").removeClass('ready');
            $(".view-portfolio-item div").html("");
            window.location.hash = "";
        }
    });

    $('body').on('keydown', function(e){
        if(e.keyCode === 27) {
            $(".view-portfolio-item").removeClass('ready');
            $(".view-portfolio-item div").html("");   
            window.location.hash = "";
        }
    });

});

$(window).resize(function(){
    if($(window).width() > 590) {
        $('.content, .newcontent, .oldcontent').width( $('.main').width() );
    } else {
        $('.content, .newcontent, .oldcontent').width( $('.main').width() );
    }
    $(".view-portfolio-item").height($('body').height());
    $('.newcontent').css({ top: $(window).height() });
    $('.hovercircle').height($('.hovercircle').width());
    var bgw = $('.bg-img').width(),
        ww = $(window).width();
	setTimeout(function() {
		$('#grid').isotope();
	}, 500);
});


$(window).scroll(function(){
    if($('.content .bg-img-holder img').height() > 0) {
        var offset = $('.content .bg-img-holder img').height();
        if(offset > 600) {
            offset = 600;
        }
        $('.bg-img-holder').css({
            height: offset - ($(window).scrollTop() / 2)
        });
    }
});

function triggerPortfolio($e) {

     $('html, body').animate({
        scrollTop: 0
    }, 250);

    $(".view-portfolio-item").addClass('ready').height($('body').height());
    var video = $('<video loop/>');
    var sourceMp4 = $('<source type="video/mp4"/>');
    sourceMp4.attr('src', $e.find('.large-content').data('videosource') + '.mp4');
    var sourceWebm = $('<source type="video/webm"/>');
    sourceWebm.attr('src', $e.find('.large-content').data('videosource') + '.webm');
    var sourceOgg = $('<source type="video/ogg"/>');
    sourceOgg.attr('src', $e.find('.large-content').data('videosource') + '.ogv');
    video.append(sourceMp4).append(sourceWebm).append(sourceOgg);
    $(".view-portfolio-item div").prepend(video);
    $(".view-portfolio-item div").append($e.find('.large-content').html());

    $('video')[0].play();

    window.location.hash = $e.find('.large-content').data('hash');

    if($(window).width() < 540) {
        $('video').attr('controls', true);
    }
}

function changePage(page) {
    url = '/themes/2016.declantyson/page.aspx?page=' + page;
    $('.content').css({ opacity: 0 });
    pjaxit.changePage(url, 250, function() {
        $('.content').css({ opacity: 1 });
        history.pushState('', 'New URL: /' + page, page);
    }, 650, false);

}

function filterBlogsToCategory(cat, index, current) {
    glob.pageswitch = true;
    $('.sidebar .listings .listing').each(function(){
        var $newListing = $(this).clone();
    	$('.new-listings').append($newListing);
        if($newListing.data('category') == cat) {
            $newListing.addClass('visible');
        } else {
            $newListing.removeClass('visible');
        }
    });

    $('.listings').removeClass('static');
    
    if(current < index) {
        $('.new-listings').addClass('after');
        $('.listings').addClass('before');
    } else {
        $('.new-listings').addClass('before');
        $('.listings').addClass('after');
    }
    setTimeout(function(){
        $('.new-listings').addClass('moving');
        setTimeout(function() {
            $('.new-listings').removeClass('moving').addClass('static').removeClass('after').removeClass('before');
            $('.listings').html($('.new-listings').html()).addClass('static').removeClass('after').removeClass('before');
            $('.listings').append('<div class="clearfix"></div>');
            $('.new-listings').html('').removeClass('static');
            glob.pageswitch = false;
        }, 900);
    },20);
}

function hsl2rgb(h, s, l) {
    var m1, m2, hue, r, g, b;
    s /=100;
    l /= 100;
    if (s === 0)
        r = g = b = (l * 255);
    else {
        if (l <= 0.5)
            m2 = l * (s + 1);
        else
            m2 = l + s - l * s;
        m1 = l * 2 - m2;
        hue = h / 360;
        r = Math.round(HueToRgb(m1, m2, hue + 1/3));
        g = Math.round(HueToRgb(m1, m2, hue));
        b = Math.round(HueToRgb(m1, m2, hue - 1/3));
    }
    return {r: r, g: g, b: b};
}


function HueToRgb(m1, m2, hue) {
    var v;
    if (hue < 0)
        hue += 1;
    else if (hue > 1)
        hue -= 1;

    if (6 * hue < 1)
        v = m1 + (m2 - m1) * hue * 6;
    else if (2 * hue < 1)
        v = m2;
    else if (3 * hue < 2)
        v = m1 + (m2 - m1) * (2/3 - hue) * 6;
    else
        v = m1;

    v = v * 255;
    return v;
}

function isExternal(url) {
    var match = url.match(/^([^:\/?#]+:)?(?:\/\/([^\/?#]*))?([^?#]+)?(\?[^#]*)?(#.*)?/);
    if (typeof match[1] === "string" && match[1].length > 0 && match[1].toLowerCase() !== location.protocol) return true;
    if (typeof match[2] === "string" && match[2].length > 0 && match[2].replace(new RegExp(":("+{"http:":80,"https:":443}[location.protocol]+")?$"), "") !== location.host) return true;
    return false;
}

window.ondevicemotion = function(e) {
	var YZeroPoint = $(window).height() / 4;
	var XZeroPoint = ($(window).width() / 4) * 3;
	var x = Math.round(e.accelerationIncludingGravity.x * 30);
	var y = Math.round(e.accelerationIncludingGravity.y * 30);
	cubeMovement(x + XZeroPoint, y + YZeroPoint);
};