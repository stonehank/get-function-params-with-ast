[中文说明](https://github.com/stonehank/get-function-params-with-ast/blob/master/README-CN.md)

------

### Get function parameters with any "shape".

[![Build Status](https://travis-ci.org/stonehank/get-function-params-with-ast.svg?branch=master)](https://travis-ci.org/stonehank/get-function-params-with-ast)
[![npm](https://img.shields.io/npm/v/get-function-params-with-ast.svg)](https://www.npmjs.com/package/get-function-params-with-ast)
[![Codecov](https://codecov.io/gh/stonehank/get-function-params-with-ast/branch/master/graph/badge.svg)](https://codecov.io/gh/stonehank/get-function-params-with-ast)

------

### Feature

 * Support ES6, with `default parameters`, `spread syntax`, `destructuring assignment`, `new operator`,
 `arrow function`, `async function`, `function*`,`class expression`, etc.
 * 100+ tests.
 * Analysis with `AST` by [esprima](http://esprima.org/index.html), easy scalable.
 
### Install

`npm install get-function-params-with-ast`

----

### Usage

`getFuncParamsName(func:<String|Function>):<Array>`

----------
### Test

`npm run test`

--------

#### Example
```
function(){}                                      // []
function(a,b){}                                   // ['a','b']
function x(a=4*(5/3), b) {}                       // ['a','b']
e=>{}                                             // ['e']
(a,b)=>{}                                         // ['a','b']
class x{                                          // ['a','b']
    constructor(a,b){}
    method(cc,dd){}
  }     
async function name(asy1,asy2){await run(x,y)}    // ['asy1','asy2']
function *generator(gen1,gen2){yield "x1"}        // ['gen1','gen2']
new Function                                      // []
function x([a,b]=[1,2],{c,d}={c:7,y:2}){}         // [['a','b'],['c','d']]
function x(...arg){}                              // ['...arg']
```

* Something special
```
new Function ("a=5","b",/* c=7 ,*//* d ,*/"e=function(x,y){}","f=5","console.log(a,b)")   
// ['a','b','e','f']
function funcName(a=function(a=b){function inner(b=c){function inner(c=a){function inner(d=b){function inner(b){function inner(d){function inner(a){}}}}}}}){}   
// ['a']
function x(a=5,b="a",c=function(x=1,y){console.log(x=function(i=8,j){})},d={x:1,y:2,z:'x=6'},e=x=>7,f=['3=5','x.1','y,2',1],g=(x,y)=>{let z=(i,j=6)=>{}},h){}   
// ['a','b','c','d','e','f','g','h']
function x({a:[...args],b:{c:{d:{e:[...another]}}}}){}   
// [['a','b']]
```