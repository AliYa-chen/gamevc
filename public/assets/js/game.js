var data_content;
var wasm_content;

const params = new URLSearchParams(window.location.search);

window.VCSKY = window.VCSKY || {};

window.VCSKY.setConfig = function (cfg = {}) {
    if (cfg.language) {
        currentLanguage = cfg.language;
        updateGameDataForLanguage(currentLanguage);
    }

    if (typeof cfg.cheats === 'boolean') {
        cheatsEnabled = cfg.cheats;
    }

    if (typeof cfg.fullscreen === 'boolean') {
        autoFullScreen = cfg.fullscreen;
    }

    if (typeof cfg.maxFPS === 'number') {
        maxFPS = cfg.maxFPS;
        if (window.Module?._setFPSLimit) {
            Module._setFPSLimit(maxFPS);
        }
    }

    console.log('[VCSKY] Config applied:', {
        language: currentLanguage,
        cheatsEnabled,
        autoFullScreen,
        maxFPS,
    });
};



// Base URLs
const replaceBR = "https://cdn.nbcnm.cn/vcbr/"

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

var currentLanguage = navigator.language.split("-")[0] === "ru" ? "ru" : "en";
if (params.get("lang") === "ru") {
    currentLanguage = "ru";
}
if (params.get("lang") === "en") {
    currentLanguage = "en";
}

currentLanguage = 'zh'

window.t = function (key) {
    return key;
}

// Function to update game data files based on language
function updateGameDataForLanguage(lang) {
    if (lang === 'ru') {
        data_content = `${replaceBR}vc-sky-ru-v6.data.br`;
        wasm_content = `${replaceBR}vc-sky-ru-v6.wasm.br`;
    } else {
        data_content = `${replaceBR}vc-sky-en-v6.data.br`;
        wasm_content = `${replaceBR}vc-sky-en-v6.wasm.br`;
    }
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
        if (done) break;

        chunks.push(value);
        receivedLength += value.length;

        const percent = Math.min(
            100,
            Math.floor((receivedLength / dataSize) * 100)
        );

        // ⭐ 向 Vue 上报真实进度
        window.VCSKY.onProgress?.(percent);

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
    if (e?.stopPropagation) e.stopPropagation();

    const startContainer = document.querySelector('.start-container');
    if (startContainer) startContainer.style.display = 'none';

    const intro = document.querySelector('.intro');
    const introContainer = document.querySelector('.intro-container');
    const loaderContainer = document.querySelector('.loader-container');

    if (loaderContainer) loaderContainer.style.display = "flex";
    if (introContainer) introContainer.hidden = false;

    if (intro) {
        intro.play?.();
    }

    const dataBuffer = await loadData();

    setStatus(t("clickToContinue"));

    if (introContainer) {
        introContainer.hidden = false;
        introContainer.style.cursor = 'pointer';
    }

    const clickHandler = () => {
        intro?.pause?.();
        if (introContainer) introContainer.style.display = 'none';
        loadGame(dataBuffer);
    };

    if (isMobile) {
        window.addEventListener('pointerup', clickHandler, { once: true });
    } else {
        window.addEventListener('click', clickHandler, { once: true });
    }
}


function setStatus(text) {
  if (!text) return

  // ⭐ 关键：告诉 Vue「可以进入游戏了」
  if (text === t("clickToContinue")) {
    window.VCSKY.onReady?.()
    return
  }
}


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
                alert("WebGL context lost. Please reload the page.")
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






const originalGameFile = document.getElementById('original-game-file');


function ownerShipConfirmed() {
    localStorage.setItem('vcsky.haveOriginalGame', 'true');
    haveOriginalGame = true;
};

function ownerShipNotConfirmed() {
    localStorage.removeItem('vcsky.haveOriginalGame');
    haveOriginalGame = false;
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

// start game
window.VCSKY.start = function () {
    if (!haveOriginalGame) {
        alert(t('demoAlert'));
        return;
    }

    startGame(null);

    if (!isMobile && autoFullScreen) {
        if (window.top === window) {
            document.documentElement.requestFullscreen?.();
        } else {
            window.top.postMessage({ event: 'request-fullscreen' }, '*');
        }
    }
};