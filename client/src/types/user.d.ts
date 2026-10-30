
interface USER{
	email:FormDataEntryValue;
	password:FormDataEntryValue;
};
interface NEW_USER extends USER{
	firstName:FormDataEntryValue;
	lastName:FormDataEntryValue;
};

export { USER, NEW_USER };
