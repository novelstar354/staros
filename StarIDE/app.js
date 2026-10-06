/* =====================================================
   WEB IDE
   APP.JS
   STEP 3-A
   ===================================================== */

let editor;

/* =====================================================
   FILE SYSTEM
   ===================================================== */

const files = [];

let activeFileId = null;

/* =====================================================
   DOM
   ===================================================== */

const tabsEl = document.getElementById("tabs");
const treeEl = document.getElementById("fileTree");

const fileNameEl =
document.getElementById("fileName");

const languageEl =
document.getElementById("language");

const positionEl =
document.getElementById("position");

const charCountEl =
document.getElementById("charCount");

/* =====================================================
   FILE TYPE DETECTION
   ===================================================== */

function detectLanguage(name){

    const ext =
    name.split(".").pop().toLowerCase();

    switch(ext){

        case "html":
            return "html";

        case "css":
            return "css";

        case "js":
            return "javascript";

        case "txt":
        default:
            return "plaintext";
    }
}

/* =====================================================
   FILE OBJECT
   ===================================================== */

function createFile(
    name="untitled.txt",
    content=""
){

    const file = {

        id:
        Date.now() +
        Math.random(),

        name,

        content,

        language:
        detectLanguage(name),

        model:null
    };

    files.push(file);

    createTab(file);

    createTreeItem(file);

    openFile(file.id);

    return file;
}

/* =====================================================
   TABS
   ===================================================== */

function createTab(file){

    const tab =
    document.createElement("div");

    tab.className = "tab";

    tab.dataset.id = file.id;

    tab.innerHTML = `
        <span>${file.name}</span>
        <span class="tab-close">×</span>
    `;

    tab.addEventListener("click",e=>{

        if(
            e.target.classList
            .contains("tab-close")
        ){
            closeTab(file.id);
            return;
        }

        openFile(file.id);
    });

    tabsEl.appendChild(tab);
}

/* =====================================================
   CLOSE TAB
   ===================================================== */

function closeTab(id){

    const index =
    files.findIndex(
        f => f.id === id
    );

    if(index === -1) return;

    const tab =
    tabsEl.querySelector(
        `[data-id="${id}"]`
    );

    if(tab) tab.remove();

    const tree =
    treeEl.querySelector(
        `[data-id="${id}"]`
    );

    if(tree) tree.remove();

    files.splice(index,1);

    if(activeFileId === id){

        if(files.length){

            openFile(
                files[0].id
            );

        }else{

            activeFileId = null;

            editor.setValue("");

            updateStatus();
        }
    }
}

/* =====================================================
   FILE TREE
   ===================================================== */

function createTreeItem(file){

    const li =
    document.createElement("li");

    li.textContent =
    file.name;

    li.dataset.id =
    file.id;

    li.addEventListener("click",()=>{

        openFile(file.id);

    });

    treeEl.appendChild(li);
}

/* =====================================================
   OPEN FILE
   ===================================================== */

function openFile(id){

    const file =
    files.find(
        f => f.id === id
    );

    if(!file) return;

    activeFileId = id;

    if(file.model){

        editor.setModel(
            file.model
        );

    }else{

        file.model =
        monaco.editor.createModel(
            file.content,
            file.language
        );

        editor.setModel(
            file.model
        );
    }

    updateActiveUI();

    updateStatus();
}

/* =====================================================
   ACTIVE UI
   ===================================================== */

function updateActiveUI(){

    document
    .querySelectorAll(".tab")
    .forEach(tab=>{

        tab.classList.remove(
            "active"
        );

        if(
            Number(tab.dataset.id)
            === activeFileId
        ){
            tab.classList.add(
                "active"
            );
        }
    });

    document
    .querySelectorAll("#fileTree li")
    .forEach(item=>{

        item.classList.remove(
            "active"
        );

        if(
            Number(item.dataset.id)
            === activeFileId
        ){
            item.classList.add(
                "active"
            );
        }
    });
}

/* =====================================================
   STATUS BAR
   ===================================================== */

function updateStatus(){

    const file =
    files.find(
        f => f.id === activeFileId
    );

    if(!file){

        fileNameEl.textContent =
        "No File";

        languageEl.textContent =
        "-";

        positionEl.textContent =
        "Ln 1, Col 1";

        charCountEl.textContent =
        "0 chars";

        return;
    }

    const pos =
    editor.getPosition();

    const value =
    editor.getValue();

    fileNameEl.textContent =
    file.name;

    languageEl.textContent =
    file.language;

    positionEl.textContent =
    `Ln ${pos.lineNumber}, Col ${pos.column}`;

    charCountEl.textContent =
    `${value.length} chars`;
}

/* =====================================================
   MONACO INIT
   ===================================================== */

require.config({

    paths:{

        vs:
        "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs"
    }
});

require(
["vs/editor/editor.main"],

function(){

    editor =
    monaco.editor.create(
        document.getElementById("editor"),
        {
            value:"",
            language:"plaintext",
            theme:"vs-dark",
            automaticLayout:true
        }
    );

    hookPreviewUpdates();

    editor.onDidChangeCursorPosition(
        updateStatus
    );

    editor.onDidChangeModelContent(
        updateStatus
    );

    document.getElementById(
        "loadingScreen"
    ).style.display = "none";

    if(!restoreWorkspace()){
        createFile(
            "untitled.txt",
            ""
        );
    }
});

    

/* =====================================================
   NEW FILE BUTTON
   ===================================================== */

document
.getElementById(
    "newFileBtn"
)
.addEventListener(
    "click",
    ()=>{

        const name =
        prompt(
            "ファイル名"
        );

        if(!name) return;

        createFile(
            name,
            ""
        );
    }
);
/* =====================================================
   STEP 3-B
   FILE OPEN / SAVE / AUTOSAVE
   ===================================================== */

/* =====================================================
   OPEN FILE
   ===================================================== */

const fileInput =
document.getElementById(
    "fileInput"
);

document
.getElementById(
    "openFileBtn"
)
.addEventListener(
    "click",
    ()=>{
        fileInput.click();
    }
);

fileInput.addEventListener(
    "change",
    async e=>{

        const selected =
        [...e.target.files];

        for(const f of selected){

            const text =
            await f.text();

            createFile(
                f.name,
                text
            );
        }

        fileInput.value = "";
    }
);

/* =====================================================
   SAVE FILE
   ===================================================== */

document
.getElementById(
    "saveFileBtn"
)
.addEventListener(
    "click",
    saveCurrentFile
);

function saveCurrentFile(){

    const file =
    files.find(
        f => f.id === activeFileId
    );

    if(!file) return;

    file.content =
    editor.getValue();

    const blob =
    new Blob(
        [file.content],
        {
            type:"text/plain"
        }
    );

    const url =
    URL.createObjectURL(blob);

    const a =
    document.createElement("a");

    a.href =
    url;

    a.download =
    file.name;

    document.body
    .appendChild(a);

    a.click();

    a.remove();

    URL.revokeObjectURL(
        url
    );
}

/* =====================================================
   CTRL + S
   ===================================================== */

window.addEventListener(
    "keydown",
    e=>{

        if(
            e.ctrlKey &&
            e.key.toLowerCase()
            === "s"
        ){

            e.preventDefault();

            saveCurrentFile();
        }
    }
);

/* =====================================================
   DRAG & DROP
   ===================================================== */

window.addEventListener(
    "dragover",
    e=>{

        e.preventDefault();
    }
);

window.addEventListener(
    "drop",
    async e=>{

        e.preventDefault();

        const dropped =
        [...e.dataTransfer.files];

        for(const file of dropped){

            const text =
            await file.text();

            createFile(
                file.name,
                text
            );
        }
    }
);

/* =====================================================
   AUTOSAVE
   ===================================================== */

const STORAGE_KEY =
"WEB_IDE_FILES";

function saveWorkspace(){

    const data =
    files.map(f=>({

        id:f.id,

        name:f.name,

        language:f.language,

        content:
        f.id === activeFileId
        ? editor.getValue()
        : (
            f.model
            ? f.model.getValue()
            : f.content
        )
    }));

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify({

            activeFileId,

            files:data
        })
    );
}

/* =====================================================
   AUTO SAVE TIMER
   ===================================================== */

setInterval(

    saveWorkspace,

    5000
);

/* =====================================================
   SAVE BEFORE EXIT
   ===================================================== */

window.addEventListener(

    "beforeunload",

    saveWorkspace
);

/* =====================================================
   RESTORE WORKSPACE
   ===================================================== */

function restoreWorkspace(){

    const raw =
    localStorage.getItem(
        STORAGE_KEY
    );

    if(!raw) return false;

    try{

        const workspace =
        JSON.parse(raw);

        files.length = 0;

        tabsEl.innerHTML = "";

        treeEl.innerHTML = "";

        workspace.files
        .forEach(file=>{

            const obj = {

                id:file.id,

                name:file.name,

                content:file.content,

                language:file.language,

                model:null
            };

            files.push(obj);

            createTab(obj);

            createTreeItem(obj);
        });

        if(
            workspace.files.length
        ){

            openFile(

                workspace
                .activeFileId
            );
        }

        return true;

    }catch(err){

        console.error(err);

        return false;
    }
}

/* =====================================================
   PATCH INIT
   ===================================================== */

/*
Step 3-A の

createFile(
    "untitled.txt",
    ""
);

を

↓へ置換
*/


/* =====================================================
   MANUAL SAVE BUTTON
   ===================================================== */

function forceSaveWorkspace(){

    saveWorkspace();

    alert(
        "ワークスペース保存完了"
    );
}

/* =====================================================
   EXTRA SHORTCUT
   ===================================================== */

window.addEventListener(
    "keydown",
    e=>{

        if(
            e.ctrlKey &&
            e.shiftKey &&
            e.key.toLowerCase()
            === "s"
        ){

            e.preventDefault();

            forceSaveWorkspace();
        }
    }
);

/* =====================================================
   STEP 3-D
   PREVIEW / THEME / FULLSCREEN / PWA
   ===================================================== */

const previewPane =
document.getElementById(
    "previewPane"
);

const previewFrame =
document.getElementById(
    "previewFrame"
);

/* =====================================================
   PREVIEW TOGGLE
   ===================================================== */

document
.getElementById(
    "previewBtn"
)
.addEventListener(
    "click",
    ()=>{

        previewPane
        .classList
        .toggle("show");

        updatePreview();
    }
);

/* =====================================================
   CLOSE PREVIEW
   ===================================================== */

document
.getElementById(
    "closePreview"
)
.addEventListener(
    "click",
    ()=>{

        previewPane
        .classList
        .remove("show");
    }
);

/* =====================================================
   GET FILES
   ===================================================== */

function getFileByExt(ext){

    return files.find(
        f =>
        f.name
        .toLowerCase()
        .endsWith(ext)
    );
}

/* =====================================================
   BUILD PREVIEW
   ===================================================== */

function updatePreview(){

    if(
        !previewPane.classList
        .contains("show")
    ){
        return;
    }

    const htmlFile =
    getFileByExt(".html");

    const cssFile =
    getFileByExt(".css");

    const jsFile =
    getFileByExt(".js");

    let html = "";
    let css = "";
    let js = "";

    if(htmlFile){

        html =
        htmlFile.model
        ? htmlFile.model.getValue()
        : htmlFile.content;
    }

    if(cssFile){

        css =
        cssFile.model
        ? cssFile.model.getValue()
        : cssFile.content;
    }

    if(jsFile){

        js =
        jsFile.model
        ? jsFile.model.getValue()
        : jsFile.content;
    }

    const src = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
${css}
</style>
</head>
<body>

${html}

<script>
${js}
<\/script>

</body>
</html>
`;

    previewFrame.srcdoc =
    src;
}

/* =====================================================
   AUTO PREVIEW UPDATE
   ===================================================== */

setInterval(
    updatePreview,
    1000
);

/* =====================================================
   UPDATE ON EDIT
   ===================================================== */

function hookPreviewUpdates(){

    editor.onDidChangeModelContent(
        ()=>{

            updatePreview();
        }
    );
}

/*
Step 3-A の Monaco 初期化直後へ追加

hookPreviewUpdates();
*/

/* =====================================================
   THEME
   ===================================================== */

let darkTheme = true;

document
.getElementById(
    "themeBtn"
)
.addEventListener(
    "click",
    ()=>{

        darkTheme =
        !darkTheme;

        if(darkTheme){

            document.body
            .classList
            .remove("light");

            monaco.editor
            .setTheme(
                "vs-dark"
            );

        }else{

            document.body
            .classList
            .add("light");

            monaco.editor
            .setTheme(
                "vs"
            );
        }
    }
);

/* =====================================================
   FULLSCREEN
   ===================================================== */

document
.getElementById(
    "fullscreenBtn"
)
.addEventListener(
    "click",
    toggleFullscreen
);

function toggleFullscreen(){

    if(
        !document.fullscreenElement
    ){

        document
        .documentElement
        .requestFullscreen();

    }else{

        document
        .exitFullscreen();
    }
}

/* =====================================================
   F11 SUPPORT
   ===================================================== */

window.addEventListener(
    "keydown",
    e=>{

        if(
            e.key === "F11"
        ){

            e.preventDefault();

            toggleFullscreen();
        }
    }
);

/* =====================================================
   PWA
   ===================================================== */

if(
    "serviceWorker"
    in navigator
){

    window.addEventListener(
        "load",
        ()=>{

            navigator
            .serviceWorker
            .register(
                "./sw.js"
            )
            .then(()=>{

                console.log(
                    "SW Registered"
                );
            })
            .catch(err=>{

                console.error(
                    err
                );
            });
        }
    );
}

/* =====================================================
   BEFORE INSTALL PROMPT
   ===================================================== */

let installPrompt;

window.addEventListener(
    "beforeinstallprompt",
    e=>{

        e.preventDefault();

        installPrompt = e;
    }
);

/* =====================================================
   INSTALL APP
   ===================================================== */

function installPWA(){

    if(
        !installPrompt
    ) return;

    installPrompt.prompt();

    installPrompt.userChoice
    .then(result=>{

        console.log(result);

        installPrompt = null;
    });
}

/* =====================================================
   CTRL + SHIFT + P
   ===================================================== */

window.addEventListener(
    "keydown",
    e=>{

        if(
            e.ctrlKey &&
            e.shiftKey &&
            e.key.toLowerCase()
            === "p"
        ){

            e.preventDefault();

            installPWA();
        }
    }
);

/* =====================================================
   LIVE STATUS
   ===================================================== */

setInterval(
    ()=>{

        if(
            activeFileId
        ){

            updateStatus();
        }

    },
    500
);

/* =====================================================
   READY
   ===================================================== */

console.log(
    "WEB IDE READY"
);
const searchBar =
document.getElementById(
    "searchBar"
);
const searchInput =
document.getElementById("searchInput");


const replaceInput =
document.getElementById(
    "replaceInput"
);

/* OPEN SEARCH */

document
.getElementById("searchBtn")
.addEventListener("click",()=>{

    searchBar.classList.remove("hidden");

    document
    .getElementById("container")
    .style.height =
    "calc(100vh - 48px - 42px)";
});
searchInput.addEventListener(
    "input",
    ()=>{

        if(
            !editor ||
            !editor.getModel()
        ){
            return;
        }

        const text =
        searchInput.value;

        if(!text){

            window.searchMarks =
            editor.deltaDecorations(
                window.searchMarks || [],
                []
            );

            return;
        }

        const matches =
        editor.getModel().findMatches(
            text,
            true,
            false,
            false,
            null,
            true
        );

        const decorations =
        matches.map(m=>({

            range:m.range,

            options:{
                inlineClassName:
                "searchHighlight"
            }
        }));

        window.searchMarks =
        editor.deltaDecorations(
            window.searchMarks || [],
            decorations
        );
    }
);
/* CLOSE */

document
.getElementById("closeSearchBar")
.addEventListener(
    "click",
    ()=>{

        searchBar.classList.add("hidden");

        document
        .getElementById("container")
        .style.height =
        "calc(100vh - 48px)";
    }
);

document
.getElementById(
    "replaceOneBtn"
)
.addEventListener(
    "click",
    ()=>{

        const search =
searchInput.value;

        const replace =
        replaceInput.value;

        const text =
        editor.getValue();

        const idx =
        text.indexOf(search);

        if(idx === -1) return;

        editor.setValue(

            text.replace(
                search,
                replace
            )
        );
    }
);
document
.getElementById(
    "replaceAllBtn"
)
.addEventListener(
    "click",
    ()=>{

        const search =
        searchInput.value

        const replace =
        replaceInput.value;

        if(!search) return;

        editor.setValue(

            editor
            .getValue()
            .split(search)
            .join(replace)
        );
    }
);
/* =====================================================
   RUN CURRENT FILE
   ===================================================== */

document
.getElementById("runBtn")
.addEventListener(
    "click",
    runCurrentFile
);

function runCurrentFile(){

    const file =
    files.find(
        f => f.id === activeFileId
    );

    if(!file){

        alert("実行するファイルが開かれていません");

        return;
    }

    const content =
    file.model
    ? file.model.getValue()
    : file.content;

    const ext =
    file.name
    .split(".")
    .pop()
    .toLowerCase();


    /* =========================
       HTML
       ========================= */

    if(ext === "html"){

        const win =
        window.open(
            "",
            "_blank"
        );

        if(!win){

            alert(
                "ポップアップがブロックされています。"
            );

            return;
        }

        win.document.open();

        win.document.write(
            content
        );

        win.document.close();

        return;
    }


    /* =========================
       JavaScript
       ========================= */

    if(ext === "js"){

        const win =
        window.open(
            "",
            "_blank"
        );

        if(!win){

            alert(
                "ポップアップがブロックされています。"
            );

            return;
        }

        win.document.open();

        win.document.write(`
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${file.name}</title>
</head>
<body>

<h3>JavaScript実行結果</h3>

<script>
try {

${content}

} catch(error) {

    document.body.innerHTML +=
        "<pre style='color:red'>" +
        String(error) +
        "</pre>";

}
<\/script>

</body>
</html>
        `);

        win.document.close();

        return;
    }


    /* =========================
       CSS
       ========================= */

    if(ext === "css"){

        const win =
        window.open(
            "",
            "_blank"
        );

        if(!win){

            alert(
                "ポップアップがブロックされています。"
            );

            return;
        }

        win.document.open();

        win.document.write(`
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${file.name}</title>

<style>
${content}
</style>

</head>
<body>

<h2>CSS Preview</h2>

<p>現在開いているCSSファイルを適用しています。</p>

<div class="preview-box">
    CSS Preview
</div>

</body>
</html>
        `);

        win.document.close();

        return;
    }


    /* =========================
       その他
       ========================= */

    const win =
    window.open(
        "",
        "_blank"
    );

    if(!win){

        alert(
            "ポップアップがブロックされています。"
        );

        return;
    }

    win.document.open();

    win.document.write(`
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${file.name}</title>
</head>

<body>

<pre style="
white-space:pre-wrap;
font-family:monospace;
padding:20px;
">${escapeHTML(content)}</pre>

</body>
</html>
    `);

    win.document.close();
}


/* =====================================================
   HTML ESCAPE
   ===================================================== */

function escapeHTML(text){

    return String(text)
        .replace(/&/g,"&amp;")
        .replace(/</g,"&lt;")
        .replace(/>/g,"&gt;")
        .replace(/"/g,"&quot;")
        .replace(/'/g,"&#039;");
}
function runCurrentProject(){

    const html =
    getFileByExt(".html");

    const css =
    getFileByExt(".css");

    const js =
    getFileByExt(".js");

    const win =
    window.open(
        "",
        "_blank"
    );

    win.document.write(`
<!DOCTYPE html>
<html>
<head>
<style>
${css?.model ? css.model.getValue() : ""}
</style>
</head>
<body>

${html?.model ? html.model.getValue() : ""}

<script>
${js?.model ? js.model.getValue() : ""}
<\/script>

</body>
</html>
`);

    win.document.close();
}

setTimeout(()=>{

    const loading =
    document.getElementById(
        "loadingScreen"
    );

    if(
        loading.style.display !==
        "none"
    ){

        loading.style.display =
        "none";

        alert(
            "Monaco Editorの読み込みに失敗しました"
        );
    }

},5000);
