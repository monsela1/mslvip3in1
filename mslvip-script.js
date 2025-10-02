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

// ... (The rest of the script is the same)
// The code continues here...
