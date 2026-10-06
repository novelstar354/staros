/* =====================================================
   STar Parser
   parser.js
   ===================================================== */
parseWhile() {

    this.expect(
        "KEYWORD",
        "while"
    );

    const condition =
        this.parseExpression();

    this.expect(
        "SYMBOL",
        "{"
    );

    const body = [];

    while (
        !this.match(
            "SYMBOL",
            "}"
        )
    ) {

        body.push(
            this.parseStatement()
        );

    }

    this.expect(
        "SYMBOL",
        "}"
    );

    return {

        type: "WhileStatement",

        condition,

        body

    };

}
parseReturn() {

    this.expect(
        "KEYWORD",
        "return"
    );

    return {

        type: "ReturnStatement",

        value:
            this.parseExpression()

    };

}
class STarParser {

    constructor(tokens) {

        this.tokens = tokens;
        this.position = 0;

    }

    current() {

        return this.tokens[this.position];

    }

    next() {

        return this.tokens[this.position++];

    }

    match(type, value = null) {

        const token = this.current();

        if (!token)
            return false;

        if (token.type !== type)
            return false;

        if (
            value !== null &&
            token.value !== value
        )
            return false;

        return true;

    }

    expect(type, value = null) {

        const token = this.current();

        if (!this.match(type, value)) {

            throw new Error(
                `Expected ${type} ${value ?? ""}`
            );

        }

        this.position++;

        return token;

    }

    parse() {

        const body = [];

        while (
            !this.match("EOF")
        ) {

            body.push(
                this.parseStatement()
            );

        }

        return {

            type: "Program",

            body

        };

    }

    parseStatement() {

        const token =
            this.current();

        if (
            token.type === "KEYWORD"
        ) {

            switch (
                token.value
            ) {

                case "let":
                    return this.parseVariableDeclaration();

                case "print":
                    return this.parsePrintStatement();

                case "repeat":
                    return this.parseRepeatStatement();

                case "if":
                    return this.parseIfStatement();

                case "func":
                    
                    return this.parseFunctionDeclaration();
                case "return":
                    return this.parseReturn();
                case "while":
                    return this.parseWhile();
            }

        }

        throw new Error(
            "Unexpected token: " +
            JSON.stringify(token)
        );

    }

    /* ==========================================
       let
       ========================================== */

    parseVariableDeclaration() {

        this.expect(
            "KEYWORD",
            "let"
        );

        const name =
            this.expect(
                "IDENTIFIER"
            ).value;

        this.expect(
            "OPERATOR",
            "="
        );

        const value =
            this.parseExpression();

        return {

            type:
                "VariableDeclaration",

            name,

            value

        };

    }

    /* ==========================================
       print
       ========================================== */

    parsePrintStatement() {

        this.expect(
            "KEYWORD",
            "print"
        );

        return {

            type:
                "PrintStatement",

            value:
                this.parseExpression()

        };

    }

    /* ==========================================
       repeat
       ========================================== */

    parseRepeatStatement() {

        this.expect(
            "KEYWORD",
            "repeat"
        );

        const count =
            this.parseExpression();

        this.expect(
            "SYMBOL",
            "{"
        );

        const body = [];

        while (
            !this.match(
                "SYMBOL",
                "}"
            )
        ) {

            body.push(
                this.parseStatement()
            );

        }

        this.expect(
            "SYMBOL",
            "}"
        );

        return {

            type:
                "RepeatStatement",

            count,

            body

        };

    }

    /* ==========================================
       if
       ========================================== */

    parseIfStatement() {

        this.expect(
            "KEYWORD",
            "if"
        );

        const condition =
            this.parseExpression();

        this.expect(
            "SYMBOL",
            "{"
        );

        const body = [];

        while (
            !this.match(
                "SYMBOL",
                "}"
            )
        ) {

            body.push(
                this.parseStatement()
            );

        }

        this.expect(
            "SYMBOL",
            "}"
        );

        let elseBody = [];

        if (
            this.match(
                "KEYWORD",
                "else"
            )
        ) {

            this.next();

            this.expect(
                "SYMBOL",
                "{"
            );

            while (
                !this.match(
                    "SYMBOL",
                    "}"
                )
            ) {

                elseBody.push(
                    this.parseStatement()
                );

            }

            this.expect(
                "SYMBOL",
                "}"
            );

        }

        return {

            type:
                "IfStatement",

            condition,

            body,

            elseBody

        };

    }

    /* ==========================================
       func
       ========================================== */

    parseFunctionDeclaration() {

        this.expect(
            "KEYWORD",
            "func"
        );

        const name =
            this.expect(
                "IDENTIFIER"
            ).value;

        this.expect(
            "SYMBOL",
            "("
        );

        const params = [];

        while (
            !this.match(
                "SYMBOL",
                ")"
            )
        ) {

            params.push(
                this.expect(
                    "IDENTIFIER"
                ).value
            );

            if (
                this.match(
                    "SYMBOL",
                    ","
                )
            ) {

                this.next();

            }

        }

        this.expect(
            "SYMBOL",
            ")"
        );

        this.expect(
            "SYMBOL",
            "{"
        );

        const body = [];

        while (
            !this.match(
                "SYMBOL",
                "}"
            )
        ) {

            body.push(
                this.parseStatement()
            );

        }

        this.expect(
            "SYMBOL",
            "}"
        );

        return {

            type:
                "FunctionDeclaration",

            name,

            params,

            body

        };

    }

    /* ==========================================
       Expressions
       ========================================== */

    parseExpression() {
    return this.parseAddSub();
}

parseAddSub() {

    let left = this.parseMulDiv();

    while (
        this.match("OPERATOR", "+") ||
        this.match("OPERATOR", "-")
    ) {

        const op = this.next().value;
        const right = this.parseMulDiv();

        left = {
            type: "BinaryExpression",
            operator: op,
            left,
            right
        };

    }

    return left;
}

parseMulDiv() {

    let left = this.parsePrimary();

    while (
        this.match("OPERATOR", "*") ||
        this.match("OPERATOR", "/")
    ) {

        const op = this.next().value;
        const right = this.parsePrimary();

        left = {
            type: "BinaryExpression",
            operator: op,
            left,
            right
        };

    }

    return left;
}

}

/* =====================================================
   Helper
   ===================================================== */

function parseSTar(tokens) {

    const parser =
        new STarParser(tokens);

    return parser.parse();

}
/* =====================================================
   STar Lexer v2
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

    peek(offset = 0) {

        return this.source[
            this.position + offset
        ];

    }

    advance() {

        return this.source[
            this.position++
        ];

    }

    isWhitespace(char) {

        return /\s/.test(char);

    }

    isDigit(char) {

        return /[0-9]/.test(char);

    }

    isLetter(char) {

        return /[a-zA-Z_]/.test(char);

    }

    tokenize() {

        while (
            this.position <
            this.source.length
        ) {

            const char =
                this.peek();

            /* whitespace */

            if (
                this.isWhitespace(char)
            ) {

                this.advance();
                continue;

            }

            /* comment */

            if (char === "#") {

                while (
                    this.position <
                    this.source.length &&
                    this.peek() !== "\n"
                ) {

                    this.advance();

                }

                continue;

            }

            /* string */

            if (char === '"') {

                this.advance();

                let value = "";

                while (
                    this.position <
                    this.source.length &&
                    this.peek() !== '"'
                ) {

                    value +=
                        this.advance();

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

            /* number */

            if (
                this.isDigit(char)
            ) {

                let value = "";

                while (
                    this.position <
                    this.source.length &&
                    (
                        this.isDigit(
                            this.peek()
                        ) ||
                        this.peek() === "."
                    )
                ) {

                    value +=
                        this.advance();

                }

                this.tokens.push(
                    new STarToken(
                        "NUMBER",
                        Number(value)
                    )
                );

                continue;

            }

            /* identifier */

            if (
                this.isLetter(char)
            ) {

                let value = "";

                while (
                    this.position <
                    this.source.length &&
                    /[a-zA-Z0-9_]/
                    .test(this.peek())
                ) {

                    value +=
                        this.advance();

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

                    "input",

                    "true",
                    "false",
                    "null"

                ];

                this.tokens.push(

                    new STarToken(

                        keywords.includes(value)
                            ? "KEYWORD"
                            : "IDENTIFIER",

                        value

                    )

                );

                continue;

            }

            /* double operators */

            const doubleOps = [

                "==",
                "!=",
                ">=",
                "<=",
                "&&",
                "||"

            ];

            const two =
                char +
                this.peek(1);

            if (
                doubleOps.includes(two)
            ) {

                this.tokens.push(
                    new STarToken(
                        "OPERATOR",
                        two
                    )
                );

                this.advance();
                this.advance();

                continue;

            }

            /* single operators */

            const operators = [

                "+",
                "-",
                "*",
                "/",
                "%",
                "=",
                ">",
                "<",
                "!"

            ];

            if (
                operators.includes(char)
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

            /* symbols */

            const symbols = [

                "(",
                ")",

                "{",
                "}",

                "[",
                "]",

                ",",
                ".",

                ":",
                ";"

            ];

            if (
                symbols.includes(char)
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

            throw new Error(
                "Unknown character: " +
                char
            );

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

    return new STarLexer(
        source
    ).tokenize();

}
parseExpression() {
    return this.parseComparison();
}

parseComparison() {

    let left =
        this.parseAddition();

    while (
        this.match("OPERATOR", "==") ||
        this.match("OPERATOR", "!=") ||
        this.match("OPERATOR", ">")  ||
        this.match("OPERATOR", "<")  ||
        this.match("OPERATOR", ">=") ||
        this.match("OPERATOR", "<=")
    ) {

        const operator =
            this.next().value;

        const right =
            this.parseAddition();

        left = {
            type: "BinaryExpression",
            operator,
            left,
            right
        };
    }

    return left;
}

parseAddition() {

    let left =
        this.parseMultiplication();

    while (
        this.match("OPERATOR", "+") ||
        this.match("OPERATOR", "-")
    ) {

        const operator =
            this.next().value;

        const right =
            this.parseMultiplication();

        left = {
            type: "BinaryExpression",
            operator,
            left,
            right
        };
    }

    return left;
}

parseMultiplication() {

    let left =
        this.parsePrimary();

    while (
        this.match("OPERATOR", "*") ||
        this.match("OPERATOR", "/") ||
        this.match("OPERATOR", "%")
    ) {

        const operator =
            this.next().value;

        const right =
            this.parsePrimary();

        left = {
            type: "BinaryExpression",
            operator,
            left,
            right
        };
    }

    return left;
}
parsePrimary() {

    const token = this.current();

    if (token.type === "NUMBER") {

        this.next();

        return {
            type: "NumberLiteral",
            value: token.value
        };

    }

    if (token.type === "STRING") {

        this.next();

        return {
            type: "StringLiteral",
            value: token.value
        };

    }

    if (token.type === "IDENTIFIER") {

        this.next();

        const identifier = {

            type: "Identifier",
            name: token.value

        };

        if (
            this.match("SYMBOL", "(")
        ) {

            return this.finishCall(
                identifier
            );

        }

        return identifier;

    }

    if (
        this.match("SYMBOL", "(")
    ) {

        this.next();

        const expr =
            this.parseExpression();

        this.expect(
            "SYMBOL",
            ")"
        );

        return expr;

    }

    throw new Error(
        "Unexpected token: " +
        JSON.stringify(token)
    );

}
finishCall(callee) {

    this.expect(
        "SYMBOL",
        "("
    );

    const args = [];

    while (
        !this.match(
            "SYMBOL",
            ")"
        )
    ) {

        args.push(
            this.parseExpression()
        );

        if (
            this.match(
                "SYMBOL",
                ","
            )
        ) {

            this.next();

        }

    }

    this.expect(
        "SYMBOL",
        ")"
    );

    return {

        type: "FunctionCall",

        name: callee.name,

        arguments: args

    };

}