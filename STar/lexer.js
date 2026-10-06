/* =====================================================
   STar Lexer
   lexer.js
   ===================================================== */

class STarToken {

    constructor(type, value) {

        this.type = type;
        this.value = value;

    }

}

class STarLexer {

    constructor(source) {

        this.source = source;
        this.position = 0;

        this.tokens = [];

    }

    peek() {

        return this.source[this.position];

    }

    advance() {

        return this.source[this.position++];

    }

    isLetter(char) {

        return /[a-zA-Z_]/.test(char);

    }

    isDigit(char) {

        return /[0-9]/.test(char);

    }

    isWhitespace(char) {

        return /\s/.test(char);

    }

    tokenize() {

        while (
            this.position < this.source.length
        ) {

            let char = this.peek();

            /* 空白 */
            if (this.isWhitespace(char)) {

                this.advance();
                continue;

            }

            /* コメント */
            if (char === "#") {

                while (
                    this.position < this.source.length &&
                    this.peek() !== "\n"
                ) {

                    this.advance();

                }

                continue;

            }

            /* 文字列 */
            if (char === '"') {

                this.advance();

                let value = "";

                while (
                    this.position < this.source.length &&
                    this.peek() !== '"'
                ) {

                    value += this.advance();

                }

                this.advance();

                this.tokens.push(
                    new STarToken(
                        "STRING",
                        value
                    )
                );

                continue;

            }

            /* 数値 */
            if (this.isDigit(char)) {

                let value = "";

                while (
                    this.position < this.source.length &&
                    this.isDigit(this.peek())
                ) {

                    value += this.advance();

                }

                this.tokens.push(
                    new STarToken(
                        "NUMBER",
                        Number(value)
                    )
                );

                continue;

            }

            /* 識別子 */
            if (this.isLetter(char)) {

                let value = "";

                while (
                    this.position < this.source.length &&
                    /[a-zA-Z0-9_]/.test(this.peek())
                ) {

                    value += this.advance();

                }

                const keywords = [

                    "let",
                    "print",
                    "func",
                    "class",
                    "if",
                    "else",
                    "while",
                    "repeat",
                    "return",

                    "import",

                    "async",
                    "wait",

                    "on",

                    "create",
                    "move",
                    "rotate",
                    "destroy",

                    "input"

                ];

                if (
                    keywords.includes(value)
                ) {

                    this.tokens.push(
                        new STarToken(
                            "KEYWORD",
                            value
                        )
                    );

                } else {

                    this.tokens.push(
                        new STarToken(
                            "IDENTIFIER",
                            value
                        )
                    );

                }

                continue;

            }

            /* 演算子 */

            if (
                ["+","-","*","/","="]
                .includes(char)
            ) {

                this.tokens.push(
                    new STarToken(
                        "OPERATOR",
                        char
                    )
                );

                this.advance();

                continue;

            }

            /* 記号 */

            if (
                [
                    "(",
                    ")",
                    "{",
                    "}",
                    "[",
                    "]",
                    ",",
                    ":",
                    ";"
                ].includes(char)
            ) {

                this.tokens.push(
                    new STarToken(
                        "SYMBOL",
                        char
                    )
                );

                this.advance();

                continue;

            }

            console.warn(
                "Unknown Character:",
                char
            );

            this.advance();

        }

        this.tokens.push(
            new STarToken(
                "EOF",
                null
            )
        );

        return this.tokens;

    }

}

/* =====================================================
   Helper
   ===================================================== */

function lexSTar(source) {

    const lexer =
        new STarLexer(source);

    return lexer.tokenize();

}
