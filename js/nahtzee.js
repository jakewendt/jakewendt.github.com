$(function(){ 
	y = new Yahtzee({ 
		board_tag: "div#yahtzee_board"
	}); 
});

//	http://en.wikipedia.org/wiki/Yahtzee

function Yahtzee(options_) {
	var _this = this;
	var options = {
		board_tag: 'div#yahtzee_board'
	}
	$.extend( true, options, options_ );
	build_board();

	round = new Round();
	var round_count = 1;
	display_roll();

	this.scores = {
		bonus_yahtzees: 0
	};
	
	this.score_round = function(score_name){
		if(!this.scores[score_name]){
			var roll_scores = round.scores();

if( this.scores['yahtzee'] && roll_scores['yahtzee'] ) {
	this.scores['bonus_yahtzees'] += 100
	$('#lower_bonus_score td.score').html(this.scores['bonus_yahtzees'])
}

			this.scores[score_name] = roll_scores[score_name];
			$('#'+score_name+' td.score').html(roll_scores[score_name]);

			//	$('#'+score_name+' td.reroll').remove();
			$('#'+score_name+' td.reroll').unbind();
			$('#'+score_name+' td.reroll').html('');
			$('#'+score_name+' td.reroll').removeClass('reroll');

			var upper_total = (this.scores['aces']||0) + 
				(this.scores['twos']||0) +
				(this.scores['threes']||0) + 
				(this.scores['fours']||0) +
				(this.scores['fives']||0) + 
				(this.scores['sixes']||0)
			$('#upper_total td.score').html(upper_total)

			var upper_bonus = 0;
			if( upper_total > 62 ) {
				upper_bonus = 35;
				$('#upper_bonus td.score').html(upper_bonus)
			}
			$('tr.upper_grand_total td.score').html(upper_total + upper_bonus)
			var lower_total = (this.scores['three_of_a_kind']||0) + 
				(this.scores['four_of_a_kind']||0) +
				(this.scores['full_house']||0) + 
				(this.scores['small_straight']||0) +
				(this.scores['large_straight']||0) + 
				(this.scores['chance']||0) + 
				(this.scores['yahtzee']||0) +
				(this.scores['bonus_yahtzees'])
			$('#lower_total td.score').html(lower_total)
			$('#grand_total td.score').html(upper_total + upper_bonus + lower_total )

			if( round_count < 13 ) {
				round = new Round(this.scores['yahtzee']);
				round_count++;
				display_roll();
			} else {
				$('#card table#score_card tr.rollable td.roll').html('');	//	remove();
				$('#card table#score_card tr.rollable td.reroll').html('');	//	remove();
			}
		}
	}

	function reroll(){
		if( round.reroll() )
			display_roll();
	}

	function build_board(){
		$(options.board_tag).html("");
		$(options.board_tag).append("<div id='card'>&nbsp;</div>")
		$(options.board_tag).append("<div id='misc'></div>")
		$('#misc').append("<div id='dice'>&nbsp;</div>")
		$('#misc').append("<div id='control'>&nbsp;</div>");
		$('#card').html(
			"<table id='score_card' border='1'>" +
			"<tr id='upper_label'><td colspan='4'>Upper Section</td></tr>" +
			"<tr class='scoreable rollable' id='aces'><td>Aces<span>(Total 1's)</span></td></tr>" +
			"<tr class='scoreable rollable' id='twos'><td>Twos<span>(Total 2's)</span></td></tr>" +
			"<tr class='scoreable rollable' id='threes'><td>Threes<span>(Total 3's)</span></td></tr>" +
			"<tr class='scoreable rollable' id='fours'><td>Fours<span>(Total 4's)</span></td></tr>" +
			"<tr class='scoreable rollable' id='fives'><td>Fives<span>(Total 5's)</span></td></tr>" +
			"<tr class='scoreable rollable' id='sixes'><td>Sixes<span>(Total 6's)</span></td></tr>" +
			"<tr class='scoreable' id='upper_total'><td>Total</td></tr>" +
			"<tr class='scoreable' id='upper_bonus'><td>Bonus<span>(35 if total>62)</span></td></tr>" +
			"<tr class='scoreable upper_grand_total'><td>Upper Total</td></tr>" +
			"<tr><td></td></tr>" +
			"<tr id='lower_label'><td colspan='4'>Lower Section</td></tr>" +
			"<tr class='scoreable rollable' id='three_of_a_kind'><td>3 of a kind<span>(sum)</span></td></tr>" +
			"<tr class='scoreable rollable' id='four_of_a_kind'><td>4 of a kind<span>(sum)</span></td></tr>" +
			"<tr class='scoreable rollable' id='full_house'><td>Full House<span>(25)</span></td></tr>" +
			"<tr class='scoreable rollable' id='small_straight'><td>Sm. Straight<span>(30)</span></td></tr>" +
			"<tr class='scoreable rollable' id='large_straight'><td>Lg. Straight<span>(40)</span></td></tr>" +
			"<tr class='scoreable rollable' id='yahtzee'><td>Yahtzee<span>(50)</span></td></tr>" +
			"<tr class='scoreable rollable' id='chance'><td>Chance<span>(sum)</span></td></tr>" +
			"<tr class='scoreable' id='lower_bonus_score'><td>Bonus chips<span>(100 each)</span></td></tr>" +
			"<tr class='scoreable' id='lower_total'><td>Lower Total</td></tr>" +
			"<tr class='scoreable upper_grand_total'><td>Upper Total</td></tr>" +
			"<tr class='scoreable' id='grand_total'><td>Grand Total</td></tr>" +
			"</table>"
		);
		$('#control').html(
			"<h1>Round:<span id='round_count'></span></h1>" +
			"<h1>Roll:<span id='roll_count'></span></h1>" +
			"<button type='button' id='reroll'>Reroll</button>"
		);
		$('#card table#score_card tr.scoreable').append("<td class='score'>&nbsp;</td>");
		$('#card table#score_card tr.rollable').append("<td class='roll'>&nbsp;</td>");
		$('#card table#score_card tr.rollable').append("<td class='reroll'>&nbsp;</td>");
		$('#reroll').click(function(){ reroll(); });
	}

	function display_roll(){
		var roll_scores = round.scores()
		$('td.roll').html('');
		if(val=roll_scores['aces']) 
			$('#aces td.roll').html(val);
		if(val=roll_scores['twos']) 
			$('#twos td.roll').html(val);
		if(val=roll_scores['threes']) 
			$('#threes td.roll').html(val);
		if(val=roll_scores['fours']) 
			$('#fours td.roll').html(val);
		if(val=roll_scores['fives']) 
			$('#fives td.roll').html(val);
		if(val=roll_scores['sixes']) 
			$('#sixes td.roll').html(val);
		if(val=roll_scores['three_of_a_kind']) 
			$('#three_of_a_kind td.roll').html(val);
		if(val=roll_scores['four_of_a_kind']) 
			$('#four_of_a_kind td.roll').html(val);
		if(val=roll_scores['full_house']) 
			$('#full_house td.roll').html(val);
		if(val=roll_scores['small_straight']) 
			$('#small_straight td.roll').html(val);
		if(val=roll_scores['large_straight']) 
			$('#large_straight td.roll').html(val);
		if(val=roll_scores['yahtzee']) 
			$('#yahtzee td.roll').html(val);
		$('#chance td.roll').html(roll_scores['chance'])
		$('td.reroll').html("Score");
		$('td.reroll').unbind();
		$('td.reroll').click(function(){
			_this.score_round($(this).parent('tr').attr('id'));
		});
		$('#round_count').html(round_count);
		$('#roll_count').html(round.roll_count());
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

function Round(yahtzeed){
	dice = new Dice({
		dice_count: 5,
		board_tag:  'div#dice'
	});

	this.roll_count = dice.roll_count;
	this.values = dice.values;

	this.reroll = function(){
		if( this.roll_count() < 3 ){
			dice.reroll();
			dice.update_dice();
			return true;
		} else {
			return false;
		}
	}

	this.scores = function(){
		return {
			aces: aces(),
			twos: twos(),
			threes: threes(),
			fours: fours(),
			fives: fives(),
			sixes: sixes(),
			three_of_a_kind: three_of_a_kind(),
			four_of_a_kind: four_of_a_kind(),
			full_house: full_house(),
			small_straight: small_straight(),
			large_straight: large_straight(),
			yahtzee: yahtzee(),
			chance: dice.values().sum()
		}
	}

	function aces(){
		var matches = dice.values().join('').match(/1/g)
		if( matches )
			return matches.sum();
		else
			return 0;
	}

	function twos(){
		var matches = dice.values().join('').match(/2/g)
		if( matches )
			return matches.sum();
		else
			return 0;
	}

	function threes(){
		var matches = dice.values().join('').match(/3/g)
		if( matches )
			return matches.sum();
		else
			return 0;
	}

	function fours(){
		var matches = dice.values().join('').match(/4/g)
		if( matches )
			return matches.sum();
		else
			return 0;
	}

	function fives(){
		var matches = dice.values().join('').match(/5/g)
		if( matches )
			return matches.sum();
		else
			return 0;
	}

	function sixes(){
		var matches = dice.values().join('').match(/6/g)
		if( matches )
			return matches.sum();
		else
			return 0;
	}

	function three_of_a_kind(){
		var matches = dice.values().sort().join('').match(/(\d)\1\1/g)
		if( matches || ( yahtzee() && yahtzeed ) )
			return dice.values().sum();
		else
			return 0;
	}

	function four_of_a_kind(){
		var matches = dice.values().sort().join('').match(/(\d)\1\1\1/g)
		if( matches || ( yahtzee() && yahtzeed ) )
			return dice.values().sum();
		else
			return 0;
	}

	function yahtzee(){
		var matches = dice.values().sort().join('').match(/(\d)\1\1\1\1/g)
		if( matches )
			return 50;
		else
			return 0;
	}
	
	function full_house(){
		var matches = dice.values().sort().join('').match(/((\d)\2(\d)\3\3)|((\d)\5\5(\d)\6)/g)
		if( matches || ( yahtzee() && yahtzeed ) )
			return 25;
		else
			return 0;
	}

	function small_straight(){
		if(dice.values().contains([1,2,3,4]) || 
			dice.values().contains([2,3,4,5]) || 
			dice.values().contains([3,4,5,6]) || ( yahtzee() && yahtzeed ) )
			return 30;
		else
			return 0;
	}

	function large_straight(){
		if(dice.values().contains([1,2,3,4,5]) || dice.values().contains([2,3,4,5,6]) || ( yahtzee() && yahtzeed )) 
			return 40;
		else
			return 0;
	}
}
