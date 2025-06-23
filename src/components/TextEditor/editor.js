// This file defines structure-like documentation for developers using JS

/**
 * @typedef {Object} EditorCommand
 * @property {string} command
 * @property {string} [value]
 * @property {boolean} [useCSS]
 */

/**
 * @typedef {Object} EditorState
 * @property {string} content
 * @property {Selection | null} selection
 */

/**
 * @typedef {Object} ToolbarButton
 * @property {string} id
 * @property {string} label
 * @property {React.ReactNode} icon
 * @property {EditorCommand} command
 * @property {() => boolean} [isActive]
 */

/**
 * @typedef {Object} ColorOption
 * @property {string} name
 * @property {string} value
 */
