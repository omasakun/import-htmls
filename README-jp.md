# importHTMLs
## デモ
https://omasakun.github.io/import-htmls/demo/

## 使い方
1. `importHTMLs.js` を、あなたのプロジェクトにコピーしてください。
2. `<script src="importHTMLs.js">`を`<head>`タグの内部に、他の`window.addEventListener("load", ... )`を用いる他のどのスクリプトよりも早く読み込まれるように書き加えてください。
3. 何らかのバグや修正点、改善点を見つけましたら、遠慮なく報告してください。

## Description
**このライブラリーは、どのスクリプトよりも先に読み込まれるようにしてください。**

このライブラリーは、importタグを追加します。

例えば、`<import src="./button.html" />` というタグを書いた場合、 `./button.html` の内容でそのタグが置き換えられます。
標準では、最初にページが読み込まれたときにのみ import タグの置き換えがされます。  
(例外:importタグによってインポートされたファイル中に書いてあるimportタグは、例外的に自動的に読み込まれます。)  
もし、それ以外のタイミングで import タグの解釈をさせたい場合、 importHTMLs 関数を引数無しで読んでください。

このスクリプトが読み込まれてから window の load イベントが発火するまでに追加された load イベントハンドラーは、importHTMLs 実行後に呼び出されます。

インポートされるファイル中に書かれている`<script src = "..." />` や `<script> /* some JS code */ </script>` は、ブラウザーによって解釈され、また、そのスクリプトは実行されます。