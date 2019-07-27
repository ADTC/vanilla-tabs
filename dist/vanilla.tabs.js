'use strict';

/**
 * 
 * Hey there! Here is my *really first* plugin, written using Pure JavaScript / ES5
 * Hope you'll enjoy using it!
 * 
 * ToDo: Re-write a plugin using ES6
 * 
 */

/**
  * Start writing a plugin using Immediately Invoked Function Expression (IIFE).
  * Function is used to create a private scope: variable, created inside a function
  * is not accessible outside the function
 */

(function(){

	// Constructor function
	const VanillaTabs = function( opts ) {

		this.options = Object.assign( VanillaTabs.defaults, opts );
		this.elems = document.querySelectorAll( this.options.selector );

		buildUI( this );
		handleNavigation( this );
		handleResponsive( this );

	}

	// Private function to initialize the UI Elements
	function buildUI( tabs ){

		// walk on all tabs on the page
		tabs.elems.forEach( function( el, i ) {

			let tabsElem = el,
			childNodes = tabsElem.childNodes,
			tabsTitles = [],
			tabsStyle = tabs.options.type;

			tabsElem.classList.add( 'style__' + tabs.options.type );

			for( let i = 0; i < childNodes.length; i++ ) {

				if( childNodes[i].classList && childNodes[i].classList.contains( 'tabs__content') ) {

					let tabItem = childNodes[i];

					// grab tab title from data attribute
					let tabTitle = tabItem.dataset.title ? tabItem.dataset.title : '';
					tabsTitles.push( tabTitle );

					// wrap tab content
					let tabContent = tabItem.innerHTML;
					tabItem.innerHTML = '<div class="tabs__content_wrapper">' + tabContent + '</div>';

					// insert nav link for accordion navigation
					tabItem.insertAdjacentHTML( 'afterbegin', '<a class="tabs__nav_link">' + tabTitle + '</a>');

				}

			}

			// create horizontal / vertical tabs navigation elements
			let navElemsHTML = '';

			tabsTitles.forEach( function( title ) {
				navElemsHTML = navElemsHTML + '<a class="tabs__nav_link">' + title + '</a>';
			});

			tabsElem.insertAdjacentHTML( 'afterbegin', '<li class="tabs__nav">' + navElemsHTML + '</li>');

			// set initial active tab
			let activeTabIndex = Number( tabs.options.activeIndex );

			// validate active tab index. but, you can specify -1 for accordion tabs to make all of them closed by defaults
			if( tabsStyle != 'accordion' && activeTabIndex != -1 ) {
				if( activeTabIndex > (tabsTitles.length - 1) ) {
					console.warn( 'VANILLA TABS: Active tab number from settings is bigger than tabs count. Please remember, that index starts from Zero! To avoid crashes, activeIndex option was reverted to 0.');
					activeTabIndex = 0;
				}

				tabsElem.querySelectorAll( '.tabs__nav > .tabs__nav_link')[ activeTabIndex ].classList.add( 'is__active' );
				tabsElem.querySelectorAll( '.tabs__content')[ activeTabIndex ].classList.add( 'is__active' );
				tabsElem.querySelectorAll( '.tabs__content > .tabs__nav_link')[ activeTabIndex ].classList.add( 'is__active' );

			}

		});

	}

	// Navigation: assign click events
	function handleNavigation( tabs ) {

		// walk on all tabs on the page
		tabs.elems.forEach( function( el, i ) {

			let tabsElem = el;

			tabsElem.addEventListener( 'click', function( e ){

				if( e.target && e.target.classList.contains( 'tabs__nav_link') ) {
					e.preventDefault();

					let activeTabIndex;

					// if we click on main navigation link
					if( e.target.parentElement.classList == 'tabs__nav' ) {
						activeTabIndex = Array.prototype.slice.call( e.target.parentElement.children ).indexOf( e.target );

					// if we click on accordion nav link
					} else {
						activeTabIndex = Array.prototype.slice.call( e.target.parentElement.parentElement.children ).indexOf( e.target.parentElement ) - 1;
					}

					let tabsContent = tabsElem.getElementsByClassName( 'tabs__content');

					// remove active class for inactive tabs
					for( let i = 0; i < tabsContent.length; i++ ) {
						tabsContent[ i ].classList.remove( 'is__active');
					}

					// add active class for a current (active) tab
					tabsContent[ activeTabIndex ].classList.add( 'is__active');

					// add active classes and remove inactive for main nav links
					let mainNavLinks = tabsElem.querySelectorAll( '.tabs__nav > .tabs__nav_link');
					mainNavLinks.forEach( function( el ) {
						el.classList.remove( 'is__active');
					});
					mainNavLinks[ activeTabIndex ].classList.add( 'is__active');

					// add active classes and remove inactive for accordion nav links
					let accordionNavLinks = tabsElem.querySelectorAll( '.tabs__content > .tabs__nav_link');
					accordionNavLinks.forEach( function( el ) {
						el.classList.remove( 'is__active');
					});
					accordionNavLinks[ activeTabIndex ].classList.add( 'is__active');

				}

			});

		});

	}

	// Responsive: tabs to accordion
	function handleResponsive( tabs ) {

		const responsiveClassName = 'is__responsive';

		window.addEventListener( 'resize', function() {

			// walk on all tabs on the page
			tabs.elems.forEach( function( el, i ) {

				if( window.innerWidth > Number( tabs.options.responsiveBreak ) ) {

					el.classList.remove( responsiveClassName );

				} else {

					el.classList.add( responsiveClassName );

				}

			});

		});

		// manually fire resize event
		window.dispatchEvent( new Event( 'resize' ));

	}

	// Attach our defaults for plugin to the plugin itself
	VanillaTabs.defaults = {
		'selector': '.tabs',
		'type': 'horizontal',
		'responsiveBreak': 840,
		'activeIndex' : 0
	}

	// make accessible globally
	window.VanillaTabs = VanillaTabs;

})();