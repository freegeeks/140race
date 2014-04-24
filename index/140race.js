$(document).keyup(function(e) {
      if (e.keyCode == 13) {  // enter

      //moveTrack("1900", 6000)

        $( ".player_1" ).removeClass("p1_anim").addClass("winner");
        $( ".player_2" ).removeClass("p2_anim").addClass("loser");

        //$( ".div_winner" ).show();
        
        setInterval(function() {
            $( ".div_winner" ).delay(500).fadeIn(800);
        }, 300);      

      moveTrack("0", 60000)



      } 
});


$(document).keyup(function(e) {
      if (e.keyCode == 48) {  // enter

        $( ".player_1" ).addClass("p1_anim");
        $( ".player_2" ).addClass("p2_anim");

      } 
});





function moveTrack(position, speedy) {

    $( ".track" ).animate({
        bottom: "-="+position+"px"
    }, speedy, "linear", function() {
    
    var p = $( ".track" );
    var position = p.position();
    var topPos = position.top
    console.log(topPos)

    if ( topPos >= "-140" ) {
        $( ".track" ).css("bottom", "0%")
    }

  });

};




setInterval(function() {
    moveTrack("1400", 6000)
}, 6000);




$( ".login-bt" ).on( "click", function() {
    $( ".login" ).slideUp();

    $( ".player_1" ).addClass("p1_anim");
    $( ".player_2" ).addClass("p2_anim");
    
    moveTrack("1400", 6000);

});




$(".tap").on('touchstart mousedown',function(e){
    moveTrack("250")
})



// to be removed
var number = 1 + Math.floor(Math.random() * 60);
setInterval(function() {
  var number = 1 + Math.floor(Math.random() * 60);
  var n2 = number + 8
  $('.p1').text(number);
  $('.p2').text(n2);
},
400);
