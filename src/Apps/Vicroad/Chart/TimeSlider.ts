/// <reference path="./VicroadChart.d.ts" />
import { DragAblePanal } from '../../../Jigsaw/Component/Panal/DragAblePanal';
import * as moment from '../../../../vendor/moment/moment';
import { TimeAdjust } from 'VicroadChart';
export class TimeSlider extends DragAblePanal{
    constructor(conf?){
        super(conf)
        this.rootView.addClass("timeSlider")
        this.style({height:"5rem",width:'30rem'})
        this.timeAdjuster=new TimeAdjust("adjuster",{style:{
            width:"30rem",height:"4.5rem"
        },padding:0})
        this.timeAdjuster.renderAt(this.rootView.getContentNode())
        this.hidden()
        this.on("simulator-apply",(d)=>{
            this.show()
            this.setTime(d.date,d.duration)
        })
        this.timeAdjuster.on("dragend",(o)=>{
            this.send("timeslider-change",{date:o.dateTime})
        })
      
    }
    timeAdjuster:TimeAdjust
    show(){
        this.rootView.style({
            display:"initial"
        })
    }
    hidden(){
        this.rootView.style({
            display:"none"
        })
    }
    setTime(from:Date,duration:number){
        let fromTime=moment(from).format("YYYY-MM-DD HH:mm")
        let toTime=moment(from).add(duration,"h").format("YYYY-MM-DD HH:mm")
        this.timeAdjuster.setConfig({
              timeParse: "%Y-%m-%d %H:%M",
              rangeMin: fromTime,
              rangeMax: toTime,
              focusTime:fromTime,
        })
    }
}