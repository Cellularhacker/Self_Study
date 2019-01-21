/*
function a(){
  console.log('A');
}
*/

/*
var a = function(){ //이름이 없는 함수 - 익명함수;Anonymous Funcion
  console.log('A');
} // 함수가 변수의 값이 될 수 있다!!

a();
*/

var a = function(){ //이름이 없는 함수 - 익명함수;Anonymous Funcion
  console.log('A');
} // 함수가 변수의 값이 될 수 있다!!

function slowfunc(callback) {
  callback();
}

slowfunc(a);  // slowfunc() 함수는 a가 가리키고 있는(Pointing;Referencing) 함수. 즉, 'A'를 출력하는 함수를 가리키게 된다.
// C를 기준으로 하면,
// 1)slowfunc()의 인자 값으로, a()함수의 Pointer값을 넘겨주고,
// 2)slowfunc()함수에서는 인자로 a()함수의 포인터 값을 받은 다음에,
// 3)그 포인터 내용을 "참조하여",
// 4)해당 함수(여기서는 a() 함수)를 실행(;호출)하게 된다.
