/**********************************************************
** by @oofaish   
**    http://cigari.co.uk/countdown
** create a div, with say id counter, then call:
** $('#counter').countdownCube({
**		  target: new Date( 'May 20, 2025 19:33:10' ), 
**		cubeSize: 50 
**		});
***********************************************************/

;(function ( $, window, document, undefined ) {

    /**********************************************************
    ** helpers
    **
    ** basically where all the function are defined
	***********************************************************/
    var helpers = { 
    		
            has3d: function()
            {
                        var el = document.createElement('p'),
            
                        transforms = {
                            'webkitTransform':'-webkit-transform',
                            'OTransform':'-o-transform',
                            'msTransform':'-ms-transform',
                            'MozTransform':'-moz-transform',
                            'transform':'transform'
                        };
                    
                        // Add it to the body to get the computed style
                        document.body.insertBefore(el, null);
                    
                        for(var t in transforms){
                            if( el.style[t] !== undefined ){
                                el.style[t] = 'translate3d(1px,1px,1px)';
                                has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
                            }
                        }
                    
                        document.body.removeChild(el);
                    
                        return (has3d !== undefined && has3d.length > 0 && has3d !== "none");
            },
                
    	    /**********************************************************
            ** init
            ** The main function - actually resets everything each time
            ** you call it
            ***********************************************************/
            init: function( element, options ) {
            //remove any existing elements
                    element.find('*').remove();
            
                    //if a cube is already defined, remove it and clear the timer
            if( typeof element.data('countdownCubeId' ) != 'undefined' )
            {
                        clearInterval( element.data('countdownCubeId' ) );
                        element.removeData('countdownCubeId');
            };
                        
            //somehow keep track of all the various countdowns
            if( typeof $('body').data('countdownCubeCounter') == 'undefined' )
                    $('body').data( 'countdownCubeCounter', 0 );
            else
                    $('body').data( 'countdownCubeCounter', $('body').data( 'countdownCubeCounter' ) + 1 );
            
            this.elementClass = 'countdownCube_ID_' +  $('body').data( 'countdownCubeCounter' );
            
            element.addClass( this.elementClass );
                            
            this.classes = [ 'front','back', 'right', 'left', 'top', 'bottom' ];

                if( options.showDaysOnly ){
                    this.topTags = ['hour', 'minute', 'second' ];
                    this.loadingTags = [ 'LOAD', 'ING.', '....', '....'];
                }
                else {
                    this.topTags = ['Hour', 'Minute', 'Second' ];
                    this.loadingTags = [ '03', '39', '17', 'G.', '..', '...'];
                }
                this.transformNames =  [ '-webkit-transform', '-moz-transform', '-o-transform', 'transform' ];

                cubes = [];
                    
                    //add the figures, etc to the div
                    
                    for( var tagIndex in this.topTags )
                    {
                            var tag = this.topTags[ tagIndex ];
                            
                            cube = element.append('<section></section>')
                                       .children(':last')	   
                                            .attr('id', tag )
                                       .addClass( "countdownCubeContainer" )
                                       .append('<div></div>')
                                       .children(':last')
                                       .addClass('countdownCubeCube')
                                       .data('side', 'show-front');
                            /*this is horrible, chaining would be much cooler*/
                            this.addFigures( cube, this.classes, this.loadingTags[ tagIndex ] );
                            
                            element.children(':last').append('<div></div>').children(':last').html(tag).addClass('countdownCubeTitleDiv');
                    }
                     
                    this.setupAllCss( element, options );

                    /*actually use this offset so you handle people in different time zones*/
                    /*var offset = options.target.getTimezoneOffset() + 60;//in Minutes;*/
                    
                    var that = this;
                    /*set it up for the first time, and then set a timer, to refresh every Second*/
                    
                setTimeout( function(){ that.setTimeLeft( element, options );}, 10 );
                var refreshId = setInterval( function(){ that.setTimeLeft( element, options );}, 1000 );
                element.data('countdownCubeId', refreshId );
                
                        if ( !this.has3d() )
                        {
                                    element.append("<p>Your Browser/Computer Sucks - It doesnt support 3d Transforms!</p>");
                        }           

                
            },

            /**********************************************************
            ** setupAllCss
            ** set all the various CSS properties that I need
            ** experimenting a little with various different
            ** ways of setting css properties actually.
            ***********************************************************/
            setupAllCss: function( element, options )
            {
            	element.css({
            		diaplay:	'inline-block',
            		height:      options.cubeSize * 1.5 + 'px',//a bit lazy here just doing 1.5x 
            	});
            	
        		var perspective = options.cubeSize * 5 + 'px';
        		var cubeSizepx = options.cubeSize + 'px';
        		var figurepx = options.cubeSize - 4 + 'px';
        		var fontSize = Math.round( options.cubeSize / 5 * 3 ) + 'px';
        		var titleFontSize = Math.round( options.cubeSize / 10 * 3 ) + 'px';
        		var transformSize = Math.round( options.cubeSize / 2 ) + 'px';
        		
        		$( '.' + this.elementClass + ' .countdownCubeContainer' ).css({
        			height: 				cubeSizepx,
        			width:  				cubeSizepx,
        		    '-webkit-perspective': 	perspective,
        		    '-moz-perspective': 	perspective,
        		    '-o-perspective': 		perspective,
                    'perspective': 			perspective,

        		});
        		
        		element.find( '.countdownCubeTitleDiv' ).css({
        			'margin-top': cubeSizepx,
        			'text-align': 'center',
        			'font-size'	:  titleFontSize, 
        		});
        		
        		element.find('figure').css({
        			margin:	0,
        			height: figurepx,
        			width: figurepx,
        			'line-height': figurepx,
        			'font-size': fontSize,
        			background: options.background,
        			color: options.color,
        		});

        		this.addTransforms( element, '.countdownCubeCube .front', 		'translateZ( ' + transformSize + ' )' ); 
        		this.addTransforms( element, '.countdownCubeCube .back', 		'rotateX( -180deg ) translateZ( ' + transformSize + ' )' );
        		this.addTransforms( element, '.countdownCubeCube .right', 		'rotateY(   90deg ) translateZ( ' + transformSize + ' )' );
        		this.addTransforms( element, '.countdownCubeCube .left',    	'rotateY(  -90deg ) translateZ( ' + transformSize + ' )' );
        		this.addTransforms( element, '.countdownCubeCube .top',     	'rotateX(   90deg ) translateZ( ' + transformSize + ' )' );
        		this.addTransforms( element, '.countdownCubeCube .bottom',  	'rotateX(  -90deg ) translateZ( ' + transformSize + ' )' );
        		
        		var styleSheet = "";
        		styleSheet += this.createStyleSheet( element, '.' + this.elementClass + ' .countdownCubeCube.show-front', 'translateZ( -' + transformSize + ' )' );
        		styleSheet += this.createStyleSheet( element, '.' + this.elementClass + ' .countdownCubeCube.show-back', 	'translateZ( -' + transformSize + ' ) rotateX( -180deg )' );
        		styleSheet += this.createStyleSheet( element, '.' + this.elementClass + ' .countdownCubeCube.show-right', 'translateZ( -' + transformSize + ' ) rotateY(  -90deg )' );
        		styleSheet += this.createStyleSheet( element, '.' + this.elementClass + ' .countdownCubeCube.show-left', 	'translateZ( -' + transformSize + ' ) rotateY(   90deg )' );
        		styleSheet += this.createStyleSheet( element, '.' + this.elementClass + ' .countdownCubeCube.show-top', 	'translateZ( -' + transformSize + ' ) rotateX(  -90deg )' );
        		styleSheet += this.createStyleSheet( element, '.' + this.elementClass + ' .countdownCubeCube.show-bottom','translateZ( -' + transformSize + ' ) rotateX(   90deg )' );
        		
        		this.addStyleSheet( styleSheet );            	
            },
            
    	    /**********************************************************
            ** createStyleSheet
            ** create the innerHTML of a stylesheet for the cube
            ** transforms
            ***********************************************************/
            createStyleSheet: function( element, childSelector, transform )
            {
            	var newCssProperties = '{';
            	
            	for( var index in this.transformNames )
            		newCssProperties += this.transformNames[ index ] + ': ' + transform + ';';
            	
            	newCssProperties += '}';

            	return childSelector + newCssProperties ;
            },
            
    	    /**********************************************************
            ** addStyleSheet
            ** Add the stylesheet to the head
            ***********************************************************/
            addStyleSheet: function( styleSheet )
            {
            	var style = document.createElement('style');
            	style.type = 'text/css';
            	style.innerHTML = styleSheet;
            	$( style ).appendTo('head');
            },
    	    /**********************************************************
            ** addTransforms
            ** a different way of adding CSS properties for the 
            ** cube
            ***********************************************************/

            addTransforms: function( element, childSelector, transform )
            {
            	var newCssProperties = {};
            	
            	for( var index in this.transformNames )
            		newCssProperties[ this.transformNames[ index ] ] = transform;
            	element.find( childSelector ).css( newCssProperties );
            },

            /**********************************************************
            ** addFigures
            ** add the figures to each cube
            ***********************************************************/
            addFigures: function( cube, classes, loadingTag )
            {
            	var i;

            	for( i = 0; i< 6; i ++ )
            	{
            		cube.append('<figure></figure>').children(':last').addClass(classes[ i ] ).html( loadingTag );
            	}

            	return this;        	    
            },
    	    /**********************************************************
    		** shiftCube
    		** shift the cube to a new position 
    		** FIXME each cube should be an object with this method
    		***********************************************************/
        	shiftCube: function( element, options, cube, nextNumber )
        	{
        		var classes = this.classes;
        		var lastNumber = cube.data('number');
        		if( nextNumber != lastNumber )
        		{
        			var lastClass = cube.data( 'side' );
        			var lastClassShort = lastClass.replace( 'show-', '');
        			var classesCopy = classes.slice(0);
        			var nextIndex = Math.floor( Math.random() * 5 );
        	    	var lastClassIndex = classesCopy.indexOf( lastClassShort );
        	    	classesCopy.splice( lastClassIndex, 1 );
        	    	var nextClassShort = classesCopy[ nextIndex ];
        	    	var nextClass = 'show-' + nextClassShort;
        	    	
        	        cube.find('figure').not( '.' + lastClassShort ).html( nextNumber );
        	    	cube.removeClass( lastClass ).addClass( nextClass );
        			cube.data('side', nextClass );
        			cube.data('number', nextNumber );
        		};
        	},

        	/**********************************************************
    		** setTimeLeft
    		** FIXME there must be a cleaner way of doing this function
    		*		 this way is potentially buggy.
    		***********************************************************/

    		setTimeLeft: function( element, options )
    		{
    			//FIXME Create these using this.topTags so you are consistent 
        		var secCube 	= element.find('#Second .countdownCubeCube');
        		var minCube 	= element.find('#Minute .countdownCubeCube'); 
        		var HourCube 	= element.find('#Hour .countdownCubeCube');
        		var DayCube	 	= element.find('#Day .countdownCubeCube');
        		var MonthCube 	= element.find('#Month .countdownCubeCube');
        		var YearCube 	= element.find('#Year .countdownCubeCube'); 
        	
    	    	var now = new Date();
    	    	
    	    	var diff = ( options.target - now ) / 1000.0;
    	    	if( diff < 0 )
    	    	{
    	    		clearInterval( element.data('countdownCube').refreshId );
    	    		return;
    	    	}
    	    	var DaysToShow, MonthsToShow, HoursToShow, MinutesToShow, SecondsToShow;
    	    	
    	    	var Years  	= options.target.getFullYear() 	- now.getFullYear();
    	    	var Months 	= options.target.getMonth() 	- now.getMonth();
    	    	var Days   	= options.target.getDate() 		- now.getDate();
    	    
    	    	var Hours   = options.target.getHours() 	- now.getHours();
    	    	var Minutes = options.target.getMinutes() 	- now.getMinutes();
    	    	var Seconds = options.target.getSeconds() 	- now.getSeconds();
    	    	
    	    	var copy;
    	    	
    	    	copy = new Date( now.getTime() );
    	    	copy.setFullYear(copy.getFullYear() + Years );
    	    	
    	    	if( copy > options.target )
    	    	{
    	    		YearsToShow = Years - 1;
    	    		MonthsToShow = Months + 12;
    	    	}
    	    	else
    	    	{
    	    		YearsToShow = Years;
    	    		MonthsToShow = Months;
    	    	}
    	    	
    	    	//handle cases where the target Day is on an earlier Day in the Month to now (e.g. now is 22nd, target Day is 10th)
    	    	if( Days < 0 || ( Days == 0 && Hours < 0 ) || ( Days == 0 && Hours == 0 && Minutes < 0 ) || ( Days == 0 && Hours == 0 && Minutes == 0 && Seconds <= 0 ) )
    	    	{
    	    		var copy = new Date( now.getTime() );
    	    		copy.setDate(1);
    	    		copy.setMonth( now.getMonth() + 1 );
    	    		var diffToNextMonth = Math.round( ( copy - now ) / 1000 / 3600 / 24 ) - 1;
    	    		DaysToShow = options.target.getDate() + diffToNextMonth;
    	    		MonthsToShow --;
    	    	}
    	    	else if( Days == 0 )
    	    	{
    	    		DaysToShow = 0;
    	    	}
    	    	else 
    	    	{
    	    		DaysToShow = Days;
    	    	}

    	    	//similarly to above, handle case when target Hour is before the current Hour
    	    	if( Hours < 0 || ( Hours == 0 && Minutes < 0 ) || ( Hours == 0 && Minutes == 0 && Seconds <= 0 ) )
    	    	{
    	    		DaysToShow --;
    	    	}

    	    	HoursToShow = (Hours + 24 ) % 24;

    	    	diffTime = new Date( diff * 1000 );
    	    	
    	    	SecondsToShow = diffTime.getSeconds();
    	    	MinutesToShow = diffTime.getMinutes();
    			HoursToShow   = diffTime.getHours();
    			
    	    	/* make each cube an object on its own with a feature to shift it!*/
    	    	this.shiftCube( element, options, secCube, SecondsToShow );
    	    	this.shiftCube( element, options, minCube, MinutesToShow );
    	    	this.shiftCube( element, options, HourCube, HoursToShow );
    	    	this.shiftCube( element, options, DayCube, DaysToShow );
    	    	this.shiftCube( element, options, MonthCube, MonthsToShow );
    	    	this.shiftCube( element, options, YearCube, YearsToShow );
    		},

        };
    
    /**********************************************************
     ** Plugin
     ** definition of the plugin function
     ***********************************************************/
    function Plugin( element, userOptions ) {
        var options = $.extend( {}, $.fn.countdownCube.defaults, userOptions );
        
        helpers.init( element, options );
        //add the options to the data, so we know what state we are in
        element.data( 'countdownCube', options );
    }
    
    /**********************************************************
     ** Actual attachment to jQuery
     ***********************************************************/    
    $.fn['countdownCube'] = function ( options ) {
        return this.each(function () {
        	Plugin( $( this ), options );
        } );
    };
    
    /**********************************************************
    ** Defaults
    ***********************************************************/
    
    $.fn.countdownCube.defaults = {
    		
            /*target: new Date(),*/
    		cubeSize: 50,
    		background: 'rgba( 255, 150, 150, 0.8 )',
    		color: 'white',
        };

})( jQuery, window, document );
