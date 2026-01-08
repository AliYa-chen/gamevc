(function() {
    var modules = [
        'assets/modules/runtime.js',
        (currentLanguage === 'ru' ? 'assets/modules/packages/ru.js' : 'assets/modules/packages/en.js'),
        'assets/modules/loader.js',
        'assets/modules/fs.js',
        'assets/modules/audio.js',
        'assets/modules/graphics.js',
        'assets/modules/events.js',
        'assets/modules/fetch.js',
        (currentLanguage === 'ru' ? 'assets/modules/asm_consts/ru.js' : 'assets/modules/asm_consts/en.js'),
        'assets/modules/main.js'
    ];
    if (typeof importScripts === 'function') {
        importScripts.apply(null, modules);
    } else {
        var loadNext = function(i) {
            if (i < modules.length) {
                var s = document.createElement('script');
                s.src = modules[i];
                s.async = false; // Ensure order
                s.onload = function() { loadNext(i + 1); };
                s.onerror = function() { console.error('Failed to load module: ' + modules[i]); };
                document.body.appendChild(s);
            }
        };
        loadNext(0);
    }
})();
