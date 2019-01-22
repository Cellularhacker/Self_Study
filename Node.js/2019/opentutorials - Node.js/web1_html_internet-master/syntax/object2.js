//Object Oriented Programming
//
// array, object

var f = function(){ // function은 어떠한 상태를 나타내는 Statement임과 동시에 value(값) 아다.
  console.log(1+1); //즉, function이라는 statement는 값이 될 수 있다는 말이다.
  console.log(1+2);
}
console.log(f);
f();

//var i = if(true){console.log(1)};

//var w = while(true){console.log(1)};

var a = [f];
a[0]();

var o = {
  func:f
}
o.func();
