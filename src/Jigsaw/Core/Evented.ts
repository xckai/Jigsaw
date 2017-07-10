import _ = require("underscore")
import Backbone =require( 'Backbone');
interface IEventObj{
    callback:Function,
    ctx:Object
}
interface IEvents{
    [selector: string]:IEventObj []
}
interface IEventMessage{
    eventId:string,
    eventKey:string,
    args:any[]
}
interface IEvented{
    on(key:string,callback?:Function,ctx?:any)
    off(key:string,callback?:Function,ctx?:any)
}
export class EventBus {
    constructor(){
        this.eventId=_.uniqueId("eventbus")
        this.eventBusChildren=[]
        this.events={}
    }
    private eventId:string
    private eventBusParent:EventBus
    private eventBusChildren :EventBus []
    private events:IEvents
    on(str:string,callback:Function,ctx?){
       _.each( str.split(" "),(t)=>{
           this._on(t,callback,ctx)
       })
    }
    off(str:string ,callback?:Function,ctx?){
        _.each( str.split(" "),(t)=>{
           this._off(t,callback,ctx)
        })
    }
    _on(t:string,callback:Function,ctx?){
        if (this.events[t]!=undefined) {
            if (_.some(this.events[t], (e) => e.callback.toString() == callback.toString() && e.ctx == ctx)) {
                return this
            } else {
                let obj: any = {};
                obj.callback = callback;
                obj.ctx = ctx;
                this.events[t].push(obj);
            }
        } else {
            this.events[t] = [];
            let obj: any = {};
            obj.callback = callback;
            obj.ctx = ctx;
            this.events[t].push(obj);
        }
        return this
    }
    _off(t:string ,callback?:Function,ctx?){
        if(this.events[t]==undefined){
            return this
        }else{
            if(callback==undefined){
                return this._offAllKey(t)
            }else{
                let newEvents=[]
                newEvents=_.reject(this.events[t],(e)=>e.callback==callback && e.callback==ctx)
                this.events[t]=newEvents
                return this
            }
        }
    }
    send(t:string,...args){
        let message={
            eventId:this.eventId,
            eventKey:t,
            args:args
        }
        this.fire(t,args)
        this.setToParent(message)
    }
    setToParent(e:IEventMessage){
        if(this.eventBusParent){
            this.eventBusParent.setToParent(e)
        }else{
            this.handleEventMessage(e)
        }
    }
    setToChildren(e:IEventMessage){
         _.chain(this.eventBusChildren).filter(c=>e.eventId!=c.eventId).each(c=>c.handleEventMessage(e))
    }
    handleEventMessage(e:IEventMessage){
        this.fire(e.eventKey,e.args)
        this.setToChildren(e)
    }
    fire(t:string,args?){
        _.each(this.events[t],(e)=>{
               e.callback.apply(e.ctx,args)
        })
    }
    destroy(){
        _.each(this.eventBusChildren,c=>c.eventBusParent=null)

        if(this.eventBusParent){
            this.eventBusParent.removeChildrenEventBus(this)
        }
    }
    listenTo(c:EventBus){
        c.eventBusParent=this
        this.addChildrenEventBus(c)
    }
    observe(c:EventBus){
        c.eventBusParent=this
        this.addChildrenEventBus(c)
    }
    private addChildrenEventBus(c:EventBus){
        if(_.some(this.eventBusChildren,(i)=>c.eventId==i.eventId)){
            return 
        }else{
             this.eventBusChildren.push(c)
        }
       
    }
    private removeChildrenEventBus(c:EventBus){
        this.eventBusChildren=_.reject(this.eventBusChildren,(e)=>e.eventId==c.eventId)
        c.eventBusParent=null;
    }
    _offAllKey(t:string){
        this.events[t]=[]
        return this
    }
    proxyEvents(obj:IEvented,...args){
        _.each(args,(k)=>{
            obj.on(k,(...objs)=>{
                this.send.apply(this,[k].concat(objs))
            })
        })
    }
}
export class Evented {
    constructor() {
        this.events = {};
    }
    private events: any
    private event_parent: Evented
    on(t: string, fn: Function, ctx ? : Object) {

        var st = t.split(" ");
        st.forEach((tt) => {
            this._on(tt,fn,ctx)
        })
        return this;
    }
    private _on(t: string, fn: Function, ctx ? : Object) {
        if (this.events[t]) {
            if (_.some(this.events[t], (e: any) => e.fn.toString() == fn.toString() && e.ctx == ctx)) {
                return
            } else {
                let obj: any = {};
                obj.fn = fn;
                obj.ctx = ctx;
                this.events[t].push(obj);
            }
        } else {
            this.events[t] = [];
            let obj: any = {};
            obj.fn = fn;
            obj.ctx = ctx;
            this.events[t].push(obj);
        }
    }
    private _off(t: string, fn ? : Function, ctx ? ) {
        if(t=="*"){
            this.events={}
        }
        if (!this.events[t]) {
            return this;
        } else {
            let nEs = [];
            if (fn) {
                this.events[t].forEach(o => {
                    if (o.fn.toString() != fn.toString() && o.ctx != ctx) {
                        nEs.push(o);
                    }
                });
            }
            this.events[t] = nEs;
        }
    }
    off(t: string, fn?: Function) {
        var st = t.split(" ");
        st.forEach(s => this._off(s, fn))
        return this;
    }
    fire(t: string, obj ? : any) {
        if (this.events[t]) {
            this.events[t].forEach((o) => o.fn.call(o.ctx, obj));
        }
        let p = this.event_parent
        if(p){
              p.fire(t, obj)
        }
        return this
    }
    listenTo(e: Evented) {
        e.event_parent = this
        return this
    }
}