start
        = (axis namespace? name predicate?)+

axis
        = '//' / '/'

namespace
        = str:[a-z0-9_]i+ ':' { return str.join(""); }

name
        = str:[a-z0-9_]i+ { return str.join(""); }

predicate
        = '[' expr ']'

expr
        = attribute_ref op (string_literal / number_literal)

attribute_ref
        = '@' name

op
        = '='

string_literal
        = '"' str:[a-z0-9_ ]i+ '"' { return str.join(""); }

number_literal
        = str:[0-9]+ { return str.join(""); }
