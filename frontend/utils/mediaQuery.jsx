import { useState, useEffect } from "react";

export function useMediaQuery(query){
	const [match,setMatch] = useState(false);
	
	useEffect(() => {
		const media = window.matchMedia(query);
		setMatch(media.matches);

		const listener = (e) => setMatch(e.matches);
		media.addEventListener('change', listener);

		return () => media.removeEventListener('change', listener);
	},[query])
	return match
}
