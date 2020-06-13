/**
 *  Global variables
 *  ITEMS_TO_SHOW - number of elements to show per page
 *  rows - HTMLCollection of book table rows; this is what elements will refer to
 */
const ITEMS_TO_SHOW = 10;
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
	// set up new div and ul to add links to
	const pageDiv = document.getElementById('main-content');
	const linkDiv = document.createElement('div');
	linkDiv.classList.add('pagination');
	const ul = document.createElement('ul');

	// make pagination links
	for (let i = 1; i <= numPages; i++) {
		const li = document.createElement('li');
		const a = document.createElement('a');
		a.setAttribute('href', '#');
		a.innerText = i;
		li.appendChild(a);
		ul.appendChild(li);
	}
	// add 'active' class to first link
	ul.firstElementChild.firstElementChild.classList.add('active');

	// add ul with links to page
	linkDiv.appendChild(ul);
	pageDiv.appendChild(linkDiv);
}

// Paginate the HTML elements and start on first page
showPage(rows, 1);
// create pagination links
appendPageLinks(rows);

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