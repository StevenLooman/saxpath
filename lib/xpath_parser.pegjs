start
        = (axis namespace? name predicate?)+

axis
        = '//' / '/'

namespace
        = str:[a-z_]i str2:[a-z0-9_\-\.]i* ':' { return str + str2.join(""); }

name
        = str:[a-z_]i str2:[a-z0-9_\-\.]i* { return str + str2.join(""); }
          /
          '*'

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
