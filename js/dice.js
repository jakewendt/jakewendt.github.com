$(function(){ 
	dice = new Dice({ 
		board_tag: "div#dice_board",
		show_controls: true
	}); 
});


function Dice(dice_options){
	_this = this;
	var options = {
		dice_count: 5,
		show_controls:false
	}
	$.extend( true, options, dice_options );
	var dice_count = ( parseInt(dice_options,10) > 0 ) ? parseInt(dice_options,10) : options.dice_count
	var roll_count = 0;
	var die = new Array(dice_count);
	roll();

	if(options.board_tag) {
		create_board();
		update_dice();
	}


/* ***************************************** */

	function create_board() {
		$(options.board_tag).html('');
		$.each(die, function(index,element){
			$(options.board_tag).append("<div class='die' id='die_"+index+"'>&nbsp;</div>");
		});
		$('div.die').click(function(){
			var index = $(this).attr('id').split('_').pop();
			die[index].toggle_frozen();
			if(die[index].frozen())
				$(this).addClass('frozen');
			else
				$(this).removeClass('frozen');
		});
		if(options.show_controls){
			$(options.board_tag).append("<h1>Roll Count:<span id='roll_count'></span></h1>");
			$(options.board_tag).append("<button type='button' id='reroll'>Reroll</button>");
			$('button#reroll').click(function(){
				_this.reroll();
				update_dice();
			});
		}
	}

	this.update_dice = update_dice;
	function update_dice() {
		$.each(die, function(index,element){
			$(options.board_tag+" div.die#die_"+index).html(
				"<img class='die' src='dice/Dice-"+element.value()+".png'/>" + 
				"<span class='click'>Click to keep</span>" +
				"<span class='keep'>Keep</span>"
			);
		});
		if(options.show_controls)
			$('#roll_count').html(roll_count);
	}

	this.roll_count = function(){
		return roll_count;
	}

	function roll(indexes){
		for(var i=0; i<die.length; i++)
			die[i] = new Die();
		return ++roll_count;
	}

	this.reroll = function(){
		for(var i=0; i<die.length; i++)
			die[i].reroll();
		return ++roll_count;
	}

	this.values = values;
	function values(){
		var values = new Array(die.length);
		for(var i=0; i<die.length; i++){
			values[i] = die[i].value();
		}
		return values;
	}

}




function Die() {
	var value = roll();
	var frozen = false;
	
	this.reroll = roll;
	function roll() {
		if( frozen ) 
			return value;
		else
			return value = Math.floor(Math.random()*6) + 1;
	}

	this.value = function(){
		return value;
	}
	this.toggle_frozen = function(){
		return frozen = !frozen;
	}
	this.frozen = function(){
		return frozen;
	}
	this.freeze = function(){
		return frozen = true;
	}
	this.thaw = function(){
		return frozen = false;
	}
}

Array.prototype.contains = function(v) {
	var values = v
	if(typeof(v) != 'object') values = [v]
	for( var i=0; i<values.length; i++ )
		if( $.inArray(values[i],this) == -1 )
			return false;
	return true;
}

Array.prototype.sum = function() {
	var sum = 0;
	for( var i=0; i<this.length; i++ ) sum += parseInt(this[i],10)
	return sum;
}

