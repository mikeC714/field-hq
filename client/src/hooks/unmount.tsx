import { useState, useEffect } from "react"

export function useUnmount(status:boolean, delayTime?:number){
	const [render, setRender] = useState<boolean>(false);	

	useEffect(() => {
		if(status && !render){
			setRender(true);
		}else if(!status && render){
			const timeout = setTimeout(() => setRender(false), delayTime);
			return () => clearTimeout(timeout);
		}
	},[render, status, delayTime]);

	return render;
}
