import type { Dispatch, SetStateAction } from "react";

function handleMouseEnter(timeoutRef:any, open:Dispatch<SetStateAction<boolean>>){
	if(timeoutRef.current){
		clearTimeout(timeoutRef.current);
	};
	open(true);
}; 

function handleMouseLeave(time:number = 200, timeoutRef:any, open:Dispatch<SetStateAction<boolean>>){
	timeoutRef.current = setTimeout(() => {
		open(false);
	}, time);
};

export { handleMouseEnter, handleMouseLeave }
