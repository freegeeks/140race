$(document).keyup(function(e) {
    if (e.keyCode == 13) {  // enter

        $( ".player_1" ).removeClass("p1_anim").addClass("winner");
        $( ".player_2" ).removeClass("p2_anim").addClass("loser");

        //$( ".div_winner" ).show();
        
        setInterval(function() {
            $( ".div_winner" ).delay(500).fadeIn(800);
        }, 300);
    } 
});


function moveTrack() {
    var track = $('.track');
    var bottom = track.parent().height() - track.height();

    track.css('bottom', '-30px');
    track.animate({bottom: bottom}, 6000, 'linear', function() {
      moveTrack();
    });
};
moveTrack();


$( ".login-bt" ).on( "click", function() {
    $( ".login" ).slideUp();

    $( ".player_1" ).addClass("p1_anim");
    $( ".player_2" ).addClass("p2_anim");
});



// to be removed
var number = 1 + Math.floor(Math.random() * 60);
setInterval(function() {
    var number = 1 + Math.floor(Math.random() * 60);
    var n2 = number + 8
    $('.p1').text(number);
    $('.p2').text(n2);
}, 400);
