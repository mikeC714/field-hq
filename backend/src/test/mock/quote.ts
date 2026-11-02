const quote = [
	{
		hourly:2000,
		markup:10.2,
		total:100,

		customer:{
			firstName:"Joe",
			lastName:"Smith",
			lastName:"Smith",
		},
		labor:[
			{
				desc:"Changed light bulb",
				hours:1,
			},
			{
				desc:"Changed outlet",
				hours:4,
			},
			{
				desc:"Pool install",
				hours:10,
			},
			{
				desc:"Panel install",
				hours:12,
			},
		],
		materials:[
			{
				desc:"light bulb",
				quantity:1,
				unitCost:200,
			},
			{
				desc:"2 AWG Wire 50ft",
				quantity:1,
				unitCost:500,
			},
			{
				desc:"Panel",
				quantity:1,
				unitCost:220,
			},
			{
				desc:"Pool",
				quantity:1,
				unitCost:10000,
			},
		]
	},
];

export { quote };
