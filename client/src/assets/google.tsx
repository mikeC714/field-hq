import googleIcon from "./imgs/GoogleG_FullColor_RGB.png";
import type { HxW } from "../types/imgs.d.ts";


export const Google = ({ h, w }:HxW) => <img src={googleIcon} style={{ width: w ? w : "50px", height : h ? h : "50px"}} />


