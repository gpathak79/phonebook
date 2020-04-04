console.log('Before');
getuser(1);
console.log('After');   
function getuser(id)
{
setTimeout(()=>{


    console.log('This will after 2 seconds');
},2000);
}


