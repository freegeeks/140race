$(document).keyup(function(e) {
      if (e.keyCode == 13) {

      moveTrack("1900", 6000)

      }   // enter
});



function moveTrack(position, speedy) {

    $( ".track" ).animate({
        bottom: "-="+position+"px"
    }, speedy, "linear", function() {
    
    var p = $( ".track" );
    var position = p.position();
    var topPos = position.top
    console.log(topPos)

    if ( topPos >= "-150" ) {
        $( ".track" ).css("bottom", "0%")
    }

  });

};




setInterval(function() {
    moveTrack("1400", 6000)
}, 200);



$( ".login" ).on( "click", function() {
    $( this ).slideUp();
});



// Game page tabs
$(".tap").on('touchstart mousedown',function(e){
    moveTrack("250")
})

