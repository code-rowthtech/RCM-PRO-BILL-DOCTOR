/**
 * Utility function to safely scroll to an element within its scroll container
 * without causing viewport shifts or UI sliding issues
 */
export const safeScrollToElement = (targetSelector, options = {}) => {
    const {
        offset = -20,
        behavior = 'smooth',
        timeout = 200,
        containerSelector = '.scroll-container'
    } = options;

    return new Promise((resolve) => {
        setTimeout(() => {
            try {
                const element = document.querySelector(targetSelector);
                if (!element) {
                    console.warn(`Element not found: ${targetSelector}`);
                    resolve(false);
                    return;
                }

                // Find the appropriate scroll container
                let scrollContainer = element.closest(containerSelector);
                
                // Fallback to the first scroll container if closest doesn't work
                if (!scrollContainer) {
                    scrollContainer = document.querySelector(containerSelector);
                }

                if (!scrollContainer) {
                    console.warn(`Scroll container not found: ${containerSelector}`);
                    resolve(false);
                    return;
                }

                // Calculate scroll position
                const elementRect = element.getBoundingClientRect();
                const containerRect = scrollContainer.getBoundingClientRect();
                
                // Calculate the target scroll position
                const targetOffset = elementRect.top - containerRect.top + scrollContainer.scrollTop + offset;
                
                // Ensure we don't scroll beyond container bounds
                const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
                const targetScroll = Math.max(0, Math.min(targetOffset, maxScroll));

                // Perform the scroll
                scrollContainer.scrollTo({
                    top: targetScroll,
                    behavior: behavior
                });

                resolve(true);
            } catch (error) {
                console.error('Error during scroll operation:', error);
                resolve(false);
            }
        }, timeout);
    });
};

/**
 * Enhanced scroll function specifically for encounter fields
 */
export const scrollToEncounterField = async (fieldName, options = {}) => {
    const targetSelector = `[data-field-name="${fieldName}"]`;
    
    // Wait for accordion to expand if needed
    const { waitForExpansion = true, ...scrollOptions } = options;
    
    if (waitForExpansion) {
        // Check if element is visible (accordion expanded)
        let attempts = 0;
        const maxAttempts = 10;
        
        while (attempts < maxAttempts) {
            const element = document.querySelector(targetSelector);
            if (element && element.offsetHeight > 0) {
                break; // Element is visible
            }
            await new Promise(resolve => setTimeout(resolve, 50));
            attempts++;
        }
    }
    
    return await safeScrollToElement(targetSelector, scrollOptions);
};