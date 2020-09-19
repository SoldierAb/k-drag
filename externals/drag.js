class Event{

    static add(t,eventName,cb){
        if(window.addEventListener){
            t.addEventListener(eventName,cb,false);
        }else if(window.attachEvent){
            t.attachEvent(`on${eventName}`,cb);
        }else{
            t[`on${eventName}`] = cb;
        }
    }

    static del(t,eventName,cb){
        if(window.removeEventListener){
            t.removeEventListener(eventName,cb,false);
        }else if(window.detachEvent){
            t.detachEvent(`on${eventName}`,cb);
        }else{
            t[`on${eventName}`] = null;
        }
    }

}


const throttle =  (func,delay)=>{
    let timer = null;
    if(!func) return;
    if(!getType(func,'Function')){
        throw new Error(`the 1st param must be a Function at throttleUtil`);
    }
    if(!delay)  delay=300;                       //默认时间间隔300毫秒
    let startTime = Date.now();
    return function(){
        // eslint-disable-next-line no-undef
        let ctx=this,args=arguments;
        let curTime = Date.now();
        let remaining = delay-(curTime-startTime);
        clearTimeout(timer);
        if(remaining<=0){
            func.apply(ctx,args);
            startTime = Date.now();
        }else{
            timer = setTimeout(()=>{
                func.apply(ctx,args);
            },remaining);
        }
    };
};



const getType = (obj,_type) =>{
    if( Object.prototype.toString.call(_type)!==`[object String]`){
        throw new Error(' _type must be String at getType');
    }
    return Object.prototype.toString.call(obj)===`[object ${_type.substr(0,1).toUpperCase()}${_type.substr(1).toLowerCase()}]`;
}; 

const drag = (el, triggerEl, limitBox) => {

    el.style.position = "absolute";
    triggerEl.style.cursor = "move";

    const _el_cb = (ev) => {
        const {
            clientHeight,
            clientWidth,
        } = el;
        const {
            clientWidth: boxWidth,
            clientHeight: boxHeight,
            scrollHeight,
            scrollWidth,
        } = limitBox;
    
        const minLeft = 0;
        const minTop = 0;
        const maxLeft = (scrollWidth || boxWidth ) - clientWidth;
        const maxTop = (scrollHeight || boxHeight) - clientHeight;

        const e = ev || window.event;
        const posLeft = e.clientX - el.offsetLeft;
        const posTop = e.clientY - el.offsetTop;

        const _move_cb = (event) => {
            const _e = event || window.event;
            let curX = _e.clientX - posLeft;
            let curY = _e.clientY - posTop;
            curX = curX <= minLeft ? minLeft : curX >= maxLeft ? maxLeft : curX;
            curY = curY <= minTop ? minTop : curY >= maxTop ? maxTop : curY;
            el.style.left = `${curX}px`;
            el.style.top = `${curY}px`;
        };

        const _del_move = () => {
            Event.del(document, "mousemove", _move_cb);
            Event.del(document, "mouseup", _del_move);
            triggerEl.style.cursor = "normal";
        };

        Event.add(document, "mousemove", _move_cb);

        Event.add(document, "mouseup", _del_move);

        return false;
    };

    Event.add(triggerEl, "mousedown", _el_cb);
};



const resize = (el, triggerEl, minWidth = 100, minHeight =100 )=>{
    
    triggerEl.style.cursor = "nwse-resize";
    
    const _el_cb = (ev) => {
 
        const {
            clientHeight,
            clientWidth,
        } = el;
        
        let curWidth,curHeight;
        const e = ev || window.event;
        const posLeft = e.clientX;
        const posTop = e.clientY;
        
        const _resize_cb = throttle((event) => {
            const _e = event || window.event;
            const disX = _e.clientX - posLeft;
            const disY = _e.clientY - posTop;
            curWidth = clientWidth+ disX
            curHeight = clientHeight + disY
            curWidth = curWidth > minWidth ? curWidth : minWidth 
            curHeight = curHeight > minHeight ? curHeight: minHeight
            el.style.width = `${curWidth}px`;
            el.style.height = `${curHeight}px`;
        },80);

        const _del_move = () => {
            Event.del(document, "mousemove", _resize_cb);
            Event.del(document, "mouseup", _del_move);
            triggerEl.style.cursor = "normal";
        };

        Event.add(document, "mousemove", _resize_cb);

        Event.add(document, "mouseup", _del_move);

        ev.preventDefault();
        ev.stopPropagation();

        return false;
    };

    Event.add(triggerEl, "mousedown", _el_cb);
}