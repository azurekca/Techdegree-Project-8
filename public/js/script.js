/**
 *  Global variables
 *  ITEMS_TO_SHOW - number of elements to show per page
 *  rows - HTMLCollection of book table rows; this is what elements will refer to
 */
const ITEMS_TO_SHOW = 20;
const rows = document.getElementsByClassName('tr-book');

/**
 * Shows the HTML elements for the given page number
 * and hide the rest of the HTML elements
 * @param {object} elements - HTMLCollection of book table row elements
 * @param {number} pageNum - number of the page to show
 */
function showPage(elements, pageNum) {
	// set start and end indexes of HTML elements that will be shown
	const startIndex = ITEMS_TO_SHOW * pageNum - ITEMS_TO_SHOW;
	const endIndex = startIndex + ITEMS_TO_SHOW;
	for (let i = 0; i < elements.length; i++) {
		// show the HTML elements for the current page
		if (i >= startIndex && i < endIndex) {
			elements[i].style.display = '';
			// otherwise, do not display the HTML elements
		} else {
			elements[i].style.display = 'none';
		}
	}
}

/**
 * Generates a list of links that enable the user
 * to navigate the paginated book table
 * @param {object} elements - HTMLCollection of book table row elements
 */
function appendPageLinks(elements) {
	// Determine how many links will be required
	const numPages = Math.ceil(elements.length / ITEMS_TO_SHOW);
	// set up new nav and buttons to add links to
	const pageDiv = document.getElementById('main-content');
	const linkNav = document.createElement('nav');
	linkNav.classList.add('pagination');

	// make pagination links
	for (let i = 1; i <= numPages; i++) {
		const p = document.createElement('p');
		const a = document.createElement('a');
    a.setAttribute('href', '#');
    a.classList = 'button';
		a.innerText = i;
    p.appendChild(a);
    linkNav.appendChild(p);
  }
  
	// add 'active' class to first link
	linkNav.firstElementChild.classList.add('active');
	// add buttons with links to page
	pageDiv.appendChild(linkNav);
}

// check if there are any elements to paginate
if (rows.length > 0) {
	// Paginate the HTML elements and start on first page
	showPage(rows, 1);
	// create pagination links
	appendPageLinks(rows);
}

// add event handler to page
document.addEventListener('click', event => {
  if (event.target.tagName === 'A') {
    const a = event.target; // the 'a' element that was clicked
    const pageNum = a.innerText; // number of which link was clicked

    // call showPage function with the page number
    showPage(rows, pageNum);
    // toggle 'active' class from previously active link to clicked link
    document.querySelector('a.active').classList.remove('active');
    a.classList.add('active');
  }
});