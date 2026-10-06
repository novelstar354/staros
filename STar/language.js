/* =====================================================
   STar Language Support
   language.js
   ===================================================== */

require(["vs/editor/editor.main"], () => {

    monaco.languages.register({
        id: "star"
    });

    monaco.languages.setMonarchTokensProvider("star", {

        tokenizer: {

            root: [

                [/".*?"/, "string"],

                [/\b(let|func|class|if|else|while|repeat|return|import|async|wait|on|create|move|rotate|destroy|print|input)\b/, "keyword"],

                [/\b(true|false|null)\b/, "constant"],

                [/[0-9]+/, "number"],

                [/#.*$/, "comment"],

                [/[a-zA-Z_][a-zA-Z0-9_]*/, "identifier"]

            ]
        }

    });

    monaco.editor.setTheme("star-dark", {

        base: "vs-dark",
        inherit: true,

        rules: [

            {
                token: "keyword",
                foreground: "38bdf8"
            },

            {
                token: "string",
                foreground: "22c55e"
            },

            {
                token: "number",
                foreground: "f59e0b"
            },

            {
                token: "comment",
                foreground: "64748b"
            }

        ],

        colors: {}

    });

    monaco.languages.registerCompletionItemProvider("star", {

        provideCompletionItems() {

            return {

                suggestions: [

                    {
                        label: "print",
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        insertText: "print "
                    },

                    {
                        label: "let",
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        insertText: "let "
                    },

                    {
                        label: "func",
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        insertText: "func ${1:name}() {\n\t$0\n}",
                        insertTextRules:
                            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                    },

                    {
                        label: "if",
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        insertText: "if ${1:condition} {\n\t$0\n}",
                        insertTextRules:
                            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                    },

                    {
                        label: "repeat",
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        insertText: "repeat ${1:10} {\n\t$0\n}",
                        insertTextRules:
                            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                    }

                ]

            };

        }

    });

});
monaco.editor.setTheme(
"star-neon",
{
    base:"vs-dark",

    inherit:true,

    rules:[

        {
            token:"keyword",
            foreground:"38bdf8",
            fontStyle:"bold"
        },

        {
            token:"string",
            foreground:"00ff88"
        },

        {
            token:"number",
            foreground:"f59e0b"
        }

    ]
});
