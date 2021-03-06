
import Backbone = require('backbone');
import { Evented } from "./Evented";
import _ = require("lodash");
import { Util } from "../Utils/Util"
export interface IJViewOption extends  Backbone.ViewOptions<Backbone.Model>{
    id?:string
    class?: string
    position?: string,
    left?: string,
    right?: string,
    top?: string,
    bottom?: string
    width?: string
    height?: string 
    appendAt?:string|HTMLElement|SVGAElement|JQuery   
} 
export class JView extends  Backbone.View<Backbone.Model>{
    constructor(c?:IJViewOption){
        super(c)
        this.updateView(c)
        if(c.appendAt){
            this.$el.appendTo(c.appendAt)
        }
    }
    updateView(c:IJViewOption){
        if(c){
            this.getNode$().addClass(_.get(c,"class",""))
            this.style(_.pick(c,"width","height","left","right","top","bottom","position"))
            this.attr("jviewid",c.id)
        }
        return this
    }
    getNode$(){
        return this.$el
    }
    fire(k:string,...args){
        this.trigger.apply(this,[k].concat(args))
    }
    attr(k,v?){
        if(_.isObject(k)){
            _.each(k,(vv,kk)=>{
                vv=vv?vv:""
                this.$el.attr(kk,vv)
            })
        }else{
            this.$el.attr(k,v)
        }
        return this
    }
    style(k,v?){
        if(_.isObject(k)){
            _.each(k,(vv,kk)=>{
                vv=vv?vv:""
                this.$el.css(kk,vv)
            })
        }else{
            this.$el.css(k,v)
        }
        return this
    }
    addClass(cls) {
        if (cls) {
            this.$el.addClass(cls)
        }
        return this
    }
    removeClass(cls) {
        this.$el.removeClass(cls)
        return this
    }
    setBusy(busy: boolean, size?) {
        if (busy) {
            this.getNode$().append(Util.loader.genBallBusy(size || .5))
        } else {
            this.getNode$().find(".busyContainer").remove()
        }
        return this
    }
    

}
