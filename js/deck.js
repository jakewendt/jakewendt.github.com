function Deck(decks) {
	var decks = decks || 1;
	var cards = new Array();
	var suits = [ 'diamonds','hearts','spades','clubs' ];
	var faces = ['2','3','4','5','6','7','8','9','10','j','q','k','a'];
	build();

	function build(){
		var deck_count = decks;
		while(deck_count--){
			for(var s=0; s<suits.length; s++){
				for(var f=0; f<faces.length; f++){
					cards.push( new Card({ face: faces[f], suit: suits[s] }) );
				}
			}
		}
		cards.shuffle();
	}

	this.deal = function(){
		if( cards.length == 0 )
			build();
		return cards.pop();
	}

	this.cards = function(){
		return cards;
	}

}

function Card(options_) {
	var options = {
		face: 'q',
		suit: 'hearts'
	}
	$.extend( true, options, options_ );
	
/*
	// would be nice to preload in the backgound, but this actually happens in the foreground
	var image = new Image();
	image.src = "eludication/"+options.suit+"-"+options.face+"-150.png"
*/

	this.suit = function(){
		return options.suit;
	}

	this.face = function(){
		return options.face;
	}

	// potentially use in blackjack for 'historic' blackjack payout of 10:1
	this.color = function(){
		return ( /hearts|diamonds/.test(options.suit) ? 'red' : 'black' )
	}
}

Array.prototype.shuffle = function(){
	for(var j, x, i = this.length; 
		i; 
		j = parseInt(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);
	return this;
};

/*
Object.prototype.dup = function(){
	obj = new Object();
	for( property in this )
		obj[property] = this[property]
	return obj;
}
*/
