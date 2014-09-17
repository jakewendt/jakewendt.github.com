$(function(){ 
	bj = new BlackJack({ 
		board_tag: "div#blackjack_board"
	}); 
});

// http://www.eludication.org/playingcards.html

function BlackJack(options_) {
	var _this = this;
	var options = {
		board_tag: 'div#blackjack_board',
		deck_count: 4
	}
	$.extend( true, options, options_ );
	var shoe = new Deck(options.deck_count);
	var dealer_hand;
	var player_hand;
	var bank = 0;
	var wager = 10;
	build_board();
	$('#wager').val(wager);

	function build_board(){
		$(options.board_tag).html(
			"<div id='dealer' class='side'></div>" +
			"<div id='player' class='side'></div>"
		);
		$('#dealer').html(
			"<div id='deck' class='card_holder'><img class='card' src='eludication/back-red-150-1.png' /></div>" +
			"<div id='info' class='card_holder'><div class='card'></div></div>" +
			"<div id='dealer_hand' class='hand card_holder'></div>" +
			"<p class='message'>Dealer stands on all 17's</p>"
		);
		$('#player').html(
			"<div id='chips' class='card_holder'>" +
			"<div class='card'>" +
				"<span class='label'>Wager:</span>" +
				"<input id='wager' type='text' size='6' />" +
				"<span class='label'>Bank:</span>" +
				"<span id='bank'>"+bank+"</span>" +
			"</div>" +
			"</div>" +
			"<div id='controls' class='card_holder'><div class='card'></div></div>" +
			"<div id='player_hand' class='hand card_holder'></div>"
		);
		$('#controls .card').html(
			"<button type='button' id='double' disabled='true'> Double Down </button>" +
			"<button type='button' id='hit'    disabled='true'> Hit Me </button>" +
			"<button type='button' id='stand'  disabled='true'> Stand </button>" +
			"<button type='button' id='deal'> Deal New Hand </button>"
		);
		$('button#double').click(double_down);
		$('button#hit').click(hit_me);
		$('button#stand').click(finish_dealer_hand);
		$('button#deal').click(deal);
		$('#info .card').html(
			"<span class='label'>Decks in shoe:</span>" +
			"<span id='deck_count'>"+options.deck_count+"</span> " +
			"<span class='label'>Cards left in shoe:</span>" +
			"<span id='card_count'>"+shoe.cards().length+"</span> " +
			"<span class='label'>Hi Opt I:</span>" +
			"<span id='hi_opt_i'>"+shoe.hi_opt_i.with_sign()+"</span> " 
		);
	}

	function deal(){
		if(wager = parseInt($('#wager').val(),10) ) {
//			$('#wager').disable();
			$('#wager').attr('disabled',true);
			dealer_hand = new Hand();
			player_hand = new Hand();
			player_hand.add_card(shoe.deal_and_count());
			dealer_hand.add_card(shoe.deal_and_count());
			player_hand.add_card(shoe.deal_and_count());
			dealer_hand.add_card(shoe.deal_and_count());
			show_dealer_hand();
			show_player_hand();
			$('#double').attr( 'disabled',false);
			$('#hit').attr( 'disabled',false);
			$('#stand').attr('disabled',false);
			$('#deal').attr('disabled',true);
			$('#bank').html(bank);
			update_card_count();
		} else {
			alert("No wager. No play.");
		}
	}

	function show_dealer_hand(show_all){
		$('#dealer_hand').html('');
		var dcards = dealer_hand.cards();
		if( show_all ) {
			for(var i=0; i<dcards.length; i++)
				$('#dealer_hand').append(
					image_for(dcards[i])
				);
			$('#dealer_hand').append("<div class='score card'>"+dealer_hand.score()+"</div>");
		} else {
			$('#dealer_hand').append(
				"<div class='card'><img src='eludication/back-red-150-1.png' /></div>" +
				image_for(dcards[1])
			);
		}
	}
	
	function show_player_hand(){
		$('#player_hand').html('');
		var pcards = player_hand.cards();
		for(var i=0; i<pcards.length; i++)
			$('#player_hand').append(
				image_for(pcards[i])
			);
		$('#player_hand').append("<div class='score card'>"+player_hand.score()+"</div>");
	}

	function image_for(card){
		return "<div class='card'><img src='eludication/"+card.suit()+"-"+card.face()+"-150.png' /></div>"
	}

	function finish_dealer_hand(){
		if( !player_hand.bust() ){
			while( dealer_hand.score() < 17 )
				dealer_hand.add_card(shoe.deal_and_count());
			show_dealer_hand(true);
		}
		update_card_count();
		hand_over();
	}

	function hit_me(){
		$('#double').attr('disabled',true);
		player_hand.add_card(shoe.deal_and_count());
		show_player_hand();
		update_card_count();
		if( player_hand.bust() ){
			hand_over();
//			$('#player_hand').append("<div class='lightbox'><span>Busted!</span></div>")
//			$('body').append("<div class='lightbox'><span>Busted!</span></div>")
		}
	}

	function double_down(){
		wager *= 2;
		$('#wager').val(wager);
		player_hand.add_card(shoe.deal_and_count());
		show_player_hand();
		if( player_hand.bust() ){
			update_card_count();
			hand_over();
//			$('#player_hand').append("<div class='lightbox'>Busted!</div>")
		}else
			finish_dealer_hand();
		wager /= 2;
		$('#wager').val(wager);
	}

	function update_card_count(){
		$('#card_count').html(shoe.cards().length);
		$('#hi_opt_i').html(shoe.hi_opt_i.with_sign());
	}

	function hand_over(){
		$('#double').attr('disabled',true);
		$('#hit').attr('disabled',true);
		$('#stand').attr('disabled',true);
		$('#deal').attr('disabled',false);
		$('#wager').attr('disabled',false);
//		$('#wager').enable();
		/*

			Whenever the dealer has a blackjack, 
				he wins against all player hands except those 
				that also have a blackjack (which are a "push")
			The payoff for a player blackjack is 3:2	(1.5*wager)

			Does a dealer blackjack beat a player 21?
			Does a player blackjack beat a dealer 21?
				If so, does it still payout 3:2

		*/
		if( player_hand.bust() )
			bank -= wager;
		else {
			if( dealer_hand.bust() )
				bank += wager;
			else {
				if( player_hand.score() > dealer_hand.score() ){
					if( player_hand.blackjack() )
						bank += (1.5 * wager)
					else
						bank += wager;
				} else if( player_hand.score() < dealer_hand.score() )
					bank -= wager;
				else if( dealer_hand.blackjack() && !player_hand.blackjack() ) // both 21, but dealer has natural
					bank -= wager;
			} 
		} 
		$('#bank').html(bank);
	}

}


function Hand(){
	var cards = new Array();
	
	this.add_card = function(new_card){
		if( new_card instanceof Card ){
			cards.push(new_card);
			return true;
		} else 
			return false;
	}

	this.cards = function(){
		return cards;
	}

	this.score = function(){
		var score = 0;
		for(var i=0; i<cards.length; i++)
			score += cards[i].value();

		for(var i=0; i<cards.length; i++){
			if(/a/i.test(cards[i].face())){
				if(score < 12)
					score += 10;		//	add 10 more than the previously added 1
			}
		}
		return score;
	}

	this.bust = function(){
		return ( this.score() > 21 );
	}

	this.blackjack = function(){
		return ( this.score() == 21 && cards.length == 2 )
	}

}

Deck.prototype.ace_five = 0;
Deck.prototype.hi_lo = 0;
Deck.prototype.hi_opt_i = 0;
Deck.prototype.hi_opt_iI = 0;
Deck.prototype.zen_count = 0;
Deck.prototype.omega_ii = 0;
Deck.prototype.deal_and_count = function(){
	//	this will affect the card counting, even for the Dealer's hold card before its revealed
	var card = this.deal()
	/*
		http://en.wikipedia.org/wiki/Card_counting (Hi-Opt I)
		Card Strategy     2 	3 	4 	5 	6 	7 	8 	9 	10 	J 	Q 	K 	A
		Wizard Ace/Five   0 	0 	0 	+1 	0 	0		0		0		0		0 	0 	0 	−1
		Hi-Lo            +1 	+1 	+1 	+1 	+1 	0 	0 	0 	−1 	−1 	−1 	−1 	−1
		Hi-Opt I          0 	+1 	+1 	+1 	+1 	0 	0 	0 	−1 	−1 	−1 	−1 	0
		Hi-Opt II        +1 	+1 	+2 	+2 	+1 	+1 	0 	0 	−2 	−2 	−2 	−2 	0
		Zen Count        +1 	+1 	+2 	+2 	+2 	+1 	0 	0 	−2 	−2 	−2 	−2 	−1
		Omega II         +1 	+1 	+2 	+2 	+2 	+1 	0 	−1 	−2 	−2 	−2 	−2 	0
		KO 	             +1 	+1 	+1 	+1 	+1 	+1 	0 	0 	−1 	−1 	−1 	−1 	−1			// Unbalanced!
	*/
	if(card.value() == 11){
		this.ace_five--;
		this.hi_lo--;
		this.zen_count--;
	} else if(card.value() == 10){
		this.hi_lo--;
		this.hi_opt_i--;
		this.hi_opt_ii-=2;
		this.zen_count-=2;
		this.omega_ii-=2;
	} else if(card.value() == 9){
		this.omega_ii--;
	} else if(card.value() == 7){
		this.hi_opt_ii++;
		this.zen_count++;
		this.omega_ii++;
	} else if(card.value() == 6){
		this.hi_lo++;
		this.hi_opt_i++;
		this.hi_opt_ii++;
		this.zen_count+=2;
		this.omega_ii+=2;
	} else if(card.value() == 5){
		this.ace_five++;
		this.hi_lo++;
		this.hi_opt_i++;
		this.hi_opt_ii+=2;
		this.zen_count+=2;
		this.omega_ii+=2;
	} else if(card.value() == 4){
		this.hi_lo++;
		this.hi_opt_i++;
		this.hi_opt_ii+=2;
		this.zen_count+=2;
		this.omega_ii+=2;
	} else if(card.value() == 3){
		this.hi_lo++;
		this.hi_opt_i++;
		this.hi_opt_ii++;
		this.zen_count++;
		this.omega_ii++;
	} else if(card.value() == 2){
		this.hi_lo++;
		this.hi_opt_ii++;
		this.zen_count++;
		this.omega_ii++;
	}
	return card;
}

Card.prototype.value = function(){
	var value = 0;
	if(/a/i.test(this.face()))
		value = 1;	//	default to 1 rather than 11 to make scoring easier
	else if(/\d+/i.test(this.face()))
		value = parseInt(this.face(),10);
	else
		value = 10;
	return value;
}

Number.prototype.with_sign = function(){
	return ( this > 0 ) ? "+"+this : this.toString();
}
