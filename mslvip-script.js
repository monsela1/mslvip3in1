// --- Password Lock Logic ---
const passwordModal = document.getElementById('password-modal');
const passwordInput = document.getElementById('password-input');
const passwordSubmit = document.getElementById('password-submit');
const passwordError = document.getElementById('password-error');
const passwordExpiryDisplay = document.getElementById('expiry-display');

const translationTool = document.getElementById('translation-tool-container');
const textToPromptTool = document.getElementById('text-to-prompt-tool-container');
const storyGeneratorTool = document.getElementById('story-generator-tool-container');
const translationLockOverlay = document.getElementById('translation-lock-overlay');
const textToPromptLockOverlay = document.getElementById('text-to-prompt-lock-overlay');
const storyLockOverlay = document.getElementById('story-lock-overlay');
const unlockTranslationBtn = document.getElementById('unlock-translation-btn');
const unlockTextToPromptBtn = document.getElementById('unlock-text-to-prompt-btn');
const unlockStoryBtn = document.getElementById('unlock-story-btn');

const translationUsageBarContainer = document.getElementById('translation-usage-bar-container');
const translationUsageBar = document.getElementById('translation-usage-bar');
const translationUsageText = document.getElementById('translation-usage-text');
const textToPromptUsageBarContainer = document.getElementById('text-to-prompt-usage-bar-container');
const textToPromptUsageBar = document.getElementById('text-to-prompt-usage-bar');
const textToPromptUsageText = document.getElementById('text-to-prompt-usage-text');
const storyUsageBarContainer = document.getElementById('story-usage-bar-container');
const storyUsageBar = document.getElementById('story-usage-bar');
const storyUsageText = document.getElementById('story-usage-text');

const closePasswordModalBtn = document.getElementById('close-password-modal');
const translationDailyCountSpan = document.getElementById('translation-daily-count');
const textToPromptDailyCountSpan = document.getElementById('text-to-prompt-daily-count');
const storyDailyCountSpan = document.getElementById('story-daily-count');

const processBtn = document.getElementById('process-btn');
const generatePromptBtn = document.getElementById('generate-prompt-btn');
const generateStoryButton = document.getElementById('generate-button');
const translationDailyUsageDiv = document.getElementById('translation-daily-usage-div');
const fileInput = document.getElementById('file-input');
const fileNameSpan = document.getElementById('file-name');

let activeTool = null;

const encodedKeys = 'eyIwMUg2LTYyREQtSEFBQy1ERDY2Ijo1MzU2ODAwMDAwLCIwMVBBLTEyNUQtWEFYMS1ERDZSIjoxMDgwMDAwMDAwMCwiMDFQQS0xOTBELTJUV0QtRERMVyI6MTY0MTYwMDAwMDAsIjAxQUgtNTUwRC1EMVU4LURESEMiOjQ3NTIwMDAwMDAwLCIwMVRRLTA0WVItUUtGSy1ERFJPIjoxMjYxNDQwMDAwMDAsIjAyQTYtNjJEREtDTjhSLURESVkiOjUzNTY4MDAwMDAsIjAyQTYtMTI1RC1WVTVGLURERTkiOjEwODAwMDAwMDAwLCIwMkFBLTE5MEQtVEhOTy1ERExXIjoxNjQxNjAwMDAwMCwiMDJBQS01NTBELVpYMEwtRERUViI6NDc1MjAwMDAwMDAsIjAyQUgtMDRZUi1CR0tVLUREQVUiOjEyNjE0NDAwMDAwMCwiMDNBNi02MkRELURQVlEtREQ2WSI6NTM1NjgwMDAwMCwiMDNBNi0xMjVELTg5Tk4tRERJViI6MTA4MDAwMDAwMDAsIjAzQUEtMTkwRC1UTUcwLUREV0YiOjE2NDE2MDAwMDAwLCIwM0FBLTU1MEQtSThJTy1ERFBUIjo0NzUyMDAwMDAwMCwiMDNBSC0wNFlSLTFLQlctREQ5NCI6MTI2MTQ0MDAwMDAwLCIwMUs2LVRSWUQtRzQzMC1ERFQ5Ijo3MjAwMDAwLCIwMkE2LVRSWUQtM0NYSy1ERE0wIjo3MjAwMDAwLCIwM0E2LVRSWUQtRUhKUy1ERE৭১Ijo3MjAwMDAwfQ==';
const passwordDurations = JSON.parse(atob(encodedKeys));

const passwordPermissions = {
    '01': 'translator',
    '02': 'story-generator',
    '03': 'text-to-prompt'
};

const countdownIntervals = {
    translator: null,
    story: null
};

function updateUsageBar(expiry, duration, barElement, barContainer, textElement) {
    const now = new Date().getTime();
    if (expiry === 'forever') {
        barElement.style.width = '100%';
        textElement.textContent = 'ប្រើបានជារៀងរហូត';
        barContainer.classList.remove('hidden');
    } else {
        const remaining = expiry - now;
        const progress = (remaining / duration) * 100;
        
        if (remaining <= 0) {
            barElement.style.width = '0%';
            barContainer.classList.add('hidden');
            
            if (barElement === translationUsageBar) {
                translationLockOverlay.classList.remove('hidden');
                if (countdownIntervals.translator) clearInterval(countdownIntervals.translator);
                countdownIntervals.translator = null;
                localStorage.removeItem('translation_password_value');
                localStorage.removeItem('translation_password_expiry');
            } else if (barElement === textToPromptUsageBar) {
                textToPromptLockOverlay.classList.remove('hidden');
                if (countdownIntervals.textToPrompt) clearInterval(countdownIntervals.textToPrompt);
                countdownIntervals.textToPrompt = null;
                localStorage.removeItem('textToPrompt_password_value');
                localStorage.removeItem('textToPrompt_password_expiry');
            } else if (barElement === storyUsageBar) {
                storyLockOverlay.classList.remove('hidden');
                if (countdownIntervals.story) clearInterval(countdownIntervals.story);
                countdownIntervals.story = null;
                localStorage.removeItem('story_password_value');
                localStorage.removeItem('story_password_expiry');
            }
            passwordExpiryDisplay.textContent = 'លេខកូដរបស់អ្នកបានផុតកំណត់ហើយ។ សូមបញ្ចូលថ្មី។';
        } else {
            const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
            const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

            const text = `ប្រើ​បាន៖​ ${days} ថ្ងៃ ${hours} ម៉ោង ${minutes} នាទី ${seconds} វិនាទី`;
            textElement.textContent = text;
            barElement.style.width = `${progress}%`;
            barContainer.classList.remove('hidden');
        }
    }
}

function startUsageBarUpdates(permission) {
    let password, expiry, duration, barElement, barContainer, textElement, intervalName;
    
    if (permission === 'translator') {
        password = localStorage.getItem('translation_password_value');
        expiry = localStorage.getItem('translation_password_expiry');
        duration = passwordDurations[password];
        barElement = translationUsageBar;
        barContainer = translationUsageBarContainer;
        textElement = translationUsageText;
        intervalName = 'translator';
    } else if (permission === 'text-to-prompt') {
        password = localStorage.getItem('textToPrompt_password_value');
        expiry = localStorage.getItem('textToPrompt_password_expiry');
        duration = passwordDurations[password];
        barElement = textToPromptUsageBar;
        barContainer = textToPromptUsageBarContainer;
        textElement = textToPromptUsageText;
        intervalName = 'textToPrompt';
    } else if (permission === 'story-generator') {
        password = localStorage.getItem('story_password_value');
        expiry = localStorage.getItem('story_password_expiry');
        duration = passwordDurations[password];
        barElement = storyUsageBar;
        barContainer = storyUsageBarContainer;
        textElement = storyUsageText;
        intervalName = 'story';
    }

    if (countdownIntervals[intervalName]) clearInterval(countdownIntervals[intervalName]);
    
    const expiryTime = expiry === 'forever' ? 'forever' : parseInt(expiry);
    
    if (expiry) {
        updateUsageBar(expiryTime, duration, barElement, barContainer, textElement);
        if (expiryTime !== 'forever') {
            countdownIntervals[intervalName] = setInterval(() => {
                updateUsageBar(expiryTime, duration, barElement, barContainer, textElement);
            }, 1000);
        }
    }
}

const DAILY_LIMIT = 10;
const DAILY_RESET_TIME = 4 * 60 * 60 * 1000;

function getDailyUsage(toolName) {
    let count = parseInt(localStorage.getItem(`${toolName}_daily_count`));
    const resetTime = parseInt(localStorage.getItem(`${toolName}_daily_reset_time`));
    const now = new Date().getTime();

    if (isNaN(count) || now > resetTime) {
        count = DAILY_LIMIT;
        localStorage.setItem(`${toolName}_daily_count`, DAILY_LIMIT);
        localStorage.setItem(`${toolName}_daily_reset_time`, now + DAILY_RESET_TIME);
    }
    return count;
}

function updateDailyUsageDisplay() {
    const translationCount = getDailyUsage('translation');
    const textToPromptCount = getDailyUsage('text-to-prompt');
    const storyCount = getDailyUsage('story');

    if (translationDailyCountSpan) {
        translationDailyCountSpan.textContent = translationCount;
        if (translationCount <= 0) {
            processBtn.disabled = true;
        } else {
            processBtn.disabled = false;
        }
    }
    
    if (textToPromptDailyCountSpan) {
        textToPromptDailyCountSpan.textContent = textToPromptCount;
        if (textToPromptCount <= 0) {
            generatePromptBtn.disabled = true;
        } else {
            generatePromptBtn.disabled = false;
        }
    }
    
    if (storyDailyCountSpan) {
        storyDailyCountSpan.textContent = storyCount;
        if (storyCount <= 0) {
            generateStoryButton.disabled = true;
        } else {
            generateStoryButton.disabled = false;
        }
    }
}

function checkAndApplyInitialState() {
    const translationPassword = localStorage.getItem('translation_password_value');
    const translationExpiry = localStorage.getItem('translation_password_expiry');
    const textToPromptPassword = localStorage.getItem('textToPrompt_password_value');
    const textToPromptExpiry = localStorage.getItem('textToPrompt_password_expiry');
    const storyPassword = localStorage.getItem('story_password_value');
    const storyExpiry = localStorage.getItem('story_password_expiry');

    const now = new Date().getTime();

    if (translationPassword && translationExpiry) {
        const expiry = translationExpiry === 'forever' ? 'forever' : parseInt(translationExpiry);
        if (expiry === 'forever' || now < expiry) {
            translationLockOverlay.classList.add('hidden');
            startUsageBarUpdates('translator');
        } else {
            localStorage.removeItem('translation_password_value');
            localStorage.removeItem('translation_password_expiry');
        }
    }

    if (textToPromptPassword && textToPromptExpiry) {
         const expiry = textToPromptExpiry === 'forever' ? 'forever' : parseInt(textToPromptExpiry);
         if (expiry === 'forever' || now < expiry) {
            textToPromptLockOverlay.classList.add('hidden');
            startUsageBarUpdates('text-to-prompt');
         } else {
            localStorage.removeItem('textToPrompt_password_value');
            localStorage.removeItem('textToPrompt_password_expiry');
         }
    }
    
    if (storyPassword && storyExpiry) {
        const expiry = storyExpiry === 'forever' ? 'forever' : parseInt(storyExpiry);
        if (expiry === 'forever' || now < expiry) {
            storyLockOverlay.classList.add('hidden');
            startUsageBarUpdates('story-generator');
        } else {
            localStorage.removeItem('story_password_value');
            localStorage.removeItem('story_password_expiry');
        }
    }
    
    updateDailyUsageDisplay();
}

passwordSubmit.addEventListener('click', () => {
    const enteredPassword = passwordInput.value;
    passwordError.textContent = 'កំពុងផ្ទៀងផ្ទាត់...';
    const duration = passwordDurations[enteredPassword];
    const now = new Date().getTime();
    const prefix = enteredPassword.substring(0, 2);

    let permission = null;
    if (passwordPermissions[prefix]) {
        permission = passwordPermissions[prefix];
    }

    if (duration !== undefined && permission) {
        const expiry = duration === Infinity ? 'forever' : now + duration;
        
        if (permission === 'translator') {
            localStorage.setItem('translation_password_value', enteredPassword);
            localStorage.setItem('translation_password_expiry', expiry.toString());
            translationLockOverlay.classList.add('hidden');
            startUsageBarUpdates(permission);
        } else if (permission === 'text-to-prompt') {
            localStorage.setItem('textToPrompt_password_value', enteredPassword);
            localStorage.setItem('textToPrompt_password_expiry', expiry.toString());
            textToPromptLockOverlay.classList.add('hidden');
            startUsageBarUpdates(permission);
        } else if (permission === 'story-generator') {
            localStorage.setItem('story_password_value', enteredPassword);
            localStorage.setItem('story_password_expiry', expiry.toString());
            storyLockOverlay.classList.add('hidden');
            startUsageBarUpdates(permission);
        }
        
        passwordModal.classList.add('hidden');
        passwordError.textContent = '';
        passwordInput.value = '';
        updateDailyUsageDisplay();
    } else {
        passwordError.textContent = 'លេខកូដមិនត្រឹមត្រូវ!';
    }
});

unlockTranslationBtn.addEventListener('click', () => {
    passwordModal.classList.remove('hidden');
    passwordInput.value = '';
    passwordError.textContent = '';
    passwordInput.focus();
});

unlockTextToPromptBtn.addEventListener('click', () => {
    passwordModal.classList.remove('hidden');
    passwordInput.value = '';
    passwordError.textContent = '';
    passwordInput.focus();
});

unlockStoryBtn.addEventListener('click', () => {
    passwordModal.classList.remove('hidden');
    passwordInput.value = '';
    passwordError.textContent = '';
    passwordInput.focus();
});

closePasswordModalBtn.addEventListener('click', () => {
    passwordModal.classList.add('hidden');
});

const customMessageBox = document.getElementById('custom-message-box');
const messageBoxText = document.getElementById('message-box-text');
const messageBoxOkBtn = document.getElementById('message-box-ok-btn');

function showMessageBox(message) {
    messageBoxText.textContent = message;
    customMessageBox.classList.remove('hidden');
}

messageBoxOkBtn.addEventListener('click', () => {
    customMessageBox.classList.add('hidden');
});

checkAndApplyInitialState();
setInterval(updateDailyUsageDisplay, 1000);

class ApiQuotaError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ApiQuotaError';
    }
}

const API_KEYS = [
    "AIzaSyADOpeZUfKJwGCvUad26sQmYQXsEITNqKQ",
    "AIzaSyCP1GAYjIBAFIOd19auFFMA5S7jWS3AXBQ",
    "AIzaSyBWrOzarjXHuWfOleO8IJLyAVtgSbKhsTE",
    "AIzaSyDbcCDq-4LSHbR73DKGoXb_c819tlBxo1c",
    "AIzaSyCGXFvGuEklZTfWicFNCJoPtQf5CwgH5gw",
];
let currentApiKeyIndex = 0;

async function callGeminiAPI(prompt, format = 'TEXT', tools = [], systemInstruction = null) {
    const payload = { contents: [{ parts: [{ text: prompt }] }] };
    if (format === 'JSON') payload.generationConfig = { responseMimeType: "application/json" };
    if (tools.length > 0) payload.tools = tools;
    if (systemInstruction) payload.systemInstruction = { parts: [{ text: systemInstruction }] };

    let maxRetries = API_KEYS.length;
    let retryCount = 0;

    while (retryCount < maxRetries) {
        const apiKey = API_KEYS[currentApiKeyIndex];
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
        try {
            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (response.ok) {
                const result = await response.json();
                return { text: result.candidates[0].content.parts[0].text };
            } else if (response.status === 429 || response.status === 503) {
                console.warn(`API key ${currentApiKeyIndex + 1} failed. Retrying...`);
                currentApiKeyIndex = (currentApiKeyIndex + 1) % API_KEYS.length;
                retryCount++;
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
            } else {
                throw new Error(`API request failed: ${response.status}`);
            }
        } catch (error) {
            console.error('API call error:', error);
            currentApiKeyIndex = (currentApiKeyIndex + 1) % API_KEYS.length;
            retryCount++;
            if (retryCount >= maxRetries) throw new ApiQuotaError("All API keys failed.");
        }
    }
}
// ... (The rest of the script logic for translation, story generation, etc.)
