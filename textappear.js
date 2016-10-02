
var showText = function (target, message, index, interval) {   
  if (index < message.length) {
    $(target).append(message[index++]);
    setTimeout(function () { showText(target, message, index, interval); }, interval);
  }
}

var changepill = function(clicktarget){
  $("#"+clicktarget).find("a").trigger('click');
  // $("#" + oldness + "pill").removeClass("active");
  // $("#" + newness + "pill").addClass("active"); 
}

$(document).ready(function() {
      showText("#myname","Hi. My name is James.", 0, 200);
      setTimeout(function () { showText("#iam","I am a", 0, 200, 1500); },5000);
      setTimeout(function () { showText("#neuro","Neuroscientist.", 0, 100, 1500); },8000);
      setTimeout(function () { showText("#data","Data geek.", 0, 125, 1500); },9000);
      setTimeout(function () { showText("#dev","Developer.", 0, 75, 1500); },9500);
      setTimeout(function () { showText("#res","Researcher.", 0, 100, 1500); },9700);
      // setTimeout(function () {changepill("kennapill");},1000);
})