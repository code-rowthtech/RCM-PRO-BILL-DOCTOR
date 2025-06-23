export const executeCommand = (command: string, value?: string): boolean => {
    document.execCommand('styleWithCSS', false, 'true');
    return document.execCommand(command, false, value);
};

export const getSelectedText = (): string => {
    const selection = window.getSelection();
    return selection ? selection.toString() : '';
};

export const isCommandActive = (command: string): boolean => {
    return document.queryCommandState(command);
};

export const insertHTML = (html: string): void => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();

        const fragment = document.createRange().createContextualFragment(html);
        range.insertNode(fragment);

        // Move cursor to end of inserted content
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
    }
};

export const wrapSelectedText = (tag: string, attributes?: Record<string, string>): void => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const selectedText = range.toString();

        if (selectedText) {
            const element = document.createElement(tag);
            if (attributes) {
                Object.entries(attributes).forEach(([key, value]) => {
                    element.setAttribute(key, value);
                });
            }
            element.textContent = selectedText;

            range.deleteContents();
            range.insertNode(element);

            selection.removeAllRanges();
            const newRange = document.createRange();
            newRange.selectNodeContents(element);
            selection.addRange(newRange);
        }
    }
};

export const cleanHTML = (html: string): string => {
    // Remove unnecessary attributes and clean up the HTML
    return html
        .replace(/style="[^"]*"/g, '') // Remove inline styles
        .replace(/class="[^"]*"/g, '') // Remove classes
        .replace(/data-[^=]*="[^"]*"/g, '') // Remove data attributes
        .replace(/contenteditable="[^"]*"/g, '') // Remove contenteditable
        .replace(/<div><br><\/div>/g, '<br>') // Clean up empty divs
        .replace(/<div>/g, '<p>').replace(/<\/div>/g, '</p>') // Convert divs to paragraphs
        .trim();
};