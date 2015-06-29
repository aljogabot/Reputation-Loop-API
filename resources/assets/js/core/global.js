function Global_Bogart( $settings ) {
	this.construct( $settings );
}

Global_Bogart.prototype = {

	construct : function( $settings ) {
		// Initialization ...
		if( $settings ) {
			this.init_settings( $settings );
		}
		if( this.use_loader ) {
			this.init_transparent_overlay();
		}
		this.additional_functions();
	},
	
	loaded_scripts : [],
	loaded_styles : [],
	
	ajax_push_resource : false,
	
	use_loader : true,
	use_error_icon : true,
	use_error_popup : true,

	scroll_to_message : true,
	
	use_own_message_script : false,
	
	response : false,

    gritter_id : false,

	init_settings : function( $settings ) {
		
		$self = this;
		
		$.each(
			$settings,
			function( $key, $value ) {
				$self[ $key ] = $value;
			}
		);
		
	},

	form : function( element_variable, variables, callback ) {
		
		var $self = this;
        var $extra_post_variables = variables;
		
		var $defaults = {
			errorClass: "help-inline text-danger",
			errorElement: "span",
			highlight:function( element, errorClass, validClass ) {
				$( element ).parents( '.form-group' ).addClass( 'has-error' );
			},
			unhighlight: function( element, errorClass, validClass ) {
				$( element ).parents('.form-group' ).removeClass( 'has-error' );
				$( element ).parents('.form-group' ).addClass( 'has-success' );
			},
			submitHandler : function( element ) {
				
				if( $self.use_loader ) {
					$self.overlay();
				}
				
				if( callback && $.isPlainObject( callback ) && $.isFunction( callback.before_submit ) ) {
					
					if ( ! callback.before_submit() ) { 
						if( $self.use_loader )
							$self.normal();
						
						return false;
					}
				}

                $( element ).find( '#alert-message-box' ).hide();

                $( element ).ajaxSubmit(
                    {
                        data: $extra_post_variables,
                        headers : {
                            'X-CSRF-TOKEN' : $( 'meta[name="csrf-token"]' ).attr( 'content' )
                        },
                        success: function( response ) {

                            $self.response = response;

                            $self.read_response( response, element );

                            if( callback ) {

                                if( $.isFunction( callback ) ) {
                                    callback( $self.response );
                                }

                                if( $.isPlainObject( callback ) && $.isFunction( callback.after_submit ) ) {

                                    callback.after_submit( $self.response );

                                }

                            }

                        },

                        error : function( $response ) {

                            if( $response.status == 401 )
                                $( location ).prop( 'pathname', '/' );

                            if( $response.status == 422 ) {

                                var $response_object = {};
                                $response_object.field_errors = $response.responseJSON;

                                // Automatically this is an error ...
                                $response_object.success = false;

                                var $ajax_error_message = $response_object.field_errors.ajax_error_message ?
                                    $response_object.field_errors.ajax_error_message : 'There was an error';

                                $response_object.message = $ajax_error_message;

                                $self.read_response( $response_object, element );

                                if( callback ) {

                                    if( $.isFunction( callback ) ) {
                                        callback( $response_object );
                                    }

                                    if( $.isPlainObject( callback ) && $.isFunction( callback.after_submit ) ) {

                                        callback.after_submit( $response_object );

                                    }

                                }


                            }


                        }
                    }
                );

			}
		};
		
		variables = $.fn.extend( $defaults, variables );
		
		$( element_variable ).validate( variables );
		
		return this;
		
	},
	
	ajax : function( url, parameters, element, callback ) {
		
		var $self = this;
		
		if( $self.use_loader ) {
			$self.overlay();
		}
		
		if( callback && $.isPlainObject( callback ) && $.isFunction( callback.before_submit ) ) {
			callback.before_submit();
		}

		jQuery.ajax(
			{
				url : url,
				type : 'POST',
				dataType: 'json',
                headers: {
                    'X-CSRF-TOKEN' : $( 'meta[name="csrf-token"]' ).attr( 'content' )
                },
				data : parameters,
				success : function( response ) {
					
					$self.response = response;
					
					$self.read_response( response, element );
					
					if( callback ) {
							
						if( $.isFunction( callback ) ) {
							callback( $self.response );
						}							

						if( $.isPlainObject( callback ) && $.isFunction( callback.after_submit ) ) {

							callback.after_submit( $self.response );

						}

					}
					
				},

                error : function( $response ) {

                    if( $response.status == 401 )
                        $( location ).prop( 'pathname', '/' );

                    if( $response.status == 422 ) {

                        var $response_object = {};
                        $response_object.field_errors = $response.responseJSON;

                        // Automatically this is an error ...
                        $response_object.success = false;

                        $response_object.message = 'There was an error.';

                        $self.read_response( $response_object, element );

                        if( callback ) {

                            if( $.isFunction( callback ) ) {
                                callback( $response_object );
                            }

                            if( $.isPlainObject( callback ) && $.isFunction( callback.after_submit ) ) {

                                callback.after_submit( $response_object );

                            }

                        }


                    }

                }
			}
			
		);
		
	},
	
	ajax_pull : function( $pull_file ) {
		
		LazyLoad.js( 'temp/response/' + $pull_file );
		
	},
	
	ajax_push : function( url, parameters, element, callback ) {
		
		var $self = this;
		
		$self.use_loader = false;
		
		var $push_file = $Site_Tools.uniqid();
		parameters.push_file = $push_file;
		
		$self.ajax_push_resource = setInterval(
			function() {
				 $self.ajax_pull( parameters.push_file + '.js' );
			},
			700
		);
		
		$.ajax(
			{
				url : url,
				type : 'post',
				dataType: 'json',
				data : parameters,
				success : function( response ) {
					
					$self.response = response;
					
					$self.read_response( response, element );
					
					if( callback ) {
						callback( $self.response );
					}
					
					$self.use_loader = true;
					
				},
				
				error : function() {
					// ...
					if( $self.use_loader ) {
						 $self.normal();
					}
				}
			}
			
		);
		
	},

	read_response : function( response, element ) {
		
		var $json;
		var $self = this;
		
		if( typeof response === 'object' ) {
			$json = response;
		} else {
			$json = $.parseJSON( response );
		}
		
		if( $json.message != null ) {
			
			if( element && $( element ).find( '#alert-message-box' ).length ) {

				var $class = $json.success ? 'alert-success' : 'alert-danger';
				var $remove_class = $json.success ? 'alert-danger' : 'alert-success';

				var $message_element = $( element ).find( '#alert-message-box' );
				
				$message_element.css( { 'display' : 'block' } )
								.addClass( $class )
								.removeClass( $remove_class )
								.html( $json.message );
				
				if( $self.scroll_to_message ) {
					$self.scroll_to( $message_element, 800, 65 );
				}
				
			} else {
				
				if( $self.use_error_popup ) {
					
					if( $self.use_own_message_script ) {
						
						$self.status_message( $json.message, $json.success == false ? 'Please correct them.' : 'Success.', 3000 );
						
					} else {
						
						if( $self.use_error_icon ) {
							if( $json.success ) {
								humanMsg.displayMsg( '<img src="' + $site_config.base_url + 'assets/images/success-icon.png" /> ' + $json.message );
							} else {
								humanMsg.displayMsg( '<img src="' + $site_config.base_url + 'assets/images/error-icon.png" /> ' + $json.message );
							}
						} else {
							humanMsg.displayMsg( $json.message );
						}
						
					}
					
				}
				
			}
			
		}
		
		if( $json.html != null ) {

			var $x;

			for( $x = 0; $x < $json.html.length; $x++ ) {
				if( $x % 2 === 0 ) {
					$( $json.html[ $x ] ).html( $json.html[ $x + 1 ] );
				}
			}
			
		}
		
		// Remove Any Field Errors Before Applying Again ...
		if( $( element ).find( '.help-inline' ).length ) {
			$( element ).find( '.help-inline' ).remove();
			$( element ).find( '.form-group' ).removeClass( 'has-error' );
		}
		
		if( $json.field_errors != null ) {
			
			this.field_errors( $json, element, $json.field_errors );
			
		}
		
		if( $json.redirect != null ) {
			
			$( location ).attr( 'href', $json.redirect );
			
		}
		
		if( $json.execute != null ) {
			
			$.each(
				$json.execute,
				function( $key, $code ) {
					eval( $code );
				}
			);

		}
		
		if( $json.load_view_styles != null ) {
			
			var $styles_to_be_loaded = [];
			var $style_parsed = false;
			
			$.each(
				$json.load_view_styles,
				function( $index, $style ) {
					
					$style_parsed = $style.split( '?' )[0];
					
					if( $.inArray( $style_parsed, $self.loaded_styles ) == '-1' ) {
						$styles_to_be_loaded.push( $style );
						$self.loaded_styles.push( $style_parsed );
					}
					
				}
			);	
			
			LazyLoad.css( $styles_to_be_loaded );
			
		}
		
		if( $json.load_view_scripts != null ) {
			
			var $new_scripts = new Array();
			var $loaded_scripts = new Array();
			var $original_file;
			
			$.each( 
				$json.load_view_scripts, 
				function( $index, $file ) {
					$original_file = $file;
					
					$file = $self.parse_script_file( $file );
					
					if( ! $self.loaded_scripts[ $file ] ) {
						$new_scripts.push( $original_file );
					} else {
						$loaded_scripts.push( $self.loaded_scripts[ $file ] );
					}
					
				}  
			);
				
			// New Scripts That Needed To Be Loaded ...
			if( $new_scripts != 0 ) {
				LazyLoad.js( $new_scripts );
				
				$.each(
					$new_scripts,
					function( $index, $file ) {
						$file = $self.parse_script_file( $file );

						if( ! $self.loaded_scripts[ $file ] ) {
							$self.loaded_scripts[ $file ] = $file;
						}
					}
				);
			}
			
			// Loaded Scripts That Needed To Be Re-Initialized For The HTML That Are Newly Loaded ...
			if( $loaded_scripts != 0 ) {
				
				$.each(
					$loaded_scripts,
					function( $index, $variable ) {
						if( $variable instanceof Object ) {
							$variable.construct();
						}
					}
				);
				
			}
			
		}

		if( this.use_loader ) {
			this.normal();
		}
		
		if( $self.ajax_push_resource ) {
			setTimeout( function() { clearInterval( $self.ajax_push_resource ) }, 500 );
		}
		
	},
	
	field_errors : function( $json, element, $field_errors ) {

		var $self = this;

		if( this.use_own_validation ) {
				
			$Main.form_validation( $json.field_errors, element );

		} else {

			var $input;
			
			$.each(
				$field_errors,
				function( $key, $value ) {

					var $search = $key.indexOf( '#' );

					if( $key === '_external' ) {
						$self.field_errors( $json, element, $value );
					}

					if( $search == 0 ) {
						$input = $( element ).find( $key );
					} else {
						
						var $name_element = $( element ).find( '[name=' + $key + ']' );
						
						if( $name_element.length ) {
							$input = $( element ).find( '[name=' + $key + ']' );
						} else {
							$input = $( element ).find( '#' + $key );
						}
						
					}

                    if(
                        $input.parent().find( '.input-group-addon' ).length
                        ||
                        ( $input.is( ':checkbox' ) )
                    ) {

                        $input.closest( '.form-group' ).append( '<span class="help-inline text-danger" for="' + $key + '" generated="true">' + $value + '</span>' )
                              .closest( '.form-group' ).removeClass( 'has-success' ).addClass( 'has-error' );

                    } else {

                        $input.after( '<span class="help-inline text-danger" for="' + $key + '" generated="true">' + $value + '</span>' )
                              .closest( '.form-group' ).removeClass( 'has-success' ).addClass( 'has-error' );

                    }



				}
			);

		}

	},
	
	parse_script_file : function( $file ) {
		
		$file = $file.replace( $site_config.base_url, '' );
		$file = $file.replace( 'assets/scripts/', '' );
		$file = $file.replace( 'core/', '' );
		$file = $file.replace( 'libs/', '' );
		$file = $file.replace( 'view/', '' );
		
		if( $file.indexOf( '?' ) ) {
			$file = $file.split( '?' )[ 0 ];
		}
		
		return $file;
		
	},
	
	init_transparent_overlay : function() {
		
		if( ! $( 'body #overlay' ).length ) {
			$( 'body' ).append( 
				'<div id="overlay" style="display: none;">' +
					'<div class="col-md-4"></div>' +
					'<div class="status col-md-4"><img src="/images/loading-image.gif" /><br />Loading ...</div>' +
					'<div class="col-md-4"></div>' +
				'</div>' 
			);
		}
		
		var $height = $( document ).height();
        var $width = $( window ).width();

		$( '#overlay' ).css(
			{
				'height'   : $height
			}
		);

		$( '#overlay .status' ).css(
			{
				/*'left'     : Math.floor( ( $width / 2 ) - 100 ),*/
				'top'      : Math.floor( ( $height / 3 ) )
			}
		);
	},
	
	overlay : function() {
		var $height = $( document ).height();

		$( '#overlay' ).css(
			{
				'height'   : $height
			}
		).fadeIn();
	},
	
	normal : function() {
		$( '#overlay' ).fadeOut();
	},
	
	additional_functions : function() {
		
		String.prototype.ucfirst = function() {
			return this.charAt( 0 ).toUpperCase() + this.slice( 1 );
		}
		
		String.prototype.nl2br = function( str, is_xhtml ) {
			
			if( ! str ) {
				str = this;
			}
			
			var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br ' + '/>' : '<br>'; // Adjust comment to avoid issue on phpjs.org display

			return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
			
		}
		
		String.prototype.htmlspecialchars = function( string, quote_style, charset, double_encode ) {
			
			if( ! string ) {
				string = this;
			}
			
			var optTemp = 0,
			i = 0,
			noquotes = false;
			
			if (typeof quote_style === 'undefined' || quote_style === null) {
				quote_style = 2;
			}
			
			string = string.toString();
			if (double_encode !== false) { // Put this first to avoid double-encoding
				string = string.replace(/&/g, '&amp;');
			}
			string = string.replace(/</g, '&lt;').replace(/>/g, '&gt;');

			var OPTS = {
				'ENT_NOQUOTES': 0,
				'ENT_HTML_QUOTE_SINGLE': 1,
				'ENT_HTML_QUOTE_DOUBLE': 2,
				'ENT_COMPAT': 2,
				'ENT_QUOTES': 3,
				'ENT_IGNORE': 4
			};
			
			if (quote_style === 0) {
				noquotes = true;
			}
  
			if (typeof quote_style !== 'number') { // Allow for a single string or an array of string flags
				quote_style = [].concat(quote_style);
				for (i = 0; i < quote_style.length; i++) {
					// Resolve string input to bitwise e.g. 'ENT_IGNORE' becomes 4
					if (OPTS[quote_style[i]] === 0) {
						noquotes = true;
					}
					else if (OPTS[quote_style[i]]) {
						optTemp = optTemp | OPTS[quote_style[i]];
					}
				}
				quote_style = optTemp;
			}
			
			if (quote_style & OPTS.ENT_HTML_QUOTE_SINGLE) {
				string = string.replace(/'/g, '&#039;');
			}
			if (!noquotes) {
				string = string.replace(/"/g, '&quot;');
			}

			return string;
			
		}
		
	},
	
	redirect : function( $url ) {
		
		$( location ).attr( 'href', $url );
		
	},
	
	use_own_validation : false,
	
	gritter : function( $title, $text, $time, $image ) {
		
		$sticky = $time ? false : true;
		
		return $.gritter.add(
			{
				title : $title,
				text : $text,
				image : $image,
				sticky : $sticky,
				time : $time
			}
		);
		
	},
	
	remove_gritter : function( $unique_id ) {
		
		if( $unique_id ) {
			return $.gritter.remove(
						$unique_id, {
							fade: true, // optional
							speed: 'fast' // optional
						}
					);
		} else {
			
			return $.gritter.removeAll();
			
		}
		
	},

	scroll_to : function( $element, $speed, $offset ) {
		
		if( ! $speed ) {
			$speed = 800;
		}
		
		if( $offset ) {
			$( 'html, body' ).animate( { scrollTop: $( $element ).offset().top - $offset }, $speed );
		} else {
			$( 'html, body' ).animate( { scrollTop: $( $element ).offset().top }, $speed );
		}
		
	},

    status_message : function( $message, $text, $time ) {

        if( this.gritter_id ) {
            this.remove_gritter( this.gritter_id );
        }

        this.gritter_id = this.gritter( $message, $text, $time );

    }

	
};

var $Site;
jQuery( document ).ready(
	function() {
		$Site = new Global_Bogart(
			{
				use_loader : true,
				use_own_validation : false,
				use_own_message_script : true
			}
		);
	}
);