
function breadcrumbs() {
var breadcrumb_ids = [];
	$('.breadcrumbs').each(function() {
		breadcrumb_ids.push(this.id);
})

breadcrumb_ids.forEach(checkname);

}

function checkname(name){
	var viewportWidth = $(window).width();
	if (name.split('-')[1] == 'sm' && viewportWidth < 992) {
		appear(name);
	}
	else if (name.split('-')[1] == 'lg' && viewportWidth >= 992){
		appear(name);
	}
}

function appear(name) {
	console.log('appear: ',name);
	var position = $('#'+name).position().top;
	var offset = 5;
	// console.log('position: ',position);
	// console.log('pageYOffset: ',window.pageYOffset);
	var displayed = ['block','inline'];
	if (window.pageYOffset > position + offset ) {//&& $.inArray($('#'+name).css('display'),displayed) == -1) {
		$('#'+name).css('display','block');
	}
	else{$('#'+name).css('display','none');}
}