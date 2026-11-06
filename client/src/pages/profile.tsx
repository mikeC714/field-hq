import { useAuth } from "../hooks/auth.tsx";

export function Profile(){
	const { useDelete } = useAuth();
	const { deleteAcc, deleteAccLoading, deleteAccError } = useDelete();
}
