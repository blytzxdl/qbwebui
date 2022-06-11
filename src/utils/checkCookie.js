const checkCookie = ()=>{
    document.cookie = 'SID=cookie'
    if (!document.cookie) {
        return true
    }else{return false}
}

export default checkCookie