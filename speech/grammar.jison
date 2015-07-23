/* description: Parses and executes mathematical expressions. */

/* lexical grammar */
%lex

%options flex case-insensitive

%%

\s+                   /* skip whitespace */
[0-9]+("."[0-9]+)?\b  return 'NUMBER'
[A-Za-z_]\w*          return 'ID';
"-"                   return '-'
"Prozent"             return 'PROZENT'
[0-9]+\s+"PROZENT"    	 %{ console.log(yytext);
                   		return 'PROZENT'; %}
<<EOF>>               return 'EOF'
.                     return 'INVALID'

/lex

/* operator associations and precedence */

%left '-'

%start expressions

%% /* language grammar */

expressions
    : wordBlock EOF
        { typeof console !== 'undefined' ? console.log($1) : print($1);
          return $1; }
    ;

wordBlock
    : wordBlock '-' wordBlock
        {$$ = $1-$3;}
    | NUMBER
        {$$ = Number(yytext);}
    | PROZENT
        {$$ = 10000;}
    ;
