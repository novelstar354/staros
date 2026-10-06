/* =====================================================
STar IDE 
app.js
===================================================== */

let editor = null;

const functions = {};
const consts = {};
const keys = {};

let mouseX = 0;
let mouseY = 0;

const mouseButtons = {
    left: false,
    middle: false,
    right: false
};

const mouseClicks = {
    left: false,
    middle: false,
    right: false
};

let saveTimer = null;
const classes = {};
/* =====================================================
   STar Background
===================================================== */

let starBackgroundTasks = [];
let starBackgroundRunId = 0;

function stopStarBackground() {
    starBackgroundRunId++;

    for (const task of starBackgroundTasks) {
        task.running = false;
    }

    starBackgroundTasks = [];
}
/* =====================================================
   STar IDE Language
===================================================== */

let currentLanguage =
    localStorage.getItem("star_language") || "ja";


const starTranslations = {

    ja: {
        newFile: "＋ New File",
        open: "開く",
        save: "保存",
        search: "検索",
        replace: "置換",
        replaceAll: "一括置換",
        run: "▶ 実行",
        shortcuts: "ショートカット",
        help: "使い方",

        explorer: "EXPLORER",
        outline: "OUTLINE",
        classes: "▶ Classes",
        variables: "▶ Variables",
        arrays: "▶ Arrays",
        constants: "▶ Constants",
        functions: "▶ Functions",

        searchPlaceholder: "検索...",
        replacePlaceholder: "置換...",
        previousSearch: "前を検索",
        nextSearch: "次を検索",
        resultCount: "0 件",

        caseSensitive: "大文字/小文字",
        wholeWord: "単語単位",
        regex: "正規表現",

        console: "Console",
        autoScroll: "自動スクロール",
        clear: "Clear",

        helpTitle: "STar Guide",
        helpSearch: "ヘルプを検索...",

        searchSection: "検索・置換",
        fileSection: "ファイル",
        runSection: "▶ 実行",
        editSection: "編集",
        lineSection: "行操作",

        find: "検索",
        replaceAction: "置換",
        nextResult: "次の検索結果",
        previousResult: "前の検索結果",
        closePanel: "パネルを閉じる",

        saveAction: "保存",
        newFile: "新規ファイル",
        closeFile: "ファイルを閉じる",

        runProgram: "プログラム実行",

        undo: "元に戻す",
        redo: "やり直す",
        copy: "コピー",
        cut: "切り取り",
        paste: "貼り付け",
        selectAll: "すべて選択",
        toggleComment: "コメント切り替え",
        goToLine: "指定行へ移動",

        deleteLine: "行を削除",
        moveLineUp: "行を上へ移動",
        moveLineDown: "行を下へ移動",
        duplicateLineUp: "行を上へ複製",
        duplicateLineDown: "行を下へ複製"
    },


    en: {
        newFile: "＋ New File",
        open: "Open",
        save: "Save",
        search: "Search",
        replace: "Replace",
        replaceAll: "Replace All",
        run: "▶ Run",
        shortcuts: "Shortcuts",
        help: "Help",

        explorer: "EXPLORER",
        outline: "OUTLINE",
        classes: "▶ Classes",
        variables: "▶ Variables",
        arrays: "▶ Arrays",
        constants: "▶ Constants",
        functions: "▶ Functions",

        searchPlaceholder: "Search...",
        replacePlaceholder: "Replace...",
        previousSearch: "Find Previous",
        nextSearch: "Find Next",
        resultCount: "0 results",

        caseSensitive: "Case Sensitive",
        wholeWord: "Whole Word",
        regex: "Regular Expression",

        console: "Console",
        autoScroll: "Auto Scroll",
        clear: "Clear",

        helpTitle: "STar Guide",
        helpSearch: "Search help...",

        searchSection: "Search & Replace",
        fileSection: "File",
        runSection: "▶ Run",
        editSection: "Edit",
        lineSection: "Line",

        find: "Search",
        replaceAction: "Replace",
        nextResult: "Next Result",
        previousResult: "Previous Result",
        closePanel: "Close Panel",

        saveAction: "Save",
        newFile: "New File",
        closeFile: "Close File",

        runProgram: "Run Program",

        undo: "Undo",
        redo: "Redo",
        copy: "Copy",
        cut: "Cut",
        paste: "Paste",
        selectAll: "Select All",
        toggleComment: "Toggle Comment",
        goToLine: "Go to Line",

        deleteLine: "Delete Line",
        moveLineUp: "Move Line Up",
        moveLineDown: "Move Line Down",
        duplicateLineUp: "Duplicate Line Up",
        duplicateLineDown: "Duplicate Line Down"
    }

};


function t(key) {

    return (
        starTranslations[currentLanguage]?.[key] ??
        starTranslations.ja[key] ??
        key
    );

}


function setLanguage(language) {

    if (
        language !== "ja" &&
        language !== "en"
    ) {
        language = "ja";
    }

    currentLanguage = language;

    localStorage.setItem(
        "star_language",
        language
    );

    applyLanguage();

}

document
    .querySelectorAll("[data-i18n]")
    .forEach(element => {

        const key =
            element.dataset.i18n;

        if (starTranslations[currentLanguage]?.[key]) {
            element.textContent =
                t(key);
        }

    });

function toggleLanguage() {

    setLanguage(
        currentLanguage === "ja"
            ? "en"
            : "ja"
    );

}


function applyLanguage() {

    document.documentElement.lang =
        currentLanguage === "en"
            ? "en"
            : "ja";


    /* =========================
       Toolbar
    ========================= */

    const setText = (id, key) => {

        const element =
            document.getElementById(id);

        if (element) {
            element.textContent = t(key);
        }

    };


    setText("newFileBtn", "newFile");
    setText("openFileBtn", "open");
    setText("saveFileBtn", "save");
    setText("searchBtn", "search");
    setText("replaceBtnTop", "replace");
    setText("replaceAllBtnTop", "replaceAll");
    setText("runBtn", "run");
    setText("shortcutBtn", "shortcuts");
    setText("helpBtn", "help");


    /* =========================
       Sidebar
    ========================= */

    const sidebarHeaders =
        document.querySelectorAll(
            ".sidebar-header"
        );

    if (sidebarHeaders[0]) {
        sidebarHeaders[0].textContent =
            t("explorer");
    }

    if (sidebarHeaders[1]) {
        sidebarHeaders[1].textContent =
            t("outline");
    }


    const outlineTitles =
        document.querySelectorAll(
            ".outlineTitle"
        );

    if (outlineTitles[0])
        outlineTitles[0].textContent =
            t("classes");

    if (outlineTitles[1])
        outlineTitles[1].textContent =
            t("variables");

    if (outlineTitles[2])
        outlineTitles[2].textContent =
            t("arrays");

    if (outlineTitles[3])
        outlineTitles[3].textContent =
            t("constants");

    if (outlineTitles[4])
        outlineTitles[4].textContent =
            t("functions");


    /* =========================
       Search
    ========================= */

    const searchInput =
        document.getElementById(
            "searchInput"
        );

    if (searchInput) {
        searchInput.placeholder =
            t("searchPlaceholder");
    }


    const replaceInput =
        document.getElementById(
            "replaceInput"
        );

    if (replaceInput) {
        replaceInput.placeholder =
            t("replacePlaceholder");
    }


    const findPrevBtn =
        document.getElementById(
            "findPrevBtn"
        );

    if (findPrevBtn) {
        findPrevBtn.title =
            t("previousSearch");
    }


    const findNextBtn =
        document.getElementById(
            "findNextBtn"
        );

    if (findNextBtn) {
        findNextBtn.title =
            t("nextSearch");
    }


    const searchCount =
        document.getElementById(
            "searchCount"
        );

    if (
        searchCount &&
        !searchCount.dataset.dynamic
    ) {
        searchCount.textContent =
            t("resultCount");
    }


    const caseSensitive =
        document.getElementById(
            "caseSensitive"
        );

    if (caseSensitive?.parentElement) {
        caseSensitive.parentElement.lastChild.textContent =
            " " + t("caseSensitive");
    }


    const wholeWord =
        document.getElementById(
            "wholeWord"
        );

    if (wholeWord?.parentElement) {
        wholeWord.parentElement.lastChild.textContent =
            " " + t("wholeWord");
    }


    const regexSearch =
        document.getElementById(
            "regexSearch"
        );

    if (regexSearch?.parentElement) {
        regexSearch.parentElement.lastChild.textContent =
            " " + t("regex");
    }


    /* =========================
       Console
    ========================= */

    const consoleHeader =
        document.querySelector(
            "#consoleHeader > span"
        );

    if (consoleHeader) {
        consoleHeader.textContent =
            t("console");
    }


    const autoScroll =
        document.querySelector(
            ".consoleCheck"
        );

    if (autoScroll) {

        const checkbox =
            autoScroll.querySelector(
                "input"
            );

        autoScroll.textContent =
            "";

        if (checkbox) {
            autoScroll.appendChild(
                checkbox
            );
        }

        autoScroll.appendChild(
            document.createTextNode(
                " " + t("autoScroll")
            )
        );

    }


    setText(
        "clearConsoleBtn",
        "clear"
    );


    /* =========================
       Help
    ========================= */

    const helpTitle =
        document.querySelector(
            "#helpHeader h2"
        );

    if (helpTitle) {
        helpTitle.textContent =
            t("helpTitle");
    }


    const helpSearch =
        document.getElementById(
            "helpSearch"
        );

    if (helpSearch) {
        helpSearch.placeholder =
            t("helpSearch");
    }


    /* =========================
       Shortcut
    ========================= */

    const shortcutSections =
        document.querySelectorAll(
            ".shortcutSection"
        );

    if (shortcutSections[0]) {

        const title =
            shortcutSections[0].querySelector(
                "h3"
            );

        if (title)
            title.textContent =
                t("searchSection");

    }


    if (shortcutSections[1]) {

        const title =
            shortcutSections[1].querySelector(
                "h3"
            );

        if (title)
            title.textContent =
                t("fileSection");

    }


    if (shortcutSections[2]) {

        const title =
            shortcutSections[2].querySelector(
                "h3"
            );

        if (title)
            title.textContent =
                t("runSection");

    }


    if (shortcutSections[3]) {

        const title =
            shortcutSections[3].querySelector(
                "h3"
            );

        if (title)
            title.textContent =
                t("editSection");

    }


    if (shortcutSections[4]) {

        const title =
            shortcutSections[4].querySelector(
                "h3"
            );

        if (title)
            title.textContent =
                t("lineSection");

    }


    /* =========================
       Language button
    ========================= */

    const languageBtn =
        document.getElementById(
            "languageBtn"
        );

    if (languageBtn) {

        languageBtn.textContent =
            currentLanguage === "ja"
                ? "🇺🇸 English"
                : "🇯🇵 日本語";

    }
    /* =========================
       Help Content
    ========================= */

    const helpJa =
        document.getElementById("help-ja");

    const helpEn =
        document.getElementById("help-en");

    if (helpJa && helpEn) {

        if (currentLanguage === "en") {

            helpJa.style.display = "none";
            helpEn.style.display = "";

        } else {

            helpJa.style.display = "";
            helpEn.style.display = "none";

        }

    }


    /* =========================
       Shortcut
    ========================= */

    applyShortcutLanguage();

applyShortcutLanguage();
}

function applyShortcutLanguage() {

    document
        .querySelectorAll("#shortcutPanel [data-ja][data-en]")
        .forEach(element => {

            element.textContent =
                currentLanguage === "en"
                    ? element.dataset.en
                    : element.dataset.ja;

        });

}

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const languageBtn =
            document.getElementById(
                "languageBtn"
            );

        if (languageBtn) {

            languageBtn.addEventListener(
                "click",
                toggleLanguage
            );

        }

        applyLanguage();

    }
);

/* =====================================================
   STar Canvas
===================================================== */

let starCanvas = null;
let starCtx = null;
let starCanvasAnimationRunning = false;
let starCanvasAnimationId = null;
let starCanvasAnimationFrame = 0;
let starCanvasAnimationStartTime = 0;
let starCanvasAnimationLastTime = 0;
let starCanvasColor = "#ffffff";
let starCanvasFill = "#ffffff";
let starCanvasStroke = "#ffffff";
let starCanvasFont = "20px sans-serif";
let starCanvasLineWidth = 1;
/* =====================================================
   STar Canvas Objects
===================================================== */

const starCanvasObjects = {};
const starCanvasObjectAnimations = {};
/* =====================================================
   STar CANVAS SYSTEM
===================================================== */

function createStarCanvas(width = 800, height = 500) {

    width = Math.max(1, Number(width) || 800);
    height = Math.max(1, Number(height) || 500);

    let stage =
        document.getElementById("starCanvasStage");

    if (!stage) {

        /* =========================
           Canvasステージ
        ========================= */

        stage =
            document.createElement("div");

        stage.id =
            "starCanvasStage";

        stage.style.position =
            "fixed";

        stage.style.left =
            "50%";

        stage.style.top =
            "50%";

        stage.style.transform =
            "translate(-50%, -50%)";

        stage.style.padding =
            "12px";

        stage.style.background =
            "rgba(10,15,30,.97)";

        stage.style.border =
            "1px solid rgba(0,229,255,.35)";

        stage.style.borderRadius =
            "12px";

        stage.style.boxShadow =
            "0 0 30px rgba(0,229,255,.20)";

        stage.style.zIndex =
            "9999";

        stage.style.maxWidth =
            "calc(100vw - 40px)";

        stage.style.maxHeight =
            "calc(100vh - 40px)";

        stage.style.boxSizing =
            "border-box";


        /* =========================
           ×ボタン
        ========================= */

        /* =========================
   ×ボタン
========================= */

const closeButton =
    document.createElement("button");

closeButton.id =
    "starCanvasClose";

closeButton.textContent =
    "×";

closeButton.title =
    "Canvasを閉じる";

closeButton.style.position =
    "absolute";

closeButton.style.top =
    "8px";

closeButton.style.right =
    "8px";

closeButton.style.width =
    "30px";

closeButton.style.height =
    "30px";

closeButton.style.padding =
    "0";

closeButton.style.border =
    "1px solid rgba(0,229,255,.35)";

closeButton.style.borderRadius =
    "6px";

closeButton.style.background =
    "rgba(15,23,42,.90)";

closeButton.style.color =
    "rgba(255,255,255,.85)";

closeButton.style.fontSize =
    "22px";

closeButton.style.fontWeight =
    "400";

closeButton.style.lineHeight =
    "27px";

closeButton.style.textAlign =
    "center";

closeButton.style.cursor =
    "pointer";

closeButton.style.boxSizing =
    "border-box";

closeButton.style.zIndex =
    "10000";

closeButton.style.transition =
    "all .15s ease";

closeButton.style.backdropFilter =
    "blur(6px)";


/* =========================
   マウスを乗せたとき
========================= */

closeButton.addEventListener(
    "mouseenter",
    () => {

        closeButton.style.background =
            "rgba(0,229,255,.15)";

        closeButton.style.borderColor =
            "rgba(0,229,255,.75)";

        closeButton.style.color =
            "#ffffff";

        closeButton.style.boxShadow =
            "0 0 12px rgba(0,229,255,.20)";

    }
);


/* =========================
   マウスを離したとき
========================= */

closeButton.addEventListener(
    "mouseleave",
    () => {

        closeButton.style.background =
            "rgba(15,23,42,.90)";

        closeButton.style.borderColor =
            "rgba(0,229,255,.35)";

        closeButton.style.color =
            "rgba(255,255,255,.85)";

        closeButton.style.boxShadow =
            "none";

    }
);


/* =========================
   クリック
========================= */

closeButton.addEventListener(
    "click",
    (event) => {

        event.stopPropagation();

        destroyStarCanvas();

    }
);


        stage.appendChild(
            closeButton
        );

        document.body.appendChild(
            stage
        );
    }


    /* =========================
       既存Canvasを削除
    ========================= */

    if (starCanvas) {

        starCanvas.remove();

    }


    /* =========================
       Canvas作成
    ========================= */

    starCanvas =
        document.createElement("canvas");

    starCanvas.id =
        "starCanvas";

    starCanvas.width =
        width;

    starCanvas.height =
        height;

/* =====================================================
   STar Canvas Mouse
===================================================== */

starCanvas.addEventListener("mousemove", e => {

    const rect =
        starCanvas.getBoundingClientRect();

    const scaleX =
        starCanvas.width / rect.width;

    const scaleY =
        starCanvas.height / rect.height;

    mouseX =
        (e.clientX - rect.left) * scaleX;

    mouseY =
        (e.clientY - rect.top) * scaleY;

});


starCanvas.addEventListener("mousedown", e => {

    if (e.button === 0) {
        mouseButtons.left = true;
        mouseClicks.left = true;
    }

    if (e.button === 1) {
        mouseButtons.middle = true;
        mouseClicks.middle = true;
    }

    if (e.button === 2) {
        mouseButtons.right = true;
        mouseClicks.right = true;
    }

});


starCanvas.addEventListener("mouseup", e => {

    if (e.button === 0) {
        mouseButtons.left = false;
    }

    if (e.button === 1) {
        mouseButtons.middle = false;
    }

    if (e.button === 2) {
        mouseButtons.right = false;
    }

});


starCanvas.addEventListener("mouseleave", () => {

    mouseButtons.left = false;
    mouseButtons.middle = false;
    mouseButtons.right = false;

});


starCanvas.addEventListener("contextmenu", e => {
    e.preventDefault();
});
    /* =========================
       Canvas表示サイズ
    ========================= */

    starCanvas.style.display =
        "block";

    starCanvas.style.maxWidth =
        "calc(100vw - 70px)";

    starCanvas.style.maxHeight =
        "calc(100vh - 90px)";

    starCanvas.style.width =
        "auto";

    starCanvas.style.height =
        "auto";

    starCanvas.style.background =
        "#111827";

    starCanvas.style.borderRadius =
        "8px";

    starCanvas.style.boxSizing =
        "border-box";


    /* =========================
       Canvasをステージへ追加
    ========================= */

    stage.appendChild(
        starCanvas
    );


    /* =========================
       Context
    ========================= */

    starCtx =
    starCanvas.getContext("2d");


starCanvasColor =
    "#ffffff";

starCanvasFill =
    "#ffffff";

starCanvasStroke =
    "#ffffff";

starCanvasFont =
    "20px sans-serif";

starCanvasLineWidth =
    1;


starCtx.fillStyle =
    starCanvasFill;

starCtx.strokeStyle =
    starCanvasStroke;

starCtx.lineWidth =
    starCanvasLineWidth;

starCtx.font =
    starCanvasFont;

    /* =========================
       表示
    ========================= */

    stage.style.display =
        "block";


    return starCanvas;
}

/* =====================================================
   STar Canvas Object
===================================================== */

function createStarCanvasObject(name, properties = {}) {

    if (!name) {
        throw new Error(
            "Canvas object requires a name."
        );
    }

    let x = Number(properties.x ?? 0);
    let y = Number(properties.y ?? 0);

    let width =
        Number(properties.width ?? 50);

    let height =
        Number(properties.height ?? 50);

    let points =
        Array.isArray(properties.points)
            ? properties.points
            : null;

    starCanvasObjects[name] = {

        name: name,

        type:
            String(properties.type ?? "rectangle")
                .toLowerCase(),

        x: x,
        y: y,

        width: width,
        height: height,

        angle:
    Number(
        properties.angle ??
        properties.rotate ??
        0
    ),

rotate:
    Number(
        properties.rotate ??
        properties.angle ??
        0
    ),

        points: points,

        fill:
            properties.fill ??
            "#ffffff",

        visible:
            properties.visible !== undefined
                ? Boolean(properties.visible)
                : true,

        opacity:
            properties.opacity !== undefined
                ? Number(properties.opacity)
                : 1

    };

    return starCanvasObjects[name];
}
/* Canvas取得 */

function requireStarCanvas() {

    if (!starCanvas || !starCtx) {

        createStarCanvas();

    }

    return true;
}
/* =====================================================
   STar Canvas Object Move
===================================================== */

function parseStarAnimationDuration(value) {

    if (value === undefined || value === null) {
        return 0;
    }

    const text =
        String(value)
            .trim()
            .toLowerCase();

    const match =
        text.match(
            /^(-?(?:\d+(?:\.\d+)?|\.\d+))\s*(ms|s|m)?$/
        );

    if (!match) {
        return Number(value) || 0;
    }

    const number =
        Number(match[1]);

    const unit =
        match[2] || "ms";

    if (unit === "ms") {
        return number;
    }

    if (unit === "s") {
        return number * 1000;
    }

    if (unit === "m") {
        return number * 60000;
    }

    return number;
}


function animateStarCanvasObject(
    name,
    type,
    value,
    duration,
    animationTime,
    animationKey
) {

    const object =
        starCanvasObjects[name];

    if (!object) {

        throw new Error(
            `Canvas object not found: ${name}`
        );

    }

    const durationMs =
        Math.max(
            0,
            parseStarAnimationDuration(duration)
        );

    const time =
        Math.max(
            0,
            Number(animationTime) || 0
        );


    const key =
        `${name}:${type}:${animationKey}`;


    /* =========================
       即時変更
    ========================= */

    if (durationMs <= 0) {

        if (type === "move") {

            const amount =
                Number(value.amount) || 0;

            const dx =
                value.direction === "right"
                    ? amount
                    : value.direction === "left"
                        ? -amount
                        : 0;

            const dy =
                value.direction === "down"
                    ? amount
                    : value.direction === "up"
                        ? -amount
                        : 0;

            object.x =
                Number(object.x || 0) + dx;

            object.y =
                Number(object.y || 0) + dy;

            if (Array.isArray(object.points)) {

                object.points =
                    object.points.map(point => [
                        Number(point[0]) + dx,
                        Number(point[1]) + dy
                    ]);

            }
        }


        if (type === "rotate") {

            object.rotate =
                Number(value);

            object.angle =
                Number(value);

        }


        if (type === "fadein") {

            object.opacity = 1;

        }


        if (type === "fadeout") {

            object.opacity = 0;

        }

        return object;
    }


    /* =========================
       初回
    ========================= */

    let animation =
        starCanvasObjectAnimations[key];


    if (
        !animation ||
        animation.completed
    ) {

        animation = {

            type: type,

            startTime:
                time,

            duration:
                durationMs,

            completed:
                false

        };


        if (type === "move") {

            const amount =
                Number(value.amount) || 0;

            animation.startX =
                Number(object.x || 0);

            animation.startY =
                Number(object.y || 0);

            animation.endX =
                animation.startX;

            animation.endY =
                animation.startY;


            if (
    value.direction === "right" ||
    value.direction === "left" ||
    value.direction === "up" ||
    value.direction === "down"
) {

    if (value.direction === "right") {
        animation.endX += amount;
    }

    if (value.direction === "left") {
        animation.endX -= amount;
    }

    if (value.direction === "down") {
        animation.endY += amount;
    }

    if (value.direction === "up") {
        animation.endY -= amount;
    }

}
else {

    const angle =
        Number(value.direction)
        *
        Math.PI / 180;


    animation.endX +=
        Math.cos(angle) *
        amount;


    animation.endY +=
        Math.sin(angle) *
        amount;

}


            if (Array.isArray(object.points)) {

                animation.startPoints =
                    object.points.map(
                        point => [
                            Number(point[0]),
                            Number(point[1])
                        ]
                    );

                animation.endPoints =
                    animation.startPoints.map(
                        point => [
                            point[0] +
                                (animation.endX -
                                 animation.startX),

                            point[1] +
                                (animation.endY -
                                 animation.startY)
                        ]
                    );

            }

        }


        if (type === "rotate") {

    animation.startAngle =
        Number(
            object.rotate ??
            object.angle ??
            0
        );

    animation.endAngle =
        animation.startAngle +
        Number(value);

}


        if (type === "fadein") {

            animation.startOpacity =
                Number(object.opacity ?? 0);

            animation.endOpacity =
                1;

        }


        if (type === "fadeout") {

            animation.startOpacity =
                Number(object.opacity ?? 1);

            animation.endOpacity =
                0;

        }


        starCanvasObjectAnimations[key] =
            animation;

    }


    /* =========================
       進行度
    ========================= */

    const elapsed =
        time -
        animation.startTime;

    const progress =
        Math.max(
            0,
            Math.min(
                1,
                elapsed /
                animation.duration
            )
        );


    /* =========================
       なめらかな補間
       easeInOut
    ========================= */

    const eased =
        progress < 0.5
            ? 2 * progress * progress
            : 1 -
              Math.pow(
                  -2 * progress + 2,
                  2
              ) / 2;


    /* =========================
       MOVE
    ========================= */

    if (type === "move") {

        object.x =
            animation.startX +
            (
                animation.endX -
                animation.startX
            ) * eased;

        object.y =
            animation.startY +
            (
                animation.endY -
                animation.startY
            ) * eased;


        if (
            Array.isArray(
                animation.startPoints
            )
        ) {

            object.points =
                animation.startPoints.map(
                    (point, index) => [

                        point[0] +
                        (
                            animation.endPoints[index][0] -
                            point[0]
                        ) * eased,

                        point[1] +
                        (
                            animation.endPoints[index][1] -
                            point[1]
                        ) * eased

                    ]
                );

        }

    }


    /* =========================
       ROTATE
    ========================= */

    if (type === "rotate") {

        const angle =
            animation.startAngle +
            (
                animation.endAngle -
                animation.startAngle
            ) * eased;

        object.rotate =
            angle;

        object.angle =
            angle;

    }


    /* =========================
       FADE IN
    ========================= */

    if (type === "fadein") {

        object.opacity =
            animation.startOpacity +
            (
                animation.endOpacity -
                animation.startOpacity
            ) * eased;

    }


    /* =========================
       FADE OUT
    ========================= */

    if (type === "fadeout") {

        object.opacity =
            animation.startOpacity +
            (
                animation.endOpacity -
                animation.startOpacity
            ) * eased;

    }


    /* =========================
       完了
    ========================= */

    if (progress >= 1) {

        animation.completed =
            true;

        if (type === "move") {

            object.x =
                animation.endX;

            object.y =
                animation.endY;

            if (
                Array.isArray(
                    animation.endPoints
                )
            ) {

                object.points =
                    animation.endPoints.map(
                        point => [
                            point[0],
                            point[1]
                        ]
                    );

            }

        }


        if (type === "rotate") {

            object.rotate =
                animation.endAngle;

            object.angle =
                animation.endAngle;

        }


        if (
            type === "fadein"
        ) {

            object.opacity = 1;

        }


        if (
            type === "fadeout"
        ) {

            object.opacity = 0;

        }

    }


    return object;
}

/* Canvas削除 */

function destroyStarCanvas() {

    stopStarCanvasAnimation();

    const stage =
        document.getElementById(
            "starCanvasStage"
        );

    if (stage) {
        stage.remove();
    }

    starCanvas = null;
    starCtx = null;
}


/* Canvasクリア */

function clearStarCanvas() {

    if (!requireStarCanvas())
        return;

    starCtx.clearRect(
        0,
        0,
        starCanvas.width,
        starCanvas.height
    );
}


/* 背景 */

function setStarCanvasBackground(color) {

    if (!requireStarCanvas())
        return;

    const oldFill =
        starCtx.fillStyle;

    starCtx.fillStyle = color;

    starCtx.fillRect(
        0,
        0,
        starCanvas.width,
        starCanvas.height
    );

    starCtx.fillStyle =
        oldFill;
}


/* 描画色 */

function setStarCanvasColor(color) {

    requireStarCanvas();

    starCanvasColor = color;

    starCanvasFill = color;
    starCanvasStroke = color;

    starCtx.fillStyle = color;
    starCtx.strokeStyle = color;
}


/* 塗りつぶし色 */

function setStarCanvasFill(color) {

    requireStarCanvas();

    starCanvasFill = color;

    starCtx.fillStyle = color;
}


/* 線色 */

function setStarCanvasStroke(color) {

    requireStarCanvas();

    starCanvasStroke = color;

    starCtx.strokeStyle = color;
}


/* 四角形 */

function starCanvasRect(
    x,
    y,
    width,
    height
) {

    requireStarCanvas();

    starCtx.strokeStyle =
        starCanvasStroke;

    starCtx.strokeRect(
        Number(x),
        Number(y),
        Number(width),
        Number(height)
    );
}

/* =====================================================
   STar Canvas Object Draw
===================================================== */

function drawStarCanvasObject(name) {

    requireStarCanvas();

    const object =
        starCanvasObjects[name];

    if (!object) {

        throw new Error(
            `Canvas object not found: ${name}`
        );

    }


    /* =========================
       非表示
    ========================= */

    if (object.visible === false) {
        return;
    }


    /* =========================
       Canvas状態保存
    ========================= */

    starCtx.save();


    /* =========================
       透明度
    ========================= */

    starCtx.globalAlpha =
        Math.max(
            0,
            Math.min(
                1,
                Number(object.opacity ?? 1)
            )
        );


    /* =========================
       色
    ========================= */

    starCtx.fillStyle =
        object.fill ?? "#ffffff";


    /* =========================
       回転
    ========================= */

    if (
    Number(
        object.rotate ??
        object.angle ??
        0
    ) !== 0
) {

        const centerX =
            Number(object.x) +
            Number(object.width) / 2;

        const centerY =
            Number(object.y) +
            Number(object.height) / 2;

        starCtx.translate(
            centerX,
            centerY
        );

        starCtx.rotate(
    Number(
        object.rotate ??
        object.angle ??
        0
    ) *
    Math.PI / 180
);

        starCtx.translate(
            -centerX,
            -centerY
        );
    }


    /* =========================
       points がある場合
    ========================= */

    if (
    Array.isArray(object.points)
) {

    const type =
        String(object.type || "polygon")
            .toLowerCase();


    /* =========================
       triangle
    ========================= */

    if (
        type === "triangle" &&
        object.points.length !== 3
    ) {

        starCtx.restore();

        throw new Error(
            `Canvas object '${name}' triangle requires exactly 3 points.`
        );

    }


    /* =========================
       rectangle
    ========================= */

    if (
        (
            type === "rectangle" ||
            type === "rect"
        ) &&
        object.points.length !== 4
    ) {

        starCtx.restore();

        throw new Error(
            `Canvas object '${name}' rectangle requires exactly 4 points.`
        );

    }


    /* =========================
       polygon
    ========================= */

    if (
        type === "polygon" &&
        object.points.length < 3
    ) {

        starCtx.restore();

        throw new Error(
            `Canvas object '${name}' polygon requires at least 3 points.`
        );

    }


    /* =========================
       描画
    ========================= */

    if (object.points.length >= 3) {

        starCtx.beginPath();

        starCtx.moveTo(
            Number(object.points[0][0]),
            Number(object.points[0][1])
        );

        for (
            let i = 1;
            i < object.points.length;
            i++
        ) {

            starCtx.lineTo(
                Number(object.points[i][0]),
                Number(object.points[i][1])
            );

        }

        starCtx.closePath();

        starCtx.fill();

        starCtx.restore();

        return;
    }
}


    /* =========================
       points がない場合
       通常の四角形
    ========================= */

    starCtx.save();

const angle =
    Number(
        object.rotate ??
        object.angle ??
        0
    );

const centerX =
    Number(object.x || 0) +
    Number(object.width || 50) / 2;

const centerY =
    Number(object.y || 0) +
    Number(object.height || 50) / 2;

starCtx.translate(
    centerX,
    centerY
);

starCtx.rotate(
    angle * Math.PI / 180
);

starCtx.fillRect(
    -Number(object.width || 50) / 2,
    -Number(object.height || 50) / 2,
    Number(object.width || 50),
    Number(object.height || 50)
);

starCtx.restore();


    starCtx.restore();
}
/* 塗りつぶし四角形 */

function starCanvasFillRect(
    x,
    y,
    width,
    height
) {

    requireStarCanvas();

    starCtx.fillStyle =
        starCanvasFill;

    starCtx.fillRect(
        Number(x),
        Number(y),
        Number(width),
        Number(height)
    );
}


/* 枠付き四角形 */

function starCanvasStrokeRect(
    x,
    y,
    width,
    height
) {

    requireStarCanvas();

    starCtx.strokeStyle =
        starCanvasStroke;

    starCtx.strokeRect(
        Number(x),
        Number(y),
        Number(width),
        Number(height)
    );
}


/* 円 */

function starCanvasCircle(
    x,
    y,
    radius
) {

    requireStarCanvas();

    starCtx.beginPath();

    starCtx.arc(
        Number(x),
        Number(y),
        Number(radius),
        0,
        Math.PI * 2
    );

    starCtx.strokeStyle =
        starCanvasStroke;

    starCtx.stroke();
}


/* 塗りつぶし円 */

function starCanvasFillCircle(
    x,
    y,
    radius
) {

    requireStarCanvas();

    starCtx.beginPath();

    starCtx.arc(
        Number(x),
        Number(y),
        Number(radius),
        0,
        Math.PI * 2
    );

    starCtx.fillStyle =
        starCanvasFill;

    starCtx.fill();
}


/* 線 */

function starCanvasLine(
    x1,
    y1,
    x2,
    y2
) {

    requireStarCanvas();

    starCtx.beginPath();

    starCtx.moveTo(
        Number(x1),
        Number(y1)
    );

    starCtx.lineTo(
        Number(x2),
        Number(y2)
    );

    starCtx.strokeStyle =
        starCanvasStroke;

    starCtx.stroke();
}

function setStarCanvasLineWidth(width) {

    requireStarCanvas();

    starCanvasLineWidth =
        Math.max(0.1, Number(width) || 1);

    starCtx.lineWidth =
        starCanvasLineWidth;
}
function interpolateStarCanvasText(text, vars) {

    return String(text).replace(
        /\$\{([^}]+)\}/g,
        (_, expression) => {

            try {

                return String(
                    evalExpr(
                        expression.trim(),
                        vars
                    )
                );

            }
            catch(e){

                return "${" + expression + "}";

            }

        }
    );

}
/* テキスト */

function starCanvasText(
    text,
    x,
    y,
    size = 20
) {

    requireStarCanvas();

    starCtx.save();

    starCtx.font =
        `${Number(size) || 20}px sans-serif`;

    starCtx.fillStyle =
        starCanvasFill;

    starCtx.textAlign =
        "left";

    starCtx.textBaseline =
        "alphabetic";

    starCtx.fillText(
        String(text),
        Number(x),
        Number(y)
    );

    starCtx.restore();
}

function starCanvasFillPolygon(points) {

    requireStarCanvas();

    if (!Array.isArray(points) || points.length < 3) {
        return;
    }

    starCtx.save();

    starCtx.beginPath();

    starCtx.moveTo(
        Number(points[0][0]),
        Number(points[0][1])
    );

    for (let i = 1; i < points.length; i++) {

        starCtx.lineTo(
            Number(points[i][0]),
            Number(points[i][1])
        );

    }

    starCtx.closePath();

    starCtx.fillStyle =
        starCanvasFill;

    starCtx.fill();

    starCtx.restore();
}

function starCanvasPolygon(points) {

    requireStarCanvas();

    if (!Array.isArray(points) || points.length < 3) {
        return;
    }

    starCtx.save();

    starCtx.beginPath();

    starCtx.moveTo(
        Number(points[0][0]),
        Number(points[0][1])
    );

    for (let i = 1; i < points.length; i++) {

        starCtx.lineTo(
            Number(points[i][0]),
            Number(points[i][1])
        );

    }

    starCtx.closePath();

    starCtx.strokeStyle =
        starCanvasStroke;

    starCtx.lineWidth =
        starCanvasLineWidth || 1;

    starCtx.stroke();

    starCtx.restore();
}
function starCanvasArc(
    x,
    y,
    radius,
    startAngle,
    endAngle
) {

    requireStarCanvas();

    starCtx.save();

    starCtx.beginPath();

    starCtx.arc(
        Number(x),
        Number(y),
        Number(radius),
        Number(startAngle),
        Number(endAngle)
    );

    starCtx.strokeStyle =
        starCanvasStroke;

    starCtx.lineWidth =
        starCanvasLineWidth || 1;

    starCtx.stroke();

    starCtx.restore();
}
/* Canvas表示 */

function showStarCanvas() {

    const stage =
        document.getElementById(
            "starCanvasStage"
        );

    if (stage) {
        stage.style.display = "block";
    }
}
/* =========================
   Canvas save
========================= */

function starCanvasSave(){

    requireStarCanvas();

    starCtx.save();

}


/* =========================
   Canvas restore
========================= */

function starCanvasRestore(){

    requireStarCanvas();

    starCtx.restore();

}


/* =========================
   Canvas translate
========================= */

function starCanvasTranslate(x,y){

    requireStarCanvas();

    starCtx.translate(
        Number(x),
        Number(y)
    );

}


/* =========================
   Canvas rotate
========================= */

function starCanvasRotate(angle){

    requireStarCanvas();

    // STarは度数指定
    const rad =
        Number(angle) *
        Math.PI / 180;

    starCtx.rotate(rad);

}
/* =====================================================
   STar Canvas Animation
===================================================== */

function stopStarCanvasAnimation() {

    starCanvasAnimationRunning = false;

    if (starCanvasAnimationId !== null) {

        cancelAnimationFrame(
            starCanvasAnimationId
        );

        starCanvasAnimationId = null;
    }
}


function startStarCanvasAnimation(
    block,
    vars,
    baseLine = 1,
    fps = 60
) {

    requireStarCanvas();

    stopStarCanvasAnimation();

    starCanvasAnimationRunning = true;

    starCanvasAnimationFrame = 0;

    starCanvasAnimationStartTime =
        performance.now();

    starCanvasAnimationLastTime =
        starCanvasAnimationStartTime;

    fps =
        Math.max(
            1,
            Math.min(
                240,
                Number(fps) || 60
            )
        );

    const frameInterval =
        1000 / fps;


    async function animationLoop(now) {

        if (!starCanvasAnimationRunning)
            return;

        if (!starCanvas || !starCtx) {

            stopStarCanvasAnimation();
            return;
        }


        const elapsed =
            now -
            starCanvasAnimationLastTime;


        if (elapsed >= frameInterval) {

            const delta =
                now -
                starCanvasAnimationLastTime;

            starCanvasAnimationLastTime =
                now;


            vars.frame =
                starCanvasAnimationFrame;

            vars.time =
                now -
                starCanvasAnimationStartTime;

            vars.delta =
                delta;


            try {

                await runSTar(
                    block,
                    vars,
                    baseLine
                );

            }
            catch (err) {

                stopStarCanvasAnimation();

                if (
                    err &&
                    typeof err === "object" &&
                    err.lineNumber !== undefined
                ) {

                    logError(err);

                }
                else {

                    log(
                        `[Animation Error] ${
                            err?.message ||
                            String(err)
                        }`
                    );

                    console.error(err);

                }

                return;
            }


            starCanvasAnimationFrame++;

        }


        if (starCanvasAnimationRunning) {

            starCanvasAnimationId =
                requestAnimationFrame(
                    animationLoop
                );

        }

    }


    starCanvasAnimationId =
        requestAnimationFrame(
            animationLoop
        );
}
/* Canvas非表示 */

function hideStarCanvas() {

    const stage =
        document.getElementById(
            "starCanvasStage"
        );

    if (stage) {
        stage.style.display = "none";
    }
}


/* Canvasサイズ変更 */

function resizeStarCanvas(
    width,
    height
) {

    if (!requireStarCanvas())
        return;

    starCanvas.width =
        Math.max(1, Number(width) || 800);

    starCanvas.height =
        Math.max(1, Number(height) || 500);

    // Canvasの描画状態を再設定
    starCtx.fillStyle =
        starCanvasFill;

    starCtx.strokeStyle =
        starCanvasStroke;

    starCtx.lineWidth =
        starCanvasLineWidth;

    starCtx.font =
        starCanvasFont;
}
/* =====================================================
DOM
===================================================== */

const fileTree = document.getElementById("fileTree");
const tabs = document.getElementById("tabs");
const consoleEl = document.getElementById("console");

const fileInput = document.getElementById("fileInput");

const runBtn = document.getElementById("runBtn");
const saveBtn = document.getElementById("saveFileBtn");
const openBtn = document.getElementById("openFileBtn");
const newBtn = document.getElementById("newFileBtn");
const clearBtn = document.getElementById("clearConsoleBtn");
const themeBtn = document.getElementById("themeBtn");

const sidebar =
    document.getElementById("fileSidebar");

const resizer =
    document.getElementById("sidebarResizer");

let resizing = false;

resizer.addEventListener(
    "mousedown",
    () => {
        resizing = true;
    }
);

document.addEventListener(
    "mousemove",
    (e) => {

        if (!resizing) return;

        let width = e.clientX;

        width = Math.max(
            180,
            Math.min(
                600,
                width
            )
        );

        sidebar.style.width =
            width + "px";
    }
);

document.addEventListener(
    "mouseup",
    () => {
        resizing = false;
    }
);
/* =====================================================
SEARCH
===================================================== */




function escapeHtml(text) {

    text = String(text);

    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}
/* =====================================================
LOG
===================================================== */

let consoleAutoScroll = true;


function scrollConsoleToBottom(){

    if(consoleAutoScroll){

        consoleEl.scrollTop =
            consoleEl.scrollHeight;

    }

}


function setConsoleScrollMode(mode){

    consoleAutoScroll = mode;


    localStorage.setItem(
        "consoleAutoScroll",
        mode
    );


    const check =
        document.getElementById(
            "consoleAutoScrollCheck"
        );


    if(check){

        check.checked = mode;

    }

}


function log(text){

    consoleEl.innerHTML +=
        `<div>${escapeHtml(text)}</div>`;

    scrollConsoleToBottom();

}

function logError(err) {
    const div = document.createElement("div");
    div.className = "error";

    div.innerHTML = `
    <div class="err-title">[Line ${err.lineNumber}] ${escapeHtml(err.error)}</div>
    ${err.raw ? `<div class="raw">→ ${escapeHtml(err.raw)}</div>` : ""}
`;

    div.style.cursor = "pointer";

    div.onclick = () => {
        jumpToLine(err.lineNumber);
    };

    consoleEl.appendChild(div);
}
function jumpToLine(lineNumber) {
    if (!editor) return;

    editor.revealLineInCenter(lineNumber);
    editor.setPosition({
        lineNumber,
        column: 1
    });
    editor.focus();
}
function clearConsole() {
consoleEl.textContent = "";
}
function waitEditorReady() {
    const timer = setInterval(() => {
        if (editor) {
            clearInterval(timer);
            attachEditorEvents();
        }
    }, 50);
}
/* =====================================================
LOADING
===================================================== */

window.addEventListener("load", () => {

initMonaco();
waitEditorReady();
setTimeout(() => {

    const loading =
        document.getElementById("loadingScreen");

    if (loading)
        loading.remove();

}, 500);

});

/* =====================================================
MONACO
===================================================== */
function initHelp() {

    const helpBtn =
        document.getElementById("helpBtn");

    const helpPanel =
        document.getElementById("helpPanel");

    const closeHelp =
        document.getElementById("closeHelp");

    const helpSearch =
        document.getElementById("helpSearch");

    const helpJa =
        document.getElementById("help-ja");

    const helpEn =
        document.getElementById("help-en");


    if (
        !helpBtn ||
        !helpPanel ||
        !closeHelp ||
        !helpSearch ||
        !helpJa ||
        !helpEn
    ) {
        console.warn(
            "help UI not found"
        );

        return;
    }


    const originalJa =
        helpJa.textContent;

    const originalEn =
        helpEn.textContent;


    helpBtn.onclick = () => {

        helpPanel.classList.add("open");

        applyHelpSearch();

    };


    closeHelp.onclick = () => {

        helpPanel.classList.remove("open");

    };


    function applyHelpSearch() {
    const keyword =
        helpSearch.value
            .trim()
            .toLowerCase();

    const content =
        currentLanguage === "en"
            ? helpEn
            : helpJa;

    const original =
        currentLanguage === "en"
            ? originalEn
            : originalJa;

    // 検索文字が空なら元の文章に戻す
    if (!keyword) {
        content.textContent = original;
        return;
    }

    // HTMLを安全に扱う
    const escapedKeyword = escapeHtml(keyword);

    // 元の文章をHTMLとして作り直す
    const lines = original.split("\n");

    content.innerHTML = lines
        .map(line => {
            const lowerLine = line.toLowerCase();
            let result = "";
            let start = 0;

            while (true) {
                const index =
                    lowerLine.indexOf(keyword, start);

                // 見つからなかった
                if (index === -1) {
                    result += escapeHtml(
                        line.slice(start)
                    );
                    break;
                }

                // 検索文字より前の部分
                result += escapeHtml(
                    line.slice(start, index)
                );

                // 検索文字だけをハイライト
                result +=
                    `<span class="searchHit">` +
                    escapeHtml(
                        line.slice(
                            index,
                            index + keyword.length
                        )
                    ) +
                    `</span>`;

                start =
                    index + keyword.length;
            }

            return result;
        })
        .join("<br>");
}


    helpSearch.addEventListener(
        "input",
        applyHelpSearch
    );


    window.addEventListener(
        "star-language-changed",
        applyHelpSearch
    );

}


window.addEventListener("load", initHelp);

function initMonaco() {

require.config({
    paths: {
        vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs"
    }
});

require(["vs/editor/editor.main"], () => {

    editor = monaco.editor.create(
        document.getElementById("editor"),
        {
            value: activeFile?.content || `print "Hello STar"

let name = "World"

print name`,
            language: "javascript",
            theme: "vs-dark",
            automaticLayout: true,
            fontSize: 15,
            minimap: { enabled: true }
        }
    );
    if (activeFile) {
    editor.setValue(activeFile.content || "");
}
editor.onDidChangeModelContent(() => {
    updateOutline();
});

updateOutline();

});
}

function initFiles() {
    let saved = [];

    try {
        saved = JSON.parse(
            localStorage.getItem("star_files") || "[]"
        );
    } catch (e) {
        console.warn(
            "保存データの読み込みに失敗しました",
            e
        );
    }

    files = Array.isArray(saved) ? saved : [];

    if (files.length === 0) {
        files = [{
            id: crypto.randomUUID(),
            name: "main.star",
            content: ""
        }];

        saveFiles();
    }

    activeFile = files[0];
}
/* =====================================================
FILE
===================================================== */

function createNewFile() {

const file = {
    id: crypto.randomUUID(),
    name: "main.star",
    content: ""
};

files.push(file);

activeFile = file;

renderTabs();
renderTree();

}

function renderTabs() {
tabs.innerHTML = "";

files.forEach(file => {
    const tab = document.createElement("div");

    tab.className =
        "tab" + (activeFile?.id === file.id ? " active" : "");

    // ファイル名
    const name = document.createElement("span");
    name.textContent = file.name;
    name.onclick = () => openFile(file.id);

    // ×ボタン
    const close = document.createElement("span");
    close.textContent = " ×";
    close.style.marginLeft = "8px";
    close.style.cursor = "pointer";
    close.style.color = "#aaa";

    close.onclick = (e) => {
        e.stopPropagation();
        closeFile(file.id);
    };

    tab.appendChild(name);
    tab.appendChild(close);

    tabs.appendChild(tab);
});

}
function closeFile(id) {
if (files.length <= 1) {
alert("最後のファイルは閉じられません");
return;
}

const index = files.findIndex(f => f.id === id);
if (index === -1) return;

const isActive = activeFile?.id === id;

// ファイル削除（閉じる＝非表示扱い）
files.splice(index, 1);

// アクティブ調整
if (isActive) {
    const newIndex = Math.max(0, index - 1);
    activeFile = files[newIndex] || files[0];
    editor.setValue(activeFile?.content || "");
}

saveFiles();
renderTabs();
renderTree();

}




/* =====================================================
FILE SYSTEM (STar IDE)
===================================================== */
let files = JSON.parse(localStorage.getItem("star_files") || "[]");
let activeFile = null;

function saveFiles() {
    try {
        localStorage.setItem(
            "star_files",
            JSON.stringify(files)
        );
    } catch (e) {
        console.error(
            "ファイルの自動保存に失敗しました",
            e
        );
    }
}

/* 新規作成 */
function createFile() {

    const promptText =
        currentLanguage === "en"
            ? "Enter file name"
            : "ファイル名を入力";

    const name =
        prompt(promptText, "main.star");

    if (!name) return;

    const file = {
        id: crypto.randomUUID(),
        name: name,
        content: ""
    };

    files.push(file);
    activeFile = file;

    if (!editor) return;

    saveFiles();
    renderTabs();
    renderTree();
}

function openFile(id) {
    const file = files.find(f => f.id === id);
    if (!file) return;

    saveCurrentFile();

    activeFile = file;

    if (editor) {
        editor.setValue(
            activeFile.content || ""
        );
    }

    renderTabs();
    renderTree();
}

function saveCurrentFile() {
    if (!activeFile || !editor) return;

    activeFile.content = editor.getValue();

    const index = files.findIndex(
        f => f.id === activeFile.id
    );

    if (index !== -1) {
        files[index].content = activeFile.content;
    }

    saveFiles();
}
/* 名前変更 */
function renameFile(id, newName) {
const file = files.find(f => f.id === id);
if (!file) return;

file.name = newName;

saveFiles();
renderTabs();
renderTree();

}

/* 削除 */
function deleteFile(id) {
files = files.filter(f => f.id !== id);

if (activeFile?.id === id) {
    activeFile = files[0] || null;
    editor.setValue(activeFile?.content || "");
}

saveFiles();
renderTabs();
renderTree();

}




/* Tree */
function renderTree() {
    fileTree.innerHTML = "";

    files.forEach(file => {

        const item = document.createElement("div");
        item.className = "file";

        const name = document.createElement("span");
        name.textContent = file.name;

        const renameBtn = document.createElement("button");
        renameBtn.textContent = "変更";
        renameBtn.className = "renameBtn";

        renameBtn.onclick = (e) => {
            e.stopPropagation();

            const newName = prompt(
                "新しいファイル名",
                file.name
            );

            if (newName) {
                renameFile(file.id, newName);
            }
        };

        item.appendChild(name);
        item.appendChild(renameBtn);

        item.onclick = () => openFile(file.id);

        fileTree.appendChild(item);
    });
}


function attachEditorEvents() {
    if (!editor) return;

    if (editor.__starAutoSaveAttached) return;
    editor.__starAutoSaveAttached = true;

    editor.onDidChangeModelContent(() => {
        if (!activeFile) return;

        clearTimeout(saveTimer);

        saveTimer = setTimeout(() => {
            saveCurrentFile();
        }, 500);
    });

    window.addEventListener("beforeunload", () => {
        saveCurrentFile();
    });
}
    

/* 初期化 */
window.addEventListener("load", () => {
    initFiles();
    renderTabs();
    renderTree();
});
/* =====================================================
SAVE
===================================================== */

function saveFile() {

saveCurrentFile();

const blob =
    new Blob(
        [activeFile.content],
        {
            type:
                "text/plain"
        }
    );

const a =
    document.createElement("a");

a.href =
    URL.createObjectURL(blob);

a.download =
    activeFile.name;

a.click();

}




/* =====================================================
STar Runtime
===================================================== */

async function runSTar(code, vars = {}, baseLine = 1) {
const deferBlocks = [];
    const lines = code.split("\n");

    function getBlock(startIndex) {

        const block = [];
        let depth = 1;
        let i = startIndex;

        while (i < lines.length && depth > 0) {

            const current = lines[i].trim();

            if (current.endsWith("{"))
                depth++;

            if (current === "}") {

                depth--;

                if (depth === 0)
                    break;
            }

            if (depth > 0)
                block.push(lines[i]);

            i++;
        }

        return {
            block: block.join("\n"),
            end: i
        };
    }

    for (let i = 0; i < lines.length; i++) {

    const lineNumber = baseLine + i;
    let line = lines[i].trim();

    if (!line) continue;
    if (line.startsWith("#")) continue;

    /* =====================================================
   CANVAS
===================================================== */

if (line.startsWith("canvas ")) {

    const canvasCommand =
        line.substring(7).trim();
    /* =========================
   canvas object distance
========================= */

if (
    canvasCommand.startsWith("object ") &&
    canvasCommand.includes(" distance ")
) {

    const parts =
        canvasCommand.split(/\s+/);

    const object1Name =
        parts[1];

    const distanceIndex =
        parts.indexOf("distance");

    const object2Name =
        parts[distanceIndex + 1];

    const object1 =
        starCanvasObjects[object1Name];

    const object2 =
        starCanvasObjects[object2Name];

    if (!object1) {
        runtimeError(
            `Canvas object not found: ${object1Name}`,
            lineNumber,
            line
        );

        continue;
    }

    if (!object2) {
        runtimeError(
            `Canvas object not found: ${object2Name}`,
            lineNumber,
            line
        );

        continue;
    }

    const x1 =
        Number(object1.x || 0) +
        Number(object1.width || 0) / 2;

    const y1 =
        Number(object1.y || 0) +
        Number(object1.height || 0) / 2;

    const x2 =
        Number(object2.x || 0) +
        Number(object2.width || 0) / 2;

    const y2 =
        Number(object2.y || 0) +
        Number(object2.height || 0) / 2;

    const dx =
        x2 - x1;

    const dy =
        y2 - y1;

    const distance =
        Math.sqrt(
            dx * dx +
            dy * dy
        );

    vars.distance = distance;

    continue;
}


/* =========================
   canvas object collision
========================= */

if (
    canvasCommand.startsWith("object ") &&
    canvasCommand.includes(" collision ")
) {

    const parts =
        canvasCommand.split(/\s+/);

    const object1Name =
        parts[1];

    const collisionIndex =
        parts.indexOf("collision");

    const object2Name =
        parts[collisionIndex + 1];

    const object1 =
        starCanvasObjects[object1Name];

    const object2 =
        starCanvasObjects[object2Name];

    if (!object1) {
        runtimeError(
            `Canvas object not found: ${object1Name}`,
            lineNumber,
            line
        );

        continue;
    }

    if (!object2) {
        runtimeError(
            `Canvas object not found: ${object2Name}`,
            lineNumber,
            line
        );

        continue;
    }


    /* =========================
       Objectの範囲を取得
    ========================= */

    function getObjectBounds(object) {

        if (
            Array.isArray(object.points) &&
            object.points.length >= 3
        ) {

            const xs =
                object.points.map(
                    point => Number(point[0])
                );

            const ys =
                object.points.map(
                    point => Number(point[1])
                );

            return {
                left: Math.min(...xs),
                right: Math.max(...xs),
                top: Math.min(...ys),
                bottom: Math.max(...ys)
            };
        }


        return {
            left:
                Number(object.x || 0),

            right:
                Number(object.x || 0) +
                Number(object.width || 0),

            top:
                Number(object.y || 0),

            bottom:
                Number(object.y || 0) +
                Number(object.height || 0)
        };
    }


    const a =
        getObjectBounds(object1);

    const b =
        getObjectBounds(object2);


    /* =========================
       当たり判定
    ========================= */

    const collision =
        a.left < b.right &&
        a.right > b.left &&
        a.top < b.bottom &&
        a.bottom > b.top;


    vars.collision =
        collision;

    continue;
}
/* =========================
   canvas animate
========================= */

if (
    canvasCommand.startsWith(
        "animate"
    )
) {

    const match =
        canvasCommand.match(
            /^animate(?:\s+(.+?))?\s*\{$/
        );

    if (!match) {

        runtimeError(
            "Canvas animate syntax: canvas animate [fps] {",
            lineNumber,
            line
        );

        continue;
    }


    const fpsText =
        match[1];


    const fps =
        fpsText
            ? evalExpr(
                fpsText,
                vars
            )
            : 60;


    const result =
        getBlock(
            i + 1
        );


    startStarCanvasAnimation(
        result.block,
        vars,
        lineNumber,
        fps
    );


    i =
        result.end;

    continue;
}
    /* =========================
   canvas stop
========================= */

if (
    canvasCommand === "stop"
) {

    stopStarCanvasAnimation();

    continue;
}

    /* =========================
       canvas create
    ========================= */

    if (canvasCommand.startsWith("create ")) {

        const args =
            canvasCommand
                .substring(7)
                .trim()
                .split(/\s+/);

        const width =
            evalExpr(
                args[0] || "800",
                vars
            );

        const height =
            evalExpr(
                args[1] || "500",
                vars
            );

        createStarCanvas(
            width,
            height
        );

        continue;
    }

/* =========================
   canvas object
========================= */

if (
    canvasCommand.startsWith("object ")
) {

    const match =
        canvasCommand.match(
            /^object\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\{$/
        );

    if (!match) {

        runtimeError(
            "Canvas object syntax: canvas object name {",
            lineNumber,
            line
        );

        continue;
    }

    const objectName =
        match[1];

    const result =
        getBlock(i + 1);

    const properties = {};

const propertyLines =
    result.block.split("\n");

for (
    let p = 0;
    p < propertyLines.length;
    p++
) {

    const propertyLine =
        propertyLines[p].trim();

    if (!propertyLine)
        continue;

    if (propertyLine.startsWith("#"))
        continue;

    const propertyMatch =
        propertyLine.match(
            /^([a-zA-Z_][a-zA-Z0-9_]*)\s+(.+)$/
        );

    if (!propertyMatch) {

        runtimeError(
            `Invalid Canvas object property: ${propertyLine}`,
            lineNumber + p + 1,
            propertyLine
        );

        continue;
    }

    const propertyName =
        propertyMatch[1];

    const propertyValue =
        propertyMatch[2].trim();


    /* =========================
       type
    ========================= */

    if (propertyName === "type") {

        properties.type =
            propertyValue
                .replace(/^["']|["']$/g, "")
                .trim()
                .toLowerCase();

        continue;
    }


    /* =========================
       points
       
       points x1 y1 x2 y2 x3 y3 ...
    ========================= */

    if (propertyName === "points") {

        const args =
            propertyValue
                .split(/\s+/)
                .filter(v => v);

        if (
            args.length < 6 ||
            args.length % 2 !== 0
        ) {

            runtimeError(
                "Canvas object points requires x1 y1 x2 y2 x3 y3 ...",
                lineNumber + p + 1,
                propertyLine
            );

            continue;
        }

        const points = [];

        for (
            let j = 0;
            j < args.length;
            j += 2
        ) {

            points.push([
                Number(
                    evalExpr(
                        args[j],
                        vars
                    )
                ),

                Number(
                    evalExpr(
                        args[j + 1],
                        vars
                    )
                )
            ]);

        }

        properties.points =
            points;

        continue;
    }


    /* =========================
       position x y
    ========================= */

    if (propertyName === "position") {

        const args =
            propertyValue
                .split(/\s+/)
                .filter(v => v);

        if (args.length < 2) {

            runtimeError(
                "Canvas object position requires x y",
                lineNumber + p + 1,
                propertyLine
            );

            continue;
        }

        properties.x =
            Number(
                evalExpr(
                    args[0],
                    vars
                )
            );

        properties.y =
            Number(
                evalExpr(
                    args[1],
                    vars
                )
            );

        continue;
    }


    /* =========================
       size width height
    ========================= */

    if (propertyName === "size") {

        const args =
            propertyValue
                .split(/\s+/)
                .filter(v => v);

        if (args.length < 2) {

            runtimeError(
                "Canvas object size requires width height",
                lineNumber + p + 1,
                propertyLine
            );

            continue;
        }

        properties.width =
            Number(
                evalExpr(
                    args[0],
                    vars
                )
            );

        properties.height =
            Number(
                evalExpr(
                    args[1],
                    vars
                )
            );

        continue;
    }


    /* =========================
       その他
    ========================= */

    properties[propertyName] =
        evalExpr(
            propertyValue,
            vars
        );
}

    createStarCanvasObject(
        objectName,
        properties
    );

    i =
        result.end;

    continue;
}
    /* =========================
       canvas clear
    ========================= */

    if (canvasCommand === "clear") {

        clearStarCanvas();

        continue;
    }

/* =========================
   canvas draw
========================= */

if (
    canvasCommand.startsWith(
        "draw "
    )
) {

    const name =
        canvasCommand
            .substring(5)
            .trim();

    if (!name) {

        runtimeError(
            "Canvas draw requires an object name",
            lineNumber,
            line
        );

        continue;
    }

    try {

        drawStarCanvasObject(
            name
        );

    }
    catch (err) {

        runtimeError(
            err.message,
            lineNumber,
            line
        );

    }

    continue;
}
    /* =========================
       canvas show
    ========================= */

    if (canvasCommand === "show") {

        showStarCanvas();

        continue;
    }


    /* =========================
       canvas hide
    ========================= */

    if (canvasCommand === "hide") {

        hideStarCanvas();

        continue;
    }


    /* =========================
       canvas destroy
    ========================= */

    if (canvasCommand === "destroy") {

        destroyStarCanvas();

        continue;
    }


    /* =========================
       canvas background
    ========================= */

    if (
        canvasCommand.startsWith(
            "background "
        )
    ) {

        const value =
            canvasCommand
                .substring(11)
                .trim();

        const color =
            evalExpr(
                value,
                vars
            );

        setStarCanvasBackground(
            color
        );

        continue;
    }


    /* =========================
       canvas color
    ========================= */

    if (
        canvasCommand.startsWith(
            "color "
        )
    ) {

        const value =
            canvasCommand
                .substring(6)
                .trim();

        const color =
            evalExpr(
                value,
                vars
            );

        setStarCanvasColor(
            color
        );

        continue;
    }


    /* =========================
       canvas fill
    ========================= */

    if (
        canvasCommand.startsWith(
            "fill "
        )
    ) {

        const value =
            canvasCommand
                .substring(5)
                .trim();

        const color =
            evalExpr(
                value,
                vars
            );

        setStarCanvasFill(
            color
        );

        continue;
    }


    /* =========================
       canvas stroke
    ========================= */

    if (
        canvasCommand.startsWith(
            "stroke "
        )
    ) {

        const value =
            canvasCommand
                .substring(7)
                .trim();

        const color =
            evalExpr(
                value,
                vars
            );

        setStarCanvasStroke(
            color
        );

        continue;
    }


    /* =========================
       canvas size
    ========================= */

    if (
        canvasCommand.startsWith(
            "size "
        )
    ) {

        const args =
            canvasCommand
                .substring(5)
                .trim()
                .split(/\s+/);

        const width =
            evalExpr(
                args[0] || "800",
                vars
            );

        const height =
            evalExpr(
                args[1] || "500",
                vars
            );

        resizeStarCanvas(
            width,
            height
        );

        continue;
    }


    /* =========================
       canvas rect
    ========================= */

    if (
        canvasCommand.startsWith(
            "rect "
        )
    ) {

        const args =
            canvasCommand
                .substring(5)
                .trim()
                .split(/\s+/);

        if (args.length < 4) {

            runtimeError(
                "Canvas rect requires x y width height",
                lineNumber,
                line
            );

            continue;
        }

        starCanvasRect(
            evalExpr(args[0], vars),
            evalExpr(args[1], vars),
            evalExpr(args[2], vars),
            evalExpr(args[3], vars)
        );

        continue;
    }


    /* =========================
       canvas fillRect
    ========================= */

    if (
        canvasCommand.startsWith(
            "fillRect "
        )
    ) {

        const args =
            canvasCommand
                .substring(9)
                .trim()
                .split(/\s+/);

        if (args.length < 4) {

            runtimeError(
                "Canvas fillRect requires x y width height",
                lineNumber,
                line
            );

            continue;
        }

        starCanvasFillRect(
            evalExpr(args[0], vars),
            evalExpr(args[1], vars),
            evalExpr(args[2], vars),
            evalExpr(args[3], vars)
        );

        continue;
    }


    /* =========================
       canvas strokeRect
    ========================= */

    if (
        canvasCommand.startsWith(
            "strokeRect "
        )
    ) {

        const args =
            canvasCommand
                .substring(11)
                .trim()
                .split(/\s+/);

        if (args.length < 4) {

            runtimeError(
                "Canvas strokeRect requires x y width height",
                lineNumber,
                line
            );

            continue;
        }

        starCanvasStrokeRect(
            evalExpr(args[0], vars),
            evalExpr(args[1], vars),
            evalExpr(args[2], vars),
            evalExpr(args[3], vars)
        );

        continue;
    }


    /* =========================
       canvas circle
    ========================= */

    if (
        canvasCommand.startsWith(
            "circle "
        )
    ) {

        const args =
            canvasCommand
                .substring(7)
                .trim()
                .split(/\s+/);

        if (args.length < 3) {

            runtimeError(
                "Canvas circle requires x y radius",
                lineNumber,
                line
            );

            continue;
        }

        starCanvasCircle(
            evalExpr(args[0], vars),
            evalExpr(args[1], vars),
            evalExpr(args[2], vars)
        );

        continue;
    }


    /* =========================
       canvas fillCircle
    ========================= */

    if (
        canvasCommand.startsWith(
            "fillCircle "
        )
    ) {

        const args =
            canvasCommand
                .substring(11)
                .trim()
                .split(/\s+/);

        if (args.length < 3) {

            runtimeError(
                "Canvas fillCircle requires x y radius",
                lineNumber,
                line
            );

            continue;
        }

        starCanvasFillCircle(
            evalExpr(args[0], vars),
            evalExpr(args[1], vars),
            evalExpr(args[2], vars)
        );

        continue;
    }


    /* =========================
       canvas line
    ========================= */

    if (
        canvasCommand.startsWith(
            "line "
        )
    ) {

        const args =
            canvasCommand
                .substring(5)
                .trim()
                .split(/\s+/);

        if (args.length < 4) {

            runtimeError(
                "Canvas line requires x1 y1 x2 y2",
                lineNumber,
                line
            );

            continue;
        }

        starCanvasLine(
            evalExpr(args[0], vars),
            evalExpr(args[1], vars),
            evalExpr(args[2], vars),
            evalExpr(args[3], vars)
        );

        continue;
    }


  /* =========================
   canvas text
========================= */

if (
    canvasCommand.startsWith(
        "text "
    )
) {

    /*
     * 対応形式
     *
     * canvas text "Hello World" 100 100
     * canvas text name 100 100
     * canvas text `Score: ${score}` 100 100
     * canvas text score 100 100 30
     */

    const match =
        canvasCommand.match(
            /^text\s+(?:"([\s\S]*?)"|`([\s\S]*?)`|(\S+))\s+(\S+)\s+(\S+)(?:\s+(\S+))?$/
        );

    if (!match) {

        runtimeError(
            'Canvas text syntax: canvas text "text" x y [size]',
            lineNumber,
            line
        );

        continue;
    }


    /* =========================
       文字
    ========================= */

    let text;


    /*
     * "Hello World"
     */

    if (
        match[1] !== undefined
    ) {

        text =
            match[1];

    }


    /*
     * `Score: ${score}`
     */

    else if (
    match[2] !== undefined
) {

    text =
        interpolateStarCanvasText(
            match[2],
            vars
        );

}


    /*
     * 変数
     *
     * name
     * score
     * message
     */

    else {

        text =
            evalExpr(
                match[3],
                vars
            );

    }


    /* =========================
       X
    ========================= */

    const x =
        evalExpr(
            match[4],
            vars
        );


    /* =========================
       Y
    ========================= */

    const y =
        evalExpr(
            match[5],
            vars
        );


    /* =========================
       サイズ
    ========================= */

    const size =
        match[6]
            ? evalExpr(
                match[6],
                vars
            )
            : 20;


    /* =========================
       描画
    ========================= */

    starCanvasText(
        text,
        x,
        y,
        size
    );

    continue;
}

/* =========================
   canvas fillPolygon
========================= */

if (
    canvasCommand.startsWith(
        "fillPolygon "
    )
) {

    const args =
        canvasCommand
            .substring(12)
            .trim()
            .split(/\s+/);

    if (
        args.length < 6 ||
        args.length % 2 !== 0
    ) {

        runtimeError(
            "Canvas fillPolygon requires x1 y1 x2 y2 x3 y3 ...",
            lineNumber,
            line
        );

        continue;
    }

    const points = [];

    for (
        let p = 0;
        p < args.length;
        p += 2
    ) {

        points.push([
            evalExpr(args[p], vars),
            evalExpr(args[p + 1], vars)
        ]);

    }

    starCanvasFillPolygon(
        points
    );

    continue;
}
/* =========================
   canvas polygon
========================= */

if (
    canvasCommand.startsWith(
        "polygon "
    )
) {

    const args =
        canvasCommand
            .substring(8)
            .trim()
            .split(/\s+/);

    if (
        args.length < 6 ||
        args.length % 2 !== 0
    ) {

        runtimeError(
            "Canvas polygon requires x1 y1 x2 y2 x3 y3 ...",
            lineNumber,
            line
        );

        continue;
    }

    const points = [];

    for (
        let p = 0;
        p < args.length;
        p += 2
    ) {

        points.push([
            evalExpr(args[p], vars),
            evalExpr(args[p + 1], vars)
        ]);

    }

    starCanvasPolygon(
        points
    );

    continue;
}
    /* =========================
   canvas arc
========================= */

if (
    canvasCommand.startsWith(
        "arc "
    )
) {

    const args =
        canvasCommand
            .substring(4)
            .trim()
            .split(/\s+/);

    if (args.length < 5) {

        runtimeError(
            "Canvas arc requires x y radius startAngle endAngle",
            lineNumber,
            line
        );

        continue;
    }

    starCanvasArc(
        evalExpr(args[0], vars),
        evalExpr(args[1], vars),
        evalExpr(args[2], vars),
        evalExpr(args[3], vars),
        evalExpr(args[4], vars)
    );

    continue;
}
    /* =========================
   canvas save
========================= */

if(canvasCommand === "save"){

    starCanvasSave();

    continue;
}


/* =========================
   canvas restore
========================= */

if(canvasCommand === "restore"){

    starCanvasRestore();

    continue;
}


/* =========================
   canvas translate
========================= */

if(
    canvasCommand.startsWith(
        "translate "
    )
){

    const args =
        canvasCommand
        .substring(10)
        .trim()
        .split(/\s+/);


    starCanvasTranslate(
        evalExpr(args[0],vars),
        evalExpr(args[1],vars)
    );

    continue;
}


/* =========================
   canvas rotate
========================= */

if(
    canvasCommand.startsWith(
        "rotate "
    )
){

    const angle =
        canvasCommand
        .substring(7)
        .trim();


    starCanvasRotate(
        evalExpr(angle,vars)
    );

    continue;
}
    /* =========================
   canvas lineWidth
========================= */

if (
    canvasCommand.startsWith(
        "lineWidth "
    )
) {

    const value =
        canvasCommand
            .substring(10)
            .trim();

    const width =
        evalExpr(
            value,
            vars
        );

    setStarCanvasLineWidth(
        width
    );

    continue;
}
    /* =========================
       unknown canvas command
    ========================= */

    runtimeError(
        `Unknown Canvas command: ${canvasCommand}`,
        lineNumber,
        line
    );

    continue;
}
        /* =====================================================
   Canvas Object Property Change
===================================================== */

const canvasObjectProperty =
    line.match(
        /^([a-zA-Z_][a-zA-Z0-9_]*)\s+(position|size|fill|opacity|rotate|angle|type|points)\s+(.+)$/
    );

if (
    canvasObjectProperty &&
    !(
        (
            canvasObjectProperty[2] === "rotate" ||
            canvasObjectProperty[2] === "angle"
        ) &&
        canvasObjectProperty[3]
            .trim()
            .split(/\s+/)
            .length >= 2
    )
) {

    const objectName =
        canvasObjectProperty[1];

    const property =
        canvasObjectProperty[2];

    const valueText =
        canvasObjectProperty[3].trim();

    const object =
        starCanvasObjects[objectName];

    if (!object) {

        runtimeError(
            `Canvas object not found: ${objectName}`,
            lineNumber,
            line
        );

        continue;
    }else {

    const objectName =
        canvasObjectProperty[1];

    const property =
        canvasObjectProperty[2];

    const valueText =
        canvasObjectProperty[3].trim();

    const object =
        starCanvasObjects[objectName];

    if (!object) {

        runtimeError(
            `Canvas object not found: ${objectName}`,
            lineNumber,
            line
        );

        continue;
    }
}

    /* =========================
       position
    ========================= */

    if (property === "position") {

        const args =
            valueText
                .split(/\s+/)
                .filter(v => v);

        if (args.length !== 2) {

            runtimeError(
                "position requires x y",
                lineNumber,
                line
            );

            continue;
        }

        object.x =
            Number(
                evalExpr(
                    args[0],
                    vars
                )
            );

        object.y =
            Number(
                evalExpr(
                    args[1],
                    vars
                )
            );

        continue;
    }


    /* =========================
       size
    ========================= */

    if (property === "size") {

        const args =
            valueText
                .split(/\s+/)
                .filter(v => v);

        if (args.length !== 2) {

            runtimeError(
                "size requires width height",
                lineNumber,
                line
            );

            continue;
        }

        object.width =
            Number(
                evalExpr(
                    args[0],
                    vars
                )
            );

        object.height =
            Number(
                evalExpr(
                    args[1],
                    vars
                )
            );

        continue;
    }


    /* =========================
       fill
    ========================= */

    if (property === "fill") {

        object.fill =
            evalExpr(
                valueText,
                vars
            );

        continue;
    }


    /* =========================
       opacity
    ========================= */

    if (property === "opacity") {

        object.opacity =
            Number(
                evalExpr(
                    valueText,
                    vars
                )
            );

        object.opacity =
            Math.max(
                0,
                Math.min(
                    1,
                    object.opacity
                )
            );

        continue;
    }


    /* =========================
       rotate / angle
    ========================= */

    if (
        property === "rotate" ||
        property === "angle"
    ) {

        const angle =
            Number(
                evalExpr(
                    valueText,
                    vars
                )
            );

        object.rotate =
            angle;

        object.angle =
            angle;

        continue;
    }


    /* =========================
       type
    ========================= */

    if (property === "type") {

        object.type =
            String(
                valueText
            )
            .replace(
                /^["']|["']$/g,
                ""
            )
            .toLowerCase();

        continue;
    }


    /* =========================
       points
    ========================= */

    if (property === "points") {

        const args =
            valueText
                .split(/\s+/)
                .filter(v => v);

        if (
            args.length < 6 ||
            args.length % 2 !== 0
        ) {

            runtimeError(
                "points requires x1 y1 x2 y2 ...",
                lineNumber,
                line
            );

            continue;
        }

        const points = [];

        for (
            let i = 0;
            i < args.length;
            i += 2
        ) {

            points.push([

                Number(
                    evalExpr(
                        args[i],
                        vars
                    )
                ),

                Number(
                    evalExpr(
                        args[i + 1],
                        vars
                    )
                )

            ]);

        }

        object.points =
            points;

        continue;
    }
}
        
    /* =====================================================
   Canvas Object Animation
===================================================== */

const canvasObjectAnimation =
    line.match(
        /^([a-zA-Z_][a-zA-Z0-9_]*)\s+move\s+(right|left|up|down|-?\d+(?:\.\d+)?)\s+(\S+)(?:\s+(\S+))?$/
    );


if (canvasObjectAnimation) {

    const objectName =
        canvasObjectAnimation[1];

    const direction =
    canvasObjectAnimation[2];

const amount =
    evalExpr(
        canvasObjectAnimation[3],
        vars
    );

const duration =
    canvasObjectAnimation[4];


    try {

        animateStarCanvasObject(

            objectName,

            "move",

            {
                direction:
                    direction,

                amount:
                    amount
            },

            duration,

            vars.time,

            lineNumber

        );

    }
    catch (err) {

        runtimeError(
            err.message,
            lineNumber,
            line
        );

    }

    continue;
}


/* =========================
   Canvas Object Rotate
========================= */

const canvasObjectRotate =
    line.match(
        /^([a-zA-Z_][a-zA-Z0-9_]*)\s+rotate\s+(-?(?:\d+(?:\.\d+)?|\.\d+))(?:\s+(\S+))?$/
    );

if (canvasObjectRotate) {

    const objectName =
        canvasObjectRotate[1];

    const angle =
        Number(
            canvasObjectRotate[2]
        );

    const duration =
    canvasObjectRotate[3] || null;


    try {

        animateStarCanvasObject(

            objectName,

            "rotate",

            angle,

            duration,

            vars.time,

            "rotate"

        );

    }
    catch (err) {

        runtimeError(
            err.message,
            lineNumber,
            line
        );

    }

    continue;
}

/* =========================
   fadein
========================= */

const canvasObjectFadeIn =
    line.match(
        /^([a-zA-Z_][a-zA-Z0-9_]*)\s+fadein(?:\s+(\S+))?$/
    );


if (canvasObjectFadeIn) {

    const objectName =
        canvasObjectFadeIn[1];

    const duration =
        canvasObjectFadeIn[2];


    try {

        animateStarCanvasObject(

            objectName,

            "fadein",

            1,

            duration,

            vars.time,

            lineNumber

        );

    }
    catch (err) {

        runtimeError(
            err.message,
            lineNumber,
            line
        );

    }

    continue;
}


/* =========================
   fadeout
========================= */

const canvasObjectFadeOut =
    line.match(
        /^([a-zA-Z_][a-zA-Z0-9_]*)\s+fadeout(?:\s+(\S+))?$/
    );


if (canvasObjectFadeOut) {

    const objectName =
        canvasObjectFadeOut[1];

    const duration =
        canvasObjectFadeOut[2];


    try {

        animateStarCanvasObject(

            objectName,

            "fadeout",

            0,

            duration,

            vars.time,

            lineNumber

        );

    }
    catch (err) {

        runtimeError(
            err.message,
            lineNumber,
            line
        );

    }

    continue;
}
/* =========================
   break
========================= */
if (line === "break") {

    vars.__break__ = true;

    return vars;
}
       if (line.startsWith("exit")) {

    const msg =
        line.substring(4).trim();

    if (msg) {
        log(
            evalExpr(msg, vars)
        );
    }

    vars.__exit__ = true;

    return vars;
}
        /* =========================
   try / catch
========================= */

if (line.startsWith("try")) {

    const tryBlock = getBlock(i + 1);

    i = tryBlock.end;

    let catchBlock = null;
    let errorName = null;

    if (i + 1 < lines.length) {

        const next = lines[i + 1].trim();

        const match =
            next.match(
                /^catch(?:\((.*?)\))?\{$/
            );

        if (match) {

            errorName = match[1];

            i++;

            catchBlock =
                getBlock(i + 1);

        }

    }

    try {

        await runSTar(
            tryBlock.block,
            vars,
            lineNumber
        );

    }
    catch (err) {

        if (catchBlock) {

            const localVars = {
                ...vars
            };

            if (errorName) {
                localVars[errorName] =
                    err.message;
            }

            await runSTar(
                catchBlock.block,
                localVars,
                lineNumber
            );

            i = catchBlock.end;

        }
        else {

            throw err;

        }

    }

    continue;
}
        /* =========================
   background
========================= */

if (line === "background {") {

    const result = getBlock(i + 1);

    const task = {
        running: true
    };

    const taskRunId = starBackgroundRunId;

    starBackgroundTasks.push(task);

    const backgroundVars = {
        ...vars
    };

    (async () => {

        while (
            task.running &&
            taskRunId === starBackgroundRunId
        ) {

            try {

                await runSTar(
                    result.block,
                    backgroundVars,
                    lineNumber
                );

            } catch (err) {

                if (
                    err &&
                    typeof err === "object" &&
                    err.lineNumber !== undefined
                ) {
                    logError(err);
                } else {
                    log(
                        `[Background Error] ${
                            err?.message ||
                            String(err)
                        }`
                    );

                    console.error(err);
                }

                task.running = false;
                break;
            }

            /*
             * waitが無いbackgroundでも
             * ブラウザを固めないようにする
             */
            await new Promise(
                resolve => setTimeout(resolve, 0)
            );
        }

    })();

    i = result.end;
    continue;
}
    /* =========================
   defer
========================= */

if(line.startsWith("defer")){

    const result =
        getBlock(i+1);

    deferBlocks.push(result.block);

    i=result.end;

    continue;
}
        /* =========================
   import
========================= */
if (line.startsWith("import ")) {

    const match =
        line.match(
            /^import\s+"(.+?)"$/
        );

    if (!match) {

        runtimeError(
            "Syntax Error (import)",
            lineNumber,
            line
        );

        continue;
    }

    const fileName = match[1];

    const file =
        files.find(
            f => f.name === fileName
        );

    if (!file) {

        runtimeError(
            `Import Error: ${fileName}`,
            lineNumber,
            line
        );

        continue;
    }

    await runSTar(
        file.content,
        vars,
        1
    );

    continue;
}
        /* =========================
           con
        ========================= */
        if (line.startsWith("con ")) {

            const parts = line.substring(4).split("=");

            const key = parts[0].trim();

            let value = parts[1]?.trim();

            if (value?.startsWith('"')) {
                value = value.slice(1, -1);
            } else {
                value = evalExpr(value, vars);
            }

            consts[key] = value;
            continue;
        }
        if (line.startsWith("wait ")) {

    let arg = line.substring(5).trim();

    // まず式として評価（変数・計算対応）
    let evaluated = evalExpr(arg, vars);

    let ms;

    // -------------------------
    // ① 数値ならそのまま
    // -------------------------
    if (typeof evaluated === "number") {
        ms = evaluated;
    } else {

        let str = String(evaluated).trim();

        // -------------------------
        // ② 単位対応
        // -------------------------
        if (str.endsWith("ms")) {
            ms = Number(str.slice(0, -2));
        }
        else if (str.endsWith("s")) {
            ms = Number(str.slice(0, -1)) * 1000;
        }
        else if (str.endsWith("m")) {
            ms = Number(str.slice(0, -1)) * 60000;
        }
        else {
            ms = Number(str);
        }
    }

    // -------------------------
    // ③ バリデーション
    // -------------------------
    if (!Number.isFinite(ms)) {
        runtimeError("Invalid wait value", lineNumber, line);
        continue;
    }

    await new Promise(r => setTimeout(r, ms));
    continue;
}
/* =========================
   func
========================= */
if (line.startsWith("func ")) {

    const match =
        line.match(
            /^func\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\((.*?)\)\s*\{$/
        );

    if (!match) {
        log("Syntax Error: func");
        continue;
    }

    const funcName = match[1];

    const params =
        match[2]
            .split(",")
            .map(v => v.trim())
            .filter(v => v);

    const block = [];

    let depth = 1;
    i++;

    while (i < lines.length && depth > 0) {

        const current =
            lines[i].trim();

        if (current.endsWith("{"))
            depth++;

        if (current === "}") {

            depth--;

            if (depth === 0)
                break;
        }

        if (depth > 0)
            block.push(lines[i]);

        i++;
    }

    functions[funcName] = {
        params,
        body: block.join("\n")
    };

    continue;
}
       if (line.startsWith("class ")) {

    const match =
        line.match(
            /^class\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\{$/
        );

    if (!match) {
        runtimeError(
            "Syntax Error (class)",
            lineNumber,
            line
        );
        continue;
    }

    const className = match[1];

    const result =
        getBlock(i + 1);

    const cls = {
        fields: {},
        methods: {}
    };

    const classLines =
        result.block.split("\n");

    for (let j = 0; j < classLines.length; j++) {

        let cl =
            classLines[j].trim();

        if (!cl) continue;

        if (cl.startsWith("let ")) {

            const m =
                cl.match(
                    /^let\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.+)$/
                );

            if (m) {

                cls.fields[
                    m[1].trim()
                ] = m[2].trim();
            }
        }
        if (cl.startsWith("func ")) {

    const funcMatch =
        cl.match(
            /^func\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\((.*?)\)\s*\{$/
        );

    if (funcMatch) {

        const methodName = funcMatch[1];

        const params =
            funcMatch[2]
                .split(",")
                .map(v => v.trim())
                .filter(v => v);

        let depth = 1;
        const body = [];

        j++;

        while (
            j < classLines.length &&
            depth > 0
        ) {

            const current =
                classLines[j].trim();

            if (current.endsWith("{"))
                depth++;

            if (current === "}") {

                depth--;

                if (depth === 0)
                    break;
            }

            if (depth > 0)
                body.push(classLines[j]);

            j++;
        }

        cls.methods[methodName] = {
            params,
            body: body.join("\n")
        };
    }
}
    }

    classes[className] = cls;

    i = result.end;
    continue;
}
           /*===================================
           clear
           ====================================*/
        if (line === "clear") {
    clearConsole();
    continue;
}
        /* =========================
   foreach
========================= */
if (line.startsWith("foreach ")) {

    const match =
        line.match(
            /^foreach\s+([a-zA-Z_][a-zA-Z0-9_]*)\s+in\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\{$/
        );

    if (!match) {

        runtimeError(
            "Syntax Error (foreach)",
            lineNumber,
            line
        );

        continue;
    }

    const itemVar = match[1];
    const arrayName = match[2];

    const arr = vars[arrayName];

    if (!Array.isArray(arr)) {

        runtimeError(
            `${arrayName} is not array`,
            lineNumber,
            line
        );

        continue;
    }

    const result =
        getBlock(i + 1);

    for (const item of arr) {

    vars[itemVar] = item;

    const loopResult =
        await runSTar(
            result.block,
            vars,
            lineNumber
        );

    if (loopResult.__exit__) {
        return loopResult;
    }

    if (loopResult.__continue__) {

        delete vars.__continue__;
        continue;
    }

    if (loopResult.__break__) {

        delete vars.__break__;
        break;
    }
}

    i = result.end;
    continue;
}
        /* =========================
   repeat until
========================= */

if(line.startsWith("repeat until ")){

    const match =
        line.match(
            /^repeat\s+until\s+(.+?)\s*\{$/
        );

    if(!match){

        runtimeError(
            "Syntax Error (repeat until)",
            lineNumber,
            line
        );

        continue;

    }

    const result =
        getBlock(i+1);

    while(
        !evalExpr(
            match[1],
            vars
        )
    ){

        const loopResult =
            await runSTar(
                result.block,
                vars,
                lineNumber
            );

        if(loopResult.__exit__)
            return loopResult;

        if(loopResult.__continue__){

            delete vars.__continue__;
            continue;

        }

        if(loopResult.__break__){

            delete vars.__break__;
            break;

        }

    }

    i=result.end;

    continue;

}
        /* =========================
           repeat
        ========================= */
        if (line.startsWith("repeat ")) {

    const match =
        line.match(
            /^repeat\s+(.+?)\s*\{$/
        );

if (!match) {
    runtimeError("Syntax Error (repeat)", lineNumber, line);
    continue;
}

    const count =
        Number(
            evalExpr(
                match[1],
                vars
            )
        );

    const result =
        getBlock(i + 1);

    for (
        let r = 0;
        r < count;
        r++
    ) {

        vars.count = r + 1;

        const loopResult =
    await runSTar(
        result.block,
        vars,
        lineNumber
    );

if (loopResult.__exit__) {
    return loopResult;
}

if (loopResult.__continue__) {

    delete vars.__continue__;
    continue;
}

if (loopResult.__break__) {

    delete vars.__break__;
    break;
}
    }

    i = result.end;
    continue;
}

        /* =========================
           while
        ========================= */
        if (line.startsWith("while ")) {

    const match =
        line.match(
            /^while\s+(.+?)\s*\{$/
        );

   if (!match) {
    runtimeError("Syntax Error (while)", lineNumber, line);
    continue;
}

    const condition =
        match[1];

    const result =
        getBlock(i + 1);

    while (
        evalExpr(
            condition,
            vars
        )
    ) {

        const loopResult =
    await runSTar(
        result.block,
        vars,
        lineNumber
    );

if (loopResult.__exit__) {
    return loopResult;
}

if (loopResult.__continue__) {

    delete vars.__continue__;
    continue;
}

if (loopResult.__break__) {

    delete vars.__break__;
    break;
}
    }

    i = result.end;
    continue;
}
/* =========================
   continue
========================= */
if (line === "continue") {
    vars.__continue__ = true;
    continue;
}
        /* =========================
   if / eif / else
========================= */
if (line.startsWith("if ")) {

    let executed = false;

    const match =
        line.match(
            /^if\s+(.+?)\s*\{$/
        );

    if (!match) {

        runtimeError(
            "Syntax Error (if)",
            lineNumber,
            line
        );

        continue;
    }

    const result =
        getBlock(i + 1);

    if (
        evalExpr(
            match[1],
            vars
        )
    ) {

        executed = true;

        const r =
            await runSTar(
                result.block,
                vars,
                lineNumber
            );

        if (r.__exit__) {
            return r;
        }
    }

    i = result.end;

    while (
        i + 1 < lines.length &&
        lines[i + 1]
            .trim()
            .startsWith("eif ")
    ) {

        i++;

        const eifLine =
            lines[i].trim();

        const eifMatch =
            eifLine.match(
                /^eif\s+(.+?)\s*\{$/
            );

        const eifResult =
            getBlock(i + 1);

        if (
            !executed &&
            evalExpr(
                eifMatch[1],
                vars
            )
        ) {

            executed = true;

            const r =
                await runSTar(
                    eifResult.block,
                    vars,
                    lineNumber
                );

            if (r.__exit__) {
                return r;
            }
        }

        i = eifResult.end;
    }

    if (
        i + 1 < lines.length &&
        lines[i + 1].trim() === "else{"
    ) {

        i++;

        const elseResult =
            getBlock(i + 1);

        if (!executed) {

            const r =
                await runSTar(
                    elseResult.block,
                    vars,
                    lineNumber
                );

            if (r.__exit__) {
                return r;
            }
        }

        i = elseResult.end;
    }

    continue;
}
/* =========================
   input
========================= */
if (line.startsWith("input ")) {

    const match =
        line.match(
         /^input\s+([a-zA-Z_][a-zA-Z0-9_]*)(?:\s+"([^"]*)")?(?:\s*=\s*(.+))?$/
        );

    if (!match) {
    runtimeError("Syntax Error (input)", lineNumber, line);
    continue;
}

    const varName = match[1];
    const message = match[2];
    let defaultValue = match[3];

    if (varName in consts) {
        log(`Constant Error: ${varName}`);
        continue;
    }

    if (defaultValue !== undefined) {

        defaultValue =
            defaultValue.trim();

        if (
            defaultValue.startsWith('"') &&
            defaultValue.endsWith('"')
        ) {
            defaultValue =
                defaultValue.slice(1, -1);
        } else {
            defaultValue =
                evalExpr(
                    defaultValue,
                    vars
                );
        }
    }

    const promptText =
        message ||
        `${varName} =`;

    const value =
    prompt(
        promptText,
        defaultValue ?? ""
    );

if (
    value === null ||
    value.trim() === ""
) {

    if (defaultValue !== undefined) {

        vars[varName] =
            defaultValue;

    } else {

        vars[varName] = "";
    }

    continue;
}

    const num =
        Number(value);

    vars[varName] =
        value.trim() !== "" &&
        !isNaN(num)
            ? num
            : value;

    continue;
}
        const methodCall =
    line.match(
        /^call\s+([a-zA-Z_][a-zA-Z0-9_]*)\.([a-zA-Z_][a-zA-Z0-9_]*)\((.*?)\)$/
    );

if (methodCall) {

    const obj =
        vars[methodCall[1]];

    if (!obj?.__class__) {

        runtimeError(
            "Object Error",
            lineNumber,
            line
        );

        continue;
    }

    const method =
        obj.__class__.methods[
            methodCall[2]
        ];

    if (!method) {

        runtimeError(
            `Method Error: ${methodCall[2]}`,
            lineNumber,
            line
        );

        continue;
    }

    const localVars = {
        ...vars,
        this: obj
    };

    const args =
        methodCall[3]
            .split(",")
            .map(v => v.trim())
            .filter(v => v);

    method.params.forEach(
        (p, index) => {

            localVars[p] =
                evalExpr(
                    args[index] ?? "undefined",
                    vars
                );
        }
    );

    await runSTar(
        method.body,
        localVars,
        lineNumber
    );

    continue;
}
 /* =========================
   let x = call func()
========================= */
if (
    line.startsWith("let ") &&
    line.includes("call ")
) {

    const match =
        line.match(
            /^let\s+(.+?)\s*=\s*call\s+([a-zA-Z_][a-zA-Z0-9_]*)\((.*?)\)$/
        );

    if (match) {

        const varName =
            match[1].trim();

        const funcName =
            match[2];

        const func =
            functions[funcName];

        if (!func) {

            log(
                `Function Error: ${funcName}`
            );

            continue;
        }

        const localVars =
            { ...vars };

        const args =
            match[3]
                .split(",")
                .map(v => v.trim())
                .filter(v => v);

        func.params.forEach(
            (p, index) => {

                const arg =
                    args[index];

                if (
                    arg?.startsWith('"') &&
                    arg?.endsWith('"')
                ) {

                    localVars[p] =
                        arg.slice(1, -1);

                } else {

                    localVars[p] =
                        evalExpr(
                            arg ?? "undefined",
                            vars
                        );
                }
            }
        );

        const result =
            await runSTar(
                func.body,
                localVars
            );

        vars[varName] =
            result.__return__;

        continue;
    }
}
        if (
    line.startsWith("let ") &&
    line.includes("new ")
) {

    const match =
        line.match(
            /^let\s+(.+?)\s*=\s*new\s+([a-zA-Z_][a-zA-Z0-9_]*)\((.*?)\)$/
        );

    if (match) {

        const varName = match[1];
        const className = match[2];
const argText = match[3];

const args =
    argText
        .split(",")
        .map(v => v.trim())
        .filter(v => v);
        const cls =
    classes[className];

        if (!cls) {
            runtimeError(
                `Class Error: ${className}`,
                lineNumber,
                line
            );
            continue;
        }

        const obj = {};

for (const k in cls.fields) {

    obj[k] =
        evalExpr(
            cls.fields[k],
            {
                ...vars,
                this: obj
            }
        );
}

obj.__class__ = cls;
        const ctor =
    cls.methods.constructor;

if (ctor) {

    const localVars = {
        ...vars,
        this: obj
    };

    ctor.params.forEach(
        (p, index) => {

            const arg =
                args[index];

            if (
                arg?.startsWith('"') &&
                arg?.endsWith('"')
            ) {

                localVars[p] =
                    arg.slice(1, -1);

            } else {

                localVars[p] =
                    evalExpr(
                        arg ?? "undefined",
                        vars
                    );
            }
        }
    );

    await runSTar(
        ctor.body,
        localVars,
        lineNumber
    );
}

        vars[varName] = obj;

        continue;
    }
}
        /* =========================
           let
        ========================= */
        if (line.startsWith("let ")) {

            const parts =
                line.substring(4).split("=");

            const key =
                parts[0].trim();

            let value =
                parts[1]?.trim();

            if (value?.startsWith('"')) {

                value =
                    value.slice(1, -1);

            } else {

                value =
                    evalExpr(
                        value,
                        vars
                    );
            }

            vars[key] = value;
            continue;
        }
        /* =====================================================
   inc
   ===================================================== */

if (line.startsWith("inc ")) {
    const parts = line.split(/\s+/);

    const name = parts[1];

    if (!name) {
        throw new Error(`Line ${lineNumber}: inc requires a variable`);
    }

    const amount = parts[2] !== undefined
        ? Number(evalExpr(parts.slice(2).join(" "), vars))
        : 1;

    if (!Number.isFinite(amount)) {
        throw new Error(`Line ${lineNumber}: inc amount must be a number`);
    }

    if (!(name in vars)) {
        throw new Error(`Line ${lineNumber}: variable '${name}' is not defined`);
    }

    const current = Number(vars[name]);

    if (!Number.isFinite(current)) {
        throw new Error(`Line ${lineNumber}: variable '${name}' is not a number`);
    }

    vars[name] = current + amount;

    continue;
}


/* =====================================================
   dec
   ===================================================== */

if (line.startsWith("dec ")) {
    const parts = line.split(/\s+/);

    const name = parts[1];

    if (!name) {
        throw new Error(`Line ${lineNumber}: dec requires a variable`);
    }

    const amount = parts[2] !== undefined
        ? Number(evalExpr(parts.slice(2).join(" "), vars))
        : 1;

    if (!Number.isFinite(amount)) {
        throw new Error(`Line ${lineNumber}: dec amount must be a number`);
    }

    if (!(name in vars)) {
        throw new Error(`Line ${lineNumber}: variable '${name}' is not defined`);
    }

    const current = Number(vars[name]);

    if (!Number.isFinite(current)) {
        throw new Error(`Line ${lineNumber}: variable '${name}' is not a number`);
    }

    vars[name] = current - amount;

    continue;
}
        if (line.includes(".push(")) {

    const pushMatch =
        line.match(
            /^([a-zA-Z_][a-zA-Z0-9_]*)\.push\((.*?)\)$/
        );

    if (pushMatch) {

        const arr = vars[pushMatch[1]];

        if (!Array.isArray(arr)) {

            runtimeError(
                `${pushMatch[1]} is not array`,
                lineNumber,
                line
            );

            continue;
        }

        arr.push(
            evalExpr(
                pushMatch[2],
                vars
            )
        );

        continue;
    }
} 
if (line.endsWith(".pop()")) {

    const popMatch =
    line.match(
        /^([a-zA-Z_][a-zA-Z0-9_]*)\.pop\(\)$/
    );

if (popMatch) {

    const arr = vars[popMatch[1]];

    if (!Array.isArray(arr)) {

        runtimeError(
            `${popMatch[1]} is not array`,
            lineNumber,
            line
        );

        continue;
    }

    arr.pop();

    continue;
}
}
/* =========================
   call
========================= */
if (line.startsWith("call ")) {

    const match =
        line.match(
            /^call\s+([a-zA-Z_][a-zA-Z0-9_]*)(?:\((.*?)\))?$/
        );

    if (!match) {

        log("Syntax Error: call");
        continue;
    }

    const funcName =
        match[1];

    const func =
        functions[funcName];

    if (!func) {

        log(
            `Function Error: ${funcName}`
        );

        continue;
    }

    const localVars =
        { ...vars };

    const args =
        (match[2] || "")
            .split(",")
            .map(v => v.trim())
            .filter(v => v);

    func.params.forEach(
        (p, index) => {

            const arg =
                args[index];

            if (
                arg?.startsWith('"') &&
                arg?.endsWith('"')
            ) {

                localVars[p] =
                    arg.slice(1, -1);

            } else {

                localVars[p] =
                    evalExpr(
                        arg ?? "undefined",
                        vars
                    );
            }
        }
    );

    const result =
    await runSTar(
        func.body,
        localVars
    );

if (result.__exit__) {
    return result;
}

    vars.__return__ =
        result.__return__;

    continue;
}
        /* =========================
   return
========================= */
if (line.startsWith("return ")) {

    vars.__return__ =
        evalExpr(
            line.substring(7).trim(),
            vars
        );

    return vars;
}
        /* =========================
           print
        ========================= */
        if (line.startsWith("print ")) {

    const expr =
        line.substring(6).trim();

    const value =
        expr.startsWith('"')
            ? expr.slice(1,-1)
            : evalExpr(expr, vars);

    log(value);
    continue;
}
if (line.startsWith("switch ")) {

    const match =
        line.match(
            /^switch\s+(.+?)\s*\{$/
        );

    if (!match) {

        log("Syntax Error: switch");
        continue;
    }

    const switchValue =
        evalExpr(
            match[1],
            vars
        );

    const result =
        getBlock(i + 1);

    const blockLines =
        result.block.split("\n");

    let executing = false;
    let found = false;

    for (
        let j = 0;
        j < blockLines.length;
        j++
    ) {

        const current =
            blockLines[j].trim();

        if (
            current.startsWith("case ")
        ) {

            const caseValue =
                current
                    .replace("case","")
                    .replace(":","")
                    .trim();

            executing =
                switchValue ==
                evalExpr(
                    caseValue,
                    vars
                );

            if (executing)
                found = true;

            continue;
        }

        if (
            current === "default:"
        ) {

            executing =
                !found;

            continue;
        }

        if (
            current === "break"
        ) {

            if (executing)
                break;

            continue;
        }

        if (executing) {

            await runSTar(
                current,
                vars
            );
        }
    }

    i = result.end;
    continue;
}
        const thisAssign =
    line.match(
        /^this\.([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.+)$/
    );

if (thisAssign) {

    if (vars.this) {

        vars.this[
            thisAssign[1]
        ] =
            evalExpr(
                thisAssign[2],
                vars
            );
    }

    continue;
}
       const objectAssign =
    line.match(
        /^([a-zA-Z_][a-zA-Z0-9_]*)\.([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.+)$/
    );

if (objectAssign) {

    const obj =
        vars[objectAssign[1]];

    if (
        obj &&
        typeof obj === "object"
    ) {

        obj[objectAssign[2]] =
            evalExpr(
                objectAssign[3],
                vars
            );
    }

    continue;
}
/*===============================================
    配列再代入
  ===============================================*/
const arrayAssign =
    line.match(
        /^([a-zA-Z_][a-zA-Z0-9_]*)\[(.+?)\]\s*=\s*(.+)$/
    );

if (arrayAssign) {

    const arrayName =
        arrayAssign[1];

    const index =
        Number(
            evalExpr(
                arrayAssign[2],
                vars
            )
        );

    const value =
        evalExpr(
            arrayAssign[3],
            vars
        );

    if (
        Array.isArray(
            vars[arrayName]
        )
    ) {

        vars[arrayName][index] =
            value;
    }

    continue;
}
   
        /* =========================
           再代入
        ========================= */
        if (line.includes("=")) {

            const parts =
                line.split("=");

            const key =
                parts[0].trim();

            if (key in consts) {

                log(
                    `Constant Error: ${key}`
                );

                continue;
            }

            let value =
                parts[1]?.trim();

            if (value?.startsWith('"')) {

                value =
                    value.slice(1, -1);

            } else {

                value =
                    evalExpr(
                        value,
                        vars
                    );
            }

            vars[key] = value;
        }
    }
    for(let d=deferBlocks.length-1; d>=0; d--){

    await runSTar(
        deferBlocks[d],
        vars,
        baseLine
    );

}
    return vars;
}

function evalExpr(expr, vars) {
expr = expr.replace(
    /\bthis\.([a-zA-Z_][a-zA-Z0-9_]*)\b/g,
    (_, prop) => {

        if (
            vars.this &&
            prop in vars.this
        ) {
            return JSON.stringify(
                vars.this[prop]
            );
        }

        return "undefined";
    }
);
    if (
        expr === undefined ||
        expr === null
    ) {
        return "";
    }

    expr = String(expr).trim();
/* =========================
   string template ``
========================= */
expr = expr.replace(/`([^`]*)`/g, (_, tpl) => {

    return JSON.stringify(
        tpl.replace(/\$\{(.*?)\}/g, (_, code) => {
            return evalExpr(code, vars);
        })
    );

});
    /* =========================
       length
    ========================= */

    expr = expr.replace(
        /([a-zA-Z_][a-zA-Z0-9_]*)\.length/g,
        (_, name) =>
            vars[name]?.length ?? 0
    );

    /* =========================
       upper()
    ========================= */

    expr = expr.replace(
        /([a-zA-Z_][a-zA-Z0-9_]*)\.upper\(\)/g,
        (_, name) =>
            JSON.stringify(
                String(
                    vars[name] ?? ""
                ).toUpperCase()
            )
    );

    /* =========================
       lower()
    ========================= */

    expr = expr.replace(
        /([a-zA-Z_][a-zA-Z0-9_]*)\.lower\(\)/g,
        (_, name) =>
            JSON.stringify(
                String(
                    vars[name] ?? ""
                ).toLowerCase()
            )
    );
    /* =========================
   array[index]
========================= */

expr = expr.replace(
    /([a-zA-Z_][a-zA-Z0-9_]*)\[(.+?)\]/g,
    (_, arrName, indexExpr) => {

        const arr = vars[arrName];

        if (!Array.isArray(arr)) {
            return "undefined";
        }

        const index = Number(
            evalExpr(indexExpr, vars)
        );

        return JSON.stringify(
            arr[index]
        );
    }
);
/* =========================
   object.property
========================= */

expr = expr.replace(
    /\b(?!this\b)([a-zA-Z_][a-zA-Z0-9_]*)\.([a-zA-Z_][a-zA-Z0-9_]*)\b(?!\s*\()/g,
    (_, objName, prop) => {

        const obj = vars[objName];

        if (
            obj &&
            typeof obj === "object" &&
            prop in obj
        ) {
            return JSON.stringify(
                obj[prop]
            );
        }

        return "undefined";
    }
);
    expr = expr.replace(
    /min\((.*?)\)/g,
    (_, args) => {

        const list = args
            .split(",")
            .map(v => evalExpr(v.trim(), vars));

        if (
            list.length === 1 &&
            Array.isArray(list[0])
        ) {
            return Math.min(...list[0]);
        }

        return Math.min(
            ...list.map(Number)
        );
    }
);
  expr = expr.replace(
    /max\((.*?)\)/g,
    (_, args) => {

        const list = args
            .split(",")
            .map(v => evalExpr(v.trim(), vars));

        if (
            list.length === 1 &&
            Array.isArray(list[0])
        ) {
            return Math.max(...list[0]);
        }

        return Math.max(
            ...list.map(Number)
        );
    }
);
    expr = expr.replace(
    /sum\((.*?)\)/g,
    (_, arg) => {

        const value =
            evalExpr(arg.trim(), vars);

        if (!Array.isArray(value))
            return 0;

        return value.reduce(
            (a, b) => Number(a) + Number(b),
            0
        );
    }
);
    expr = expr.replace(
    /avg\((.*?)\)/g,
    (_, arg) => {

        const value =
            evalExpr(arg.trim(), vars);

        if (
            !Array.isArray(value) ||
            value.length === 0
        )
            return 0;

        const total =
            value.reduce(
                (a, b) => Number(a) + Number(b),
                0
            );

        return total / value.length;
    }
);
    expr = expr.replace(
    /abs\((.+?)\)/g,
    (_,x)=>{

        return Math.abs(
            Number(evalExpr(x,vars))
        );

    }
);
    /* =========================
       random(min,max)
    ========================= */

    expr = expr.replace(
        /random\((.+?),(.+?)\)/g,
        (_, min, max) => {

            min = Number(
                evalExpr(
                    min,
                    vars
                )
            );

            max = Number(
                evalExpr(
                    max,
                    vars
                )
            );

            return Math.floor(
                Math.random() *
                (max - min + 1)
            ) + min;
        }
    );

   /* =========================
   key("...")
========================= */

expr = expr.replace(
    /key\(\s*["'](.+?)["']\s*\)/g,
    (_, keyName) => {

        return keys[keyName] === true
            ? "true"
            : "false";

    }
);

    /* =========================
       mouse
    ========================= */

    expr = expr.replace(
        /\bmouseX\b/g,
        mouseX
    );

    expr = expr.replace(
        /\bmouseY\b/g,
        mouseY
    );
/* =========================
   mouse
========================= */

expr = expr.replace(
    /\bmouseX\b/g,
    String(mouseX)
);

expr = expr.replace(
    /\bmouseY\b/g,
    String(mouseY)
);


/* =========================
   mouseDown()
========================= */

expr = expr.replace(
    /mouseDown\(\s*["'](left|middle|right)["']\s*\)/g,
    (_, button) => {

        return mouseButtons[button] === true
            ? "true"
            : "false";

    }
);
    /* =========================
   mouseClick()
========================= */

expr = expr.replace(
    /mouseClick\(\s*["'](left|middle|right)["']\s*\)/g,
    (_, button) => {

        const clicked =
            mouseClicks[button] === true;

        mouseClicks[button] = false;

        return clicked
            ? "true"
            : "false";

    }
);
    /* =========================
       const
    ========================= */

    for (const key in consts) {

        expr = expr.replace(
            new RegExp(
                `\\b${key}\\b`,
                "g"
            ),
            JSON.stringify(
                consts[key]
            )
        );
    }

    /* =========================
       vars
    ========================= */

    for (const key in vars) {

    const value = vars[key];

    expr = expr.replace(
        new RegExp(`\\b${key}\\b`, "g"),
        JSON.stringify(value)
    );
}

    /* =========================
       実行
    ========================= */

    try {

        return Function(
            `"use strict";
            return (${expr});`
        )();

    } catch (e) {
    log(`[Expression Error] ${expr}`);
    return 0;
}
}
/* =====================================================
COMPILE
===================================================== */

function compileToJS(code, vars) {

let js = "";

const lines = code.split("\n");

for (let line of lines) {

    line = line.trim();
    if (!line) continue;

    if (line.startsWith("print ")) {

    let value =
        line.substring(6).trim();

    if (
        vars.hasOwnProperty(value)
    ) {

        log(vars[value]);

        continue;
    }

    log(
        evalExpr(
            value,
            vars
        )
    );

    continue;
}

    if (line.startsWith("let ")) {

    const parts = line.substring(4).split("=");

    const key = parts[0].trim();
    let value = parts[1]?.trim();

    if (value?.startsWith('"')) {
        value = value.slice(1, -1);
    } else {
        value = evalExpr(value, vars);
    }

    vars[key] = value;
}
    
}

return js;

}

/* =====================================================
EVENTS
===================================================== */

runBtn.onclick = async () => {

    clearConsole();
    stopStarBackground();
    
    if (!editor) {
        log("Editor is not ready.");
        return;
    }

    saveCurrentFile();

    for (const k in functions) {
        delete functions[k];
    }

    try {

        await runSTar(
            editor.getValue()
        );

    } catch (err) {

        if (
            err &&
            typeof err === "object" &&
            err.lineNumber !== undefined
        ) {

            logError(err);

        } else {

            log(
                `[Runtime Error] ${
                    err?.message || String(err)
                }`
            );

            console.error(err);
        }
    }
};

saveBtn.onclick = saveFile;

openBtn.onclick = () => {
fileInput.click();
};

if (newBtn) {
    newBtn.onclick = () => {

        saveCurrentFile();

        const promptText =
            currentLanguage === "en"
                ? "File name"
                : "ファイル名";

        const name =
            prompt(promptText) || "new.star";

        const file = {
            id: crypto.randomUUID(),
            name,
            content: ""
        };

        files.push(file);
        activeFile = file;

        if (!editor) return;

        saveFiles();
        renderTabs();
        renderTree();
    };
}


clearBtn.onclick =
clearConsole;

fileInput.addEventListener("change", e => {

    saveCurrentFile();

    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {

        const existing =
            files.find(f => f.name === file.name);

        if (existing) {

            existing.content = reader.result;
            activeFile = existing;

            editor.setValue(existing.content);

        } else {

            const newFile = {
                id: crypto.randomUUID(),
                name: file.name,
                content: reader.result
            };

            files.push(newFile);
            activeFile = newFile;

            editor.setValue(newFile.content);
        }

        saveFiles();
        renderTabs();
        renderTree();

        fileInput.value = "";
    };

    reader.onerror = () => {
        log("ファイル読み込み失敗");
    };

    reader.readAsText(file);
});

if (themeBtn) {
    themeBtn.onclick = () => {

        document.body
            .classList
            .toggle("light");

        if (typeof monaco !== "undefined") {
            monaco.editor.setTheme(
                document.body.classList.contains("light")
                    ? "vs"
                    : "vs-dark"
            );
        }

    };
}

/* =====================================================
CTRL+S
===================================================== */
window.addEventListener("load", () => {
    const helpBtn = document.getElementById("helpBtn");
    const helpPanel = document.getElementById("helpPanel");
    const closeHelp = document.getElementById("closeHelp");

    if (!helpBtn || !helpPanel || !closeHelp) return;

    helpBtn.onclick = () => {
        helpPanel.classList.add("open");
    };

    closeHelp.onclick = () => {
        helpPanel.classList.remove("open");
    };
});
window.addEventListener(
"keydown",
e => {

    if (
        e.ctrlKey &&
        e.key === "s"
    ) {

        e.preventDefault();

        saveFile();

    }

}

);
/* =====================================================
HELP
===================================================== */

/*const helpBtn =
document.getElementById(
"helpBtn"
);

const helpPanel =
document.getElementById(
"helpPanel"
);

const closeHelp =
document.getElementById(
"closeHelp"
);

helpBtn.onclick = () => {

helpPanel.classList.add(
    "open"
);

};

closeHelp.onclick = () => {

helpPanel.classList.remove(
    "open"
);

};
*/
function runtimeError(msg, line, raw) {

    const err = {
        error: msg,
        lineNumber: line,
        raw: raw
    };

    throw err;
}
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        document.getElementById("helpPanel")?.classList.remove("open");
    }
});
/* =====================================================
   STar Keyboard
===================================================== */

document.addEventListener("keydown", e => {

    keys[e.key] = true;

    /*
       ゲームで使いやすい別名
    */

    if (e.key === " ") {
        keys["Space"] = true;
    }

    if (e.key === "Enter") {
        keys["Enter"] = true;
    }

});


document.addEventListener("keyup", e => {

    keys[e.key] = false;

    if (e.key === " ") {
        keys["Space"] = false;
    }

    if (e.key === "Enter") {
        keys["Enter"] = false;
    }

});
document.addEventListener(
    "mousemove",
    e => {

        mouseX = e.clientX;
        mouseY = e.clientY;

    }
);
window.addEventListener("load", () => {

    const sidebar =
        document.getElementById("fileSidebar");

    const resizer =
        document.getElementById("sidebarResizer");

    if (!sidebar || !resizer) return;

    let isDragging = false;

    resizer.addEventListener("mousedown", () => {
        isDragging = true;
        document.body.style.cursor = "ew-resize";
    });

    document.addEventListener("mousemove", (e) => {

        if (!isDragging) return;

        let newWidth = e.clientX;

        if (newWidth < 180) newWidth = 180;
        if (newWidth > 600) newWidth = 600;

        sidebar.style.width = newWidth + "px";
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
        document.body.style.cursor = "";
    });

});

const editorArea =
    document.getElementById("editor");

editorArea.addEventListener(
    "dragover",
    e => {
        e.preventDefault();
    }
);

editorArea.addEventListener(
    "drop",
    e => {

        e.preventDefault();

        const file =
            e.dataTransfer.files[0];

        if (!file) return;

        const reader =
            new FileReader();

        reader.onload = () => {

            const newFile = {
                id: crypto.randomUUID(),
                name: file.name,
                content: reader.result
            };

            files.push(newFile);

            activeFile = newFile;

            editor.setValue(newFile.content);

            saveFiles();
            renderTabs();
            renderTree();
        };

        reader.readAsText(file);
    }
);
function updateOutline(){

    const code = editor.getValue();

    const lines = code.split("\n");

    const classes=[];
    const vars=[];
    const arrays=[];
    const cons=[];
    const funcs=[];

    lines.forEach((line,index)=>{

        let m;

        m=line.match(/^class\s+(\w+)/);

        if(m){

            classes.push({
                name:m[1],
                line:index+1
            });

        }

        m=line.match(/^func\s+(\w+)/);

        if(m){

            funcs.push({
                name:m[1],
                line:index+1
            });

        }

        m = line.match(/^let\s+(\w+)\s*=\s*(\[.*)$/);

if (m) {

    arrays.push({
        name: m[1],
        value: m[2].trim(),
        line: index + 1
    });

}

        m = line.match(/^let\s+(\w+)\s*=\s*(.+)$/);

if (m && !m[2].trim().startsWith("[")) {

    vars.push({
        name: m[1],
        value: m[2].trim(),
        line: index + 1
    });

}

        m = line.match(/^con\s+(\w+)\s*=\s*(.+)$/);

if (m) {

    cons.push({
        name: m[1],
        value: m[2].trim(),
        line: index + 1
    });

}

    });

    renderOutline("classList",classes);

    renderOutline("varList",vars);

    renderOutline("arrayList",arrays);

    renderOutline("constList",cons);

    renderOutline("funcList",funcs);
    document.querySelector('[data-name="Classes"]').textContent =
`Classes (${classes.length})`;

document.querySelector('[data-name="Variables"]').textContent =
`Variables (${vars.length})`;

document.querySelector('[data-name="Arrays"]').textContent =
`Arrays (${arrays.length})`;

document.querySelector('[data-name="Constants"]').textContent =
`Constants (${cons.length})`;

document.querySelector('[data-name="Functions"]').textContent =
`Functions (${funcs.length})`;

}
function renderOutline(id,list){

    const div=document.getElementById(id);

    div.innerHTML="";

    list.forEach(item=>{

        const e=document.createElement("div");

        e.className="outlineItem";

        e.textContent =
    item.value !== undefined
        ? `${item.name} = ${item.value}`
        : item.name;

        e.onclick=()=>{

            editor.revealLineInCenter(item.line);

            editor.setPosition({
                lineNumber:item.line,
                column:1
            });

            editor.focus();

        };

        div.appendChild(e);

    });

}

function toggleOutline(title) {

    const content = title.nextElementSibling;

    // 常に開く
    content.classList.remove("closed");

    const count =
        content.querySelectorAll(".outlineItem").length;

    title.textContent =
        `▼ ${title.dataset.name} (${count})`;
}
/* =====================================================
   SEARCH / REPLACE
===================================================== */

const searchPanel =
    document.getElementById("searchPanel");

const searchInput =
    document.getElementById("searchInput");

const replaceInput =
    document.getElementById("replaceInput");

const findPrevBtn =
    document.getElementById("findPrevBtn");

const findNextBtn =
    document.getElementById("findNextBtn");

const replaceBtn =
    document.getElementById("replaceBtn");

const replaceAllBtn =
    document.getElementById("replaceAllBtn");

const closeSearchBtn =
    document.getElementById("closeSearchBtn");

const searchCount =
    document.getElementById("searchCount");

const caseSensitive =
    document.getElementById("caseSensitive");

const wholeWord =
    document.getElementById("wholeWord");

const regexSearch =
    document.getElementById("regexSearch");


let searchMatches = [];
let currentSearchIndex = -1;
let searchDecorations = [];

const replaceBtnTop =
    document.getElementById("replaceBtnTop");

const replaceAllBtnTop =
    document.getElementById("replaceAllBtnTop");

const searchBtn =
    document.getElementById("searchBtn");
/* =====================================================
   TOOLBAR BUTTONS
===================================================== */

searchBtn?.addEventListener(
    "click",
    () => {

        openSearch();

        searchInput.focus();

    }
);


replaceBtnTop?.addEventListener(
    "click",
    () => {

        openSearch();

        replaceInput.focus();

    }
);


replaceAllBtnTop?.addEventListener(
    "click",
    () => {

        openSearch();

        replaceInput.focus();

        /*
         * 一括置換ボタンを強調
         */

        replaceAllBtn?.focus();

    }
);


/* =====================================================
   ESCAPE REGEX
===================================================== */

function escapeRegex(text) {

    return text.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
    );

}


/* =====================================================
   GET SEARCH REGEX
===================================================== */

function getSearchRegex() {

    const text =
        searchInput.value;

    if (!text) return null;

    let pattern = text;

    if (!regexSearch.checked) {

        pattern =
            escapeRegex(pattern);

    }

    if (wholeWord.checked) {

        pattern =
            `\\b${pattern}\\b`;

    }

    try {

        return new RegExp(
            pattern,
            caseSensitive.checked
                ? "g"
                : "gi"
        );

    } catch (e) {

        searchCount.textContent =
            "正規表現エラー";

        return null;

    }

}


/* =====================================================
   UPDATE SEARCH
===================================================== */

function updateSearch() {

    if (!editor) return;

    const text =
        editor.getValue();

    const regex =
        getSearchRegex();

    searchMatches = [];

    currentSearchIndex = -1;

    if (!regex) {

        searchCount.textContent =
            "0 件";

        return;

    }

    let match;

    while (
        (match = regex.exec(text)) !== null
    ) {

        searchMatches.push({

            index: match.index,

            length: match[0].length

        });

        /*
         * 空文字マッチによる無限ループ防止
         */

        if (match[0].length === 0) {

            regex.lastIndex++;

        }

    }

    searchCount.textContent =
        `${searchMatches.length} 件`;

    if (searchMatches.length > 0) {

        const position =
            editor.getPosition();

        const offset =
            editor.getModel()
                .getOffsetAt(position);

        let nearest = 0;

        for (
            let i = 0;
            i < searchMatches.length;
            i++
        ) {

            if (
                searchMatches[i].index >= offset
            ) {

                nearest = i;
                break;

            }

        }

        currentSearchIndex =
            nearest;

        selectSearchMatch(
            currentSearchIndex
        );

    }

}


/* =====================================================
   SELECT MATCH
===================================================== */

function selectSearchMatch(index) {

    if (!editor) return;

    const model = editor.getModel();
    if (!model) return;

    /*
     * 既存の検索ハイライトを削除
     */
    searchDecorations =
        editor.deltaDecorations(
            searchDecorations,
            []
        );

    /*
     * 検索結果がない場合
     */
    if (
        index < 0 ||
        index >= searchMatches.length
    ) {
        return;
    }

    /*
     * 全検索結果のハイライトを作成
     */
    const decorations =
        searchMatches.map((match, i) => {

            const start =
                model.getPositionAt(
                    match.index
                );

            const end =
                model.getPositionAt(
                    match.index +
                    match.length
                );

            return {

                range: {
                    startLineNumber:
                        start.lineNumber,

                    startColumn:
                        start.column,

                    endLineNumber:
                        end.lineNumber,

                    endColumn:
                        end.column
                },

                options: {

                    inlineClassName:
                        i === index
                            ? "star-search-current"
                            : "star-search-match",

                    overviewRuler:
                        {
                            color:
                                i === index
                                    ? "#00e5ff"
                                    : "#64748b",

                            position:
                                monaco.editor
                                    .OverviewRulerLane
                                    .Full
                        },

                    minimap: {
                        color:
                            i === index
                                ? "#00e5ff"
                                : "#64748b",

                        position:
                            monaco.editor
                                .MinimapPosition
                                .Inline
                    }

                }

            };

        });

    /*
     * Monacoにハイライトを適用
     */
    searchDecorations =
        editor.deltaDecorations(
            [],
            decorations
        );

    /*
     * 現在選択中の検索結果
     */
    const match =
        searchMatches[index];

    const start =
        model.getPositionAt(
            match.index
        );

    const end =
        model.getPositionAt(
            match.index +
            match.length
        );

    editor.setSelection({

        startLineNumber:
            start.lineNumber,

        startColumn:
            start.column,

        endLineNumber:
            end.lineNumber,

        endColumn:
            end.column

    });

    editor.revealRangeInCenter({

        startLineNumber:
            start.lineNumber,

        startColumn:
            start.column,

        endLineNumber:
            end.lineNumber,

        endColumn:
            end.column

    });

}


/* =====================================================
   NEXT
===================================================== */

function findNext() {

    if (
        searchMatches.length === 0
    ) {

        updateSearch();

        return;

    }

    currentSearchIndex++;

    if (
        currentSearchIndex >=
        searchMatches.length
    ) {

        currentSearchIndex = 0;

    }

    selectSearchMatch(
        currentSearchIndex
    );

}


/* =====================================================
   PREVIOUS
===================================================== */

function findPrevious() {

    if (
        searchMatches.length === 0
    ) {

        updateSearch();

        return;

    }

    currentSearchIndex--;

    if (
        currentSearchIndex < 0
    ) {

        currentSearchIndex =
            searchMatches.length - 1;

    }

    selectSearchMatch(
        currentSearchIndex
    );

}


/* =====================================================
   REPLACE CURRENT
===================================================== */

function replaceCurrent() {

    if (!editor) return;

    const selection =
        editor.getSelection();

    if (!selection) return;

    const selectedText =
        editor
            .getModel()
            .getValueInRange(selection);

    const searchText =
        searchInput.value;

    if (!searchText) return;

    let matched = false;

    if (regexSearch.checked) {

        const regex =
            getSearchRegex();

        if (regex) {

            matched =
                regex.test(selectedText);

        }

    } else {

        matched =
            caseSensitive.checked
                ? selectedText === searchText
                : selectedText.toLowerCase() ===
                  searchText.toLowerCase();

    }

    if (!matched) {

        findNext();

        return;

    }

    editor.executeEdits(
        "replace",
        [{
            range: selection,

            text:
                replaceInput.value
        }]
    );

    updateSearch();

}


/* =====================================================
   REPLACE ALL
===================================================== */

function replaceAll() {

    if (!editor) return;

    const searchText =
        searchInput.value;

    if (!searchText) return;

    const replaceText =
        replaceInput.value;

    const model =
        editor.getModel();

    const text =
        model.getValue();

    const regex =
        getSearchRegex();

    if (!regex) return;

    const newText =
        text.replace(
            regex,
            replaceText
        );

    if (newText === text) {

        searchCount.textContent =
            "0 件";

        return;

    }

    editor.pushUndoStop();

    editor.executeEdits(
        "replace-all",
        [{
            range:
                model.getFullModelRange(),

            text:
                newText
        }]
    );

    editor.pushUndoStop();

    updateSearch();

    log(
        `一括置換完了: ${searchMatches.length} 件`
    );

}


/* =====================================================
   OPEN SEARCH
===================================================== */

function openSearch() {

    if (!searchPanel) return;

    searchPanel.classList.add("open");

    searchInput.focus();

    searchInput.select();

    updateSearch();

}


/* =====================================================
   CLOSE SEARCH
===================================================== */

function closeSearch() {

    if (!searchPanel) return;

    searchPanel.classList.remove("open");

    if (editor) {

        editor.focus();

    }

}


/* =====================================================
   EVENTS
===================================================== */

searchInput?.addEventListener(
    "input",
    updateSearch
);

replaceInput?.addEventListener(
    "input",
    updateSearch
);

caseSensitive?.addEventListener(
    "change",
    updateSearch
);

wholeWord?.addEventListener(
    "change",
    updateSearch
);

regexSearch?.addEventListener(
    "change",
    updateSearch
);

findNextBtn?.addEventListener(
    "click",
    findNext
);

findPrevBtn?.addEventListener(
    "click",
    findPrevious
);

replaceBtn?.addEventListener(
    "click",
    replaceCurrent
);

replaceAllBtn?.addEventListener(
    "click",
    replaceAll
);

closeSearchBtn?.addEventListener(
    "click",
    closeSearch
);


/* =====================================================
   KEYBOARD
===================================================== */

document.addEventListener(
    "keydown",
    e => {

        /*
         * Ctrl + F
         * 検索
         */

        if (
            e.ctrlKey &&
            !e.shiftKey &&
            e.key.toLowerCase() === "f"
        ) {

            e.preventDefault();

            openSearch();

            return;

        }


        /*
         * Ctrl + H
         * 置換
         */

        if (
            e.ctrlKey &&
            e.key.toLowerCase() === "h"
        ) {

            e.preventDefault();

            openSearch();

            replaceInput.focus();

            return;

        }


        /*
         * 検索中
         */

        if (
            searchPanel?.classList.contains("open")
        ) {

            /*
             * Enter = 次
             */

            if (
                e.key === "Enter" &&
                !e.shiftKey
            ) {

                e.preventDefault();

                findNext();

            }

            /*
             * Shift + Enter = 前
             */

            if (
                e.key === "Enter" &&
                e.shiftKey
            ) {

                e.preventDefault();

                findPrevious();

            }

            /*
             * Escape = 閉じる
             */

            if (e.key === "Escape") {

                e.preventDefault();

                closeSearch();

            }

        }

    }
);


/* =====================================================
   UPDATE AFTER EDIT
===================================================== */

function updateSearchAfterEdit() {

    if (
        searchPanel?.classList.contains("open")
    ) {

        updateSearch();

    }

}

/* =====================================================
   KEYBOARD SHORTCUT PANEL
===================================================== */

const shortcutBtn =
    document.getElementById("shortcutBtn");

const shortcutPanel =
    document.getElementById("shortcutPanel");

const closeShortcut =
    document.getElementById("closeShortcut");


function openShortcutPanel() {

    if (!shortcutPanel) return;

    shortcutPanel.classList.add("open");

}


function closeShortcutPanel() {

    if (!shortcutPanel) return;

    shortcutPanel.classList.remove("open");

}


shortcutBtn?.addEventListener(
    "click",
    openShortcutPanel
);


closeShortcut?.addEventListener(
    "click",
    closeShortcutPanel
);


/* パネル外クリック */

document.addEventListener(
    "mousedown",
    e => {

        if (
            !shortcutPanel ||
            !shortcutPanel.classList.contains("open")
        ) {
            return;
        }

        if (
            !shortcutPanel.contains(e.target) &&
            e.target !== shortcutBtn
        ) {

            closeShortcutPanel();

        }

    }
);


/* Escape */

document.addEventListener(
    "keydown",
    e => {

        if (e.key === "Escape") {

            closeShortcutPanel();

        }

    }
);
/* =====================================================
   プログラム実行ショートカット
   Ctrl + Enter / Cmd + Enter
===================================================== */

document.addEventListener("keydown", (e) => {

    // Ctrl + Enter または Cmd + Enter
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {

        e.preventDefault();

        // Runボタンを押す
        const runButton = document.getElementById("runBtn");

        if (runButton) {
            runButton.click();
        }
    }

});
const consoleAutoScrollCheck =
    document.getElementById(
        "consoleAutoScrollCheck"
    );


if(consoleAutoScrollCheck){

    consoleAutoScrollCheck.onchange = ()=>{

        setConsoleScrollMode(
            consoleAutoScrollCheck.checked
        );

    };

}
