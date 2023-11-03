export interface TraitsData {
	[race: string]: {
		'Ability Score Increase': string;
		Age: string;
		Size: string;
		// ... (list all other properties)
	};
}

export interface apiData {
	index: string;
	name: string;
	speed: number;
	age: string;
	size: string;
	size_description: string;
	ability_bonuses: {
		ability_score: {
			index: string;
			name: string;
			url: string;
		};
		bonus: number;
	}[];
	alignment: string;
	language_desc: string;
	traits: {
		index: string;
		name: string;
		url: string;
	}[];
	starting_proficiencies: never[];
	languages: {
		index: string;
		name: string;
		url: string;
	}[];
	subraces: never[];
	url: string;
}
