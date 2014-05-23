
var cartesian_to_polar = function (x,y){
	r = Math.sqrt( x*x + y*y );
	theta = Math.atan2( y, x );
	return([ r, theta ]);
}
var polar_to_cartesian = function (r,theta){
	x = r * Math.cos( theta );
	y = r * Math.sin( theta );
	return([ x, y ]);
}
function OrbitalSystem(_options){
	var options = {
		base_id: 'root',

		//	meters to pixels	(2e9) just includes Saturn's orbit on 1500px canvas 6e9 just includes Neptune
		scale: 6e9,	
		// I could scale the canvas down instead, but that scales line thickness as well.  Awkward.

		time: 0,
		delta_t: 72*3600,  // seconds
		canvas_size: 1000
	}
	$.extend( true, options, _options );
	this.canvas_size = options.canvas_size;
//	this.fixed = options.fixed;
	this.delta_t = options.delta_t;
	this.scale = options.scale;
	this.time = options.time;
	var base = document.getElementById(options.base_id);
	$(base).css({'position':'relative','width':this.canvas_size,'height':this.canvas_size});
	$(base).append("<canvas id='background_canvas' width='"+this.canvas_size+"' height='"+this.canvas_size+"' style='position: absolute; left: 0; top: 0; border:1px solid #d3d3d3;'>Your browser does not support the HTML5 canvas tag.</canvas>");
	$(base).append("<canvas id='foreground_canvas' width='"+this.canvas_size+"' height='"+this.canvas_size+"' style='position: absolute; left: 0; top: 0; border:1px solid #d3d3d3;'>Your browser does not support the HTML5 canvas tag.</canvas>");
	this.fg = document.getElementById('foreground_canvas').getContext("2d");
	this.bg = document.getElementById('background_canvas').getContext("2d");
	this.bg.fillStyle = 'rgba(200,200,200,0.2)';


// using "this" during development
//	this.bufferCanvas = document.createElement('canvas');
//	this.bufferCanvas.width = this.canvas_size;
//	this.bufferCanvas.height = this.canvas_size;
//	this.bufferContext = this.bufferCanvas.getContext("2d");
	

	// translate context to center of canvas
	this.bg.translate(this.canvas_size / 2, this.canvas_size / 2);
	this.fg.translate(this.canvas_size / 2, this.canvas_size / 2);
//	this.bufferContext.translate(this.canvas_size / 2, this.canvas_size / 2);

	// flip context vertically
	this.bg.scale(1,-1);
	this.fg.scale(1,-1);
//	this.bufferContext.scale(1,-1);

	this.bodies = options.bodies;
	this.plot = function(){
		this.fg.clearRect(-this.canvas_size/2,-this.canvas_size/2,
			this.canvas_size,this.canvas_size);
//		this.bg.save();

		// Use the identity matrix while clearing the canvas
//		this.bg.setTransform(1, 0, 0, 1, 0, 0);
//		this.bg.beginPath();

//		this.bg.globalCompositeOperation="lighter";
//		this.bg.fillStyle="rgba(255,255,255,0.03)";	// 0.01 works for a bit then poof! like a lit fuse
//		this.bg.globalCompositeOperation="destination-out";
//		this.bg.fillStyle="rgba(255,255,255,0.01)";		// 0.02 works, but 0.01 does nothing.  Too small??

//		this.bg.fillRect(0,0,this.bg.canvas.width, this.bg.canvas.height);
//		this.bg.fill();
//		this.bg.restore();


/* from http://rectangleworld.com/demos/ParticlesFading/ParticlesFade_AlphaSubtract.html */
/*

		var lastImage = context.getImageData(0,0,theCanvas.width,theCanvas.height);
		var i;
		var pixelData = lastImage.data;
		var len=pixelData.length;
		for (i=3; i<len; i += 4) {
			//change alpha
			pixelData[i] -= 3;
		}
		context.putImageData(lastImage,0,0);
*/
/*	Works, but really slow. */
/*
		var lastImage = this.bg.getImageData(0,0,this.bg.canvas.width,this.bg.canvas.height);
		var i;
		var pixelData = lastImage.data;
		var len=pixelData.length;
		for (i=3; i<len; i += 4) {
			//change alpha
			pixelData[i] -= 1;
		}
		this.bg.putImageData(lastImage,0,0);
*/


/*	Works, but really slow. */
/*	doesn't leave very long trails either */
/*	if really want could do this every nth time instead? */
/*
		this.bufferContext.clearRect(-this.bufferContext.canvas.width/2, -this.bufferContext.canvas.height/2,
			this.bufferContext.canvas.width, this.bufferContext.canvas.height);
		this.bufferContext.drawImage(this.bg.canvas,-500,-500);
		this.bg.clearRect( -this.bg.canvas.width/2, -this.bg.canvas.height/2,
			this.bg.canvas.width, this.bg.canvas.height);
		this.bg.globalAlpha = 0.95;
		this.bg.drawImage(this.bufferCanvas,-500,-500);
		this.bg.globalAlpha = 1;
*/


		$.each(this.bodies, function(){ this.plot( system.bg, system.scale, 1 ) });
		$.each(this.bodies, function(){ 
			system.fg.save();
			system.fg.fillStyle = this.color;
			this.plot( system.fg, system.scale ) 
			system.fg.restore();
		});
	};
	this.step = function(){
		system = this;
		$.each(this.bodies,function(){ this.reposition(system.delta_t); })
		$.each(this.bodies,function(){ this.revelocity(system.delta_t,system.bodies); });
		this.plot();
		this.time = this.time + this.delta_t;
		$("#days").text( this.time/3600/24 );
	};
};

function Body(_options){
	var options = {
		name:     'UnNamed',
		fixed: false,	//	most move. Set to true for things like Sun when you don't want it to wander.
		mass:     1.9891e30, //	kg
		radius: 1,	// m
		color: '#000000',	// m
		position: [0,0],	// m
		velocity: [0,0]		// m/s
	}
	$.extend( true, options, _options );
	this.name = options.name;
	var fixed = options.fixed;
	this.color = options.color;
	this.mass = options.mass;
	this.radius = options.radius;	// depending on scale, radius will usually be rounded up to 1 anyway
	this.position = options.position;
	this.x = this.position[0];
	this.y = this.position[1];
	this.velocity = options.velocity;
	this.vx = this.velocity[0];
	this.vy = this.velocity[1];
	this.fx = null;
	this.fy = null;
	this.plot = function(ctx,scale,r){
		if( typeof( r ) == 'undefined' )
			r =  3*(1+(this.radius/scale))
		else
			r = 1;
		if( typeof ctx == 'object' ){
//			ctx.save();
			ctx.beginPath();
			//	arc( x-center, y-center, radius, start_angle, end_angle, counter_clockwise_flag(optional) )
			ctx.arc( this.x/scale, this.y/scale, r, 0, 2*Math.PI);
//			ctx.fillStyle(this.color);
			ctx.fill();
//			ctx.restore();
		}
	};
	this.reposition = function(delta_t){
		if( !fixed ){
			this.x = this.x+(this.vx*delta_t);
			this.y = this.y+(this.vy*delta_t);
			$("tr#"+this.name+" td.x").text( this.x.toExponential(3)  );
			$("tr#"+this.name+" td.y").text( this.y.toExponential(3)  );
		}
	};
	this.revelocity = function(delta_t,bodies){
		if( !fixed ){
			me = this;
			fx = 0;
			fy = 0;
			G = 6.67384e-11;	//	N m^2 / kg^2
			$.each(bodies,function(){ 
				if( this.name != me.name ){
					dy = me.y-this.y; //	opposite
					dx = me.x-this.x;	//	adjacent
					dsquared = Math.pow( dx, 2 ) + Math.pow( dy, 2 );
					f = -( G * me.mass * this.mass ) / dsquared;
					theta = Math.atan2( dy, dx );	// NOT atan
					fx = fx + ( f * Math.cos( theta ) );
					fy = fy + ( f * Math.sin( theta ) );
				}
			});
			this.fx = fx;
			this.fy = fy;
	
			$("tr#"+this.name+" td.fx").text( this.fx.toExponential(3)  );
			$("tr#"+this.name+" td.fy").text( this.fy.toExponential(3)  );
	
			this.vx = this.vx + ( delta_t * fx / this.mass );
			this.vy = this.vy + ( delta_t * fy / this.mass );
			$("tr#"+this.name+" td.vx").text( this.vx.toExponential(3)  );
			$("tr#"+this.name+" td.vy").text( this.vy.toExponential(3)  );
		}
	};	//	this.revelocity = function(bodies){
};





/*

	Notes for future futsing about...

	Add more bodies.  Planets, moons, comets, asteroids, trojan asteroids, etc.
		http://en.wikipedia.org/wiki/3753_Cruithne

	Add a planet at the asteroid belt

	Rather than have a "STOP" button, perhaps a "Pause/Continue" button.

	Real orbit data rather than starting with the averages.

	Some type of "satellite" launch from Earth to Saturn sim.

	Adjustable speed, step_size, 

	Color?

	Make Sun fixed?  No velocity.  No change in position.

	Polar coordinates?

*/
