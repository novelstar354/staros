StarOS

Welcome to StarOS.

This is the StarOS file system.

STAR CORPORATION
日常捨てろよ。

StarOSについて

StarOSは、Star CorporationによるOS風のWebアプリケーションです。

デスクトップ、スタートメニュー、ウィンドウ、ファイルシステム、Star Explorer、Star Terminal、Star Browser、Calculator、Text Editor、Star Settings、Star Apps Storeなどを搭載しています。

StarOSのファイルシステムは基本的にブラウザの localStorage に保存されます。
そのため、同じブラウザで使用している間は、作成したファイルや設定を保持できます。

主な機能

デスクトップとアプリショートカット

スタートメニュー

ウィンドウの移動・最小化・最大化・終了

Star Explorer

仮想ファイルシステム

Star Terminal

Star Browser

Calculator

Text Editor

Star Settings

Star Apps Store

ホーム画面へのアプリショートカット追加

ユーザー作成アプリの追加

STar

Star IDE

ゴミ箱

デスクトップ設定・壁紙設定

アプリを追加する

StarOSでは、主に2つの方法でアプリを追加できます。

方法1：Star Apps StoreからHTMLアプリを追加する

StarOSの Star Apps Store を開きます。

「＋ HTMLを追加」 を押します。

追加したい .html / .htm ファイルを選択します。

HTMLファイルがStarOSに登録されます。

登録されたアプリの 「▶ 起動」 を押すと起動できます。

追加したHTMLアプリはStar Apps Storeに保存され、次回StarOSを開いたときにも利用できます。

Star Apps Storeで追加できるもの

基本的にはHTMLファイル単体のアプリを追加できます。

HTMLの中にCSSやJavaScriptを書いておけば、そのまま1つのHTMLアプリとして利用できます。

外部ファイルを使う複数ファイル構成のアプリを追加したい場合は、次の appsフォルダー方式 を使用してください。

appsフォルダーからアプリを追加する

StarOSには apps フォルダーがあります。

このフォルダーの中にアプリごとのフォルダーを作ると、StarOSが自動的にアプリとして認識します。

基本的な構成は次のようにします。

StarOS/
└── apps/
    └── MyApp/
        ├── index.html
        ├── style.css
        ├── app.js
        └── manifest.json

manifest.json、style.css、app.js は必要に応じて追加できます。

最低限必要なファイル

アプリとして認識するには、フォルダー内にHTMLファイルが必要です。

最も簡単な構成はこれです。

apps/
└── MyApp/
    └── index.html

index.html があればアプリとして認識されます。

CSSとJavaScriptを使う場合

おすすめの構成です。

apps/
└── MyApp/
    ├── index.html
    ├── style.css
    └── app.js

StarOSは、同じアプリフォルダー内のCSSとJavaScriptを読み込み、1つのアプリとして起動します。

ファイル名は次の順番で認識されます。

HTML

index.html

フォルダー名と同じ名前のHTMLファイル

フォルダー内にあるHTMLファイル

CSS

style.css

フォルダー名と同じ名前のCSSファイル

フォルダー内にあるCSSファイル

JavaScript

app.js

フォルダー名と同じ名前のJavaScriptファイル

フォルダー内にあるJavaScriptファイル

そのため、基本的には index.html、style.css、app.js という名前にしておくと分かりやすいです。

manifest.json

manifest.json を追加すると、アプリの表示名・アイコン・説明などを設定できます。

例：

{
  "name": "My App",
  "short_name": "MyApp",
  "icon": "🚀",
  "description": "自作のStarOSアプリです。"
}

設定できる項目

項目

内容

name

アプリの表示名

short_name

短い名前

icon

アプリのアイコン

emoji

icon と同様にアイコンとして使用可能

icons

アイコン候補の配列

description

アプリの説明

name が設定されていない場合は、アプリフォルダーの名前が表示名として使用されます。

アイコンが設定されていない場合は、デフォルトで 📦 が使用されます。

アプリを起動する

apps フォルダーにアプリを追加すると、StarOSが自動的にアプリを検出します。

検出されたアプリは、スタートメニューから起動できます。

また、スタートメニューにある 「＋」 ボタンから、アプリをホーム画面にショートカットとして追加できます。

ホーム画面に追加したアプリは、通常のStarOSアプリと同じようにダブルクリックして起動できます。

STar / Star IDEについて

StarOSには、Star Corporationの開発環境として STar と Star IDE を追加できます。

外部フォルダーを使用する場合は、StarOS本体と同じ場所にフォルダーを配置します。

folder/
├── StarOS_updated.html
├── STar/
│   ├── index.html
│   ├── style.css
│   ├── app.js
│   ├── lexer.js
│   ├── parser.js
│   ├── runtime.js
│   ├── compiler.js
│   └── language.js
└── StarIDE/
    ├── index.html
    ├── style.css
    └── app.js

StarOSから起動すると、それぞれの index.html がアプリとして読み込まれます。

ローカル環境で使用する場合は、ブラウザのセキュリティ制限を避けるため、StarOSのフォルダーで次のようにHTTPサーバーを起動する方法がおすすめです。

python3 -m http.server 8000

その後、ブラウザで次を開きます。

http://localhost:8000/StarOS_updated.html

アプリ作成のおすすめ構成

apps/
└── MyApp/
    ├── index.html
    ├── style.css
    ├── app.js
    └── manifest.json

例えば、電卓アプリなら次のようにできます。

apps/
└── CalculatorPlus/
    ├── index.html
    ├── style.css
    ├── app.js
    └── manifest.json

manifest.json を設定すると、スタートメニューなどで分かりやすい名前やアイコンを表示できます。

注意事項

StarOSの仮想ファイルシステムはブラウザの localStorage を使用します。

ブラウザのデータを削除すると、保存されているStarOSのデータも失われる場合があります。

外部フォルダーのSTarやStar IDEなどを使用する場合は、file:// ではなくローカルHTTPサーバーを使用することをおすすめします。

アプリのHTMLにCSSやJavaScriptをまとめて書く場合は、Star Apps StoreからHTMLファイルを直接追加できます。

複数ファイルでアプリを作る場合は、apps/アプリ名/ のフォルダー方式を使用してください。

STAR CORPORATION

役に立たない製品を製造する企業

日常捨てろよ。