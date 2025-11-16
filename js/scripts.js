/*!
* Start Bootstrap - Stylish Portfolio v6.0.6 (https://startbootstrap.com/theme/stylish-portfolio)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-stylish-portfolio/blob/master/LICENSE)
*/

// Define currentFilter outside the DOMContentLoaded so it's accessible globally
let currentFilter = 'all'; // Variable to store the currently active filter

// Function to hide all portfolio items
function hideAllPortfolioItems() {
    const items = document.querySelectorAll('.project-item');
    items.forEach(item => {
        item.style.display = 'none';
        // Also ensure the 'hidden' class from the original script is removed if present
        item.classList.remove('hidden');
    });
}

// Function to show only a limited number of items in a category and highlight the button
function filterProjects(category) {
    // Remove 'active' class from all buttons first
    const filterButtons = document.querySelectorAll('#project-filters .btn');
    filterButtons.forEach(button => {
        button.classList.remove('active');
    });

    // Add 'active' class to the clicked button
    // Find the button that corresponds to the clicked category using data attributes (more robust)
    let activeButton = document.querySelector(`#project-filters button[onclick*="filterProjects('${category}')"]`);

    if (activeButton) {
        activeButton.classList.add('active');
    }


    hideAllPortfolioItems(); // Start by hiding everything
    currentFilter = category; // Set the current filter

    const showMoreButton = document.getElementById("ShowMoreButton");
    showMoreButton.style.display = 'none'; // Hide button by default

    const items = document.querySelectorAll('.project-item');
    let itemsToShow = [];

    if (category === 'all') {
        itemsToShow = Array.from(items); // Select all items
    } else {
        // Filter items based on the selected category class
        itemsToShow = Array.from(items).filter(item => {
            // Check if the item has the specified category class
            // For 'recent', we just check if the 'recent' class is present
            return item.classList.contains(category);
        });
    }

    // Set the number of items to show initially (e.g., 4)
    const initialItemsToShow = 8; // You can change this number

    // Show the first 'initialItemsToShow' items
    for (let i = 0; i < Math.min(itemsToShow.length, initialItemsToShow); i++) {
        itemsToShow[i].style.display = 'block';
    }

    // If there are more items than the initial number, show the "Load More" button
    if (itemsToShow.length > initialItemsToShow) {
        showMoreButton.style.display = 'block';
    }
}

// Function to show all items in the currently filtered category
function showAllInCategory() {
    const items = document.querySelectorAll('.project-item');
    const showMoreButton = document.getElementById("ShowMoreButton");

    items.forEach(item => {
        let shouldShow = false;
        // Check if the item has the class corresponding to the current filter
        if (currentFilter === 'all' || item.classList.contains(currentFilter)) {
             shouldShow = true;
        }

        if (shouldShow) {
            item.style.display = 'block';
        }
    });

    showMoreButton.style.display = 'none'; // Hide the button after loading all
}


window.addEventListener('DOMContentLoaded', event => {

    const sidebarWrapper = document.getElementById('sidebar-wrapper');
    let scrollToTopVisible = false;
    // Closes the sidebar menu
    const menuToggle = document.body.querySelector('.menu-toggle');
    menuToggle.addEventListener('click', event => {
        event.preventDefault();
        sidebarWrapper.classList.toggle('active');
        _toggleMenuIcon();
        menuToggle.classList.toggle('active');
    })

    // Closes responsive menu when a scroll trigger link is clicked
    var scrollTriggerList = [].slice.call(document.querySelectorAll('#sidebar-wrapper .js-scroll-trigger'));
    scrollTriggerList.map(scrollTrigger => {
        scrollTrigger.addEventListener('click', () => {
            sidebarWrapper.classList.remove('active');
            menuToggle.classList.remove('active');
            _toggleMenuIcon();
        })
    });

    function _toggleMenuIcon() {
        const menuToggleBars = document.body.querySelector('.menu-toggle > .fa-bars');
        const menuToggleTimes = document.body.querySelector('.menu-toggle > .fa-xmark');
        if (menuToggleBars) {
            menuToggleBars.classList.remove('fa-bars');
            menuToggleBars.classList.add('fa-xmark');
        } else if (menuToggleTimes) { // Use else if here
            menuToggleTimes.classList.remove('fa-xmark');
            menuToggleTimes.classList.add('fa-bars');
        }
    }

    // Scroll to top button appear
    document.addEventListener('scroll', () => {
        const scrollToTop = document.body.querySelector('.scroll-to-top');
        if (document.documentElement.scrollTop > 100) {
            if (!scrollToTopVisible) {
                fadeIn(scrollToTop);
                scrollToTopVisible = true;
            }
        } else {
            if (scrollToTopVisible) {
                fadeOut(scrollToTop);
                scrollToTopVisible = false;
            }
        }
    }, { passive: true }) // Added passive: true for potential performance improvement


    // Initialize portfolio filter on page load - show 'recent' initially
    filterProjects('all');

}); // End of DOMContentLoaded


function fadeOut(el) {
    el.style.opacity = 1;
    (function fade() {
        if ((el.style.opacity -= .1) < 0) {
            el.style.display = "none";
        } else {
            requestAnimationFrame(fade);
        }
    })();
};

function fadeIn(el, display) {
    el.style.opacity = 0;
    el.style.display = display || "block";
    (function fade() {
        var val = parseFloat(el.style.opacity);
        if (!((val += .1) > 1)) {
            el.style.opacity = val;
            requestAnimationFrame(fade);
        }
    })();
};
