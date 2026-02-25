import notifinStyles from '../styles/index.css?inline';

const STYLE_ELEMENT_ID = 'notifin-style';

let didInject = false;

export function ensureNotifinStyles() {
    if (didInject || typeof document === 'undefined') {
        return;
    }

    if (document.getElementById(STYLE_ELEMENT_ID)) {
        didInject = true;
        return;
    }

    const styleElement = document.createElement('style');

    styleElement.id = STYLE_ELEMENT_ID;
    styleElement.textContent = notifinStyles;
    document.head.appendChild(styleElement);
    didInject = true;
}
