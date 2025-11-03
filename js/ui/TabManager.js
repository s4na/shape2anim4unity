// Tab Navigation Manager

export class TabManager {
    constructor() {
        this.activeTab = null;
        this.tabButtons = [];
        this.tabContents = [];
        this.init();
    }

    init() {
        // Get all tab buttons and content
        this.tabButtons = Array.from(document.querySelectorAll('.tab-button'));
        this.tabContents = Array.from(document.querySelectorAll('.tab-content'));

        // Add click listeners
        this.tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');
                this.switchTab(tabId);
            });
        });

        // Set initial active tab
        const activeButton = this.tabButtons.find(btn => btn.classList.contains('active'));
        if (activeButton) {
            this.activeTab = activeButton.getAttribute('data-tab');
        }
    }

    switchTab(tabId) {
        // Update buttons
        this.tabButtons.forEach(button => {
            const buttonTabId = button.getAttribute('data-tab');
            if (buttonTabId === tabId) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });

        // Update content
        this.tabContents.forEach(content => {
            if (content.id === tabId) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });

        this.activeTab = tabId;
    }

    getActiveTab() {
        return this.activeTab;
    }
}
