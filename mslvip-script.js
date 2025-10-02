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

const encodedKeys = 'eyIwMUg2LTYyREQtSEFBQy1ERDY2Ijo1MzU2ODAwMDAwLCJwMVBBLTEyNUQtWEFYMS1ERDZSIjoxMDgwMDAwMDAwMCwiMDFQQS0xOTBELTJUV0QtRERMVyI6MTY0MTYwMDAwMDAsIjAxQUgtNTUwRC1EMVU4LURESEMiOjQ3NTIwMDAwMDAwLCIwMVRRLTA0WVItUUtGSy1ERFJPIjoxMjYxNDQwMDAwMDAsIjAyQTYtNjJEREtDTjhSLURESVkiOjUzNTY4MDAwMDAsIjAyQTYtMTI1RC1WVTVGLURERTkiOjEwODAwMDAwMDAwLCIwMkFBLTE5MEQtVEhOTy1ERExXIjoxNjQxNjAwMDAwMCwiMDJBQS01NTBELVpYMEwtRERUViI6NDc1MjAwMDAwMDAsIjAyQUgtMDRZUi1CR0tVLUREQVUiOjEyNjE0NDAwMDAwMCwiMDNBNi02MkRELURQVlEtREQ2WSI6NTM1NjgwMDAwMCwiMDNBNi0xMjVELTg5Tk4tRERJViI6MTA4MDAwMDAwMDAsIjAzQUEtMTkwRC1UTUcwLUREV0YiOjE2NDE2MDAwMDAwLCIwM0FBLTU1MEQtSThJTy1ERFBUIjo0NzUyMDAwMDAwMCwiMDNBSC0wNFlSLTFLQlctREQ5NCI6MTI2MTQ0MDAwMDAwLCIwMUs2LVRSWUQtRzQzMC1ERFQ5Ijo3MjAwMDAwLCIwMkE2LVRSWUQtM0NYSy1ERE0wIjo3MjAwMDAwLCIwM0E2LVRSWUQtRUhKUy1ERE৭১Ijo3MjAwMDAwfQ==';
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
const DAILY_RESET_TIME = 5 * 60 * 60 * 1000;

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
        processBtn.disabled = translationCount <= 0;
    }
    if (textToPromptDailyCountSpan) {
        textToPromptDailyCountSpan.textContent = textToPromptCount;
        generatePromptBtn.disabled = textToPromptCount <= 0;
    }
    if (storyDailyCountSpan) {
        storyDailyCountSpan.textContent = storyCount;
        generateStoryButton.disabled = storyCount <= 0;
    }
}

function checkAndApplyInitialState() {
    const now = new Date().getTime();
    ['translation', 'textToPrompt', 'story-generator'].forEach(tool => {
        const password = localStorage.getItem(`${tool.replace('-generator', '')}_password_value`);
        const expiry = localStorage.getItem(`${tool.replace('-generator', '')}_password_expiry`);
        if (password && expiry) {
            const expiryTime = expiry === 'forever' ? 'forever' : parseInt(expiry);
            if (expiryTime === 'forever' || now < expiryTime) {
                document.getElementById(`${tool.replace('-generator', '')}LockOverlay`).classList.add('hidden');
                startUsageBarUpdates(passwordPermissions[password.substring(0, 2)]);
            } else {
                localStorage.removeItem(`${tool.replace('-generator', '')}_password_value`);
                localStorage.removeItem(`${tool.replace('-generator', '')}_password_expiry`);
            }
        }
    });
    updateDailyUsageDisplay();
}

passwordSubmit.addEventListener('click', () => {
    const enteredPassword = passwordInput.value;
    passwordError.textContent = 'កំពុងផ្ទៀងផ្ទាត់...';
    const duration = passwordDurations[enteredPassword];
    const now = new Date().getTime();
    const prefix = enteredPassword.substring(0, 2);
    const permission = passwordPermissions[prefix];
    if (duration !== undefined && permission) {
        const expiry = duration === Infinity ? 'forever' : now + duration;
        const toolName = permission.replace('-generator', '');
        localStorage.setItem(`${toolName}_password_value`, enteredPassword);
        localStorage.setItem(`${toolName}_password_expiry`, expiry.toString());
        document.getElementById(`${toolName}LockOverlay`).classList.add('hidden');
        startUsageBarUpdates(permission);
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

// The rest of the script (API calls, tool logic, etc.) continues...
