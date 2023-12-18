export interface TraitsData {
	[race: string]: {
		'Ability Score Increase': string;
		Age: string;
		Size: string;
	};
}

export interface apiData {
	hit_die: number;
	index: string;
	multi_classing: never[];
	name: string;
	proficiencies: {
		index: string;
		name: string;
		url: string;
	}[];
	proficiency_choices: {
		desc: string;
	}[];
	saving_throws: {
		index: string;
		name: string;
		url: string;
	}[];
	spellcasting: {
		level: number;
		spellcasting_ability: {
			index: string;
			name: string;
			url: string;
		};
		info: {
			name: string;
			desc: string;
		}[];
	};
	spells: string;
	starting_equipment: {
		index: string;
		name: string;
		url: string;
	}[];
	starting_equipment_options: {
		desc: string;
		choose: string;
		type: string;
	}[];

	subclasses: never[];
	url: string;
}
