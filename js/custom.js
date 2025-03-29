document.addEventListener('DOMContentLoaded', () => {
        createTab(); // Ensure at least one tab is present when the app starts
    });
    
    function createTab() {
        const tabList = document.getElementById('nav-tab');
        const tabContent = document.getElementById('nav-tabContent');
        const tabIndex = tabList.querySelectorAll('.nav-link').length;
    
        const newTabId = `nav-tab-${tabIndex}`;
        const newContentId = `nav-content-${tabIndex}`;
    
        // Create new tab button
        const newTab = document.createElement('button');
        newTab.className = `nav-link ${tabIndex === 0 ? 'active' : ''}`;
        newTab.id = newTabId;
        newTab.setAttribute('data-bs-toggle', 'tab');
        newTab.setAttribute('data-bs-target', `#${newContentId}`);
        newTab.setAttribute('type', 'button');
        newTab.setAttribute('role', 'tab');
        newTab.setAttribute('aria-controls', newContentId);
        newTab.setAttribute('aria-selected', tabIndex === 0 ? 'true' : 'false');
        newTab.innerHTML = `New tab <span class="close-tab ms-2">&times;</span>`;
    
        // Create new tab content
        const newTabPane = document.createElement('div');
        newTabPane.className = `tab-pane fade ${tabIndex === 0 ? 'show active' : ''}`;
        newTabPane.id = newContentId;
        newTabPane.setAttribute('role', 'tabpanel');
        newTabPane.setAttribute('aria-labelledby', newTabId);
        newTabPane.setAttribute('tabindex', '0');
        newTabPane.innerHTML = `
            <div class="navbar px-2 d-flex flex-nowrap align-items-center w-100">
                <button class="btn btn-ghost backBtn"><i class="bi bi-arrow-left"></i></button>
                <button class="btn btn-ghost nextBtn"><i class="bi bi-arrow-right"></i></button>
                <button class="btn btn-ghost reloadBtn"><i class="bi bi-arrow-clockwise"></i></button>
    
                <div class="search-container d-flex flex-column mx-2 position-relative">
                    <input type="text" class="search-input form-control" placeholder="Search or enter URL">
                     <button class="btn btn-custom searchBtn"><i class="bi bi-search"></i></button>
                    <ul class="suggestions-list list-group position-absolute w-100 bg-transparent shadow-sm d-none" style="top: 100%; z-index: 10;"></ul>
                </div>
    
                <button class="btn btn-custom bookmarkBtn"><i class="bi bi-bookmark"></i></button>
                <img src="../images/behemoth.jpg" class="rounded-circle" alt="Avatar" width="34">
    
                <div class="dropdown">
                    <button class="btn btn-ghost settingsBtn" type="button" id="settingsMenu" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="bi bi-three-dots-vertical"></i>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="settingsMenu">
                        <li><a class="dropdown-item d-block d-sm-none bookmarkMenuItem" href="#"><i class="bi bi-bookmark"></i> Bookmark</a></li>
                        <li><a class="dropdown-item" href="#">Settings</a></li>
                        <li><a class="dropdown-item" href="#">Help</a></li>
                    </ul>
                </div>
            </div>
        `;
    
        // Insert new tab before the "+" button
        tabList.insertBefore(newTab, document.getElementById('new-tab-button'));
        tabContent.appendChild(newTabPane);
    
        // Activate the new tab
        newTab.click();

            // Reload button logic: Change icon to cross and refresh page
        const reloadBtn = newTabPane.querySelector('.reloadBtn');
        reloadBtn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            
            // Change the icon to the cross
            icon.classList.remove('bi-arrow-clockwise');
            icon.classList.add('bi-x'); // Set cross icon
            
            // Perform a page reload after a brief delay to allow the icon change
            setTimeout(() => {
                location.reload(); // Reload the page
            }, 300); // 300ms delay to show the cross icon before refreshing
        });

            // Toggling bookmark button active state
        const bookmarkBtn = newTabPane.querySelector('.bookmarkBtn');
        bookmarkBtn.addEventListener('click', function() {
            this.classList.toggle('active'); // Toggle 'active' class
            const icon = this.querySelector('i');
            if (this.classList.contains('active')) {
                icon.classList.remove('bi-bookmark');  // Remove empty bookmark icon
                icon.classList.add('bi-bookmark-fill'); // Add filled bookmark icon
            } else {
                icon.classList.remove('bi-bookmark-fill');
                icon.classList.add('bi-bookmark');
            }
        });
    
        // Attach functionality to newly created search input
        const searchInput = newTabPane.querySelector('.search-input');
        const suggestionsList = newTabPane.querySelector('.suggestions-list');
    
        // List of common domains for suggestions
        const commonDomains = [".com", ".net", ".org", ".io", ".co", ".dev"];
    
        searchInput.addEventListener("input", function () {
            let input = this.value.trim();
    
            if (!input) {
                suggestionsList.classList.add('d-none');
                return;
            }
    
            let suggestions = [];
            if (!input.includes(".") && !input.includes(" ")) {
                // Generate possible domain suggestions
                suggestions = commonDomains.map(ext => `https://${input}${ext}`);
            } else if (!input.startsWith("http://") && !input.startsWith("https://")) {
                suggestions.push(`https://${input}`);
            }
    
            if (suggestions.length > 0) {
                showSuggestions(suggestions);
            } else {
                suggestionsList.classList.add('d-none');
            }
        });
    
        searchInput.addEventListener("blur", function () {
            setTimeout(() => {
                suggestionsList.classList.add('d-none'); // Hide dropdown on blur (with delay to allow click)
            }, 200);
        });
    
        searchInput.addEventListener("focus", function () {
            if (suggestionsList.children.length > 0) {
                suggestionsList.classList.remove('d-none');
            }
        });
    
        searchInput.addEventListener("change", function () {
            let input = this.value.trim();
            if (!input) return;
    
            let correctedUrl = input;
    
            // Auto-add https:// if not present
            if (!correctedUrl.startsWith("http://") && !correctedUrl.startsWith("https://")) {
                correctedUrl = "https://" + correctedUrl;
            }
    
            // Auto-add .com if no domain extension
            if (!correctedUrl.match(/\.[a-z]{2,}($|\/)/i) && !correctedUrl.includes(" ")) {
                correctedUrl += ".com";
            }
    
            if (correctedUrl !== input) {
                searchInput.value = correctedUrl;
            }
    
            suggestionsList.classList.add('d-none');
        });
    
        function showSuggestions(suggestions) {
            suggestionsList.innerHTML = suggestions.map(url => 
                `<li class="list-group-item suggestion-item">${url}</li>`
            ).join("");
            suggestionsList.classList.remove('d-none');
    
            // Add event listener to each suggestion item
            suggestionsList.querySelectorAll('.suggestion-item').forEach(item => {
                item.addEventListener("click", function () {
                    searchInput.value = this.textContent;
                    suggestionsList.classList.add('d-none');
                    searchInput.focus(); // Keep the input focused
                });
            });
        }
    
        // Hide suggestions when clicking outside
        document.addEventListener("click", function (e) {
            if (!searchInput.contains(e.target) && !suggestionsList.contains(e.target)) {
                suggestionsList.classList.add('d-none');
            }
        });
    }
    
    
    
    
    function closeTab(e) {
        if (!e.target.classList.contains('close-tab')) return;
    
        const tabButton = e.target.parentElement; // Get the parent button
        const tabId = tabButton.getAttribute('data-bs-target'); // Get the corresponding tab content ID
        const tabContent = document.querySelector(tabId); // Select the tab content element
    
        const allTabs = document.querySelectorAll('#nav-tab .nav-link');
        
        // Prevent closing the last remaining tab
        if (allTabs.length === 1) {
            createTab(); // Ensure a new tab is created before closing the last one
        }
    
        // If closing the active tab, activate the previous one
        if (tabButton.classList.contains('active')) {
            const previousTab = tabButton.previousElementSibling || tabButton.nextElementSibling;
            if (previousTab && previousTab.classList.contains('nav-link')) {
                previousTab.click(); // Activate the previous or next tab
            }
        }
    
        // Remove tab and content
        tabButton.remove();
        if (tabContent) tabContent.remove();
    }
      
    
    // Attach the event listener to the document for dynamically created elements
    document.addEventListener('click', closeTab);
    
