# Javascript陷阱

在网上找到的几十个非常有趣的关于javascript的难题,分享一下
---

1.
```js
['1', '2', '3'].map(parseInt) //[1, NaN, NaN]
```
* parseInt接收两个参数, parseInt(string, radix);radix表示要解析的数字的基数(即要解析的数字为多少进制);而map中向回调函数传入三个参数(element, index, array);所以当循环 "1" 的时候调用parseInt("1", 0),返回 1 ,当循环 "2" 的时候,调用parseInt("2", 1),返回NaN.

2.
```js
typeof null  //'objext'
null instanceof Object //'false'
```
* null是一个非常特殊的值,他并不是一个空引用,而是一个原始值,表示"期望"引用一个对象;null instanceof Object 表示Objext是否在null的原型链上,为false.

3.
```js
[3, 2, 1].reduce(Math.pow) //9
[].reduce(Math.pow) //throws TypeError
```
* reduce表示对数组中的所有元素调用指定的回调函数,该回调函数的返回值为累积结果,并且此返回值在下一次调用该回调函数时作为参数提供;该回调函数有四个参数(previousValue, currentValue, currentIndex, array);当循环 2 的时候调用 Math.pow(3, 2) = 9, 循环 1 的时候调用 Math.pow(9, 1) = 9, 所以结果为9.而如果数组为空数组时会报错.

4.
```js
var val = 'smtg';
console.log('Value is ' + (val === 'smtg') ? 'Something' : 'Nothing');  //'Something'
```
* 这个虽然简单但经常被忽略, 运算符的优先级 "+" 优先 "?"

5.
```js
var name = 'World!';
(function () {
    if (typeof name === 'undefined') {
        var name = 'Jack';
        console.log('Goodbye ' + name);
    } else {
        console.log('Hello ' + name);
    }
})();  //'Goodbye Jack'
```
* var的变量提升大家都很熟悉了,但if for 中的var经常被大家忽略.函数内 var name = 'Jack' 被提升至函数顶层 var name = undefined, 所以输出结果为 'Goodbye Jack'.

6.
```js
var END = Math.pow(2, 53);
var START = END - 100;
var count = 0;
for (var i = START; i <= END; i++) {
    count++;
}
console.log(count);  
```
* 2的53次方是javascript中最大的数字了,即使 Math.pow(2, 53) + 1 === Math.pow(2, 53) 结果也为true, 所以这是一个死循环.

7.
```js
var ary = [0, 1, 2];
ary[10] = 10;
ary.filter(function(x) { return x === undefined;});  //[]
```
* Array.prototype.filter 不被undefined调用.

8.
```js
var two   = 0.2
var one   = 0.1
var eight = 0.8
var six   = 0.6
[two - one == one, eight - six == two]  //[true, false]
```
* javascript存在浮点数精度误差, 与6题相似, 小数进行计算时会转化成二进制, 0.1转为二进制为0.000100010001无限循环, 0.2转为二进制为0.001100110011无限循环, 这样再运算0.2 - 0.1恰好等于0.1, 而其他浮点运算则不能得到想要的结果.解决这一问题最简单的办法可以先同时乘以10^n 结果再除以就好了.

9.
```js
function showCase(value) {
    switch(value) {
    case 'A':
        console.log('Case A');
        break;
    case 'B':
        console.log('Case B');
        break;
    case undefined:
        console.log('undefined');
        break;
    default:
        console.log('Do not know!');
    }
}
showCase(new String('A'));  //'Do not know!'
```
* new String('A')构造出来的是一个数组类型的对象, 与'A'不'===', 但'=='.

10.
```js
function showCase2(value) {
    switch(value) {
    case 'A':
        console.log('Case A');
        break;
    case 'B':
        console.log('Case B');
        break;
    case undefined:
        console.log('undefined');
        break;
    default:
        console.log('Do not know!');
    }
}
showCase2(String('A'));  //'Case A'
```
* String()表示对参数进行显式转换,转为字符串,所以String('A') === 'A'.

11.
```js
function isOdd(num) {
    return num % 2 == 1;
}
function isEven(num) {
    return num % 2 == 0;
}
function isSane(num) {
    return isEven(num) || isOdd(num);
}
var values = [7, 4, '13', -9, Infinity];
values.map(isSane);  //[true, true, true, false, false]
```
* 7, 4, '13' 很好理解, ||短路运算: 前面是true返回前面的,前面是false返回后面的; 而-9 % 2 === -1, Infinity % 2 为NaN.

12.
```js
Array.isArray(Array.prototype)  //true
```
* Array.prototype虽然看似一个包含数组原型方法的对象,但浏览器解析它为一个空数组,并可以调用数组的所有方法,只不过这些方法都挂载在这个数组上.

13.
```js
1 + - + + + - + 1  //2
```
* 很有趣的一道题 1 + (- (+ + + (- (+ 1)))) 这样看起来就清晰多了, 其实存在多个运算符, 只用把第一个当做运算符,其他的都可以理解为转换符号, '-' 表示转换符号, '+' 表示隐式转换数字.

14.
```js
var ary = Array(3);
ary[0]=2
ary.map(function(elem) { return '1'; });  //["1", undefined × 2]
var arr = [undefined, undefined, undefined];
arr.map(function(elem) { return '1'; });  //["1", "1", "1"]
```
* map只为Array被初始化的元素调用.

15.
```js
function sidEffecting(ary) {
  ary[0] = ary[2];
}
function bar(a,b,c) {
  c = 10
  sidEffecting(arguments);
  return a + b + c;
}
bar(1,1,1)  //21
```
* 在函数中, 参数被绑定到arguments对象上, 改变arguments对象, 就改变了参数的值, 所以结果为21.

16.
```js
var a = 111111111111111110000,
    b = 1111;
a + b;  //111111111111111110000
```
* 又是Javascript的数字缺乏影响小数和大数的问题, Javascript中最大数为2^53, 超过这个数就无法运算了.

17.
```js
[1 < 2 < 3, 3 < 2 < 1]  //[true, true]
```
* 布尔值参与运算的问题, (1 < 2) < 3 => false < 3 => 0 < 3 => true; (3 < 2) < 1 => false < 1 => 0 < 1 =>true.

18.
```js
2 == [[[2]]]  //true
```
* [[[2]]]转化为字符串为"2", 所以结果为true.

19.
```js
3.toString()  //error
3..toString()  //"3"
3...toString()  //error
```
* x.toString()语法错误, 不能这样使用; 3.x 用尾数定义"3",是有效语法.

20.
```js
(function(){
  var x = y = 1;
})();
console.log(y); //1
console.log(x); //error
```
* 作用域链问题, 当函数内没用声明变量的时候, 会向上一级作用域寻找, 直到找到golbal作用域, 如果还没找到, 就会在golbal作用域声明该变量并赋值;

21.
```js
var a = {}, b = Object.prototype;
a.prototype === b;               //false
Object.getPrototypeOf(a) === b;  //true
```
* a只是Object构造出来的实例, 没有prototype; Object.getPrototypeOf(a)可以获取实例a的原型;

22.
```js
function foo() {}
var oldName = foo.name;
foo.name = "bar";
[oldName, foo.name]  //["foo", "foo"]
```
* name是只读属性, 不能修改, 但上面这种写法也不会报错.

23.
```js
"1 2 3".replace(/\d/g, parseInt)  //"1 NaN 3"
```