import { Component, IComponentConfig } from "../../../Jigsaw/Core/Component";
import _ = require("lodash")
import { G2Map, IMapConfig } from "../../../Jigsaw/Controller/Map/G2Map"
import { DivNode } from "../../../Jigsaw/Controller/DivNode/DivNode";
export interface IMapComponentConfig extends IComponentConfig {
    mainMapConfig?: IMapConfig
    secondMapConfig?:IMapConfig
}
export class MapComponent extends Component {
    constructor(c?: IMapComponentConfig) {
        super(c)
        this.addClass("mapComponent")
        this.mainMap = new G2Map(_.extend({ position: "absolute", left: "0px", right: "0px", bottom: "0px", top: "0px" }, _.get(c, "mainMapConfig")))
        this.addController(this.mainMap)
        this.mainMap.layer("base", { renderer: "png", url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", visible: true })
        
        this.secondMap = new G2Map(_.extend({ position: "absolute", left: null, right: ".5rem", bottom: null, top: ".5rem",width:"20rem",height:"14rem" }, _.get(c, "secondMapConfig")))
        this.addController(this.secondMap)
        this.secondMap.layer("base", { renderer: "png", url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", visible: true })
        this.secondMap.view.addClass("secondMap")
        
        this.mainIcon=new DivNode({class:"sapLogo",left:".5rem",top:".5rem",position: "absolute"})
        this.addController(this.mainIcon)

    }
    mainIcon:DivNode
    mainMap: G2Map
    secondMap: G2Map
}