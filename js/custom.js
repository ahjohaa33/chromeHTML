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
        newTab.className = `nav-link ${tabIndex === 0 ? 'active' : ''}`; // Make the first tab active by default
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
                <button class="btn btn-custom backBtn"><i class="bi bi-arrow-left"></i></button>
                <button class="btn btn-custom nextBtn"><i class="bi bi-arrow-right"></i></button>
                <button class="btn btn-custom reloadBtn"><i class="bi bi-arrow-clockwise"></i></button>

                <div class="search-container d-flex flex-nowrap mx-2">
                    <input type="text" class="search-input" placeholder="Search or enter URL">
                    <button class="btn btn-custom searchBtn"><i class="bi bi-search"></i></button>
                </div>

                <!-- Bookmark Button (Hidden on Mobile) -->
                <button class="btn btn-custom bookmarkBtn"><i class="bi bi-bookmark"></i></button>

                <img src="https://via.placeholder.com/40" class="rounded-circle" alt="Avatar" width="34">

                <!-- Dropdown Menu for Settings -->
                <div class="dropdown">
                    <button class="btn btn-custom settingsBtn" type="button" id="settingsMenu" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="bi bi-three-dots-vertical"></i> <!-- No caret -->
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
    
