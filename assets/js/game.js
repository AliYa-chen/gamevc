var statusElement = document.getElementById("status");
var progressElement = document.getElementById("progress");
var spinnerElement = document.getElementById('spinner');
var data_content;
var wasm_content;

const params = new URLSearchParams(window.location.search);

// Base URLs
const replaceFetch = (str) => str.replace("https://cdn.dos.zone/vcsky/", "vcsky/")
const replaceBR = "https://cdn.nbcnm.cn/vcbr/"
// const replaceBR = "/gtadata/vcsky/"


// Configurable mode - show settings UI before play
//const configurableMode = params.get('configurable') === "1";
const configurableMode = "1";
// Settings that can be configured via URL or UI
let autoFullScreen = params.get('fullscreen') !== "0";
let cheatsEnabled = params.get('cheats') === "1";
let maxFPS = parseInt(params.get('max_fps')) || 0;

// full game access
if (params.get('request_original_game') !== "1")
    localStorage.setItem('vcsky.haveOriginalGame', 'true');

const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
let isTouch = isMobile && window.matchMedia('(pointer: coarse)').matches;

document.body.dataset.isTouch = isTouch ? 1 : 0;

const dataSize = 130 * 1024 * 1024;
const textDecoder = new TextDecoder();
let haveOriginalGame = false;
const translations = {
    zh: {
        clickToPlayDemo: "点击试玩Demo",
        clickToPlayFull: "点击游玩演示版",
        openLocalArchive: "打开本地存档",
        invalidKey: "无效的密钥",
        checking: "正在检查...",
        cloudSaves: "云存档:",
        enabled: "已启用",
        disabled: "未启用",
        playDemoText: "您可以试玩演示版，或提供原始游戏文件以体验完整版.",
        disclaimer: "免责声明：",
        disclaimerSources: "本游戏基于《侠盗猎车手：罪恶都市》开源版本制作，非商业发行，与R星游戏公司（Rockstar Games）无任何关联。",
        disclaimerCheckbox: "我拥有该游戏原版",
        disclaimerPrompt: "你需要提供一份原版游戏文件，以确认你拥有该游戏的原版所有权。",
        cantContinuePlaying: "演示版无法继续游玩剧情。请提供原版游戏文件以继续体验。",
        demoAlert: "演示版仅用于熟悉游戏技术架构，所有功能均可使用，但无法推进游戏剧情主线。请提供原版游戏文件以启动完整版。",
        downloading: "正在缓冲",
        enterKey: "输入你的密钥",
        clickToContinue: "点击继续...",
        enterJsDosKey: "输入js-dos密钥（5位长度）",
        ruTranslate: "",
        configLanguage: "语言：",
        configCheats: "作弊功能（F3键）",
        configFullscreen: "全屏模式",
        configMaxFps: "最大帧率：",
        configUnlimited: "（0 = 无限制）",
        // 新增表格表头翻译
        tableHeaderItem: "配置项名称",
        tableHeaderRange: "取值范围",
        tableHeaderDesc: "说明",
        // 新增表格配置项说明翻译
        configLangDesc: "游戏语言",
        configCheatsDesc: "启用作弊菜单（按F3键呼出）",
        configOriginalGameDesc: "游玩前请求下载原始游戏文件",
        configFullscreenDesc: "禁用自动全屏功能",
        configMaxFpsDesc: "限制游戏帧率（例如：设置60代表60帧/秒）",
        configConfigurableDesc: "在「开始游戏」按钮前显示配置界面",
    },
    en: {
        clickToPlayDemo: "Click to play demo",
        clickToPlayFull: "Click to play",
        openLocalArchive: "Open Local Saves",
        invalidKey: "invalid key",
        checking: "checking...",
        cloudSaves: "Cloud saves:",
        enabled: "enabled",
        disabled: "disabled",
        playDemoText: "You can play the DEMO version, or provide the original game files to play the full version.",
        disclaimer: "DISCLAIMER:",
        disclaimerSources: "This game is based on an open source version of GTA: Vice City. It is not a commercial release and is not affiliated with Rockstar Games.",
        disclaimerCheckbox: "I own the original game",
        disclaimerPrompt: "You need to provide a file from the original game to confirm ownership of the original game.",
        cantContinuePlaying: "You can't continue playing in DEMO version. Please provide the original game files to continue playing.",
        demoAlert: "The demo version is intended only for familiarizing yourself with the game technology. All features are available, but you won't be able to progress through the game's storyline. Please provide the original game files to launch the full version.",
        downloading: "Downloading",
        enterKey: "enter your key",
        clickToContinue: "Click to continue...",
        enterJsDosKey: "Enter js-dos key (5 len)",
        ruTranslate: "",
        configLanguage: "Language:",
        configCheats: "Cheats (F3)",
        configFullscreen: "Fullscreen",
        configMaxFps: "Max FPS:",
        configUnlimited: "(0 = unlimited)",
        // 新增表格表头翻译
        tableHeaderItem: "Configuration Item Name",
        tableHeaderRange: "Value Range",
        tableHeaderDesc: "Description",
        // 新增表格配置项说明翻译
        configLangDesc: "Game Language",
        configCheatsDesc: "Enable Cheat Menu (Press F3 to open)",
        configOriginalGameDesc: "Request to download original game files before playing",
        configFullscreenDesc: "Disable automatic fullscreen function",
        configMaxFpsDesc: "Limit game frame rate (e.g., set 60 for 60 FPS)",
        configConfigurableDesc: "Show configuration interface before the \"Start Game\" button",
    },
    ru: {
        clickToPlayDemo: "Играть в демо версию",
        clickToPlayFull: "Играть",
        openLocalArchive: "Открыть локальные сохранения",
        invalidKey: "неверный ключ",
        checking: "проверка...",
        cloudSaves: "Облачные сохранения:",
        enabled: "включены",
        disabled: "выключены",
        playDemoText: "Вы можете играть в демо версию, или предоставить оригинальные файлы игры для полной версии.",
        disclaimer: "ОТКАЗ ОТ ОТВЕТСТВЕННОСТИ:",
        disclaimerSources: "Эта игра основана на открытой версии GTA: Vice City. Она не является коммерческим изданием и не связана с Rockstar Games.",
        disclaimerCheckbox: "Я владею оригинальной игрой",
        disclaimerPrompt: "Вам потребуется приложить какой-либо файл из оригинальной игры для подтверждения владения оригинальной игрой.",
        cantContinuePlaying: "Вы не можете продолжить игру в демо версии. Пожалуйста, предоставьте оригинальные файлы игры для продолжения игры.",
        demoAlert: "Демо версия предназначена только для ознакомления с технологией игры. Все функции доступны, но вы не сможете продолжить игру по сюжету. Пожалуйста, предоставьте оригинальные файлы игры для запуска полной версии.",
        downloading: "Загрузка",
        enterKey: "введите ваш ключ",
        clickToContinue: "Нажмите для продолжения...",
        enterJsDosKey: "Введите ключ js-dos (5 букв)",
        ruTranslate: `
<div class="translated-by">
    <span>Переведено на русский студией</span>
    <a href="https://www.gamesvoice.ru/" target="_blank">GamesVoice</a>
</div>
`,
        configLanguage: "Язык:",
        configCheats: "Читы (F3)",
        configFullscreen: "Полный экран",
        configMaxFps: "Макс. FPS:",
        configUnlimited: "(0 = без ограничений)",
        // 新增表格表头翻译
        tableHeaderItem: "Название параметра конфигурации",
        tableHeaderRange: "Диапазон значений",
        tableHeaderDesc: "Описание",
        // 新增表格配置项说明翻译
        configLangDesc: "Язык игры",
        configCheatsDesc: "Включить меню читов (нажмите F3 для открытия)",
        configOriginalGameDesc: "Запросить загрузку оригинальных игровых файлов перед запуском",
        configFullscreenDesc: "Отключить автоматическую функцию полноэкранного режима",
        configMaxFpsDesc: "Ограничить частоту кадров игры (например: установите 60 для 60 FPS)",
        configConfigurableDesc: "Показать интерфейс конфигурации перед кнопкой «Запустить игру»",
    },
};

var currentLanguage = navigator.language.split("-")[0] === "ru" ? "ru" : "en";
    if (params.get("lang") === "ru") {
        currentLanguage = "ru";
    }
    if (params.get("lang") === "en") {
        currentLanguage = "en";
    }
    currentLanguage = 'zh'
    
window.t = function (key) {
    return translations[currentLanguage][key];
}

// Function to update all translated texts on the page
function updateAllTranslations() {
    
    const clickToPlayButton = document.getElementById('click-to-play-button');
    if (clickToPlayButton) {
        clickToPlayButton.textContent = haveOriginalGame ? t('clickToPlayFull') : t('clickToPlayDemo');
    }
    
    const openLocalArchiveLink = document.getElementById('open-local-archive-link');
    if (openLocalArchiveLink) {
        openLocalArchiveLink.textContent = t('openLocalArchive');
    }
        
    // Update config panel labels if present
    const configLangLabel = document.getElementById('config-lang-label');
    if (configLangLabel) configLangLabel.textContent = t('configLanguage');
    
    const configCheatsLabel = document.getElementById('config-cheats-label');
    if (configCheatsLabel) configCheatsLabel.textContent = t('configCheats');
    
    const configFullscreenLabel = document.getElementById('config-fullscreen-label');
    if (configFullscreenLabel) configFullscreenLabel.textContent = t('configFullscreen');
    
    const configMaxFpsLabel = document.getElementById('config-max-fps-label');
    if (configMaxFpsLabel) configMaxFpsLabel.textContent = t('configMaxFps');
    
    const configMaxFpsUnlimited = document.getElementById('config-max-fps-unlimited');
    if (configMaxFpsUnlimited) configMaxFpsUnlimited.textContent = t('configUnlimited');
    
    // ========== 新增：配置表格翻译逻辑（和原有代码风格保持一致） ==========
    // 1. 渲染表格表头
    const tableHeaderItem = document.getElementById('table-header-item');
    if (tableHeaderItem) tableHeaderItem.textContent = t('tableHeaderItem');
    
    const tableHeaderRange = document.getElementById('table-header-range');
    if (tableHeaderRange) tableHeaderRange.textContent = t('tableHeaderRange');
    
    const tableHeaderDesc = document.getElementById('table-header-desc');
    if (tableHeaderDesc) tableHeaderDesc.textContent = t('tableHeaderDesc');

    // 2. 渲染表格配置项说明
    const configDescLang = document.getElementById('config-desc-lang');
    if (configDescLang) configDescLang.textContent = t('configLangDesc');
    
    const configDescCheats = document.getElementById('config-desc-cheats');
    if (configDescCheats) configDescCheats.textContent = t('configCheatsDesc');
    
    const configDescOriginalGame = document.getElementById('config-desc-original-game');
    if (configDescOriginalGame) configDescOriginalGame.textContent = t('configOriginalGameDesc');
    
    const configDescFullscreen = document.getElementById('config-desc-fullscreen');
    if (configDescFullscreen) configDescFullscreen.textContent = t('configFullscreenDesc');
    
    const configDescMaxFps = document.getElementById('config-desc-max-fps');
    if (configDescMaxFps) configDescMaxFps.textContent = t('configMaxFpsDesc');
    
    const configDescConfigurable = document.getElementById('config-desc-configurable');
    if (configDescConfigurable) configDescConfigurable.textContent = t('configConfigurableDesc');
    // ========== 表格翻译逻辑结束 ==========
}

// Function to update game data files based on language
function updateGameDataForLanguage(lang) {
    data_content = `${replaceBR}vc-sky-en-v6.data.br`;
    wasm_content = `${replaceBR}vc-sky-en-v6.wasm.br`;
}

// Initialize data files based on current language
updateGameDataForLanguage(currentLanguage);

async function loadData() {
    let cache;
    try {
        cache = await caches.open(location.hostname);
        const cached = await cache.match(data_content);
        if (cached && data_content !== "index.data") {
            return new Uint8Array(await cached.arrayBuffer());
        }
    } catch (e) {
        console.error('Failed to open cache:', e);
    }
    const response = await fetch(data_content);

    const reader = response.body.getReader();
    let receivedLength = 0;
    let chunks = [];
    while (true) {
        const { done, value } = await reader.read();
        if (done) {
            break;
        }
        chunks.push(value);
        receivedLength += value.length;
        if (typeof setStatus === "function") {
            setStatus(`Downloading...(${receivedLength}/${dataSize})`);
        }
    }
    let buffer = new Uint8Array(receivedLength);
    let position = 0;
    for (let chunk of chunks) {
        buffer.set(chunk, position);
        position += chunk.length;
    }
    buffer = buffer.buffer;
    if (cache) {
        try {
            await cache.put(data_content, new Response(buffer, { headers: { 'Content-Type': 'application/octet-stream' } }));
        } catch (e) {
            console.error('Failed to cache data:', e.message);
        }
    }
    return new Uint8Array(buffer);
};

async function startGame(e) {
    e.stopPropagation();

    document.querySelector('.start-container').style.display = 'none';

    const intro = document.querySelector('.intro');
    const introContainer = document.querySelector('.intro-container');
    const loaderContainer = document.querySelector('.loader-container');
    document.querySelector('.click-to-play').style.display = 'none';
    loaderContainer.style.display = "flex";
    introContainer.hidden = false;
    intro.play();

    const dataBuffer = await loadData();
    spinnerElement.hidden = true;
    setStatus(t("clickToContinue"));
    introContainer.hidden = false;
    introContainer.style.cursor = 'pointer';
    const clickHandler = () => {
        intro.pause();
        introContainer.style.display = 'none';
        loadGame(dataBuffer);
    };
    if (isMobile) {
        window.addEventListener('pointerup', clickHandler, { once: true });
    } else {
        window.addEventListener('click', clickHandler, { once: true });
    }
}

function setStatus(text) {
    if (!text) {
        progressElement.hidden = true;
        spinnerElement.hidden = true;
        return;
    }
    const match = text.match(/(.+)\((\d+\.?\d*)\/(\d+)\)/);
    if (match) {
        const [current, total] = match.slice(2, 4).map(Number);
        const percent = (current / total * 100).toFixed(0);
        statusElement.textContent = t("downloading") + ` ${percent}%`;
        progressElement.value = current;
        progressElement.max = total;
        progressElement.hidden = false;
        spinnerElement.hidden = false;
        const progressBarFill = spinnerElement.querySelector('.progress-bar-fill');
        if (progressBarFill) {
            progressBarFill.style.width = percent + '%';
        }
    } else {
        statusElement.textContent = text;
    }
};

async function loadGame(data) {
    var Module = {
        mainCalled: () => {
            try {
                Module.FS.unlink("/vc-assets/local/revc.ini");
                Module.FS.createDataFile("/vc-assets/local/revc.ini", 0, revc_ini, revc_ini.length);
            } catch (e) {
                console.error('mainCalled error:', e);
            }
        },
        syncRevcIni: () => {
            try {
                const path = Module.FS.lookupPath("/vc-assets/local/revc.ini");
                if (path && path.node && path.node.contents) {
                    localStorage.setItem('vcsky.revc.ini', textDecoder.decode(path.node.contents));
                }
            } catch (e) {
                console.error('syncRevcIni error:', e);
            }
        },
        preRun: [],
        postRun: [],
        print: (...args) => console.log(args.join(' ')),
        printErr: (...args) => console.error(args.join(' ')),
        getPreloadedPackage: () => {
            return data.buffer;
        },
        canvas: function () {
            const canvas = document.getElementById('canvas');
            canvas.addEventListener('webglcontextlost', (e) => {
                statusElement.textContent = 'WebGL context lost. Please reload the page.';
                e.preventDefault();
            });
            return canvas;
        }(),
        setStatus,
        totalDependencies: 0,
        monitorRunDependencies: (num) => {
            Module.totalDependencies = Math.max(Module.totalDependencies, num);
            Module.setStatus(`Preparing... (${Module.totalDependencies - num}/${Module.totalDependencies})`);
        },
        hotelMission: () => {
            if (!haveOriginalGame) {
                alert(t("cantContinuePlaying"));
                throw new Error(t("cantContinuePlaying"));
            }
        },
    };
    Module.log = Module.print;
    Module.instantiateWasm = async (
        info,
        receiveInstance,
    ) => {
        const wasm = await (await fetch(wasm_content ? wasm_content : "index.wasm")).arrayBuffer();
        const module = await WebAssembly.instantiate(wasm, info);
        return receiveInstance(module.instance, module);
    };
    window.onerror = (message) => {
        Module.setStatus(`Error: ${message}`);
        spinnerElement.hidden = true;
    };
    Module.arguments = window.location.search
        .slice(1)
        .split('&')
        .filter(Boolean)
        .map(decodeURIComponent);
    window.onbeforeunload = function (event) {
        event.preventDefault();
        return '';
    };

    window.Module = Module;
    const script = document.createElement('script');
    script.async = true;
    script.src = '/assets/js/index.js';
    document.body.appendChild(script);

    document.body.classList.add('gameIsStarted');

    const emulator = new GamepadEmulator();
    const gamepad = emulator.AddEmulatedGamepad(null, true);
    const gamepadEmulatorConfig = {
        directions: { up: true, down: true, left: true, right: true },
        dragDistance: 100,
        tapTarget: move,
        lockTargetWhilePressed: true,
        xAxisIndex: 0,
        yAxisIndex: 1,
        swapAxes: false,
        invertX: false,
        invertY: false,
    };
    emulator.AddDisplayJoystickEventListeners(0, [gamepadEmulatorConfig]);
    const gamepadEmulatorConfig1 = {
        directions: { up: true, down: true, left: true, right: true },
        dragDistance: 100,
        tapTarget: look,
        lockTargetWhilePressed: true,
        xAxisIndex: 2,
        yAxisIndex: 3,
        swapAxes: false,
        invertX: false,
        invertY: false,
    };
    emulator.AddDisplayJoystickEventListeners(0, [gamepadEmulatorConfig1]);

    emulator.AddDisplayButtonEventListeners(0, [{
        buttonIndex: 9,
        lockTargetWhilePressed: false,
        tapTarget: document.querySelector('.touch-control.menu'),
    }]);
    emulator.AddDisplayButtonEventListeners(0, [{
        buttonIndex: 3,
        lockTargetWhilePressed: false,
        tapTarget: document.querySelector('.touch-control.car.getIn'),
    }]);
    emulator.AddDisplayButtonEventListeners(0, [{
        buttonIndex: 0,
        lockTargetWhilePressed: false,
        tapTarget: document.querySelector('.touch-control.run'),
    }]);
    emulator.AddDisplayButtonEventListeners(0, [{
        buttonIndex: 1,
        lockTargetWhilePressed: false,
        tapTarget: document.querySelector('.touch-control.fist'),
    }]);
    emulator.AddDisplayButtonEventListeners(0, [{
        buttonIndex: 5,
        lockTargetWhilePressed: false,
        tapTarget: document.querySelector('.touch-control.drift'),
    }]);
    emulator.AddDisplayButtonEventListeners(0, [{
        buttonIndex: 2,
        lockTargetWhilePressed: false,
        tapTarget: document.querySelector('.touch-control.jump'),
    }]);
    emulator.AddDisplayButtonEventListeners(0, [{
        buttonIndex: 4,
        lockTargetWhilePressed: false,
        tapTarget: document.querySelector('.touch-control.mobile'),
    }]);
    emulator.AddDisplayButtonEventListeners(0, [{
        buttonIndex: 11,
        lockTargetWhilePressed: false,
        tapTarget: document.querySelector('.touch-control.job'),
    }]);
    emulator.AddDisplayButtonEventListeners(0, [{
        buttonIndex: 4,
        lockTargetWhilePressed: false,
        tapTarget: document.querySelector('.touch-control.radio'),
    }]);
    emulator.AddDisplayButtonEventListeners(0, [{
        buttonIndex: 7,
        lockTargetWhilePressed: false,
        tapTarget: document.querySelector('.touch-control.weapon'),
    }]);
    emulator.AddDisplayButtonEventListeners(0, [{
        buttonIndex: 8,
        lockTargetWhilePressed: false,
        tapTarget: document.querySelector('.touch-control.camera'),
    }]);
    emulator.AddDisplayButtonEventListeners(0, [{
        buttonIndex: 10,
        lockTargetWhilePressed: false,
        tapTarget: document.querySelector('.touch-control.horn'),
    }]);
    emulator.AddDisplayButtonEventListeners(0, [{
        buttonIndex: 7,
        buttonIndexes: [1, 7],
        lockTargetWhilePressed: false,
        tapTarget: document.querySelector('.touch-control.fireRight'),
    }]);
    emulator.AddDisplayButtonEventListeners(0, [{
        buttonIndex: 6,
        buttonIndexes: [1, 6],
        lockTargetWhilePressed: false,
        tapTarget: document.querySelector('.touch-control.fireLeft'),
    }]);
}

const clickToPlay = document.querySelector('.click-to-play');
const clickLink = clickToPlay.querySelector('button');
clickToPlay.addEventListener('click', (e) => {
    if (!haveOriginalGame) {
        //     alert(t('demoAlert'));
        alert(t('demoOffDisclaimer'));
        return;
    }
    if (e.target === clickToPlay || e.target === clickLink) {
        startGame(e);
        if (!isMobile && autoFullScreen) {
            if (window.top === window) {
                document.body.requestFullscreen(document.documentElement);
            } else {
                window.top.postMessage({
                    event: 'request-fullscreen',
                }, '*');
            }
            function lockMouseIfNeeded() {
                if (!document.pointerLockElement && typeof Module !== 'undefined' && Module.canvas) {
                    Module.canvas.requestPointerLock({
                        unadjustedMovement: true,
                    }).catch(() => {
                        console.warn('Failed to lock in unadjusted movement mode');
                        Module.canvas.requestPointerLock().catch(() => {
                            console.error('Failed to lock in default mode');
                        });
                    });
                }
            }
            document.addEventListener("mousedown", lockMouseIfNeeded, { capture: true });
            if (navigator.keyboard && navigator.keyboard.lock) {
                navigator.keyboard.lock(["Escape", "KeyW"]);
            }
        }
    } else if (window.top !== window) {
        window.top.postMessage({
            event: 'request-fullscreen',
        }, '*');
    }
});

const savesMountPoint = "/vc-assets/local/userfiles";
const savesFile = "vcsky.saves";
wrapIDBFS(console.log).addListener({
    onLoad: (_, mount) => {
        if (mount.mountpoint !== savesMountPoint) {
            return null;
        }
        const token = localStorage.getItem('vcsky.key');
        if (token && token.length === 5) {
            const promise = CloudSDK.pullFromStorage(token, savesFile);
            promise.then((payload) => {
                console.log('[IDBFS] onLoad', token, payload ? payload.length / 1024 : 0, 'kb');
            });
            return promise;
        }
        return null;
    },
    onSave: (getData, _, mount) => {
        if (mount.mountpoint !== savesMountPoint) {
            return;
        }
        const token = localStorage.getItem('vcsky.key');
        if (token && token.length === 5) {
            getData().then((payload) => {
                if (payload.length > 0) {
                    console.log('[IDBFS] onSave', token, payload.length / 1024, 'kb');
                    return CloudSDK.pushToStorage(token, savesFile, payload);
                }
            });
        }
    },
});


const clickToPlayButton = document.getElementById('click-to-play-button');
clickToPlayButton.textContent = t('clickToPlayDemo');
clickToPlayButton.classList.add('disabled');



const originalGameFile = document.getElementById('original-game-file');


function ownerShipConfirmed() {
    localStorage.setItem('vcsky.haveOriginalGame', 'true');
    clickToPlayButton.textContent = t('clickToPlayFull');
    clickToPlayButton.classList.remove('disabled');
    haveOriginalGame = true;
};

function ownerShipNotConfirmed() {
    localStorage.removeItem('vcsky.haveOriginalGame');
    clickToPlayButton.textContent = t('clickToPlayDemo');
    haveOriginalGame = false;
    clickToPlayButton.classList.add('disabled');
};


localStorage.getItem('vcsky.haveOriginalGame') === 'true' ? ownerShipConfirmed() : ownerShipNotConfirmed();

const revc_iniDefault = `
[VideoMode]
Width=800
Height=600
Depth=32
Subsystem=0
Windowed=0
[Controller]
HeadBob1stPerson=0
HorizantalMouseSens=0.002500
InvertMouseVertically=1
DisableMouseSteering=1
Vibration=0
Method=${isTouch ? '1' : '0'}
InvertPad=0
JoystickName=
PadButtonsInited=0
[Audio]
SfxVolume=36
MusicVolume=37
MP3BoostVolume=0
Radio=0
SpeakerType=0
Provider=0
DynamicAcoustics=1
[Display]
Brightness=256
DrawDistance=1.800000
Subtitles=0
ShowHud=1
RadarMode=0
ShowLegends=0
PedDensity=1.200000
CarDensity=1.200000
CutsceneBorders=1
FreeCam=0
[Graphics]
AspectRatio=0
VSync=1
Trails=1
FrameLimiter=0
MultiSampling=0
IslandLoading=0
PS2AlphaTest=1
ColourFilter=2
MotionBlur=0
VehiclePipeline=0
NeoRimLight=0
NeoLightMaps=0
NeoRoadGloss=0
[General]
SkinFile=$$""
Language=0
DrawVersionText=0
NoMovies=0
[CustomPipesValues]
PostFXIntensity=1.000000
NeoVehicleShininess=1.000000
NeoVehicleSpecularity=1.000000
RimlightMult=1.000000
LightmapMult=1.000000
GlossMult=1.000000
[Rendering]
BackfaceCulling=1
NewRenderer=1
[Draw]
ProperScaling=1
FixRadar=1
FixSprites=1
[Bindings]
PED_FIREWEAPON=mouse:LEFT,2ndKbd:PAD5
PED_CYCLE_WEAPON_RIGHT=2ndKbd:PADENTER,mouse:WHLDOWN,kbd:E
PED_CYCLE_WEAPON_LEFT=kbd:PADDEL,mouse:WHLUP,2ndKbd:Q
GO_FORWARD=kbd:UP,2ndKbd:W
GO_BACK=kbd:DOWN,2ndKbd:S
GO_LEFT=2ndKbd:A,kbd:LEFT
GO_RIGHT=kbd:RIGHT,2ndKbd:D
PED_SNIPER_ZOOM_IN=kbd:PGUP,2ndKbd:Z,mouse:WHLUP
PED_SNIPER_ZOOM_OUT=kbd:PGDN,2ndKbd:X,mouse:WHLDOWN
VEHICLE_ENTER_EXIT=kbd:ENTER,2ndKbd:F
CAMERA_CHANGE_VIEW_ALL_SITUATIONS=kbd:HOME,2ndKbd:V
PED_JUMPING=kbd:RCTRL,2ndKbd:SPC
PED_SPRINT=2ndKbd:LSHIFT,kbd:RSHIFT
PED_LOOKBEHIND=2ndKbd:CAPSLK,mouse:MIDDLE,kbd:PADINS
PED_DUCK=kbd:C
PED_ANSWER_PHONE=kbd:TAB
VEHICLE_FIREWEAPON=kbd:PADINS,2ndKbd:LCTRL,mouse:LEFT
VEHICLE_ACCELERATE=2ndKbd:W
VEHICLE_BRAKE=2ndKbd:S
VEHICLE_CHANGE_RADIO_STATION=kbd:INS,2ndKbd:R
VEHICLE_HORN=2ndKbd:LSHIFT,kbd:RSHIFT
TOGGLE_SUBMISSIONS=kbd:PLUS,2ndKbd:CAPSLK
VEHICLE_HANDBRAKE=kbd:RCTRL,2ndKbd:SPC,mouse:RIGHT
PED_1RST_PERSON_LOOK_LEFT=kbd:PADLEFT
PED_1RST_PERSON_LOOK_RIGHT=kbd:PADHOME
VEHICLE_LOOKLEFT=kbd:PADEND,2ndKbd:Q
VEHICLE_LOOKRIGHT=kbd:PADDOWN,2ndKbd:E
VEHICLE_LOOKBEHIND=mouse:MIDDLE
VEHICLE_TURRETLEFT=kbd:PADLEFT
VEHICLE_TURRETRIGHT=kbd:PAD5
VEHICLE_TURRETUP=kbd:PADPGUP,2ndKbd:UP
VEHICLE_TURRETDOWN=kbd:PADRIGHT,2ndKbd:DOWN
PED_CYCLE_TARGET_LEFT=kbd:[,2ndKbd:PADEND
PED_CYCLE_TARGET_RIGHT=2ndKbd:],kbd:PADDOWN
PED_CENTER_CAMERA_BEHIND_PLAYER=kbd:#
PED_LOCK_TARGET=kbd:DEL,mouse:RIGHT,2ndKbd:PADRIGHT
NETWORK_TALK=kbd:T
PED_1RST_PERSON_LOOK_UP=kbd:PADPGUP
PED_1RST_PERSON_LOOK_DOWN=kbd:PADUP
_CONTROLLERACTION_36=
TOGGLE_DPAD=
SWITCH_DEBUG_CAM_ON=
TAKE_SCREEN_SHOT=
SHOW_MOUSE_POINTER_TOGGLE=
UNKNOWN_ACTION=

`;

const revc_ini = (() => {
    const cached = localStorage.getItem('vcsky.revc.ini');
    if (cached) {
        return cached;
    }
    return revc_iniDefault;
})();

// Configurable mode UI
if (configurableMode) {
    const configPanel = document.getElementById('config-panel');
    const configLang = document.getElementById('config-lang');
    const configCheats = document.getElementById('config-cheats');
    const configFullscreen = document.getElementById('config-fullscreen');
    const configMaxFps = document.getElementById('config-max-fps');
    
    if (configPanel && configCheats && configFullscreen && configMaxFps) {
        // Show config panel
        configPanel.style.display = 'block';
        
        // Set initial values from URL params
        if (configLang) configLang.value = currentLanguage;
        configCheats.checked = cheatsEnabled;
        configFullscreen.checked = autoFullScreen;
        configMaxFps.value = maxFPS;
        
        // Update config panel labels with current language
        updateAllTranslations();
        
        // Language selector handler
        if (configLang) {
            configLang.addEventListener('change', (e) => {
                currentLanguage = e.target.value;
                updateGameDataForLanguage(currentLanguage);
                updateAllTranslations();
            });
        }
        
        // Update settings when changed
        configCheats.addEventListener('change', (e) => {
            cheatsEnabled = e.target.checked;
        });
        
        configFullscreen.addEventListener('change', (e) => {
            autoFullScreen = e.target.checked;
        });
        
        configMaxFps.addEventListener('input', (e) => {
            maxFPS = parseInt(e.target.value) || 0;
        });
    }
}