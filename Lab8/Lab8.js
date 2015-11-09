/**
 * Created by bryannguyen on 10/5/15.
 */
var foldl = function (f, acc, array)
{
    if (array.length === 0) return acc;
    else return foldl(f, f(acc, array[0]),array.slice(1));

}

console.log(foldl(function(x,y){return x+y}, 0, [1,2,3]));

var foldr = function (f, z, array) {
    if (array.length === 0) return z;
    else return f(array[0], foldr(f, z, array.slice(1)));

}

console.log(foldr(function(x,y){return x/y}, 1, [2,4,8]));

var map = function (f, array)
{
    if (array.length === 0) return [];
    else return
    [f(array[0])]
        .concat(map(f, array.slice(1)));

}

console.log(map(function(x){return x+x}, [1,2,3,5,7,9,11,13]));


// Write a curry function as we discussed in class.
// Create a `double` method using the curry function
// and the following `mult` function.
function curry(x)
{
    return function(y)
    {
        return x * y;
    }
}

function mult(x,y) {
    {return x * y}
}



var double = curry(mult(2,3));
console.log(double);

function Student(firstName, lastName, studentID)
{
    this.firstName = firstName;
    this.lastName = lastName;
    this.studentID = studentID;
    this.display = function()
    {
        console.log(this.firstName + " (this)");
    }
    Student.prototype.display = function() {
        console.log(this.firstName + "(proto)");
    }
}
var stu = new Student("Stu", "Disco", 1234);
stu.display();
/*
var Harry =
{
    firstName: "Harry",
    lastName: "Potter",
    studentID: 88,
    __proto__: Student.prototype;
}
*/
