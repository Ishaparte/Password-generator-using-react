
import { useState,useCallback,useEffect,useRef } from 'react';

function App() {
  const [length,setLength]=useState(8);
  const[numberAllowed,setnumberAllowed]=useState(false);
  const [charAllowed,setcharAllowed]=useState(false);
  const [Password,setPassword]=useState("")

  //useRef hook
  const passwordRef=useRef(null)

  const passwordGenerator=useCallback(()=>{
    let pass=""
    let str="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    if(numberAllowed) str+="0123456789"
    if(charAllowed) str+="!@#$%^&*(){}"

    for(let i=1;i<=length;i++){
      let char=Math.floor(Math.random()*str.length+1)
      pass+=str.charAt(char)
    }

    setPassword(pass)

  },[length,numberAllowed,charAllowed,setPassword])

  const copyPasswordToClipboard=useCallback(()=>{
  passwordRef.current?.select()  
  passwordRef.current?.setSelectionRange(0,100);
  window.navigator.clipboard.writeText(Password)
  },[Password])


useEffect(()=>{passwordGenerator()},[length,numberAllowed,charAllowed,passwordGenerator])
  return (
  <div>
    <div className='w-full max-w-md mx-auto      shadow-md rounded-lg px-10 my-10 text-orange-500 bg-gray-700'>
    <h1 className='text-white text-center mx-3 px-3'>Password Generator</h1>
      <div className='flex shadow rounded-lg overflow-hidden mb-4'>
        <input 
        value={Password} 
        type='text'
        className='outline-none w-full py-1 px-3 my-10 rounded-lg'
        placeholder='password'
        readOnly
        ref={passwordRef}/>
        <button onClick={copyPasswordToClipboard} className='outline-none text-white bg-blue-700 shrink rounded-lg  h-10 px-3 relative top-9 py-0.5 mx-3'>Copy</button>
      </div>
      <div className='flex text-sm gap-x-2'>
        <div className='flex items-center gap-x-1'>
          <input type='range' min={6} max={100} value={length} className='cursor-pointer' onChange={(e)=>{setLength(e.target.value)}}/>
          <lable>length:{length}</lable>
          <div className='felx items-center gap-x-1'>
          <input type='checkbox'defaultChecked={numberAllowed} id="numberInput" className='cursor-pointer' onChange={()=>{setnumberAllowed((prev)=>!prev);
          }}/>
          <label htmlFor='numberInput'>Number</label>
          </div>

          <div className='felx items-center gap-x-1'>
          <input type='checkbox'defaultChecked={charAllowed} id="charInput" className='cursor-pointer' onChange={()=>{setcharAllowed((prev)=>!prev);
          }}/>
          <label htmlFor='charInput'>Character</label>
          </div>

        </div>
      </div>
     </div>
  </div>
  );
}

export default App;
