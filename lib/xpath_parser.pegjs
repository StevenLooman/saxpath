start
	= (axis name predicate?)+

axis
	= '//' / '/'

name
	= str:[a-z]i+ { return str.join(""); }

predicate
	= '[' expr ']'

expr
	= attribute_ref op (string_literal / number_literal)

attribute_ref
	= '@' name

op
	= '='

string_literal
	= '"' str:[a-z]i+ '"' { return str.join(""); }

number_literal
	= str:[0-9]+ { return str.join(""); }
