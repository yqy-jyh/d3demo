import React,{useEffect, useState} from 'react'

export default function useResizeObserver(ref) {
  const [dimensions,setDimensions]=useState(null)
  useEffect(()=>{
    const observeTarget=ref.current
    const resizeObserver=new ResizeObserver((entries)=>{
        entries.forEach(entry=>{
            setDimensions(entry.contentRect)
        })
    })
    resizeObserver.observe(observeTarget)
    return ()=>{
        resizeObserver.unobserve(observeTarget)
    }
  },[ref])
  return dimensions 
}
